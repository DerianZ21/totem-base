import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import { PRELOAD_PATH } from "../paths";
import path from "node:path";
import logger from "../utils/logger";

class BaseScreenManager {
  private window: BrowserWindow | null = null;

  constructor() {}

  // Crea una nueva ventana base sin mostrarla
  public async create(
    options: BrowserWindowConstructorOptions = {}
  ): Promise<BrowserWindow> {
    if (this.window) return this.window;

    this.window = new BrowserWindow({
      webPreferences: {
        preload: PRELOAD_PATH,
        sandbox: false,
        nodeIntegration: false,
        contextIsolation: true,
      },
      ...options, // permite sobreescribir propiedades desde las subclases
    });

    return this.window;
  }

  // Verificar si está abierta
  public isOpen(): boolean {
    return !!this.window && !this.window.isDestroyed();
  }

  // Mostrar pantalla
  public show(): void {
    if (this.window) this.window.show();
  }

  // Ocultar pantalla
  public hide(): void {
    if (this.window) this.window.hide();
  }

  // Recargar pantalla
  public reload(): void {
    if (this.window) this.window.reload();
  }

  // Enfoca la ventana
  public focus(): void {
    if (this.window && !this.window.isFocused()) {
      this.window.focus();
    }
  }

  // Cierra y destruye la ventana
  public destroy(): void {
    if (this.window) {
      this.window.destroy();
      this.window = null;
      logger.info("Ventana destruida");
    }
  }

  // Carga la URL
  public loadContent(appUrl?: string): void {
    if (!this.window || !appUrl) return;

    if (appUrl.startsWith("http")) {
      this.window.loadURL(appUrl);
    } else {
      const htmlPath = path.join(__dirname, appUrl);
      this.window
        .loadFile(htmlPath)
        .catch((err) => logger.error("Error al cargar archivo HTML", err));
    }
  }

  // Muestra pantalla offline si no se puede cargar contenido
  protected showOfflineScreen(): void {
    try {
      const offlinePath = path.join(__dirname, "../static/html/offline.html");
      this.window?.loadFile(offlinePath);
    } catch (e) {
      logger.error("Error al mostrar pantalla offline", e);
    }
  }

  // Retorna la referencia de la ventana
  public getWindow(): BrowserWindow {
    if (!this.window) throw new Error("La ventana no está creada");
    return this.window;
  }
}

export default BaseScreenManager;
