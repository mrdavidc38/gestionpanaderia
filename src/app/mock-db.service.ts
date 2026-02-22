import { InMemoryDbService } from 'angular-in-memory-web-api';
import { UserRole, OrderStatus } from './domain/models';

export class MockDbService implements InMemoryDbService {
  createDb() {
    const products = [
      { id: '1', name: 'Pan de Molde', price: 3.5, stock: 45, category: 'Panes', description: 'Pan tierno y esponjoso, ideal para tostadas y sándwiches.' },
      { id: '2', name: 'Croissant Especial', price: 1.8, stock: 12, category: 'Bollería', description: 'Hojaldre crujiente con mantequilla pura de alta calidad.' },
      { id: '3', name: 'Baguette Rústica', price: 2.2, stock: 30, category: 'Panes', description: 'Corteza crujiente y miga alveolada con masa madre.' },
      { id: '4', name: 'Tarta de Manzana', price: 15.0, stock: 5, category: 'Pastelería', description: 'Base de hojaldre con crema pastelera y manzanas frescas.' },
      { id: '5', name: 'Muffin de Chocolate', price: 2.5, stock: 25, category: 'Bollería', description: 'Muffin intenso con pepitas de chocolate belga.' },
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

    return { products, users, orders, invoices };
  }
}
