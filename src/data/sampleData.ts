// Sample data for the artisan marketplace
import product1 from '@/assets/product-1.jpg';
import product2 from '@/assets/product-2.jpg';
import product3 from '@/assets/product-3.jpg';
import product4 from '@/assets/product-4.jpg';
import product5 from '@/assets/product-5.jpg';
import product6 from '@/assets/product-6.jpg';

export interface Artisan {
  id: string;
  name: string;
  avatar?: string;
  location: string;
  specialties: string[];
  rating: number;
  totalOrders: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  artisan: Artisan;
  hypePoints: number;
  tags: string[];
  category: string;
}

export interface Order {
  id: string;
  product: Product;
  status: "pending" | "accepted" | "in_progress" | "shipped" | "completed";
  createdAt: string;
  estimatedDelivery?: string;
  customDescription?: string;
}

export const sampleArtisans: Artisan[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Jaipur, Rajasthan",
    specialties: ["Wood Carving", "Hand Painting"],
    rating: 4.9,
    totalOrders: 156,
  },
  {
    id: "2", 
    name: "Rahul Patel",
    location: "Varanasi, UP",
    specialties: ["Silk Weaving", "Traditional Textiles"],
    rating: 4.7,
    totalOrders: 89,
  },
  {
    id: "3",
    name: "Meera Devi",
    location: "Moradabad, UP",
    specialties: ["Brass Work", "Metal Crafts"],
    rating: 4.8,
    totalOrders: 134,
  },
  {
    id: "4",
    name: "Arjun Kumar",
    location: "Khurja, UP", 
    specialties: ["Pottery", "Ceramic Arts"],
    rating: 4.6,
    totalOrders: 67,
  },
  {
    id: "5",
    name: "Fatima Khan",
    location: "Kolkata, WB",
    specialties: ["Leather Work", "Bookbinding"],
    rating: 4.9,
    totalOrders: 73,
  },
  {
    id: "6",
    name: "Lakshmi Iyer",
    location: "Chennai, TN",
    specialties: ["Silver Jewelry", "Traditional Metalwork"],
    rating: 4.8,
    totalOrders: 142,
  },
];

export const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Hand-painted Wooden Jewelry Box",
    description: "Exquisite wooden jewelry box with traditional peacock motifs and gold details",
    price: 2499,
    image: product1,
    artisan: sampleArtisans[0],
    hypePoints: 127,
    tags: ["Traditional", "Wooden", "Hand-painted"],
    category: "Accessories",
  },
  {
    id: "2",
    name: "Handwoven Silk Scarf",
    description: "Pure silk scarf with traditional paisley patterns in vibrant colors",
    price: 1899,
    image: product2,
    artisan: sampleArtisans[1],
    hypePoints: 89,
    tags: ["Silk", "Handwoven", "Traditional"],
    category: "Clothing",
  },
  {
    id: "3",
    name: "Brass Decorative Elephant",
    description: "Intricately carved brass elephant figurine with traditional engravings",
    price: 3299,
    image: product3,
    artisan: sampleArtisans[2],
    hypePoints: 156,
    tags: ["Brass", "Decorative", "Metalwork"],
    category: "Home Decor",
  },
  {
    id: "4",
    name: "Hand-painted Ceramic Vase",
    description: "Beautiful ceramic vase with mandala patterns and traditional motifs",
    price: 1799,
    image: product4,
    artisan: sampleArtisans[3],
    hypePoints: 73,
    tags: ["Ceramic", "Hand-painted", "Decorative"],
    category: "Home Decor",
  },
  {
    id: "5",
    name: "Leather Bound Journal",
    description: "Premium leather journal with embossed Indian motifs and handmade paper",
    price: 1299,
    image: product5,
    artisan: sampleArtisans[4],
    hypePoints: 94,
    tags: ["Leather", "Handcrafted", "Journal"],
    category: "Accessories",
  },
  {
    id: "6",
    name: "Silver Traditional Bangles",
    description: "Handcrafted silver bangles with traditional Indian designs and patterns",
    price: 4599,
    image: product6,
    artisan: sampleArtisans[5],
    hypePoints: 142,
    tags: ["Silver", "Traditional", "Jewelry"],
    category: "Jewelry",
  },
];

export const sampleOrders: Order[] = [
  {
    id: "ORD-001",
    product: sampleProducts[0],
    status: "in_progress",
    createdAt: "2024-01-15",
    estimatedDelivery: "2024-02-15",
    customDescription: "Hand-painted wooden jewelry box with peacock design and gold accents",
  },
  {
    id: "ORD-002",
    product: sampleProducts[1],
    status: "pending",
    createdAt: "2024-01-20",
    estimatedDelivery: "2024-02-20",
  },
  {
    id: "ORD-003",
    product: sampleProducts[2],
    status: "completed",
    createdAt: "2023-12-10",
    estimatedDelivery: "2024-01-10",
  },
];