export interface Parqueo {
  id_ingreso: number;
  fecha_ingreso: string;
  fecha_validacion: string;
  estado: string;
  placa: string;
  ingreso: Ingreso;
}

export interface Ingreso {
  id_ingreso: number;
  nombre_puerta_ingreso: string;
  tipo_ingreso: string;
  tiempo_total: string; // Tiempo acumulado
  valor_total: string; // Total parqueo
  tiempo_horas_pago: string
  tarifa_aplicada: string; //tarifa
  img_ingreso: string;
  img_ingreso_array: string[];
}

export interface ResponseValidate{
  status: string;
}
