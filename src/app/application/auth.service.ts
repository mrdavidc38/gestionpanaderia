import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { User, UserRole } from '../domain/models';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private currentUser = signal<User | null>(null);
  
  user = computed(() => this.currentUser());
  isLoggedIn = computed(() => !!this.currentUser());
  role = computed(() => this.currentUser()?.role);

  constructor() {
    // Mock initial state or check localStorage
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('bakery_user');
      if (saved) {
        this.currentUser.set(JSON.parse(saved));
      }
    }
  }

  login(email: string, role: UserRole) {
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      role
    };
    this.currentUser.set(mockUser);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bakery_user', JSON.stringify(mockUser));
    }
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('bakery_user');
    }
    this.router.navigate(['/login']);
  }

  hasRole(roles: UserRole[]): boolean {
    const user = this.currentUser();
    return !!user && roles.includes(user.role);
  }
}
