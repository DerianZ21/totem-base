import { useHttp } from "./useHttp";
import {
  getCashRegister,
  openCashRegister,
  getParking,
  validateParking,
} from "../services/billing.service";
import { CajaFacturacion } from "../models/caja/caja.model";
import { Parqueo, ResponseValidate } from "../models/parqueo/parqueo.model";

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

export function useOpenCashRegister<TPayload>() {
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

export function useGetParking<TPayload>() {
  const { data, loading, error, execute, reset } = useHttp<Parqueo, TPayload>(
    getParking
  );

  const executeGetIngreso = (payload: TPayload) => execute(payload);

  return {
    dataGetParking: data,
    loadingGetParking: loading,
    errorGetParking: error,
    executeGetIngreso,
    resetGetParking: reset

  };
}

export function useValidateParking<TPayload>() {
  const { data, loading, error, execute, reset } = useHttp<ResponseValidate, TPayload>(
    validateParking
  );

  const executeValidateParqueo = (payload: TPayload) => execute(payload);

  return {
    dataValidateParking: data,
    loadingValidateParking: loading,
    errorValidateParking: error,
    executeValidateParqueo,
    resetValidateParqueo: reset
  };
}
