import { ipcRenderer, contextBridge } from 'electron'

// Envia evento de actividad del usuario
function notifyActivity(): void { 
    ipcRenderer.send('user-activity');
}

// Eventos de movimientos de mouse
window.addEventListener('mousemove', notifyActivity); 
window.addEventListener('mousedown', notifyActivity); 

// Eventos de actividad en el teclado
window.addEventListener('keydown', notifyActivity);

// Eventos de actividad en pantalla tactil
window.addEventListener('touchstart', notifyActivity);

// Eventos de scroll de contenido (Opcional)
window.addEventListener('scroll', notifyActivity);

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electronAPI', {

  // Metodos de totem
  startTotemMode: () => ipcRenderer.send("totem:start"),
  exitTotemMode: () => ipcRenderer.send("totem:exit"),
  loadUrl: (url: string) => ipcRenderer.send("totem:loadUrl", url),
  loadLocalSystem: () => ipcRenderer.send("totem:loadLocal"),
  inhibitSaverScreen: () => ipcRenderer.send("totem:inhibitSaver"),
  uninhibitSaverScreen: () => ipcRenderer.send("totem:uninhibitSaver"),
  stopSaverScreem: () => ipcRenderer.send("totem:stopSaver"),

  // Metodos genéricos
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },
})
