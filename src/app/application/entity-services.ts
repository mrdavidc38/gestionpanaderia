import { Injectable, inject } from '@angular/core';
import { EntityCollectionServiceBase, EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Product, Order, User, Invoice } from '../domain/models';

@Injectable({ providedIn: 'root' })
export class ProductService extends EntityCollectionServiceBase<Product> {
  constructor() {
    super('Product', inject(EntityCollectionServiceElementsFactory));
  }
}

@Injectable({ providedIn: 'root' })
export class OrderService extends EntityCollectionServiceBase<Order> {
  constructor() {
    super('Order', inject(EntityCollectionServiceElementsFactory));
  }
}

@Injectable({ providedIn: 'root' })
export class UserService extends EntityCollectionServiceBase<User> {
  constructor() {
    super('User', inject(EntityCollectionServiceElementsFactory));
  }
}

@Injectable({ providedIn: 'root' })
export class InvoiceService extends EntityCollectionServiceBase<Invoice> {
  constructor() {
    super('Invoice', inject(EntityCollectionServiceElementsFactory));
  }
}
