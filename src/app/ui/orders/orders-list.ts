import { Component, ChangeDetectionStrategy, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { OrderStatus, Order, Product, OrderItem } from '../../domain/models';
import { OrderService, ProductService } from '../../application/entity-services';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-order-form-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="p-8 bg-vintage-cream min-w-[600px]">
      <h2 class="text-3xl font-bold text-wood-dark vintage-serif mb-6">
        {{ data ? 'Editar Pedido' : 'Nuevo Pedido' }}
      </h2>

      <form [formGroup]="orderForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label class="vintage-serif">Nombre del Comprador</mat-label>
            <input matInput formControlName="customerName" placeholder="Ej: Juan Pérez">
            <mat-icon matPrefix class="mr-2 text-wood-light">person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label class="vintage-serif">Estado</mat-label>
            <mat-select formControlName="status">
              <mat-option [value]="OrderStatus.PENDING">Pendiente</mat-option>
              <mat-option [value]="OrderStatus.COMPLETED">Completado</mat-option>
              <mat-option [value]="OrderStatus.CANCELLED">Cancelado</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label class="vintage-serif">Fecha de Inicio</mat-label>
            <input matInput [matDatepicker]="picker1" formControlName="date">
            <mat-datepicker-toggle matIconSuffix [for]="picker1"></mat-datepicker-toggle>
            <mat-datepicker #picker1></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label class="vintage-serif">Fecha de Entrega (Salida)</mat-label>
            <input matInput [matDatepicker]="picker2" formControlName="deliveryDate">
            <mat-datepicker-toggle matIconSuffix [for]="picker2"></mat-datepicker-toggle>
            <mat-datepicker #picker2></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-wood-dark vintage-serif">Productos</h3>
            <button type="button" mat-stroked-button color="primary" class="!rounded-xl" (click)="addItem()">
              <mat-icon>add</mat-icon> Agregar Producto
            </button>
          </div>

          <div formArrayName="items" class="space-y-3 max-h-60 overflow-y-auto pr-2">
            @for (item of items.controls; track $index) {
              <div [formGroupName]="$index" class="flex gap-4 items-center bg-white/50 p-3 rounded-2xl border border-wood-light/10">
                <mat-form-field appearance="outline" class="flex-[2]">
                  <mat-label>Producto</mat-label>
                  <mat-select formControlName="productId" (selectionChange)="onProductChange($index, $event.value)">
                    @for (p of products(); track p.id) {
                      <mat-option [value]="p.id">{{ p.name }} ({{ p.price | currency }})</mat-option>
                    }
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="flex-1">
                  <mat-label>Cant.</mat-label>
                  <input matInput type="number" formControlName="quantity" min="1">
                </mat-form-field>

                <div class="flex-1 text-right font-bold text-wood-dark">
                  {{ (item.get('price')?.value * item.get('quantity')?.value) | currency }}
                </div>

                <button type="button" mat-icon-button color="warn" (click)="removeItem($index)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            }
          </div>
        </div>

        <div class="flex justify-between items-center pt-6 border-t border-wood-light/20">
          <div class="text-2xl font-bold text-wood-dark vintage-serif">
            Total: {{ calculateTotal() | currency }}
          </div>
          <div class="flex gap-4">
            <button type="button" mat-button mat-dialog-close class="!rounded-xl h-12 px-6">Cancelar</button>
            <button type="submit" mat-flat-button class="!rounded-xl h-12 px-10 wood-gradient !text-black font-bold shadow-lg" [disabled]="orderForm.invalid">
              {{ data ? 'Guardar Cambios' : 'Crear Pedido' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class OrderFormDialog implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<OrderFormDialog>);
  data = inject<Order | null>(MAT_DIALOG_DATA);
  productService = inject(ProductService);
  
  OrderStatus = OrderStatus;
  products = signal<Product[]>([]);

  orderForm = this.fb.group({
    customerName: ['', Validators.required],
    status: [OrderStatus.PENDING, Validators.required],
    date: [new Date(), Validators.required],
    deliveryDate: [new Date(), Validators.required],
    items: this.fb.array([])
  });

  get items() { return this.orderForm.get('items') as FormArray; }

  ngOnInit() {
    this.productService.getAll().subscribe(prods => this.products.set(prods));
    
    if (this.data) {
      this.orderForm.patchValue({
        customerName: this.data.customerName,
        status: this.data.status,
        date: new Date(this.data.date),
        deliveryDate: this.data.deliveryDate ? new Date(this.data.deliveryDate) : new Date()
      });
      this.data.items.forEach(item => {
        this.items.push(this.fb.group({
          productId: [item.productId, Validators.required],
          productName: [item.productName],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          price: [item.price]
        }));
      });
    } else {
      this.addItem();
    }
  }

  addItem() {
    this.items.push(this.fb.group({
      productId: ['', Validators.required],
      productName: [''],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0]
    }));
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  onProductChange(index: number, productId: string) {
    const product = this.products().find(p => p.id === productId);
    if (product) {
      const group = this.items.at(index);
      group.patchValue({
        productName: product.name,
        price: product.price
      });
    }
  }

  calculateTotal() {
    return this.items.controls.reduce((acc, control) => {
      const price = control.get('price')?.value || 0;
      const qty = control.get('quantity')?.value || 0;
      return acc + (price * qty);
    }, 0);
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      const orderData: Partial<Order> = {
        ...this.data,
        customerName: formValue.customerName!,
        status: formValue.status!,
        date: (formValue.date as Date).toISOString(),
        deliveryDate: (formValue.deliveryDate as Date).toISOString(),
        items: formValue.items as OrderItem[],
        total: this.calculateTotal(),
        userId: '1' // Mock user
      };
      this.dialogRef.close(orderData);
    }
  }
}

@Component({
  selector: 'app-order-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="p-8 bg-vintage-cream min-w-[500px]">
      <div class="flex items-center justify-between mb-8 border-b border-wood-light/20 pb-4">
        <div class="flex items-center gap-3">
          <div class="bg-wood-dark p-2 rounded-lg text-white">
            <mat-icon>bakery_dining</mat-icon>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-wood-dark vintage-serif">Panadería Sánchez</h2>
            <p class="text-xs text-wood-light font-black uppercase tracking-widest">Ticket de Pedido #{{ data.id }}</p>
          </div>
        </div>
        <button mat-icon-button mat-dialog-close class="text-wood-light" title="Cerrar">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4 bg-white/50 p-4 rounded-2xl border border-wood-light/10">
          <div>
            <p class="text-[10px] font-black text-wood-light uppercase tracking-widest">Cliente</p>
            <p class="text-lg font-bold text-wood-dark vintage-serif">{{ data.customerName }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-wood-light uppercase tracking-widest">Estado</p>
            <span [ngClass]="{
              'text-amber-600': data.status === OrderStatus.PENDING,
              'text-emerald-600': data.status === OrderStatus.COMPLETED,
              'text-rose-600': data.status === OrderStatus.CANCELLED
            }" class="text-sm font-bold uppercase tracking-widest">
              {{ data.status }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 bg-white/50 p-4 rounded-2xl border border-wood-light/10">
          <div>
            <p class="text-[10px] font-black text-wood-light uppercase tracking-widest">Fecha Inicio</p>
            <p class="text-sm font-bold text-wood-dark">{{ data.date | date:'medium' }}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-black text-wood-light uppercase tracking-widest">Fecha Entrega</p>
            <p class="text-sm font-bold text-wood-dark">{{ data.deliveryDate | date:'medium' }}</p>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-wood-light/10 overflow-hidden shadow-sm">
          <table mat-table [dataSource]="data.items" class="w-full">
            <ng-container matColumnDef="product">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-[10px] tracking-widest py-3 px-4">Producto</th>
              <td mat-cell *matCellDef="let item" class="py-3 px-4 text-sm font-bold text-wood-dark">{{ item.productName }}</td>
            </ng-container>

            <ng-container matColumnDef="qty">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-[10px] tracking-widest py-3 px-4 text-center">Cant.</th>
              <td mat-cell *matCellDef="let item" class="py-3 px-4 text-sm text-center font-mono">{{ item.quantity }}</td>
            </ng-container>

            <ng-container matColumnDef="price">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-[10px] tracking-widest py-3 px-4 text-right">Precio</th>
              <td mat-cell *matCellDef="let item" class="py-3 px-4 text-sm text-right font-bold">{{ item.price | currency }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="['product', 'qty', 'price']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['product', 'qty', 'price']"></tr>
          </table>
        </div>

        <div class="flex justify-between items-center pt-4 border-t border-wood-light/20">
          <span class="text-xl font-bold text-wood-dark vintage-serif">Total a Pagar</span>
          <span class="text-3xl font-black text-wood-dark">{{ data.total | currency }}</span>
        </div>
      </div>

      <div class="mt-10 flex gap-4">
        <button mat-flat-button class="flex-1 !rounded-xl h-12 wood-gradient !text-black font-bold" (click)="print()">
          <mat-icon class="mr-2">print</mat-icon> Imprimir Ticket
        </button>
        <button mat-stroked-button mat-dialog-close class="flex-1 !rounded-xl h-12 !border-wood-light/30 !text-wood-light font-bold">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface { border-radius: 2rem !important; }
  `]
})
export class OrderDetailDialog {
  data = inject<Order>(MAT_DIALOG_DATA);
  OrderStatus = OrderStatus;
  print() { window.print(); }
}

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="space-y-10">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 class="text-4xl font-bold text-wood-dark tracking-tight vintage-serif">Libro de Pedidos</h2>
          <p class="text-wood-light font-medium mt-2 italic vintage-serif text-lg">Seguimiento de encargos y ventas directas.</p>
        </div>
        <button mat-flat-button class="!rounded-2xl h-14 px-8 wood-gradient !text-black shadow-lg hover:shadow-xl transition-all active:scale-95" (click)="openOrderForm()">
          <mat-icon class="mr-2">shopping_basket</mat-icon>
          <span class="font-bold text-lg vintage-serif">Nuevo Encargo</span>
        </button>
      </div>

      @if (orderService.loading$ | async) {
        <div class="flex flex-col items-center justify-center p-20 space-y-4">
          <mat-progress-spinner mode="indeterminate" diameter="60" class="!text-wood-medium"></mat-progress-spinner>
          <p class="text-wood-light font-bold vintage-serif italic animate-pulse">Consultando el libro de pedidos...</p>
        </div>
      } @else {
        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-wood-light/10">
          <table mat-table [dataSource]="(orderService.entities$ | async) || []" class="w-full">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Referencia</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8 font-mono text-wood-light font-bold">
                #{{ o.id }}
              </td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Cliente</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8 text-wood-dark font-bold vintage-serif">
                {{ o.customerName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Inicio</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8 text-wood-light font-medium">
                {{ o.date | date:'short' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="deliveryDate">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Entrega</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8 text-wood-light font-medium">
                {{ o.deliveryDate | date:'short' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Total</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8 font-black text-wood-dark text-lg">
                {{ o.total | currency }}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Estado</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8">
                <span [ngClass]="{
                  'bg-amber-50 text-amber-700 ring-amber-100': o.status === OrderStatus.PENDING,
                  'bg-emerald-50 text-emerald-700 ring-emerald-100': o.status === OrderStatus.COMPLETED,
                  'bg-rose-50 text-rose-700 ring-rose-100': o.status === OrderStatus.CANCELLED
                }" class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] ring-1">
                  {{ o.status }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8 text-right">Acciones</th>
              <td mat-cell *matCellDef="let o" class="py-6 px-8 text-right">
                <button mat-icon-button class="text-wood-light hover:text-wood-dark transition-colors mr-2" (click)="viewDetail(o)" title="Ver Detalle">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button class="text-wood-light hover:text-wood-dark transition-colors mr-2" (click)="openOrderForm(o)" title="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button class="text-wood-light hover:text-rose-600 transition-colors mr-2" (click)="deleteOrder(o.id)" title="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
                <button mat-icon-button class="text-wood-light hover:text-emerald-600 transition-colors" (click)="printOrder(o)" title="Imprimir">
                  <mat-icon>print</mat-icon>
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
export class OrdersList implements OnInit {
  orderService = inject(OrderService);
  dialog = inject(MatDialog);
  displayedColumns = ['id', 'customer', 'date', 'deliveryDate', 'total', 'status', 'actions'];
  OrderStatus = OrderStatus;

  ngOnInit() {
    this.orderService.getAll();
  }

  viewDetail(order: Order) {
    this.dialog.open(OrderDetailDialog, {
      data: order,
      maxWidth: '600px'
    });
  }

  openOrderForm(order?: Order) {
    const dialogRef = this.dialog.open(OrderFormDialog, {
      data: order || null,
      width: '700px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (order) {
          this.orderService.update(result);
        } else {
          this.orderService.add({
            ...result,
            id: 'ORD-' + Math.floor(Math.random() * 1000)
          });
        }
      }
    });
  }

  deleteOrder(id: string) {
    if (confirm('¿Deseas eliminar este pedido?')) {
      this.orderService.delete(id);
    }
  }

  printOrder(order: Order) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(62, 39, 35); // Wood dark
    doc.text('Panadería Sánchez', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Tradición en cada bocado', 105, 26, { align: 'center' });
    
    doc.setDrawColor(141, 110, 99); // Wood light
    doc.line(20, 32, 190, 32);
    
    // Order Info
    doc.setFontSize(14);
    doc.setTextColor(62, 39, 35);
    doc.text(`PEDIDO Nº: ${order.id}`, 20, 45);
    
    doc.setFontSize(10);
    doc.text(`Fecha Inicio: ${new Date(order.date).toLocaleDateString()}`, 20, 52);
    const deliveryDateStr = order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : 'No especificada';
    doc.text(`Fecha Entrega: ${deliveryDateStr}`, 20, 59);
    doc.text(`Cliente: ${order.customerName}`, 20, 66);
    
    if (order.items && order.items.length > 0) {
      const tableData = order.items.map(item => [
        item.productName,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: 75,
        head: [['Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
        body: tableData,
        headStyles: { fillColor: [62, 39, 35], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 242, 237] },
        margin: { left: 20, right: 20 }
      });
    }
    
    // Total
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 85;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: $${order.total.toFixed(2)}`, 190, finalY + 20, { align: 'right' });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por su preferencia. "El secreto está en la masa y en el corazón"', 105, 280, { align: 'center' });
    
    doc.save(`Pedido_Sanchez_${order.id}.pdf`);
  }
}
