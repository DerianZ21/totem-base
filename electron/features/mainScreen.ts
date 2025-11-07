import { BrowserWindow } from "electron";
import path from "path";
import logger from "../utils/logger";

class MainScreenManager {
  private window: BrowserWindow | null = null;
  private readonly appUrl: string;

  constructor(appUrl: string) {
    this.appUrl = appUrl;
  }

  public create(): BrowserWindow {
    if (this.window) return this.window;

    this.window = new BrowserWindow({
      width: 1080,
      height: 1920,
      frame: false,
      kiosk: true,
      fullscreen: true,
      alwaysOnTop: true,
      resizable: false,
      movable: false,
      backgroundColor: "#000000",
      webPreferences: {
        preload: path.join(__dirname, "../preload.js"),
        sandbox: false,
        contextIsolation: true,
      },
    });

    this.registerEvents();
    this.window.loadURL(this.appUrl);
    return this.window;
  }

  private registerEvents(): void {
    this.window?.once("ready-to-show", () => {
      logger.info("Ventana lista para mostrar");
      this.window?.show();
    });

    this.window?.on("blur", () => {
      logger.warn("Ventana perdió el foco — restaurando...");
      this.focus();
    });

    this.window?.on("minimize", () => {
      logger.warn("Ventana minimizada — restaurando...");
      this.window?.restore();
      this.focus();
    });

    this.window?.on("close", (e) => {
      e.preventDefault();
      logger.warn("Intento de cierre bloqueado");
    });

    this.window?.webContents.on("did-fail-load", (_, code, desc) => {
      logger.error(`Error al cargar la página: ${desc} (${code})`);
      this.showOfflineScreen();
    });
  }

  public show(): void {
    this.window?.show();
  }

  public hide(): void {
    this.window?.hide();
  }

  public reload(): void {
    if (this.window) {
      logger.info("Recargando contenido...");
      this.window.reload();
    }
  }

  public focus(): void {
    if (this.window && !this.window.isFocused()) {
      this.window.focus();
    }
  }

  private showOfflineScreen(): void {
    try {
      const offlinePath = path.join(__dirname, "../renderer/offline.html");
      this.window?.loadFile(offlinePath);
    } catch (e) {
      logger.error("Error al mostrar pantalla offline", e);
    }
  }

  public getWindow(): BrowserWindow | null {
    return this.window;
  }

  public getAppUrl(): string {
    return this.appUrl;
  }

  public destroy(): void {
    if (this.window) {
      this.window.destroy();
      this.window = null;
      logger.info("Ventana destruida");
    }
  }
}

export default MainScreenManager;
