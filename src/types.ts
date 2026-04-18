
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'iPhone' | 'Mac' | 'iPad' | 'Watch' | 'Accessories';
  images: string[];
  specs: Record<string, string>;
  stock: number;
  rating: number;
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface CartItem {
  productId: string;
  quantity: number;
}
