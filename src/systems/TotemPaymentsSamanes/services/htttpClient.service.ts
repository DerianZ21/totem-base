import { HttpRequestOptions, HttpResponse } from "../models/http.model";
import { decodeGzipJson } from "../utils/decode/decodeResponse";

const cache: Record<string, unknown> = {};

const generateCacheKey = (req: HttpRequestOptions): string => {
  const method = req.method ?? "GET";
  const payloadStr = req.payload ? JSON.stringify(req.payload) : "";
  return `${req.endpoint}_${method}_${payloadStr}`;
};

export async function httpRequest<TResponse, TPayload = unknown>(
  req: HttpRequestOptions<TPayload>
): Promise<HttpResponse<TResponse>> {
  const {
    apikey,
    endpoint,
    method = "GET",
    payload,
    useCache = false,
    headers = {},
  } = req;

  const url = endpoint;
  const cacheKey = generateCacheKey(req);

  if (useCache && cache[cacheKey]) {
    return { ok: true, status: 200, data: cache[cacheKey] as TResponse  };
  }

  try {
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const buffer = await response.arrayBuffer();

    let data: TResponse;

    try {
      data = await decodeGzipJson<TResponse>(buffer);
    } catch {
      const text = new TextDecoder("utf-8").decode(buffer);
      data = JSON.parse(text);
    }

    if (useCache) cache[cacheKey] = data;

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (err: unknown) {
    console.error("Error en httpRequest:", err);
    throw err;
  }
}
