export interface PuntoEmisionData {
  id: number;
  codigo: string;
  nombre: string;
  estado: string;

  secFactura: number;
  secLiquidacionCompra: number;
  secNotaCredito: number;
  secNotaDebito: number;
  secGuiaRemision: number;
  secComprobanteRetencion: number;

  createdAt: string;
  updatedAt: string;
}