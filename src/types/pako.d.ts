// Decodificaión
declare module "pako" {
  export function ungzip(
    data: Uint8Array | ArrayBuffer,
    options: { to: "string" }
  ): string;

  export function ungzip(
    data: Uint8Array | ArrayBuffer,
    options?: object
  ): Uint8Array;

  export function gzip(
    data: Uint8Array | string,
    options?: { level?: number }
  ): Uint8Array;
}