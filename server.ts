
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { INITIAL_PRODUCTS } from './src/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'istore-2026-secret-key';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const HOST = process.env.HOST || '0.0.0.0';

  app.use(express.json());
  app.use(cookieParser());

  // In-memory data (Reset on restart for demo, could be persistent)
  let products = [...INITIAL_PRODUCTS];
  let users: any[] = [
    { id: '1', email: 'admin@istore.com', password: await bcrypt.hash('admin123', 10), name: 'Admin User', role: 'admin' }
  ];
  let orders: any[] = [];

  // API Routes
  
  // Auth
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now().toString(), email, password: hashedPassword, name, role: 'user' };
    users.push(newUser);
    
    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ user: { id: newUser.id, email, name, role: newUser.role } });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ success: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'No token' });
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.userId);
      if (!user) return res.status(401).json({ error: 'User not found' });
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch (e) {
      res.status(401).json({ error: 'Invalid token' });
    }
  });

  // Products
  app.get('/api/products', (req, res) => {
    const { category, search } = req.query;
    let filtered = products;
    if (category) filtered = filtered.filter(p => p.category === category);
    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    res.json(filtered);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  // Orders & Inventory
  app.post('/api/checkout', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Login required for checkout' });
    
    const { items, paymentMethod } = req.body;
    let total = 0;
    
    // Check stock and calculate total
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ error: `Not enough stock for ${product?.name || 'unknown product'}` });
      }
      total += product.price * item.quantity;
    }

    // Process order (Deduct stock)
    for (const item of items) {
      const productIndex = products.findIndex(p => p.id === item.productId);
      products[productIndex].stock -= item.quantity;
    }

    const order = {
      id: Date.now().toString(),
      items,
      total,
      date: new Date().toISOString(),
      status: 'completed'
    };
    orders.push(order);

    res.json({ success: true, orderId: order.id });
  });

  // Reviews
  app.post('/api/products/:id/reviews', (req, res) => {
    const { rating, comment, userName } = req.body;
    const productIndex = products.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

    const newReview = {
      id: Date.now().toString(),
      userId: 'anonymous', // For simplicity in MVP
      userName: userName || 'Customer',
      rating: Number(rating),
      comment,
      date: new Date().toISOString()
    };

    products[productIndex].reviews.push(newReview);
    // Recalculate average rating
    const totalRating = products[productIndex].reviews.reduce((acc, r) => acc + r.rating, 0);
    products[productIndex].rating = Number((totalRating / products[productIndex].reviews.length).toFixed(1));

    res.json(products[productIndex]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    const browserHost = HOST === '0.0.0.0' ? 'localhost' : HOST;
    console.log(`Server running on http://${browserHost}:${PORT}`);
  });
}

startServer();
