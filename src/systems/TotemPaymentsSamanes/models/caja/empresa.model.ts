export interface Empresa {
  id: number;
  createdAt: string;
  updatedAt: string;
  ruc: string;
  razonSocial: string;
  nombreComercial: string;
  direccionMatriz: string;

  contribuyenteRimpe: boolean;
  negocioPopular: boolean;
  contribuyenteEspecial: boolean;
  obligadoContabilidad: boolean;
  agenteRetencion: boolean;

  ambiente: number;
  logo: string | null;
}