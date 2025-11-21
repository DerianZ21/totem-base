import { HashRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import ConfigPage from "./systems/Config/main";
import SaverPage from "./systems/SaberScreen/main";
import TotemPaymentsSamanes from "./systems/TotemPaymentsSamanes/TotemPaymentsSamanes";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>

        {/* Redirección por defecto */}
        <Route path="/" element={<Navigate to="/config" replace />} />

        {/* generals */}
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/saver" element={<SaverPage />} />

        {/* SISTEMAS (Dinámico) */}
        {/* Sitema totem de pagos automático*/}
        <Route path="/totemPaymentsSamanes/*" element={<TotemPaymentsSamanes/>} />
      </Routes>
    </Router>
  );
}

export default App;