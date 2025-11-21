export type HTTPMETHOD = "GET" | "POST" | "PUT" | "DELETE";

export interface BaseParamsDataService {
  endpoint: string;
  useCache?: boolean;
}

export interface HttpRequestOptions<TPayload = unknown> {
  apikey?: string, 
  endpoint: string;         // /parking/ticket
  method?: HTTPMETHOD;      // GET, POST, etc.
  payload?: TPayload;       // body para POST o PUT
  useCache?: boolean;       // activar caché por endpoint+payload
  headers?: Record<string, string>;
}

export interface HttpResponse<T> {
  ok: boolean;
  status: number;
  data: T;
}

