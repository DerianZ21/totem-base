// Corregir
export interface DataFastResponseStatus {
  status: string;
}

export interface DataFastResponse {
  success: boolean;
  data: dataResponse;
  message: string;
}

export interface dataResponse {
  AID: string;
  ARQC: string;
  AplicacionEMV: string;
  Autorizacion: string;
  CodigoAdquirente: string;
  CodigoRespuesta: string;
  CodigoRespuestaAut: string;
  Criptograma: string;
  Fecha: string;
  FechaVencimiento: string;
  Filler1: string;
  FillerFinal: string;
  Hora: string;
  Interes: string;
  Lote: string;
  MID: string;
  MensajeRespuestaAut: string;
  ModoLectura: string;
  MontoFijo: string;
  NombreAdquirente: string;
  NumerTarjetaEncriptado: string;
  NumeroTajeta: string;
  PIN: string;
  Publicidad: string;
  RedAdquirente: string;
  Referencia: string;
  TID: string;
  TSI: string;
  TVR: string;
  TarjetaHabiente: string;
  TipoMensaje: string;
}