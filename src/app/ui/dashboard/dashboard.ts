import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../application/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="space-y-12">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-wood-light/10 pb-8">
        <div>
          <h2 class="text-5xl font-bold text-wood-dark tracking-tight vintage-serif">Libro Diario del Obrador</h2>
          <p class="text-wood-light font-medium mt-3 italic vintage-serif text-xl">Bienvenido, Maestro Panadero {{ auth.user()?.name }}</p>
        </div>
        <div class="bg-vintage-paper/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-wood-light/20 shadow-sm flex items-center gap-3">
          <div class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          <span class="text-xs font-black text-wood-dark uppercase tracking-[0.2em]">Obrador en Marcha</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <mat-card class="p-8 !rounded-[2.5rem] border border-wood-light/10 shadow-sm bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
          <div class="flex items-center justify-between">
            <div class="bg-amber-50 p-5 rounded-3xl text-wood-medium group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <mat-icon class="!w-10 !h-10 text-3xl">payments</mat-icon>
            </div>
            <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full ring-1 ring-emerald-100 uppercase tracking-widest">+12.5%</span>
          </div>
          <div class="mt-8">
            <h3 class="text-wood-light text-[10px] font-black uppercase tracking-[0.25em]">Caja del Día</h3>
            <p class="text-4xl font-bold text-wood-dark mt-3 vintage-serif">$1,240.00</p>
          </div>
        </mat-card>

        <mat-card class="p-8 !rounded-[2.5rem] border border-wood-light/10 shadow-sm bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
          <div class="flex items-center justify-between">
            <div class="bg-orange-50 p-5 rounded-3xl text-orange-700 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <mat-icon class="!w-10 !h-10 text-3xl">inventory</mat-icon>
            </div>
            <span class="text-[10px] font-black text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full ring-1 ring-rose-100 uppercase tracking-widest">Crítico</span>
          </div>
          <div class="mt-8">
            <h3 class="text-wood-light text-[10px] font-black uppercase tracking-[0.25em]">Stock a Reponer</h3>
            <p class="text-4xl font-bold text-wood-dark mt-3 vintage-serif">8 Tipos</p>
          </div>
        </mat-card>

        <mat-card class="p-8 !rounded-[2.5rem] border border-wood-light/10 shadow-sm bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
          <div class="flex items-center justify-between">
            <div class="bg-wood-light/10 p-5 rounded-3xl text-wood-medium group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <mat-icon class="!w-10 !h-10 text-3xl">pending_actions</mat-icon>
            </div>
            <span class="text-[10px] font-black text-wood-light bg-wood-light/5 px-4 py-1.5 rounded-full ring-1 ring-wood-light/10 uppercase tracking-widest">En Horno</span>
          </div>
          <div class="mt-8">
            <h3 class="text-wood-light text-[10px] font-black uppercase tracking-[0.25em]">Encargos Activos</h3>
            <p class="text-4xl font-bold text-wood-dark mt-3 vintage-serif">14</p>
          </div>
        </mat-card>

        <mat-card class="p-8 !rounded-[2.5rem] border border-wood-light/10 shadow-sm bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
          <div class="flex items-center justify-between">
            <div class="bg-emerald-50 p-5 rounded-3xl text-emerald-700 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <mat-icon class="!w-10 !h-10 text-3xl">group</mat-icon>
            </div>
            <span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full ring-1 ring-emerald-100 uppercase tracking-widest">Fieles</span>
          </div>
          <div class="mt-8">
            <h3 class="text-wood-light text-[10px] font-black uppercase tracking-[0.25em]">Visitas Hoy</h3>
            <p class="text-4xl font-bold text-wood-dark mt-3 vintage-serif">24</p>
          </div>
        </mat-card>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section class="lg:col-span-2 space-y-6">
          <div class="flex items-center justify-between px-4">
            <h3 class="text-3xl font-bold text-wood-dark vintage-serif">Últimos Encargos</h3>
            <button class="text-wood-medium font-bold text-sm hover:underline vintage-serif tracking-wide">Ver libro de pedidos completo →</button>
          </div>
          <mat-card class="p-10 !rounded-[3rem] border border-wood-light/10 shadow-xl bg-white relative overflow-hidden">
            <div class="absolute top-0 left-0 w-full h-2 wood-gradient opacity-20"></div>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left border-b border-wood-light/10">
                    <th class="pb-8 font-black text-wood-light text-[10px] uppercase tracking-[0.2em]">Referencia</th>
                    <th class="pb-8 font-black text-wood-light text-[10px] uppercase tracking-[0.2em]">Cliente</th>
                    <th class="pb-8 font-black text-wood-light text-[10px] uppercase tracking-[0.2em]">Importe</th>
                    <th class="pb-8 font-black text-wood-light text-[10px] uppercase tracking-[0.2em]">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-wood-light/5">
                  <tr class="hover:bg-vintage-cream/30 transition-all duration-300 group">
                    <td class="py-8 text-xs font-mono text-wood-light group-hover:text-wood-dark font-bold">#ORD-001</td>
                    <td class="py-8 text-lg font-bold text-wood-dark vintage-serif">Juan Pérez</td>
                    <td class="py-8 text-xl text-wood-dark font-black tracking-tight">$45.00</td>
                    <td class="py-8">
                      <span class="text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full ring-1 ring-emerald-100 shadow-sm">Completado</span>
                    </td>
                  </tr>
                  <tr class="hover:bg-vintage-cream/30 transition-all duration-300 group">
                    <td class="py-8 text-xs font-mono text-wood-light group-hover:text-wood-dark font-bold">#ORD-002</td>
                    <td class="py-8 text-lg font-bold text-wood-dark vintage-serif">María García</td>
                    <td class="py-8 text-xl text-wood-dark font-black tracking-tight">$12.50</td>
                    <td class="py-8">
                      <span class="text-[9px] font-black uppercase tracking-[0.2em] bg-amber-50 text-amber-700 px-4 py-1.5 rounded-full ring-1 ring-amber-100 shadow-sm">Pendiente</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </mat-card>
        </section>

        <section class="space-y-6">
          <div class="px-4">
            <h3 class="text-3xl font-bold text-wood-dark vintage-serif">Favoritos del Día</h3>
          </div>
          <mat-card class="p-10 !rounded-[3rem] border border-wood-light/10 shadow-xl bg-vintage-paper/30 backdrop-blur-md relative overflow-hidden">
            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-wood-medium/5 rounded-full blur-3xl"></div>
            <div class="space-y-10">
              <div class="flex items-center gap-6 group cursor-pointer">
                <div class="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-4xl shadow-lg group-hover:rotate-6 transition-all duration-500 border border-wood-light/5">🥖</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-wood-dark group-hover:text-wood-medium transition-colors vintage-serif">Baguette Tradicional</h4>
                  <p class="text-[10px] text-wood-light font-black uppercase tracking-widest mt-1">124 unidades hoy</p>
                </div>
                <span class="text-xl font-black text-wood-dark">$2.50</span>
              </div>
              <div class="flex items-center gap-6 group cursor-pointer">
                <div class="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-4xl shadow-lg group-hover:rotate-6 transition-all duration-500 border border-wood-light/5">🥐</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-wood-dark group-hover:text-wood-medium transition-colors vintage-serif">Croissant Mantequilla</h4>
                  <p class="text-[10px] text-wood-light font-black uppercase tracking-widest mt-1">89 unidades hoy</p>
                </div>
                <span class="text-xl font-black text-wood-dark">$1.80</span>
              </div>
              <div class="flex items-center gap-6 group cursor-pointer">
                <div class="w-20 h-20 rounded-[2rem] bg-white flex items-center justify-center text-4xl shadow-lg group-hover:rotate-6 transition-all duration-500 border border-wood-light/5">🍩</div>
                <div class="flex-1">
                  <h4 class="text-lg font-bold text-wood-dark group-hover:text-wood-medium transition-colors vintage-serif">Berlina de Crema</h4>
                  <p class="text-[10px] text-wood-light font-black uppercase tracking-widest mt-1">56 unidades hoy</p>
                </div>
                <span class="text-xl font-black text-wood-dark">$2.20</span>
              </div>
            </div>
            <button class="w-full mt-12 py-5 rounded-[2rem] border-2 border-dashed border-wood-light/30 text-wood-light font-black uppercase tracking-widest text-[10px] hover:bg-white hover:border-wood-medium hover:text-wood-medium transition-all shadow-sm">
              Ver catálogo completo del obrador
            </button>
          </mat-card>
        </section>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  auth = inject(AuthService);
}
