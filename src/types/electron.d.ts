export {};

declare global {
  interface Window {
    electronAPI: {
      startTotemMode: () => void;
      loadUrl: (url:string) => void;
      loadLocalSystem: () => void;
      exitTotemMode: () => void;
      inhibitSaverScreen: () => viod;
      uninhibitSaverScreen: () => viod;
      stopSaverScreem: () => void;

      // agrega aquí otras funciones que expongas en preload
      send: (channel: string, ...args: unknown[]) => void;
      invoke: (channel: string, ...args: unknown[]) => Promise<unknown>;
      on: (channel: string, listener: (...args: unknown[]) => void) => void;
    };
  }
}