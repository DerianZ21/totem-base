import { useHttp } from "./useHttp";
import { getStatus, payProcess } from "../services/dataFast.services";
import { DataFastResponse } from "../models/dataFast/response";
import { useCallback } from "react";

export function useGetDFServiceStatus() {
  const { data, loading, error, execute } = useHttp<string, void>(getStatus);
  const executeGetDFServiceStatus = useCallback(() => {
    execute(undefined);
  }, [execute]);
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

  const executeDFPayProcess = useCallback((payload: TPayload) => { execute(payload) }, [execute]);

  return {
    dataDFPayProcess: data,
    loadingDFPayProcess: loading,
    errorDFPayProcess: error,
    executeDFPayProcess,
  };
}
