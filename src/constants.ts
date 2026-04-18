import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    description: 'Forjado en titanio. Con el revolucionario chip A17 Pro, un botón de Acción personalizable y el sistema de cámara Pro más versátil hasta ahora.',
    price: 999,
    category: 'iPhone',
    images: [
      '/products/iphone-15-pro-1.png',
      '/products/iphone-15-pro-2.png'
    ],
    specs: {
      'Chip': 'Chip A17 Pro',
      'Cámara': 'Principal 48MP | Ultra Gran Angular',
      'Pantalla': 'Super Retina XDR de 6.1"'
    },
    stock: 15,
    rating: 4.8,
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'Carlos R.', rating: 5, comment: 'La mejor compra que he hecho. El titanio se siente increíblemente ligero.', date: '2026-03-20T10:00:00Z' },
      { id: 'r2', userId: 'u2', userName: 'Maria G.', rating: 5, comment: 'La cámara es de otro nivel, las fotos nocturnas son espectaculares.', date: '2026-03-22T14:30:00Z' }
    ]
  },
  {
    id: 'macbook-pro-m3',
    name: 'MacBook Pro 14"',
    description: 'Los chips más avanzados jamás construidos para una computadora personal. MacBook Pro avanza con los chips M3, M3 Pro y M3 Max.',
    price: 1599,
    category: 'Mac',
    images: [
      '/products/macbook-pro-1.png',
      '/products/macbook-pro-2.png'
    ],
    specs: {
      'Chip': 'Apple M3 Pro',
      'Memoria': '18GB Memoria Unificada',
      'Almacenamiento': '512GB SSD'
    },
    stock: 10,
    rating: 4.9,
    reviews: [
      { id: 'r3', userId: 'u3', userName: 'Javier M.', rating: 5, comment: 'Potencia pura. No hace nada de ruido incluso con tareas pesadas.', date: '2026-04-01T09:00:00Z' }
    ]
  },
  {
    id: 'ipad-pro-m2',
    name: 'iPad Pro 12.9"',
    description: 'Rendimiento asombroso. Pantallas increíblemente avanzadas. Conectividad inalámbrica ultrarrápida. Capacidades de Apple Pencil de nivel superior.',
    price: 1099,
    category: 'iPad',
    images: [
      '/products/ipad-pro-1.png',
      '/products/ipad-pro-2.png'
    ],
    specs: {
      'Chip': 'Chip Apple M2',
      'Pantalla': 'Liquid Retina XDR',
      'Conector': 'Thunderbolt / USB 4'
    },
    stock: 20,
    rating: 4.7,
    reviews: []
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    description: 'El Apple Watch más resistente y capaz. Diseñado para aventuras al aire libre y entrenamientos intensos con el nuevo S9 SiP.',
    price: 799,
    category: 'Watch',
    images: [
      '/products/watch-ultra-2-1.png',
      '/products/watch-ultra-2-2.png'
    ],
    specs: {
      'Caja': '49mm Titanio',
      'Pantalla': 'Retina siempre activa',
      'Batería': 'Hasta 36 horas'
    },
    stock: 25,
    rating: 4.9,
    reviews: [
      { id: 'r4', userId: 'u4', userName: 'Elena S.', rating: 5, comment: 'Un tanque en la muñeca. La batería me dura dos días sin problema.', date: '2026-04-10T18:20:00Z' }
    ]
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2da Gen)',
    description: 'Hasta 2 veces más Cancelación Activa de Ruido. El modo Transparencia te permite escuchar el mundo a tu alrededor. Audio Adaptativo.',
    price: 249,
    category: 'Accessories',
    images: [
      '/products/airpods-pro-2-1.png',
      '/products/airpods-pro-2-2.png'
    ],
    specs: {
      'Audio': 'Apple Silicon H2',
      'Carga': 'MagSafe (USB-C)',
      'Ruido': 'Cancelación Activa'
    },
    stock: 50,
    rating: 4.8,
    reviews: []
  }
];
