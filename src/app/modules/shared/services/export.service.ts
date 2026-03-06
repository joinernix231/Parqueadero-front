import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

// Import xlsx dinámicamente para evitar problemas de tipos
let XLSX: any;
async function loadXLSX() {
  if (!XLSX) {
    XLSX = await import('xlsx');
  }
  return XLSX;
}

export interface ExportColumn {
  key: string;
  label: string;
  format?: (value: any) => string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  
  /**
   * Exporta datos a Excel
   */
  async exportToExcel(
    data: any[],
    columns: ExportColumn[],
    fileName: string = 'reporte'
  ): Promise<void> {
    const XLSX = await loadXLSX();
    
    // Preparar datos para Excel
    const excelData = data.map(item => {
      const row: any = {};
      columns.forEach(col => {
        const value = item[col.key];
        row[col.label] = col.format ? col.format(value) : value ?? '';
      });
      return row;
    });

    // Crear workbook y worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');

    // Ajustar ancho de columnas
    const columnWidths = columns.map(() => ({ wch: 20 }));
    worksheet['!cols'] = columnWidths;

    // Generar nombre de archivo con fecha
    const dateStr = DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss');
    const fullFileName = `${fileName}_${dateStr}.xlsx`;

    // Descargar archivo
    XLSX.writeFile(workbook, fullFileName);
  }

  /**
   * Exporta reporte de tickets a Excel con formato mejorado
   */
  async exportTicketsReport(
    tickets: any[],
    fileName: string = 'reporte_tickets'
  ): Promise<void> {
    const columns: ExportColumn[] = [
      { key: 'id', label: 'ID Ticket' },
      { 
        key: 'vehicle', 
        label: 'Placa', 
        format: (v) => v?.plate || '' 
      },
      { 
        key: 'entry_time', 
        label: 'Fecha Entrada',
        format: (v) => this.formatDate(v)
      },
      { 
        key: 'exit_time', 
        label: 'Fecha Salida',
        format: (v) => v ? this.formatDate(v) : 'En curso'
      },
      { 
        key: 'parking_lot', 
        label: 'Estacionamiento',
        format: (v) => v?.name || ''
      },
      { 
        key: 'parking_spot_id', 
        label: 'Espacio'
      },
      { 
        key: 'total_amount', 
        label: 'Monto Total',
        format: (v) => v ? `$${Number(v).toFixed(2)}` : '-'
      },
      { 
        key: 'is_paid', 
        label: 'Estado Pago',
        format: (v) => v ? 'Pagado' : 'Pendiente'
      },
      { 
        key: 'is_active', 
        label: 'Estado',
        format: (v) => v ? 'Activo' : 'Completado'
      }
    ];

    await this.exportToExcel(tickets, columns, fileName);
  }

  /**
   * Exporta resumen de estadísticas a Excel
   */
  async exportSummaryReport(
    summary: any,
    fileName: string = 'resumen_estadisticas'
  ): Promise<void> {
    const XLSX = await loadXLSX();
    
    const data = [
      { Métrica: 'Total Tickets', Valor: summary.totalTickets || 0 },
      { Métrica: 'Vehículos Activos', Valor: summary.activeVehicles || 0 },
      { Métrica: 'Ingresos Totales', Valor: `$${(summary.totalRevenue || 0).toFixed(2)}` },
      { Métrica: 'Tasa de Ocupación', Valor: `${(summary.occupancyRate || 0).toFixed(2)}%` },
      { Métrica: 'Tickets Pagados', Valor: summary.paidTickets || 0 },
      { Métrica: 'Tickets Pendientes', Valor: summary.pendingTickets || 0 },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Resumen');

    worksheet['!cols'] = [{ wch: 25 }, { wch: 15 }];

    const dateStr = DateTime.now().toFormat('yyyy-MM-dd_HH-mm-ss');
    XLSX.writeFile(workbook, `${fileName}_${dateStr}.xlsx`);
  }

  private formatDate(dateString: string | null | undefined): string {
    if (!dateString || dateString === 'null' || dateString === '') return '-';
    try {
      const date = DateTime.fromISO(dateString);
      if (!date.isValid) {
        return dateString;
      }
      return date.toFormat('dd/MM/yyyy HH:mm');
    } catch {
      return dateString || '-';
    }
  }
}

