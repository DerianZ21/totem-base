// genera token de autenticación para header
export function getAuthHeaderCredential(): string {
  const prefix = "Pinlet-Auth-Totem-Payment";
  const timestamp = new Date().toISOString();
  const raw = `${prefix}.${timestamp}`;
  const token = btoa(raw);
  return token;
}
