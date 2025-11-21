export interface Parqueo {
  fecha_ingreso: string;
  fecha_validacion: string;
  estado: string;
  placa: string;
  ingreso: Ingreso;
}

export interface Ingreso {
  nombre_puerta_ingreso: string;
  tipo_ingreso: string;
  tiempo_total: string; // Tiempo acumulado
  valor_total: string; // Total parqueo
  tarifa_aplicada: string; //tarifa
  img_ingreso: string;
  img_ingreso_array: string[];
}
