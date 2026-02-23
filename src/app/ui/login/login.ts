import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../application/auth.service';
import { UserRole } from '../../domain/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-vintage-cream flex items-center justify-center p-6 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-wood-light/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-wood-dark/5 rounded-full blur-3xl"></div>

      <mat-card class="w-full max-w-md !rounded-3xl shadow-2xl overflow-hidden border border-wood-light/10 bg-white/90 backdrop-blur-sm relative z-10">
        <div class="wood-gradient p-12 text-white text-center relative">
          <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: url('https://www.transparenttextures.com/patterns/wood-pattern.png')"></div>
          <div class="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-3xl mb-6 backdrop-blur-md shadow-lg ring-1 ring-white/30">
            <mat-icon class="!w-12 !h-12 text-4xl">bakery_dining</mat-icon>
          </div>
          <h1 class="text-3xl font-bold tracking-tight vintage-serif">Panadería Sánchez</h1>
          <p class="text-wood-light/80 mt-3 font-medium italic vintage-serif text-lg">Tradición en cada bocado</p>
        </div>

        <mat-card-content class="p-10 mt-10">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="flex flex-col gap-8">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label class="vintage-serif">Correo Electrónico</mat-label>
              <input matInput type="email" formControlName="email" placeholder="ejemplo@panaderia.com">
              <mat-icon matPrefix class="mr-3 text-wood-light">email</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label class="vintage-serif">Rol de Acceso</mat-label>
              <mat-select formControlName="role">
                <mat-option [value]="UserRole.ADMIN">Administrador del Sistema</mat-option>
                <mat-option [value]="UserRole.VENDEDOR">Vendedor / Caja</mat-option>
                <mat-option [value]="UserRole.PANADERO">Maestro Panadero</mat-option>
              </mat-select>
              <mat-icon matPrefix class="mr-3 text-wood-light">admin_panel_settings</mat-icon>
            </mat-form-field>

            <button mat-flat-button class="h-14 !rounded-2xl text-lg font-bold mt-4 wood-gradient !text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
                    [disabled]="loginForm.invalid || loading()">
              @if (loading()) {
                <span class="flex items-center gap-2">
                  <mat-icon class="animate-spin">sync</mat-icon>
                  Autenticando...
                </span>
              } @else {
                Entrar al Obrador
              }
            </button>
          </form>

          <div class="mt-10 pt-8 border-t border-wood-light/10 text-center">
            <p class="text-wood-light font-medium vintage-serif italic">
              "El secreto está en la masa y en el corazón"
            </p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
    ::ng-deep .mat-mdc-outlined-button:not(:disabled) { border-color: var(--color-wood-light) !important; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  
  UserRole = UserRole;
  loading = signal(false);

  loginForm = this.fb.group({
    email: ['admin@sanchez.com', [Validators.required, Validators.email]],
    role: [UserRole.ADMIN, Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      const { email, role } = this.loginForm.value;
      // Simulate network delay
      setTimeout(() => {
        this.auth.login(email!, role!);
        this.loading.set(false);
      }, 800);
    }
  }
}
