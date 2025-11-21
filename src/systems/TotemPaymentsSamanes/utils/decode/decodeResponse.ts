import pako from "pako";

/**
 * Descomprime una respuesta GZIP y la convierte en JSON
 * @param buffer - ArrayBuffer comprimido
 * @returns Objeto JSON con el tipo indicado
 */

export const decodeGzipJson = async <T>(buffer: ArrayBuffer): Promise<T> => {
  const uint8 = new Uint8Array(buffer);
  const decompressed = pako.ungzip(uint8, { to: "string" });
  return JSON.parse(decompressed) as T;
};
