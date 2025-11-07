import { BrowserWindow } from "electron";
import path from "path";
import logger from "../utils/logger";
class SaverScreenManager {
  private saverScreen: BrowserWindow | null = null;
  private readonly mainScreen: BrowserWindow;

  constructor(mainScreen: BrowserWindow) {
    this.mainScreen = mainScreen;
  }

  public isOpen(): boolean {
    return !!this.saverScreen && !this.saverScreen.isDestroyed();
  }

  public async show(localHtmlPath?: string, remoteUrl?: string) {
    if (this.isOpen()) return;
    this.saverScreen = new BrowserWindow({
      parent: this.mainScreen,
      modal: false,
      show: false,
      fullscreen: true,
      kiosk: true,
      frame: false,
      alwaysOnTop: true,
      skipTaskbar: true,
      movable: false,
      resizable: false,
      focusable: true,
      backgroundColor: "#000000",
      webPreferences: {
        preload: path.join(__dirname, "../../preload.js"),
        contextIsolation: true,
        sandbox: false,
        nodeIntegration: false,
      },
    });

    // Carga contenido (local o remoto)
    if (remoteUrl) {
      await this.saverScreen.loadURL(remoteUrl);
    } else {
      const htmlPath =
        localHtmlPath || path.join(__dirname, "./saverScreen.html");
      await this.saverScreen.loadFile(htmlPath);
    }

    this.saverScreen.once("ready-to-show", () => this.saverScreen?.show());

    // Seguridad: bloquear nuevas ventanas/popups
    this.saverScreen.webContents.setWindowOpenHandler(() => ({
      action: "deny",
    }));
    logger.info("Salvapantallas mostrado");
  }

  // Oculta el salva pantallas
  public hide() {
    if (!this.isOpen()) return;
    this.saverScreen?.close();
    this.saverScreen = null;
    logger.info("Salvapantallas cerrado");
  }
}

export default SaverScreenManager;
