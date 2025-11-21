import { Routes, Route, Navigate } from "react-router-dom";
import styles from "./totemPaymentsSamanes.module.css";
import pinlet_branding from "../../assets/pinlet_branding.svg";
import StartPage from "./pages/start/Start";
import PaymentPage from "./pages/payment/Payment";
// import Paying from "./modals/paying/Paying";
// import AddUserData from "./modals/addUserData/AddUserData";
import ThanksPage from "./pages/thanks/Thanks";

const TotemPaymentsSamanes: React.FC = () => {
  const killTotem = () => {
    if (window.electronAPI) {
      window.electronAPI.exitTotemMode();
    } else {
      alert("No se puede terminar el modo tótem (API no disponible)");
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/totemPaymentsSamanes/start" replace />}
          />
          <Route path="/start" element={<StartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/thanks" element={<ThanksPage />} />
          {/* <Route path="/paying" element={<Paying />} /> */}
          {/* <Route path="/add-user-data" element={<AddUserData />} /> */}
        </Routes>
        <img
          className={styles.branding}
          src={pinlet_branding}
          onClick={killTotem}
        />
      </div>
    </>
  );
};

export default TotemPaymentsSamanes;
