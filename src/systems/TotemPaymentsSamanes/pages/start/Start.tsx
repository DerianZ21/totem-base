import { useNavigate } from "react-router-dom";
import styles from "./start.module.css";
import qr from "../../assets/qr.svg";
import branding from "../../assets/branding.svg";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/buttons/Button";
import { TextField, Modal, Box } from "@mui/material";
import { useGetParking } from "../../hooks/useBilling";
import { useEffect, useState, useCallback } from "react";
import { WebEnvConfig } from "../../config/env";

const Start: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const {
    dataParkingEntry,
    loadinGetParking,
    errorloadinGetParking,
    obtenerIngreso,
  } = useGetParking();

  const [openInput, setOpenInput] = useState<boolean>(false);

  const navigate = useNavigate();

  const getParkingData = async () => {
    const payload = {
      codigo: code,
      id_lugar: WebEnvConfig.idPlace,
      id_usuario_admin: "196",
      tipo_ingreso: "V",
    };
    await obtenerIngreso(payload);
  };

  const goToPayment = useCallback(() => {
    navigate("/totemPaymentsSamanes/payment", {
      state: { data: dataParkingEntry },
    });
  }, [navigate, dataParkingEntry]);

  useEffect(() => {
    setOpenInput(false)
    if (
      dataParkingEntry &&
      !loadinGetParking &&
      errorloadinGetParking === null
    ) {
      goToPayment();
    }
  }, [dataParkingEntry, loadinGetParking, errorloadinGetParking, goToPayment]);

  if (loadinGetParking) return <p>Consultando datos</p>;

  return (
    <>
      <div className={styles.main_start}>
        <img className={styles.branding_img} src={branding} />
        <div className={styles.txt}>
          <h1 className={styles.welcome_txt}>Bienvenido</h1>
          <p className={styles.message_txt}>
            Para comenzar, escanea el código QR en el lector ubicado en la parte
            inferior
          </p>
        </div>
        <img className={styles.qr_img} src={qr} />
        {errorloadinGetParking !== null && (
          <p style={{ color: "red" }}>Error de código</p>
        )}
        <ButtonSecondary
          className={styles.btnAction}
          label="Ingresar código"
          key={1}
          onClick={() => setOpenInput(true)}
        />
      </div>

      <Modal
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={openInput}
        onClose={() => setOpenInput(false)}
      >
        <Box
          sx={{
            maxWidth: "55rem",
            maxHeight: "70rem",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#eb472a",
            borderRadius: "0.5rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <TextField
            value={code}
            onChange={(e) => setCode(e.target.value)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#ffffff",
                borderRadius: "0.5rem",
                boxShadow: "1px 0.2rem 0.5rem #3e485211",
                fontFamily: "Inter, Roboto, sans-serif", // ← fuente del input
                fontSize: "1rem",
                fontWeight: "bolder",
              },
              "& .MuiOutlinedInput-input": {
                textAlign: "center",
              },
              "& .MuiOutlinedInput-notchedOutline": { border: "none" },
              "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
              "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "2px solid #3e48522f",
              },
              "& input::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "& input::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
            }}
          />
          <ButtonPrimary
            className={styles.btnActionGetData}
            label="Aceptar"
            key={1}
            onClick={() => getParkingData()}
          />
        </Box>
      </Modal>
    </>
  );
};

export default Start;
