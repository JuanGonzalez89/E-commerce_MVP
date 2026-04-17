# UADE E‑Commerce TPO — Frontend + Mock API

## Requisitos
- Node.js 18+ y npm

## Cómo correr
```bash
# 1) Mock API
cd api
npm install
npm run dev   # http://localhost:3000

# 2) Frontend
cd ../frontend
npm install
npm run dev   # http://localhost:5173
```

## Estructura
- React + Vite (SPA): Home catálogo, detalle, carrito, login/registro, mis publicaciones
- json-server: /products, /categories, /users

## Branches sugeridas
- feature/catalog, feature/product-detail, feature/cart, feature/auth, feature/product-admin, chore/ui, chore/lint, data/api-mock
