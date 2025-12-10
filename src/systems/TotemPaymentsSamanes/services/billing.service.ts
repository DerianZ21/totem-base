import { httpRequest } from "../services/htttpClient.service";
import { CajaFacturacion } from "../models/caja/caja.model";
import { Parqueo, ResponseValidate } from "../models/parqueo/parqueo.model";
import { WebEnvConfig } from "../config/env";

// Obtener Las cajas disponibles
export const getCashRegister = () => {
  return httpRequest<CajaFacturacion[]>({
    endpoint: `${WebEnvConfig.apiUrlfacturation}/cajas?empresaId=${WebEnvConfig.idPlace}`,
    method: "GET",
    useCache: true,
  });
};

// Abrir caja
export const openCashRegister = <TPayload>(payload: TPayload) => {
  return httpRequest<CajaFacturacion[], TPayload>({
    endpoint: `${WebEnvConfig.apiUrlfacturation}/caja-apertura`,
    method: "POST",
    useCache: true,
    payload: payload,
  });
};

// Buscar ingreso a parque
export const getParking = <TPayload>(payload: TPayload) => {
  return httpRequest<Parqueo, TPayload>({
    endpoint: `${WebEnvConfig.apiUrlPinlet}/lectorParqueo`,
    method: "POST",
    useCache: false,
    payload: payload,
  });
};

// Buscar ingreso a parque
export const validateParking = <TPayload>(payload: TPayload) => {
  return httpRequest<ResponseValidate, TPayload>({
    endpoint: `${WebEnvConfig.apiUrlPinlet}/validarParqueoRegistro `,
    method: "POST",
    useCache: false,
    payload: payload,
    apikey: WebEnvConfig.token,
  });
};
