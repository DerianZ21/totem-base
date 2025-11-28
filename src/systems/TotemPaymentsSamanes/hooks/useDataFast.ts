import { useHttp } from "./useHttp";
import { getStatus, payProcess } from "../services/dataFast.services";
import { DataFastResponse } from "../models/dataFast/response";

export function useGetDFServiceStatus() {
  const { data, loading, error, execute } = useHttp<unknown, void>(getStatus);
  const executeGetDFServiceStatus = () => execute(undefined);
  return {
    dataDFServiceStatus: data,
    loadingDFServiceStatus: loading,
    errorDFServiceStatus: error,
    executeGetDFServiceStatus,
  };
}

export function useDFPayProcess<TPayload = unknown>() {
  const { data, loading, error, execute } = useHttp<DataFastResponse, TPayload>(
    payProcess
  );

  const executeDFPayProcess = (payload: TPayload) => execute(payload);

  return {
    dataDFPayProcess: data,
    loadingDFPayProcess: loading,
    errorDFPayProcess: error,
    executeDFPayProcess,
  };
}
