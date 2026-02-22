import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ProductService } from '../../application/entity-services';
import { Product } from '../../domain/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  template: `
    <div class="space-y-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-4xl font-bold text-wood-dark tracking-tight vintage-serif">Catálogo de Productos</h2>
          <p class="text-wood-light font-medium mt-2 italic vintage-serif text-lg">Gestiona el inventario de panadería y repostería.</p>
        </div>
        <button mat-flat-button class="!rounded-2xl h-14 px-8 wood-gradient !text-white shadow-lg hover:shadow-xl transition-all active:scale-95" (click)="addProduct()">
          <mat-icon class="mr-2">add_circle</mat-icon>
          <span class="font-bold text-lg vintage-serif">Nuevo Producto</span>
        </button>
      </div>

      @if (productService.loading$ | async) {
        <div class="flex flex-col items-center justify-center p-20 space-y-4">
          <mat-progress-spinner mode="indeterminate" diameter="60" class="!text-wood-medium"></mat-progress-spinner>
          <p class="text-wood-light font-bold vintage-serif italic animate-pulse">Preparando el mostrador...</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          @for (p of (productService.entities$ | async); track p.id) {
            <mat-card class="!rounded-[2rem] overflow-hidden border border-wood-light/10 shadow-sm hover:shadow-2xl transition-all duration-500 group bg-white flex flex-col">
              <div class="relative h-56 overflow-hidden">
                @if (p.image) {
                  <img [src]="p.image" [alt]="p.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer">
                } @else {
                  <div class="w-full h-full bg-vintage-paper flex flex-col items-center justify-center p-6 text-center">
                    <div class="text-6xl mb-4 opacity-80 group-hover:scale-110 transition-transform duration-500">
                      {{ p.category === 'Panes' || p.category === 'Pan' ? '🥖' : 
                         p.category === 'Bollería' ? '🥐' : 
                         p.category === 'Pastelería' ? '🍰' : '🍞' }}
                    </div>
                    <p class="text-wood-light text-xs italic vintage-serif line-clamp-3 px-4">
                      {{ p.description || 'Sin descripción disponible' }}
                    </p>
                  </div>
                }
                <div class="absolute inset-0 bg-gradient-to-t from-wood-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                   <div class="flex gap-2 w-full">
                     <button mat-mini-fab color="primary" class="!bg-white !text-wood-dark" (click)="uploadImage(p)" title="Cambiar Imagen">
                       <mat-icon>photo_camera</mat-icon>
                     </button>
                     <div class="flex-1"></div>
                     <button mat-mini-fab color="warn" (click)="deleteProduct(p.id)" title="Eliminar">
                       <mat-icon>delete</mat-icon>
                     </button>
                   </div>
                </div>
                <div class="absolute top-4 right-4">
                  <span [ngClass]="{
                    'bg-rose-500 text-white': p.stock < 20,
                    'bg-emerald-500 text-white': p.stock >= 20
                  }" class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {{ p.stock }} uds.
                  </span>
                </div>
              </div>
              
              <mat-card-content class="p-6 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="text-xl font-bold text-wood-dark vintage-serif truncate pr-2">{{ p.name }}</h3>
                  <span class="text-lg font-black text-wood-medium whitespace-nowrap">{{ p.price | currency }}</span>
                </div>
                <p class="text-xs font-bold text-wood-light uppercase tracking-[0.2em] mb-4">{{ p.category }}</p>
                
                <div class="mt-auto pt-4 border-t border-wood-light/5 flex justify-between items-center">
                  <button mat-button class="!text-wood-medium !font-bold vintage-serif" (click)="editProduct(p)">
                    <mat-icon class="mr-1">edit</mat-icon> Editar
                  </button>
                  @if (p.stock < 20) {
                    <div class="flex items-center text-rose-500 gap-1">
                      <mat-icon class="text-sm">warning</mat-icon>
                      <span class="text-[10px] font-bold uppercase">Reponer</span>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsList implements OnInit {
  productService = inject(ProductService);
  displayedColumns = ['name', 'price', 'stock', 'actions'];

  ngOnInit() {
    this.productService.getAll();
  }

  addProduct() {
    const name = prompt('Nombre del producto:');
    if (name) {
      const category = prompt('Categoría (Panes, Bollería, Pastelería):', 'Panes') || 'Panes';
      const description = prompt('Descripción del producto:') || '';
      const price = parseFloat(prompt('Precio:', '1.0') || '1.0');
      
      this.productService.add({
        id: Math.random().toString(36).substr(2, 9),
        name,
        price,
        stock: 100,
        category,
        description
      });
    }
  }

  editProduct(product: Product) {
    const newPrice = prompt('Nuevo precio:', product.price.toString());
    if (newPrice !== null) {
      this.productService.update({ ...product, price: parseFloat(newPrice) });
    }
  }

  uploadImage(product: Product) {
    const imageUrl = prompt('URL de la imagen (simulación de subida):', product.image || '');
    if (imageUrl !== null) {
      this.productService.update({ ...product, image: imageUrl });
    }
  }

  deleteProduct(id: string) {
    if (confirm('¿Deseas retirar este producto del mostrador?')) {
      this.productService.delete(id);
    }
  }
}
