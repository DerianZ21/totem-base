import { useState } from "react";
import { HttpResponse } from "../models/http.model";

export function useHttp<TResponse, TPayload>(
  requestFn: (params: TPayload) => Promise<HttpResponse<TResponse>>
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<{
    message: string;
    request: (params: TPayload) => Promise<HttpResponse<TResponse>>;
    payload: TPayload;
    detalle?: HttpResponse<TResponse>;
  } | null>(null);

  const execute = async (payload: TPayload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFn(payload);
      setData(result.data);

      if (result.status !== 200) {
        setError({
          message: "BAD_REQUEST",
          request: requestFn,
          payload: payload,
          detalle: result,
        });
      }

      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError({
          message: err.message,
          request: requestFn,
          payload: payload,
        });
      } else {
        console.log("aqui: no: "+String(err));
        setError({
          message: String(err),
          request: requestFn,
          payload: payload,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setLoading(false);
    setError(null);
  };

  return { data, loading, error, execute, reset };
}
