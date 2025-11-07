import { BrowserWindow } from "electron";
import logger from "./utils/logger";
import SaverScreenManager from "./features/saverScreen";

class ScreenManager {
  private timer: NodeJS.Timeout | null = null;
  private readonly timeoutMs: number;
  private readonly mainScreen: BrowserWindow;
  private readonly saverScreen: SaverScreenManager;
  private boundReset?: () => void;

  constructor(
    mainScreen: BrowserWindow,
    saverScreen: SaverScreenManager,
    timeoutMs = 15_000
  ) {
    this.mainScreen = mainScreen;
    this.saverScreen = saverScreen;
    this.timeoutMs = timeoutMs;
  }

  start() {
    logger.info(`IdleManager: iniciando (${this.timeoutMs / 1000}s)`);
    this.resetTimer();
    this.boundReset = () => this.resetTimer();
    this.mainScreen.webContents.on("before-input-event", this.boundReset);
  }

  stop() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    if (this.boundReset) {
      this.mainScreen.webContents.removeListener(
        "before-input-event",
        this.boundReset
      );
      this.boundReset = undefined;
    }
  }

  private resetTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this.showScreensaver(), this.timeoutMs);
  }

  private async showScreensaver() {
    if (this.saverScreen.isOpen()) return;
    await this.saverScreen.show(); // por defecto screensaver.html local
  }
}

export default ScreenManager;
