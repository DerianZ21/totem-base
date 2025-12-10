import { useHttp } from "./useHttp";
import { getStatus, payProcess } from "../services/dataFast.services";
import {
  DataFastResponse,
  DataFastResponseStatus,
} from "../models/dataFast/response";

export function useGetDFServiceStatus() {
  const { data, loading, error, execute, reset } = useHttp<
    DataFastResponseStatus,
    undefined
  >(getStatus);
  const executeGetDFServiceStatus = () => {
    return execute(undefined);
  };

  return {
    dataDFServiceStatus: data,
    loadingDFServiceStatus: loading,
    errorDFServiceStatus: error,
    executeGetDFServiceStatus,
    resetDFServiceStatus: reset
  };
}

export function useDFPayProcess<TPayload>() {
  const { data, loading, error, execute, reset } = useHttp<DataFastResponse, TPayload>(
    payProcess
  );

  const executeDFPayProcess = (payload: TPayload) => {
    return execute(payload);
  };

  return {
    dataDFPayProcess: data,
    loadingDFPayProcess: loading,
    errorDFPayProcess: error,
    executeDFPayProcess,
    resetDFPayProcess: reset
  };
}
