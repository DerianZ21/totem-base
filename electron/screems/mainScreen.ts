import { BrowserWindow } from "electron";
import BaseScreenManager from "./baseScreem";
import logger from "../utils/logger";
import path from "node:path";
import { VITE_DEV_SERVER_URL, RENDERER_DIST } from "../paths";

class MainScreenManager extends BaseScreenManager {
  private static instance: MainScreenManager | null = null; // ← Singleton
  private appUrl: string = "";

  private constructor() {
    super();
  }

  public static getInstance(): MainScreenManager {
    if (!MainScreenManager.instance) {
      MainScreenManager.instance = new MainScreenManager();
    }
    return MainScreenManager.instance;
  }

  public async init(): Promise<BrowserWindow> {
    if (this.isOpen()) return this.getWindow()!;
    const mainScreen = await super.create({
      // frame: false,
      // kiosk: true,
      // fullscreen: true,
      // alwaysOnTop: true,
      // resizable: false,
      // movable: false,
      // focusable: true,
      backgroundColor: "#000000",
      show: false,
    });

    mainScreen.setAlwaysOnTop(true, "screen-saver");

    this.registerMainEvents(mainScreen);

    return mainScreen;
  }

  // Eventos de la ventana principal
  private registerMainEvents(mainScreen: BrowserWindow): void {
    mainScreen.once("ready-to-show", () => {
      logger.warn("Ventana principal lista");
      // Ejcuta metodos o funciones al estar lista la ventana
    });

    mainScreen.on("blur", () => {
      console.log("Ventana perdió el foco");
      mainScreen.focus();
    });

    mainScreen.on("minimize", () => {
      logger.warn("La ventana principal minimizada");
      mainScreen.restore();
      mainScreen.focus();
    });

    mainScreen.on("close", (e) => {
      e.preventDefault();
      logger.warn("Intento de cierre bloqueado");
    });
  }

  // Obtener url de contenido
  public setAppUrl(appUrl: string) {
    this.appUrl = appUrl;
  }

  // Obtener url de contenido
  public getAppUrl(): string {
    return this.appUrl;
  }

  public loadContent() {
    const win = this.getWindow();
    if (!win) return;

    if (this.appUrl) {
      win.loadURL(this.appUrl);
    } else {
      //Renderizar ventana de mensaje de error
    }
  }

  public async loadLocalSystem() {
    const win = this.getWindow();
    if (!win) return;

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(`${VITE_DEV_SERVER_URL}#/totemPaymentsSamanes`);
    } else {
      await win.loadFile(path.join(RENDERER_DIST, "index.html"), {
        hash: "totemPaymentsSamanes",
      });
    }
  }
}

export default MainScreenManager;
