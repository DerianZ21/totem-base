import { useCallback, useState } from "react";
import { HttpResponse } from "../models/http.model";

export function useHttp<TResponse, TPayload = unknown>(
  requestFn: (params: TPayload) => Promise<HttpResponse<TResponse>>
) {
  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const execute = useCallback( async (payload: TPayload) => {
    setLoading(true);
    setError(null);

    try {
      const result = await requestFn(payload);
      setData(result.data);

      if (result.status !== 200) {
        setError({
          message: "Error en consulta",
          request: requestFn,
          payload: payload,
          detalle: result,
        });
      }

      return result.data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  },[requestFn]);

  return { data, loading, error, execute };
}
