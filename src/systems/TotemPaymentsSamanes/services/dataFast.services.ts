import { httpRequest } from "../services/htttpClient.service";
import { WebEnvConfig } from "../config/env";
import { DataFastResponse } from "../models/dataFast/response";

// Obtener status del servicio de datafast
export const getStatus = async () => {
  let credential: string = "";

  if (window.electronAPI) {
    credential = await window.electronAPI.getCredential();
  }

  return httpRequest<unknown>({
    endpoint: `${WebEnvConfig.apiUrlDataFast}/status`,
    method: "GET",
    headers: {
      "TOTEM-PINLET-AUTH": credential,
    },
    useCache: true,
  });
};

export const payProcess = async <TPayload = unknown>(payload: TPayload) => {
  let credential: string = "";

  if (window.electronAPI) {
    credential = await window.electronAPI.getCredential();
  }

  return httpRequest<DataFastResponse, TPayload>({
    endpoint: `${WebEnvConfig.apiUrlDataFast}/payment`,
    method: "POST",
    headers: {
      "TOTEM-PINLET-AUTH": credential,
    },
    payload: payload,
    useCache: true,
  });
};
