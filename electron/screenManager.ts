import { ipcMain } from "electron";
import logger from "./utils/logger";
import SaverScreenManager from "./screems/saverScreen";
import MainScreenManager from "./screems/mainScreen";

class ScreenManager {
  
  private timer: NodeJS.Timeout | null = null;
  private readonly timeoutMs: number;
  private readonly mainScreen: MainScreenManager;
  private readonly saverScreen: SaverScreenManager;
  private readonly boundReset = () => {
    if (this.isInhibited) return;
    this.restoreMain(), this.resetTimer();
  };

  private isSaverActive: boolean = false;
  private isManagerEnabled: boolean = false;
  private isTransitioning: boolean = false;
  private isInhibited: boolean = false;

  constructor(
    mainScreen: MainScreenManager,
    saverScreen: SaverScreenManager,
    timeoutMs: number = 10000
  ) {
    this.mainScreen = mainScreen;
    this.saverScreen = saverScreen;
    this.timeoutMs = timeoutMs;
  }

  async start(): Promise<void> {
    const mainWindow = await this.mainScreen.init();
    await this.saverScreen.init(mainWindow);
  }

  public enable(): void {
    if (this.isManagerEnabled) return;
    this.isManagerEnabled = true;
    ipcMain.removeAllListeners("user-activity");
    ipcMain.on("user-activity", this.boundReset);
    this.resetTimer();
    logger.info("Manager de ventanas habilitado.");
  }

  public disable(): void {
    if (!this.isManagerEnabled) return;
    this.isManagerEnabled = false;
    ipcMain.removeListener("user-activity", this.boundReset);
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    logger.warn("Gestor de inactividad DESHABILITADO.");
  }

  public inhibit() {
    this.isInhibited = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    console.log("Salvapantallas inhibido temporalmente");
  }

  public uninhibit() {
    this.isInhibited = false;
    console.log("Salvapantallas reactivado");
    this.resetTimer();
  }

  private resetTimer(): void {
    if (!this.isManagerEnabled) return;
    if (!this.mainScreen.getWindow()) return;

    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.showSaverScreen();
    }, this.timeoutMs);
  }

  private async showSaverScreen(): Promise<void> {
    if (this.isSaverActive) return;
    if (this.isInhibited) return;
    if (this.isTransitioning) return;

    this.isTransitioning = true;
    logger.info("Tiempo de inactividad detectado, mostrando salvapantallas...");
    try {
      this.isSaverActive = true;
      this.saverScreen.show();
    } finally {
      this.isTransitioning = false;
    }
  }

  public async restoreMain(): Promise<void> {
    if (!this.isSaverActive) return;
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    logger.info("Actividad detectada, restaurando pantalla principal...");

    try {
      this.saverScreen.hide();

      this.isSaverActive = false;
      this.resetTimer();
    } finally {
      this.isTransitioning = false;
    }
  }
}

export default ScreenManager;
