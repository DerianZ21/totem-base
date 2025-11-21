import styles from "./thanks.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Thanks = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const uninhibitSaverScreen = () => {
      if (window.electronAPI) {
        window.electronAPI.uninhibitSaverScreen();
      } else {
        alert("No se puede desinahibitar el salva pantallas (API no disponible)");
      }
    };

    uninhibitSaverScreen();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/totemPaymentsSamanes/start");
    }, 5000);

    return () => clearTimeout(timer); // cleanup para evitar leaks
  }, [navigate]);

  return (
    <div className={styles.main_thanks}>
      {/* <img />

      <div>
        <h1>Gracias por su visita</h1>
        <img />
      </div> */}

      {/* <p>Dispone de 20 minutos adicionales para salir del parqueo con tranquilidad</p> */}
    </div>
  );
};

export default Thanks;
