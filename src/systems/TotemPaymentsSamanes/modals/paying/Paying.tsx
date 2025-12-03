import styles from "./paying.module.css";
import card from "../../assets/pay_card_animated.svg";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useValidateParking } from "../../hooks/useBilling";
import Notification from "../../components/notification/Notification";
import { StatusNotification } from "../../models/notification/Notification";
import { WebEnvConfig } from "../../config/env";
import { Parqueo } from "../../models/parqueo/parqueo.model";
import {
  useGetDFServiceStatus,
  useDFPayProcess,
} from "../../hooks/useDataFast";

interface PayingProps {
  dataParking: Parqueo;
}
const Paying: React.FC<PayingProps> = ({ dataParking }) => {
  // Hooks nativos
  const navigate = useNavigate();

  // Estados
  const [openNotificationDetail, setOpenNotificationDetail] =
    useState<boolean>(false);
  const [notificationDetail, setNotificationDetail] = useState<{
    tittle: string;
    message: string;
    status: StatusNotification;
  }>({ tittle: "", message: "", status: "info" });

  // Hooks personalizados
  // Obtener estado del servidor con conexión al dataFast
  const {
    dataDFServiceStatus,
    loadingDFServiceStatus,
    errorDFServiceStatus,
    executeGetDFServiceStatus,
  } = useGetDFServiceStatus();

  // Realiazar proceso de pago con dataFast
  const {
    dataDFPayProcess,
    loadingDFPayProcess,
    errorDFPayProcess,
    executeDFPayProcess,
  } = useDFPayProcess();

  // Validar Parqueo (Pago)
  const {
    dataValidateParking,
    loadingValidateParking,
    errorValidateParking,
    validarParqueo,
  } = useValidateParking();

  // Funciones
  const validateParking = useCallback(() => {
    const form = new FormData();
    form.append("id_ingreso", String(dataParking.id_ingreso));
    form.append("id_lugar", String(WebEnvConfig.idPlace));
    form.append("observacion", "Pago automático - Totem");
    form.append("tiempo_total", dataParking.ingreso.tiempo_total);
    form.append("tiempo_horas_pago", dataParking.ingreso.tiempo_horas_pago);
    form.append("tarifa_aplicada", dataParking.ingreso.tarifa_aplicada);
    form.append("valor_total", dataParking.ingreso.valor_total);
    form.append("estado", dataParking.estado);
    form.append("placa", dataParking.placa);
    form.append("especial", "N");

    validarParqueo(form);
  }, [dataParking, validarParqueo]);

  // Efectos
  // Consulta estado del servicio dataFast al cargar el componente
  useEffect(() => {
    executeGetDFServiceStatus();
  }, [executeGetDFServiceStatus]);

  // Si la consuta es ok, proceder a realizar el pago
  useEffect(() => {
    if (loadingDFServiceStatus) return;
    if (errorDFServiceStatus) {
      setNotificationDetail({
        status: "error",
        tittle: "Error de sistema de pago",
        message: "Servicio de pago no disponible",
      });
      setOpenNotificationDetail(true);
      return;
    }
    if(!dataDFServiceStatus) return
    if (dataDFServiceStatus !== "OK") {
      setNotificationDetail({
        status: "error",
        tittle: "Servicio de pago no disponible",
        message: "El sistema de pago está temporalmente fuera de servicio.",
      });
      setOpenNotificationDetail(true);
      return;
    }
    // Si está OK → Realiza proceso de pago
    const payload = {
      base0: "0.00",
      baseImponible: "8.00",
      iva: "0.96",
      total: "8.96",
      referenciaInterna: "PARQUEO-PLACA-PBQ1234",
      servicioId: 15,
    };
    executeDFPayProcess(payload);
  }, [
    dataDFServiceStatus,
    loadingDFServiceStatus,
    errorDFServiceStatus,
    executeDFPayProcess,
  ]);

  useEffect(() => {
    if (loadingDFPayProcess) return;
    if (errorDFPayProcess) {
      setNotificationDetail({
        status: "error",
        tittle: "Error de sistema",
        message: "Sistema interno de pago no disponible",
      });
      setOpenNotificationDetail(true);
      return;
    }
    if (!dataDFPayProcess) return
    if (dataDFPayProcess.data.CodigoRespuesta !== "00") {
      setNotificationDetail({
        status: "error",
        tittle: "Proceso de oago fallido",
        // Completar con parametros de respuesta dataDFPayProcess.data...
        message: "Pago no realizado - detalle: ...",
      });
      setOpenNotificationDetail(true);
      return;
    }
    validateParking();
  }, [
    dataDFPayProcess,
    loadingDFPayProcess,
    errorDFPayProcess,
    validateParking,
  ]);

  useEffect(() => {
    if (loadingValidateParking) return;
    // Completar con repuesta al consultar registro de pago Pinlet
    if (!dataValidateParking) return;
    console.log("Respuesta validación parqueo:", dataValidateParking);
    navigate("/totemPaymentsSamanes/start");
  }, [dataValidateParking, loadingValidateParking, navigate]);

  // Única consula que requiere internet - valida errer por fallas de red o el fallas en el microsevicio.
  useEffect(() => {
    if (errorValidateParking) {
      if (typeof errorValidateParking === "string") {
        const message = String(errorValidateParking);
        if (message.includes("NETWORK_ERROR")) {
          setNotificationDetail({
            status: "error",
            tittle: "Error de conexión",
            message: "Sin conexión a Internet o red inestable.",
          });
        } else if (message.includes("SERVICE_ERROR")) {
          setNotificationDetail({
            status: "error",
            tittle: "Servicio no disponible",
            message: "El sistema está temporalmente fuera de servicio.",
          });
        } else {
          setNotificationDetail({
            status: "error",
            tittle: "Error inesperado",
            message: "Ocurrió un error desconocido. Intente nuevamente.",
          });
        }
      } else {
        setNotificationDetail({
          status: "error",
          tittle: "Error de validación",
          message: "---",
        });
      }

      setOpenNotificationDetail(true);
    }
  }, [errorValidateParking]);

  return (
    <>
      <div className={styles.main_paying}>
        <div className={styles.txt}>
          <p className={styles.message_txt}>
            Coloque su tarjeta para procesar el pago
          </p>
        </div>
        <img className={styles.card_img} src={card} />
      </div>
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

export default Paying;
