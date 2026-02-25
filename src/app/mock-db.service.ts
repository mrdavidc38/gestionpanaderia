import { InMemoryDbService } from 'angular-in-memory-web-api';
import { UserRole, OrderStatus } from './domain/models';

export class MockDbService implements InMemoryDbService {
  createDb() {
    const categories = [
      { id: 'cat1', name: 'Pan grande', description: 'Panes de gran formato y hogazas tradicionales.', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat2', name: 'Dulcería', description: 'Bollería dulce, pasteles y caprichos azucarados.', image: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80' },
      { id: 'cat3', name: 'Pan pequeño', description: 'Panecillos, pulgas y piezas individuales.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
    ];

    const products = [
      { id: '1', name: 'Hogaza de Pueblo', price: 3.5, stock: 45, categoryId: 'cat1', description: 'Pan rústico de masa madre cocido en horno de piedra.', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80' },
      { id: '2', name: 'Croissant de Mantequilla', price: 1.8, stock: 12, categoryId: 'cat2', description: 'Hojaldre crujiente con mantequilla pura.', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80' },
      { id: '3', name: 'Baguette Tradición', price: 1.2, stock: 30, categoryId: 'cat1', description: 'Corteza crujiente y miga alveolada.', image: 'https://images.unsplash.com/photo-1597079910443-60c43fc4f729?auto=format&fit=crop&w=800&q=80' },
      { id: '4', name: 'Tarta de Santiago', price: 15.0, stock: 5, categoryId: 'cat2', description: 'Tarta tradicional de almendra.', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80' },
      { id: '5', name: 'Panecillo de Sésamo', price: 0.6, stock: 100, categoryId: 'cat3', description: 'Pequeño pan tierno con semillas de sésamo.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80' },
    ];

    const users = [
      { id: '1', name: 'Admin Principal', email: 'admin@lossanchez.com', role: UserRole.ADMIN },
      { id: '2', name: 'Carlos Vendedor', email: 'carlos@lossanchez.com', role: UserRole.VENDEDOR },
      { id: '3', name: 'Marta Panadera', email: 'marta@lossanchez.com', role: UserRole.PANADERO },
    ];

    const orders = [
      { 
        id: 'ORD-101', 
        userId: '1', 
        customerName: 'Familia Rodriguez',
        date: new Date().toISOString(), 
        deliveryDate: new Date(Date.now() + 86400000).toISOString(),
        total: 45.50, 
        status: OrderStatus.PENDING, 
        items: [
          { productId: '1', productName: 'Pan de Molde', quantity: 2, price: 3.5 },
          { productId: '4', productName: 'Tarta de Manzana', quantity: 1, price: 15.0 }
        ] 
      },
      { 
        id: 'ORD-102', 
        userId: '2', 
        customerName: 'Cafetería Central',
        date: new Date().toISOString(), 
        deliveryDate: new Date(Date.now() + 172800000).toISOString(),
        total: 12.80, 
        status: OrderStatus.COMPLETED, 
        items: [
          { productId: '2', productName: 'Croissant Especial', quantity: 5, price: 1.8 },
          { productId: '3', productName: 'Baguette Rústica', quantity: 2, price: 2.2 }
        ] 
      },
    ];

    const invoices = [
      { id: '2024-001', orderId: 'ORD-101', date: new Date().toISOString(), customerName: 'Consumidor Final', total: 45.50 },
    ];

    return { products, users, orders, invoices, categories };
  }
}
