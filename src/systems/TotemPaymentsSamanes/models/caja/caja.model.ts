import { Empresa } from "./empresa.model";
import { EstablecimientoData } from "./establecimiento.model";
import { PuntoEmisionData } from "./puntoEmision.model";

export type TipoFactura = "AUTOMATICA" | "MANUAL" | "NO";

export interface CajaFacturacion {
  id: number;
  createdAt: string;
  updatedAt: string;

  empresaId: number;
  estado: boolean;
  nombre: string;
  tipoFactura: TipoFactura;

  establecimiento: string;
  puntoEmision: string;

  empresa: Empresa;
  establecimientoData: EstablecimientoData;
  puntoEmisionData: PuntoEmisionData;
}