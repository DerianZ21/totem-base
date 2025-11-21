import { httpRequest } from "../services/htttpClient.service";
import { CajaFacturacion } from "../models/caja/caja.model";
import { Parqueo } from "../models/parqueo/parqueo.model";
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
export const openCashRegister = <TPayload = unknown>(payload: TPayload) => {
  return httpRequest<CajaFacturacion[], TPayload>({
    endpoint: `${WebEnvConfig.apiUrlfacturation}/caja-apertura`,
    method: "POST",
    useCache: true,
    payload: payload,
  });
};

// Buscar ingreso a parque
export const getParking = <TPayload = unknown>(payload: TPayload) => {
  return httpRequest<Parqueo, TPayload>({
    endpoint: `${WebEnvConfig.apiUrl}/lectorParqueo`,
    method: "POST",
    useCache: false,
    payload: payload,
  });
};
