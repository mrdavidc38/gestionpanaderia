import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UserRole } from '../../domain/models';
import { UserService } from '../../application/entity-services';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="space-y-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-4xl font-bold text-wood-dark tracking-tight vintage-serif">Equipo del Obrador</h2>
          <p class="text-wood-light font-medium mt-2 italic vintage-serif text-lg">Administra el personal y sus permisos de acceso.</p>
        </div>
        <button mat-flat-button class="!rounded-2xl h-14 px-8 wood-gradient !text-white shadow-lg hover:shadow-xl transition-all active:scale-95">
          <mat-icon class="mr-2">person_add</mat-icon>
          <span class="font-bold text-lg vintage-serif">Nuevo Compañero</span>
        </button>
      </div>

      @if (userService.loading$ | async) {
        <div class="flex flex-col items-center justify-center p-20 space-y-4">
          <mat-progress-spinner mode="indeterminate" diameter="60" class="!text-wood-medium"></mat-progress-spinner>
          <p class="text-wood-light font-bold vintage-serif italic animate-pulse">Consultando el registro de personal...</p>
        </div>
      } @else {
        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-wood-light/10">
          <table mat-table [dataSource]="(userService.entities$ | async) || []" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Usuario</th>
              <td mat-cell *matCellDef="let u" class="py-6 px-8">
                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-full bg-wood-medium flex items-center justify-center text-white font-black shadow-lg ring-4 ring-wood-light/10">
                    {{ u.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-wood-dark text-lg vintage-serif">{{ u.name }}</span>
                    <span class="text-xs font-bold text-wood-light italic">{{ u.email }}</span>
                  </div>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Rol / Gremio</th>
              <td mat-cell *matCellDef="let u" class="py-6 px-8">
                <span [ngClass]="{
                  'bg-blue-50 text-blue-700 ring-blue-100': u.role === UserRole.ADMIN,
                  'bg-purple-50 text-purple-700 ring-purple-100': u.role === UserRole.VENDEDOR,
                  'bg-orange-50 text-orange-700 ring-orange-100': u.role === UserRole.PANADERO
                }" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ring-1">
                  {{ u.role }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8 text-right">Acciones</th>
              <td mat-cell *matCellDef="let u" class="py-6 px-8 text-right">
                <button mat-icon-button class="text-wood-light hover:text-wood-dark transition-colors mr-2">
                  <mat-icon>security</mat-icon>
                </button>
                <button mat-icon-button class="text-wood-light hover:text-rose-600 transition-colors">
                  <mat-icon>delete_outline</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-vintage-cream/30 transition-colors"></tr>
          </table>
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersList implements OnInit {
  userService = inject(UserService);
  displayedColumns = ['name', 'role', 'actions'];
  UserRole = UserRole;

  ngOnInit() {
    this.userService.getAll();
  }
}
