import path from 'path';
import { fileURLToPath } from 'url';

// const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │

// Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const APP_ROOT = path.join(__dirname, '..');
export const DIST_ELECTRON = path.join(APP_ROOT, 'dist-electron');
export const PRELOAD_PATH = path.join(DIST_ELECTRON, 'preload.js');
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");