import styles from "./paying.module.css";
import card_load from "../../assets/pay_card_animated.svg";
import load from "../../assets/load/load_spin.svg";
import icon_success from "../../assets/success.svg";
import icon_error from "../../assets/error.svg";
import icon_warn from "../../assets/warn.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useValidateParking } from "../../hooks/useBilling";
import { StatusNotification } from "../../models/notification/Notification";
import { WebEnvConfig } from "../../config/env";
import { Parqueo } from "../../models/parqueo/parqueo.model";
import {
  useGetDFServiceStatus,
  useDFPayProcess,
} from "../../hooks/useDataFast";

interface PayingProps {
  dataParking: Parqueo;
  close: () => void;
}
const Paying: React.FC<PayingProps> = ({ dataParking }) => {
  // Hooks nativos
  const navigate = useNavigate();

  // Estados
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationDetail, setNotificationDetail] = useState<{
    tittle: string;
    message: string;
    status: StatusNotification;
  }>({ tittle: "en proceso...", message: "en proceso...", status: "info" });

  // Hooks personalizados
  // Obtener estado del servidor con conexión al dataFast
  const {
    errorDFServiceStatus,
    executeGetDFServiceStatus,
    resetDFServiceStatus,
  } = useGetDFServiceStatus();

  // Realiazar proceso de pago con dataFast
  const {
    loadingDFPayProcess,
    errorDFPayProcess,
    executeDFPayProcess,
    resetDFPayProcess,
  } = useDFPayProcess();

  // Validar Parqueo (Pago)
  const {
    errorValidateParking,
    executeValidateParqueo,
    resetValidateParqueo,
  } = useValidateParking();

  // FUNTIONS

  const validateStatusDFServices = async (): Promise<boolean> => {
    const dataDFServiceStatus = await executeGetDFServiceStatus();
    if (!dataDFServiceStatus) return false;
    if (dataDFServiceStatus.status !== "OK") {
      setNotificationDetail({
        status: "error",
        tittle: "Error de sistema de pago",
        message: "Servicio de pago no disponible",
      });
      return false;
    }
    return true;
  };

  const validatePayProcess = async (): Promise<boolean> => {
    // Cambiar los valores quemados
    const payload = {
      base0: "0.00",
      baseImponible: "1.00",
      iva: "0.15",
      total: "1.15",
      referenciaInterna: "PARQUEO-PLACA-PBQ1234",
      servicioId: 15,
    };

    const dataDFPayProcess = await executeDFPayProcess(payload);
    if (!dataDFPayProcess) return false;
    if (!dataDFPayProcess.data) return false;
    if (dataDFPayProcess.data.CodigoRespuesta !== "00") {
      setNotificationDetail({
        status: "error",
        tittle: "Proceso de pago fallido",
        message: `Pago no realizado - detalle: ${dataDFPayProcess.data.MensajeRespuestaAut}`,
      });
      return false;
    }
    return true;
  };

  const validatePayRegister = async (): Promise<boolean> => {
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
    const dataValidateParking = await executeValidateParqueo(form);
    if (!dataValidateParking) return false;
    if (dataValidateParking.status !== "Se verificó correctamente") {
      setNotificationDetail({
        status: "error",
        tittle: "Error en Registro de Parqueo",
        message: "Error al registrar la validación del pago",
      });
      return false;
    }
    return true;
  };

  const errorProcess = ({
    error,
    tittle,
    message,
  }: {
    error: string;
    tittle: string;
    message: string;
  }) => {
    if (error === "NETWORK_ERROR") {
      setNotificationDetail({
        status: "error",
        tittle: "Error de conexión",
        message: "Sin conexión a Internet o red inestable",
      });
    } else if (error === "SERVICE_DOWN") {
      setNotificationDetail({
        status: "error",
        tittle: "Error de servicio",
        message: "Servicio no disponible",
      });
    } else if (error === "BAD_REQUEST") {
      setNotificationDetail({
        status: "error",
        tittle: tittle,
        message: message,
      });
    } else {
      setNotificationDetail({
        status: "error",
        tittle: "Error inesperado",
        message: "Ocurrió un error desconocido. Intente nuevamente.",
      });
    }
  };

  // MAIN PROCESS
  const payProcessComplete = async () => {
    try {
      // Verificaión, servicio local en funcionamiento
      const statusDFService: boolean = await validateStatusDFServices();
      if (!statusDFService) {
        return;
      }

      // Verificaión, proceso de pago
      const payProcess: boolean = await validatePayProcess();
      if (!payProcess) {
        setLoading(false);
        return;
      }

      // Verificaión, registro de pago de parqueo
      const payRegister: boolean = await validatePayRegister();
      setLoading(false);
      if (!payRegister) {
        return;
      }
      setNotificationDetail({
        status: "success",
        tittle: "Transacción realizada exitosamente",
        message: "Transacción realizada exitosamente",
      });
    } catch (error) {
      setNotificationDetail({
        status: "error",
        tittle: "Error inesperado",
        message: "Intente nuevamente",
      });
    } finally {
      setTimeout(() => {
        resetValidateParqueo();
        resetDFServiceStatus();
        resetDFPayProcess();
        // close();
        navigate("/totemPaymentsSamanes/start");
      }, 5000);
    }
  };

  // MAIN EFFECT
  useEffect(() => {
    payProcessComplete();
  }, []);

  useEffect(() => {
    if (errorDFServiceStatus) {
      errorProcess({
        error: errorDFServiceStatus.message,
        tittle: "Error de servicio",
        message: "Servicio no disponible",
      });
    }

    if (errorDFPayProcess) {
      errorProcess({
        error: errorDFPayProcess.message,
        tittle: "Error de transacción",
        message:
          errorDFPayProcess.detalle?.data.message || "Error de transacción",
      });
    }

    if (errorValidateParking) {
      errorProcess({
        error: errorValidateParking.message,
        tittle: "Error de registro",
        message: "Error de registro",
      });
    }
  }, [errorDFServiceStatus, errorDFPayProcess, errorValidateParking]);

  return (
    <>
      <div className={styles.main_paying}>
        {loading ? (
          <>
            <div className={styles.txt}>
              <p className={styles.message_txt}>
                {loadingDFPayProcess
                  ? "Coloque su tarjeta para procesar el pago"
                  : "Procesando"}
              </p>
            </div>
            <img
              className={styles.card_img}
              src={loadingDFPayProcess ? card_load : load}
            />
          </>
        ) : (
          <>
            <div className={styles.txt}>
              <p className={styles.message_txt}>{notificationDetail.message}</p>
            </div>
            <img
              className={styles.card_img}
              src={notificationDetail.status === "success" ? icon_success : notificationDetail.status === "error" ?  icon_error : icon_warn}
            />
          </>
        )}
      </div>
    </>
  );
};

export default Paying;
