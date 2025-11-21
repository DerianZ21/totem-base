import { useHttp } from "./useHttp";
import {
  getCashRegister,
  openCashRegister,
  getParking,
} from "../services/billing.service";
import { CajaFacturacion } from "../models/caja/caja.model";
import { Parqueo } from "../models/parqueo/parqueo.model";

export function useGetCashRegister() {
  const { data, loading, error, execute } = useHttp<CajaFacturacion[], void>(
    getCashRegister
  );
  const cargarCajas = () => execute(undefined);
  return {
    cajas: data,
    loadingGetCashRegister: loading,
    errorGetCashRegister: error,
    cargarCajas,
  };
}

export function useOpenCashRegister<TPayload = unknown>() {
  const { data, loading, error, execute } = useHttp<
    CajaFacturacion[],
    TPayload
  >(openCashRegister);

  const abrirCaja = (payload: TPayload) => execute(payload);

  return {
    data,
    loadingOpenCashRegister: loading,
    errorOpenCashRegister: error,
    abrirCaja,
  };
}

export function useGetParking<TPayload = unknown>() {
  const { data, loading, error, execute } = useHttp<Parqueo, TPayload>(
    getParking
  );

  const obtenerIngreso = (payload: TPayload) => execute(payload);

  return {
    dataParkingEntry: data,
    loadinGetParking: loading,
    errorloadinGetParking: error,
    obtenerIngreso,
  };
}
