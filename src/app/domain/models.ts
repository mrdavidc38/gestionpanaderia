export enum UserRole {
  ADMIN = 'ADMIN',
  VENDEDOR = 'VENDEDOR',
  PANADERO = 'PANADERO'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  categoryId: string;
  description?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  date: string;
  deliveryDate?: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export interface Invoice {
  id: string;
  orderId: string;
  date: string;
  customerName: string;
  total: number;
}

export interface Expense {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}
