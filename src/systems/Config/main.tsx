import { TextField } from "@mui/material";
import { useState } from "react";

const Main: React.FC = () => {

  const [url, setUrl] = useState<string>("");

  const startTotem = () => {
    if (window.electronAPI) {
      window.electronAPI.startTotemMode();
    } else {
      alert("No se puede iniciar el modo tótem (API no disponible)");
    }
  };

  const loadContentUrl = () => {
    if (window.electronAPI) {
      window.electronAPI.loadUrl(url);
    } else {
      alert("No se pudo cargar la Url (API no disponible)");
    }
  };

  const loadContentLocalSystem = () => {
    if (window.electronAPI) {
      window.electronAPI.loadLocalSystem();
    } else {
      alert("No se pudo cargar el sistema local (API no disponible)");
    }
  };

  const exitTotem = () => {
    if (window.electronAPI) {
      window.electronAPI.exitTotemMode();
    } else {
      alert("No se pudo cerrar el totem (API no disponible)");
    }
  };

  const inhibitSaver = () => {
    if (window.electronAPI) {
      window.electronAPI.inhibitSaverScreen();
    } else {
      alert("No se pudo cerrar el totem (API no disponible)");
    }
  };

  const uninhibitSaver = () => {
    if (window.electronAPI) {
      window.electronAPI.uninhibitSaverScreen();
    } else {
      alert("No se pudo cerrar el totem (API no disponible)");
    }
  };

  return (
    <>
      <h1>Totem - configuración</h1>

      <TextField
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        sx={{
          marginBottom: "1rem",
          "& .MuiOutlinedInput-root": {
            background: "#ffffff",
            borderRadius: "0.5rem",
          },
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        }}
      />

      <button onClick={startTotem}>Iniciar totem</button>
      <button onClick={loadContentUrl}>Cargar Web</button>
      <button onClick={loadContentLocalSystem}>Cargar Sistema local</button>
      <button onClick={exitTotem}>Cerrar totem</button>
      <button onClick={inhibitSaver}>Desactivar salvaPantalla</button>
      <button onClick={uninhibitSaver}>Activar salvaPantalla</button>


    </>
  );
};

export default Main;
