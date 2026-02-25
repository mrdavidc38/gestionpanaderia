import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InvoiceService, OrderService } from '../../application/entity-services';
import { Invoice } from '../../domain/models';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-billing-list',
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
          <h2 class="text-4xl font-bold text-wood-dark tracking-tight vintage-serif">Registro de Facturación</h2>
          <p class="text-wood-light font-medium mt-2 italic vintage-serif text-lg">Historial de facturas emitidas y comprobantes.</p>
        </div>
        <div class="flex gap-4">
          <button mat-stroked-button class="!rounded-2xl h-14 px-8 !border-wood-light/30 !text-wood-medium hover:bg-vintage-paper transition-all">
            <mat-icon class="mr-2">file_download</mat-icon>
            <span class="font-bold vintage-serif">Exportar Reporte</span>
          </button>
          <button mat-flat-button class="!rounded-2xl h-14 px-8 wood-gradient !text-black shadow-lg hover:shadow-xl transition-all active:scale-95">
            <mat-icon class="mr-2">receipt</mat-icon>
            <span class="font-bold text-lg vintage-serif">Nueva Factura</span>
          </button>
        </div>
      </div>

      @if (invoiceService.loading$ | async) {
        <div class="flex flex-col items-center justify-center p-20 space-y-4">
          <mat-progress-spinner mode="indeterminate" diameter="60" class="!text-wood-medium"></mat-progress-spinner>
          <p class="text-wood-light font-bold vintage-serif italic animate-pulse">Recuperando archivos de facturación...</p>
        </div>
      } @else {
        <div class="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-wood-light/10">
          <table mat-table [dataSource]="(invoiceService.entities$ | async) || []" class="w-full">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Nº Factura</th>
              <td mat-cell *matCellDef="let i" class="py-6 px-8 font-mono text-wood-dark font-black">
                FAC-{{ i.id }}
              </td>
            </ng-container>

            <ng-container matColumnDef="customer">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Cliente</th>
              <td mat-cell *matCellDef="let i" class="py-6 px-8 text-wood-dark font-bold vintage-serif text-lg">
                {{ i.customerName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Fecha Emisión</th>
              <td mat-cell *matCellDef="let i" class="py-6 px-8 text-wood-light font-bold italic vintage-serif">
                {{ i.date | date:'mediumDate' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8">Total</th>
              <td mat-cell *matCellDef="let i" class="py-6 px-8 font-black text-emerald-700 text-xl">
                {{ i.total | currency }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef class="!bg-vintage-paper !text-wood-dark font-black uppercase text-xs tracking-[0.2em] py-6 px-8 text-right">Acciones</th>
              <td mat-cell *matCellDef="let i" class="py-6 px-8 text-right">
                <button mat-icon-button class="text-wood-light hover:text-wood-dark transition-colors mr-2" title="Descargar PDF" (click)="generatePDF(i)">
                  <mat-icon>picture_as_pdf</mat-icon>
                </button>
                <button mat-icon-button class="text-wood-light hover:text-emerald-600 transition-colors" title="Enviar por Email">
                  <mat-icon>send</mat-icon>
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
export class BillingList implements OnInit {
  invoiceService = inject(InvoiceService);
  orderService = inject(OrderService);
  displayedColumns = ['id', 'customer', 'date', 'total', 'actions'];

  ngOnInit() {
    this.invoiceService.getAll();
    this.orderService.getAll();
  }

  async generatePDF(invoice: Invoice) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(44, 24, 16); // Wood dark
    doc.text('Panadería Sánchez', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Tradición en cada bocado', 105, 26, { align: 'center' });
    
    doc.setDrawColor(210, 180, 140); // Wood light
    doc.line(20, 32, 190, 32);
    
    // Invoice Info
    doc.setFontSize(14);
    doc.setTextColor(44, 24, 16);
    doc.text(`FACTURA Nº: FAC-${invoice.id}`, 20, 45);
    
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date(invoice.date).toLocaleDateString()}`, 20, 52);
    doc.text(`Cliente: ${invoice.customerName}`, 20, 59);
    
    // Find associated order
    const orders = await firstValueFrom(this.orderService.entities$);
    const order = orders.find(o => o.id === invoice.orderId);
    
    if (order && order.items && order.items.length > 0) {
      const tableData = order.items.map(item => [
        item.productName,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`
      ]);
      
      autoTable(doc, {
        startY: 70,
        head: [['Producto', 'Cant.', 'Precio Unit.', 'Subtotal']],
        body: tableData,
        headStyles: { fillColor: [44, 24, 16], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [245, 242, 237] },
        margin: { left: 20, right: 20 }
      });
    } else {
      doc.text('Detalle de productos no disponible.', 20, 75);
    }
    
    // Total
    const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || 80;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL: $${invoice.total.toFixed(2)}`, 190, finalY + 20, { align: 'right' });
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text('Gracias por su preferencia. "El secreto está en la masa y en el corazón"', 105, 280, { align: 'center' });
    
    doc.save(`Factura_Sanchez_${invoice.id}.pdf`);
  }
}
