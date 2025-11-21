import { app, ipcMain, powerSaveBlocker } from "electron";
import dotenv from "dotenv";
// import { createRequire } from 'node:module'
// import { fileURLToPath } from 'node:url'
import path from "node:path";
import MainScreenManager from "./screems/mainScreen";
import SaverScreenManager from "./screems/saverScreen";
import ConfigScreenManager from "./screems/configScreen";
import ScreenManager from "./screenManager";
import logger from "./utils/logger";

dotenv.config();

let mainScreen: MainScreenManager | null = null;
let saverScreen: SaverScreenManager | null = null;
let configScreen: ConfigScreenManager | null = null;
let screenManager: ScreenManager | null = null;

// const require = createRequire(import.meta.url)
// const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

// // Errores no capturados
// process.on("uncaughtException", (error) => {
//   logger.error(`Error no capturado: ${error.message}`);
// });

// // Promesas no manejadas
// process.on("unhandledRejection", (reason: unknown) => {
//   logger.error(`Promesa no manejada: ${reason}`);
// });

app.whenReady().then( async () => {
  // Instancia Clase Pantalla de configuración
  configScreen = new ConfigScreenManager();
  configScreen.init();
  configScreen.show();

  // Instancia Clase Pantalla Principal (Contenido que verá el usuario)
  mainScreen = MainScreenManager.getInstance();

  // Instancia Clase Salva Pantalla (Publicidad)
  saverScreen = SaverScreenManager.getInstance();

  // Crear gestor de pantallas
  screenManager = new ScreenManager(mainScreen, saverScreen, 10000);

  await screenManager.start();

  // Evita que el sistema entre en suspensión
  powerSaveBlocker.start("prevent-display-sleep");
});

ipcMain.on("totem:start", () => {
  if (mainScreen && screenManager) {
    screenManager.enable();
    mainScreen.show();
  } else {
    logger.error("Pantalla de Totem no iniciada");
  }
});

ipcMain.on("totem:exit", () => {
  if (mainScreen && screenManager) {
    screenManager.disable();
    mainScreen.hide();
  } else {
    logger.error("Pantalla de Totem no terminada");
  }
});

ipcMain.on("totem:loadUrl", (__, url) => {
  console.log(url);
  if (mainScreen) {
    mainScreen.setAppUrl(url);
    mainScreen.loadContent();
  } else {
    logger.error("Pantalla de Totem no terminada");
  }
});

ipcMain.on("totem:loadLocal", () => {
  if (mainScreen) {
    mainScreen.loadLocalSystem();
  } else {
    logger.error("Pantalla de Totem no terminada");
  }
});

ipcMain.on("totem:stopSaver", () => {
  console.log("deteniendo salva pantallas");
  if (screenManager) {
    screenManager.restoreMain();
  } else {
    logger.error("Sistema de salvapantalla no iniciado");
  }
});

ipcMain.on("totem:inhibitSaver", () => {
  if (screenManager) {
    screenManager.inhibit();
  } else {
    logger.error("inhibiendo salvapantallas temporalmente");
  }
});

ipcMain.on("totem:uninhibitSaver", () => {
  if (screenManager) {
    screenManager.uninhibit();
  } else {
    logger.error("desinhibiendo salvapantallas");
  }
});



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainScreen = null;
  }
});

// app.on('activate', () => {
//   // On OS X it's common to re-create a window in the app when the
//   // dock icon is clicked and there are no other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })

// app.whenReady().then(createWindow)
