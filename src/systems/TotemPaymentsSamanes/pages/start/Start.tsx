import { useNavigate } from "react-router-dom";
import styles from "./start.module.css";
import qr from "../../assets/qr.svg";
import branding from "../../assets/branding.svg";
import load from "../../assets/load/load_bar_long.svg";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/buttons/Button";
import { TextField, Dialog } from "@mui/material";
import { useGetParking } from "../../hooks/useBilling";
import { useEffect, useState, useCallback } from "react";
import { WebEnvConfig } from "../../config/env";
import Notification from "../../components/notification/Notification";
import { StatusNotification } from "../../models/notification/Notification";

const Start: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [openNotificationDetail, setOpenNotificationDetail] =
    useState<boolean>(false);
  const [notificationDetail, setNotificationDetail] = useState<{
    tittle: string;
    message: string;
    status: StatusNotification;
  }>({ tittle: "", message: "", status: "info" });

  const [openInput, setOpenInput] = useState<boolean>(false);

  const {
    dataGetParking,
    loadingGetParking,
    errorGetParking,
    executeGetIngreso,
  } = useGetParking();

  const navigate = useNavigate();

  const getParkingData = async () => {
    if (code.trim() === "") {
      setNotificationDetail({
        status: "error",
        tittle: "Error de código",
        message: "No ha ingresado ningún código",
      });
      setOpenNotificationDetail(true);
      return;
    }
    const payload = {
      codigo: code,
      id_lugar: WebEnvConfig.idPlace,
      id_usuario_admin: "196",
      tipo_ingreso: "V",
    };
    await executeGetIngreso(payload);
  };

  const goToPayment = useCallback(() => {
    navigate("/totemPaymentsSamanes/payment", {
      state: { data: dataGetParking },
    });
  }, [navigate, dataGetParking]);

  useEffect(() => {
    if (dataGetParking && !loadingGetParking && errorGetParking === null) {
      goToPayment();
      setOpenInput(false);
    }
  }, [dataGetParking, loadingGetParking, errorGetParking, goToPayment]);

  useEffect(() => {
    if (errorGetParking) {
      if (errorGetParking.message === "NETWORK_ERROR") {
        setNotificationDetail({
          status: "error",
          tittle: "Error de conexión",
          message: "Sin conexión a Internet o red inestable.",
        });
      } else if (errorGetParking.message === "SERVICE_DOWN") {
        setNotificationDetail({
          status: "error",
          tittle: "Servicio no disponible",
          message: "El sistema está temporalmente fuera de servicio.",
        });
      } else if (errorGetParking.message === "BAD_REQUEST") {
        setNotificationDetail({
          status: "error",
          tittle: "Error de código",
          message: "Código de parqueo inválido",
        });
      } else {
        setNotificationDetail({
          status: "error",
          tittle: "Error inesperado",
          message: "Ocurrió un error desconocido. Intente nuevamente.",
        });
      }
      setOpenNotificationDetail(true);
    }
  }, [errorGetParking]);

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

        <ButtonSecondary
          className={styles.btnAction}
          label="Ingresar código"
          key={1}
          onClick={() => setOpenInput(true)}
        />
      </div>

      <Dialog
        open={openInput}
        onClose={() => {
          setOpenInput(false), setCode("");
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          },
        }}
      >
        <div className={styles.input_code}>
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
                fontSize: "2rem",
                fontWeight: "bolder",
                color: "#3e4852",
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
          {loadingGetParking ? (
            <div className={styles.load}>
              <img className={styles.load_animation} src={load} />
            </div>
          ) : (
            <ButtonPrimary
              className={styles.btnActionGetData}
              label="Aceptar"
              key={1}
              onClick={() => getParkingData()}
            />
          )}
        </div>
      </Dialog>
      <Notification
        tittle={notificationDetail.tittle}
        message={notificationDetail.message}
        status={notificationDetail.status}
        open={openNotificationDetail}
        key={"notification"}
        close={() => setOpenNotificationDetail(false)}
        closeTime={10000000}
      />
    </>
  );
};

export default Start;
