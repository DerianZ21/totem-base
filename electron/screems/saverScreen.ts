import { BrowserWindow } from "electron";
import BaseScreenManager from "./baseScreem";
import path from "node:path";
import { VITE_DEV_SERVER_URL, RENDERER_DIST } from "../paths";

class SaverScreenManager extends BaseScreenManager {
  private static instance: SaverScreenManager;

  private remoteUrl: string = "";
  constructor() {
    super();
  }

  public static getInstance(): SaverScreenManager {
    if (!SaverScreenManager.instance) {
      SaverScreenManager.instance = new SaverScreenManager();
    }
    return SaverScreenManager.instance;
  }

  public async init(parent: BrowserWindow): Promise<BrowserWindow> {
    if (this.isOpen()) return this.getWindow()!;
    const saverScreen = await super.create({
      parent: parent,
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
    });

    saverScreen.setAlwaysOnTop(true, "screen-saver");

    if (VITE_DEV_SERVER_URL) {
      saverScreen.loadURL(`${VITE_DEV_SERVER_URL}#/saver`);
    } else {
      await saverScreen.loadFile(path.join(RENDERER_DIST, "index.html"), {
        hash: "saver",
      });
    }

    // Seguridad: bloquear nuevas ventanas/popups
    saverScreen.webContents.setWindowOpenHandler(() => ({ action: "deny" }));

    return saverScreen;
  }

  // Obtener url de contenido
  public getAppUrl(): string {
    return this.remoteUrl;
  }
}

export default SaverScreenManager;
