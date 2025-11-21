import { BrowserWindow } from "electron";
import BaseScreenManager from "./baseScreem";
import path from "node:path";
import { VITE_DEV_SERVER_URL, RENDERER_DIST } from "../paths";


class ConfigScreenManager extends BaseScreenManager {
  
  constructor() {
    super();
  }

  public async init(): Promise<BrowserWindow> {
    if (this.isOpen()) return this.getWindow()!;

    const configScreen = await super.create({
      width: 900,
      height: 700,
      resizable: true,
      show: false,
      title: "Configuración del Tótem",
      icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    });

    if (VITE_DEV_SERVER_URL) {
      configScreen.loadURL(`${VITE_DEV_SERVER_URL}#/config`);
    } else {
      await configScreen.loadFile(
        path.join(RENDERER_DIST, "index.html"),
        { hash: "config" }
      );
    }

    return configScreen;
  }
}

export default ConfigScreenManager;
