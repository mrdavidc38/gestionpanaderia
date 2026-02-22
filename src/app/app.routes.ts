import { Routes } from '@angular/router';
import { authGuard } from './infrastructure/auth.guard';
import { UserRole } from './domain/models';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./ui/login/login').then(m => m.Login)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./ui/layout/layout').then(m => m.Layout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./ui/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'products',
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN, UserRole.PANADERO] },
        loadComponent: () => import('./ui/products/products-list').then(m => m.ProductsList)
      },
      {
        path: 'orders',
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN, UserRole.VENDEDOR] },
        loadComponent: () => import('./ui/orders/orders-list').then(m => m.OrdersList)
      },
      {
        path: 'users',
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN] },
        loadComponent: () => import('./ui/users/users-list').then(m => m.UsersList)
      },
      {
        path: 'billing',
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN, UserRole.VENDEDOR] },
        loadComponent: () => import('./ui/billing/billing-list').then(m => m.BillingList)
      },
      {
        path: 'reports',
        canActivate: [authGuard],
        data: { roles: [UserRole.ADMIN] },
        loadComponent: () => import('./ui/reports/reports').then(m => m.Reports)
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];
