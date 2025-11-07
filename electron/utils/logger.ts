import { app } from "electron";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(app.getPath("userData"), "pinlet.log");
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Verifica soi el archivo de log existe
function ensureLogDir() {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch (e) {
      console.log("Error al verificar archivo de logs: ", e);
    }
  }
}

// Rota el archivo si se alcanza el tamaño maximo (Elimina los logs mas antiguos)
function rotateIfNeeded() {
  try {
    if (!fs.existsSync(LOG_FILE)) return;
    const stat = fs.statSync(LOG_FILE);
    if (stat.size > MAX_SIZE) {
      const ts = new Date().toISOString().replace(/[:.]/g, "-");
      const dest = `${LOG_FILE}.${ts}`;
      fs.renameSync(LOG_FILE, dest);
    }
  } catch (e) {
    console.log("Error al verificar archivo de logs: ", e);
  }
}

// Funcion principal de escritura de logs
function write(level: string, msg: string, meta?: unknown) {
  try {
    ensureLogDir();
    rotateIfNeeded();
    const time = new Date().toISOString();
    const entry: Record<string, any> = { time, level, message: msg };
    if (meta) entry.meta = meta;
    const line = JSON.stringify(entry) + "\n";
    fs.appendFileSync(LOG_FILE, line);
  } catch (e) {
    console.log("Error al escribir log: ", e);
  }
  // log consola en desarrollo
  if (!app.isPackaged) {
    const out =
      `${new Date().toISOString()} [${level}] ${msg}` +
      (meta ? ` ${JSON.stringify(meta)}` : "");
    if (level === "error") console.error(out);
    else console.log(out);
  }
}

export default {
  info: (msg: string, meta?: unknown) => write("info", msg, meta),
  warn: (msg: string, meta?: unknown) => write("warn", msg, meta),
  error: (msg: string, meta?: unknown) => write("error", msg, meta),
  debug: (msg: string, meta?: unknown) => write("debug", msg, meta),
  raw: (line: string): void => {
    try {
      ensureLogDir();
      fs.appendFileSync(LOG_FILE, line + "\n");
    } catch {
      console.log("Error al escribir log raw");
    }
    if (!app.isPackaged) console.log(line);
  },
};
