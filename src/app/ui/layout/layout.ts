import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../application/auth.service';
import { UserRole } from '../../domain/models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="h-screen">
      <mat-sidenav #sidenav mode="side" opened class="w-72 border-r border-wood-light/20 bg-vintage-paper shadow-xl">
        <div class="p-8 flex flex-col h-full">
          <div class="flex flex-col items-center mb-10 text-center">
            <div class="bg-wood-dark p-3 rounded-full text-white shadow-lg mb-4 ring-4 ring-wood-light/20">
              <mat-icon class="!w-8 !h-8 text-2xl">bakery_dining</mat-icon>
            </div>
            <h1 class="text-2xl font-bold text-wood-dark tracking-tight vintage-serif">Sánchez</h1>
            <div class="h-px w-16 bg-wood-light/30 mt-2"></div>
          </div>

          <nav class="flex-1 space-y-3">
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link" 
               class="nav-item group transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl">
              <div class="flex items-center gap-4 px-2">
                <mat-icon class="text-wood-light group-hover:text-wood-dark transition-colors">dashboard</mat-icon>
                <span class="font-medium text-slate-700 group-hover:text-wood-dark">Dashboard</span>
              </div>
            </a>

            @if (auth.hasRole([UserRole.ADMIN, UserRole.PANADERO])) {
              <a mat-list-item routerLink="/products" routerLinkActive="active-link" 
                 class="nav-item group transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl">
                <div class="flex items-center gap-4 px-2">
                  <mat-icon class="text-wood-light group-hover:text-wood-dark transition-colors">inventory_2</mat-icon>
                  <span class="font-medium text-slate-700 group-hover:text-wood-dark">Productos</span>
                </div>
              </a>
            }

            @if (auth.hasRole([UserRole.ADMIN, UserRole.VENDEDOR])) {
              <a mat-list-item routerLink="/orders" routerLinkActive="active-link" 
                 class="nav-item group transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl">
                <div class="flex items-center gap-4 px-2">
                  <mat-icon class="text-wood-light group-hover:text-wood-dark transition-colors">shopping_cart</mat-icon>
                  <span class="font-medium text-slate-700 group-hover:text-wood-dark">Pedidos</span>
                </div>
              </a>
            }

            @if (auth.hasRole([UserRole.ADMIN, UserRole.VENDEDOR])) {
              <a mat-list-item routerLink="/billing" routerLinkActive="active-link" 
                 class="nav-item group transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl">
                <div class="flex items-center gap-4 px-2">
                  <mat-icon class="text-wood-light group-hover:text-wood-dark transition-colors">receipt_long</mat-icon>
                  <span class="font-medium text-slate-700 group-hover:text-wood-dark">Facturación</span>
                </div>
              </a>
            }

            @if (auth.hasRole([UserRole.ADMIN])) {
              <a mat-list-item routerLink="/reports" routerLinkActive="active-link" 
                 class="nav-item group transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl">
                <div class="flex items-center gap-4 px-2">
                  <mat-icon class="text-wood-light group-hover:text-wood-dark transition-colors">analytics</mat-icon>
                  <span class="font-medium text-slate-700 group-hover:text-wood-dark">Informes</span>
                </div>
              </a>
            }

            @if (auth.hasRole([UserRole.ADMIN])) {
              <a mat-list-item routerLink="/users" routerLinkActive="active-link" 
                 class="nav-item group transition-all duration-300 hover:shadow-md hover:scale-[1.02] rounded-xl">
                <div class="flex items-center gap-4 px-2">
                  <mat-icon class="text-wood-light group-hover:text-wood-dark transition-colors">people</mat-icon>
                  <span class="font-medium text-slate-700 group-hover:text-wood-dark">Usuarios</span>
                </div>
              </a>
            }
          </nav>

          <div class="mt-auto pt-8 border-t border-wood-light/20">
            <div class="flex items-center gap-4 mb-6 px-2 bg-white/40 p-3 rounded-2xl border border-wood-light/10">
              <div class="w-12 h-12 rounded-full bg-wood-medium flex items-center justify-center text-white font-bold shadow-inner">
                {{ auth.user()?.name?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="flex flex-col overflow-hidden">
                <span class="text-sm font-bold text-wood-dark truncate">{{ auth.user()?.name }}</span>
                <span class="text-xs text-wood-light uppercase tracking-widest font-semibold">{{ auth.user()?.role }}</span>
              </div>
            </div>
            <button mat-button color="warn" class="w-full !justify-start !rounded-xl !py-6 hover:bg-rose-50 transition-colors" (click)="auth.logout()">
              <mat-icon>logout</mat-icon>
              <span class="font-bold">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content class="bg-vintage-cream">
        <header class="h-20 bg-white/80 backdrop-blur-md border-b border-wood-light/10 flex items-center px-10 sticky top-0 z-10 shadow-sm">
          <button mat-icon-button class="lg:hidden mr-4 text-wood-dark" (click)="sidenav.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <div class="flex-1">
            <span class="text-wood-light font-medium vintage-serif italic text-lg">Artesanos del Sabor</span>
          </div>
          <div class="flex items-center gap-6">
            <button mat-icon-button class="text-wood-light hover:text-wood-dark transition-colors">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="h-10 w-px bg-wood-light/20"></div>
            <span class="text-sm font-bold text-wood-medium vintage-serif">{{ today | date:'fullDate':'':'es' }}</span>
          </div>
        </header>

        <main class="p-10 max-w-7xl mx-auto">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
    mat-sidenav { border-right: none !important; }
    .nav-item { 
      height: 56px !important; 
      border: 1px solid transparent;
    }
    .active-link {
      background-color: white !important;
      border-color: var(--color-wood-light) !important;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
    }
    .active-link span {
      color: var(--color-wood-dark) !important;
      font-weight: 700 !important;
    }
    .active-link mat-icon {
      color: var(--color-wood-dark) !important;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Layout {
  auth = inject(AuthService);
  UserRole = UserRole;
  today = new Date();
}
