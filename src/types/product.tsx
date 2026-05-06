// src/types/product.ts
export interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  image_url?: string;
  description: string;
  created_at?: string;
}