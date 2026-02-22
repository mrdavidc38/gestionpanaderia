import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { OrderService } from '../../application/entity-services';
import { Order } from '../../domain/models';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="space-y-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-4xl font-bold text-wood-dark tracking-tight vintage-serif">Informes y Balance</h2>
          <p class="text-wood-light font-medium mt-2 italic vintage-serif text-lg">Análisis de rendimiento y salud financiera del obrador.</p>
        </div>
      </div>

      <mat-card class="p-8 !rounded-[2.5rem] border border-wood-light/10 shadow-xl bg-white">
        <div class="flex flex-wrap items-end gap-6 mb-10">
          <mat-form-field appearance="outline" class="flex-1 min-w-[200px]">
            <mat-label class="vintage-serif">Desde</mat-label>
            <input matInput [matDatepicker]="picker1" [(ngModel)]="startDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="flex-1 min-w-[200px]">
            <mat-label class="vintage-serif">Hasta</mat-label>
            <input matInput [matDatepicker]="picker2" [(ngModel)]="endDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>

          <button mat-flat-button class="h-14 !rounded-2xl px-10 wood-gradient !text-white font-bold shadow-lg mb-4">
            <mat-icon class="mr-2">analytics</mat-icon>
            Generar Informe
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
            <p class="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2">Ingresos Totales</p>
            <p class="text-3xl font-bold text-emerald-900 vintage-serif">{{ totalIncome() | currency }}</p>
          </div>
          <div class="p-6 rounded-3xl bg-rose-50 border border-rose-100">
            <p class="text-[10px] font-black text-rose-700 uppercase tracking-widest mb-2">Gastos Operativos</p>
            <p class="text-3xl font-bold text-rose-900 vintage-serif">{{ totalExpenses() | currency }}</p>
          </div>
          <div class="p-6 rounded-3xl bg-wood-dark text-white shadow-xl">
            <p class="text-[10px] font-black text-wood-light uppercase tracking-widest mb-2">Balance Neto</p>
            <p class="text-3xl font-bold vintage-serif">{{ (totalIncome() - totalExpenses()) | currency }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <h3 class="text-2xl font-bold text-wood-dark vintage-serif px-2">Desglose de Actividad</h3>
          <div class="bg-vintage-paper/30 rounded-3xl p-8 border border-wood-light/10">
             <div class="flex items-center justify-between mb-6">
               <span class="text-wood-medium font-bold vintage-serif">Ventas Realizadas</span>
               <span class="text-wood-dark font-black">{{ filteredOrders().length }} pedidos</span>
             </div>
             <div class="h-2 bg-wood-light/10 rounded-full overflow-hidden mb-10">
               <div class="h-full bg-wood-dark" [style.width.%]="75"></div>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div class="space-y-4">
                 <p class="text-xs font-black text-wood-light uppercase tracking-widest">Principales Gastos</p>
                 <div class="space-y-3">
                   <div class="flex justify-between text-sm">
                     <span class="text-wood-medium font-bold">Materias Primas</span>
                     <span class="text-wood-dark font-black">$450.00</span>
                   </div>
                   <div class="flex justify-between text-sm">
                     <span class="text-wood-medium font-bold">Suministros (Luz/Agua)</span>
                     <span class="text-wood-dark font-black">$120.00</span>
                   </div>
                   <div class="flex justify-between text-sm">
                     <span class="text-wood-medium font-bold">Mantenimiento</span>
                     <span class="text-wood-dark font-black">$85.00</span>
                   </div>
                 </div>
               </div>
               <div class="space-y-4">
                 <p class="text-xs font-black text-wood-light uppercase tracking-widest">Rendimiento por Categoría</p>
                 <div class="space-y-3">
                   <div class="flex justify-between text-sm">
                     <span class="text-wood-medium font-bold">Panes</span>
                     <span class="text-emerald-700 font-black">65%</span>
                   </div>
                   <div class="flex justify-between text-sm">
                     <span class="text-wood-medium font-bold">Bollería</span>
                     <span class="text-emerald-700 font-black">25%</span>
                   </div>
                   <div class="flex justify-between text-sm">
                     <span class="text-wood-medium font-bold">Pastelería</span>
                     <span class="text-emerald-700 font-black">10%</span>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reports implements OnInit {
  orderService = inject(OrderService);
  
  startDate = new Date(new Date().setDate(new Date().getDate() - 30));
  endDate = new Date();

  orders = signal<Order[]>([]);
  
  filteredOrders = computed(() => {
    return this.orders().filter(o => {
      const orderDate = new Date(o.date);
      return orderDate >= this.startDate && orderDate <= this.endDate;
    });
  });

  totalIncome = computed(() => {
    return this.filteredOrders().reduce((acc, o) => acc + o.total, 0);
  });

  // Mock expenses for balance
  totalExpenses = signal(655.00);

  ngOnInit() {
    this.orderService.getAll().subscribe(orders => {
      this.orders.set(orders);
    });
  }
}
