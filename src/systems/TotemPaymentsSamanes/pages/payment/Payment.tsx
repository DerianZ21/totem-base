import styles from "./payment.module.css";
import { useEffect, useState } from "react";
import icon_car from "../../assets/car.svg";
import branding from "../../assets/branding_color.svg";
import CarruselBase from "../../components/carousel/CarouselBase";
import Paying from "../../modals/paying/Paying";
import AddUserData from "../../modals/addUserData/AddUserData";
import { Client } from "../../models/client.model";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "../../components/buttons/Button";
import { Modal, Box, TextField } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Parqueo } from "../../models/parqueo/parqueo.model";

const Payment: React.FC = () => {
  const location = useLocation();
  const data = location.state.data as Parqueo;

  // inhibir salva pantallas
  useEffect(() => {
    const inhibitSaverScreen = () => {
      if (window.electronAPI) {
        window.electronAPI.inhibitSaverScreen();
      } else {
        alert("No se puede inhibir el salva pantallas (API no disponible)");
      }
    };
    inhibitSaverScreen();
  }, []);

  const [openPayingModal, setOpenPayinModal] = useState<boolean>(false);
  const [openAddUserDataModal, setOpenAddUserDataModal] =
    useState<boolean>(false);

  const [clientData, setClientData] = useState<Client | null>(null);

  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (data?.ingreso.img_ingreso) {
      const images = data?.ingreso.img_ingreso.split(",");
      setImages(images);
    }
    
  }, [data?.ingreso.img_ingreso]);

  if (!data) {
    return <p>No hay datos, regrese al inicio.</p>;
  }

  return (
    <>
      <div className={styles.main_payment}>
        <div className={styles.main_content}>
          <img className={styles.branding_img} src={branding} />

          <div className={styles.info_in_content}>
            <h1 className={styles.tittle}>Informacion de ingreso</h1>
            <div className={`${styles.detail_plate} ${styles.card}`}>
              <img src={icon_car} />
              <div className={styles.detail_plate_txt}>
                <p className={styles.plate_tittle}>Placa</p>
                <p className={styles.plate}>{data.placa}</p>
              </div>
            </div>
            <div className={`${styles.card}`}>
              <div className={`${styles.detail_in}`}>
                <div className={styles.info_in_txt}>
                  <p className={styles.param_tittle}>Fecha de ingreso</p>
                  <p className={styles.param}>{data.fecha_ingreso}</p>
                </div>
                <div className={styles.info_in_txt}>
                  <p className={styles.param_tittle}>Puerta de ingreso</p>
                  <p className={styles.param}>{data.ingreso.nombre_puerta_ingreso}</p>
                </div>
                <div className={styles.info_in_txt}>
                  <p className={styles.param_tittle}>Tipo de ingreso</p>
                  <p className={styles.param}>{data.ingreso.tipo_ingreso}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.images_content}>
            <h1 className={styles.tittle}>Imagenes registradas</h1>
            <div className={`${styles.images} ${styles.card}`}>
              <CarruselBase
                images={images}
                size=""
                relationImg=""
                key={1}
                quantity={2}
              />
            </div>
          </div>

          <div className={styles.billing_content}>
            <h1 className={styles.tittle}>Facturación</h1>
            <div className={`${styles.detail_billing} ${styles.card}`}>
              <div className={styles.info_billing_txt}>
                <p className={styles.param_tittle}>Tiempo acumulado</p>
                <p className={styles.param}>{data.ingreso.tiempo_total}</p>
              </div>
              <div className={styles.info_billing_txt}>
                <p className={styles.param_tittle}>Fracción/Hora</p>
                <p className={styles.param}>{data.ingreso.tarifa_aplicada}</p>
              </div>
              <div className={styles.info_billing_txt}>
                <p className={styles.param_tittle}>Total a pagar</p>
                <p className={styles.param}>{data.ingreso.valor_total}</p>
              </div>
            </div>
          </div>

          <div className={styles.whatsapp_content}>
            <h1 className={styles.whatsapp_tittle}>
              Whatsapp para comprobante
            </h1>
            <TextField
              type="number"
              className={`${styles.card} ${styles.txt_whatsapp_component}`}
              variant="outlined"
              sx={{
                // Quitar borde cuando NO está enfocado
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                // Hover sin borde
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },

                // Borde SOLO cuando está seleccionado
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "2px solid #3e48522f", // ← tu color aquí
                },

                // Chrome / Edge / Electron (Webkit)
                "& input[type=number]::-webkit-outer-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
                "& input[type=number]::-webkit-inner-spin-button": {
                  WebkitAppearance: "none",
                  margin: 0,
                },
              }}
            />
          </div>

          {clientData ? (
            <div className={styles.billing_content}>
              <h1 className={styles.tittle}>Datos de cliente</h1>
              <div className={`${styles.detail_billing} ${styles.card}`}>
                <div className={styles.info_billing_txt}>
                  <p className={styles.param_tittle}>Cédula:</p>
                  <p className={styles.param}>{clientData.idNumber}</p>
                </div>
                <div className={styles.info_billing_txt}>
                  <p className={styles.param_tittle}>Nombre: </p>
                  <p className={styles.param}>{clientData.name}</p>
                </div>
                <div className={styles.info_billing_txt}>
                  <p className={styles.param_tittle}>Correo:</p>
                  <p className={styles.param}>{clientData.email}</p>
                </div>
                <div className={styles.info_billing_txt}>
                  <p className={styles.param_tittle}>Dirección</p>
                  <p className={styles.param}>{clientData.address}</p>
                </div>
              </div>
            </div>
          ) : null}

          {!clientData ? (
            <div className={styles.actions}>
              <ButtonPrimary
                label="Realizar pago"
                className={styles.btnAction}
                // Modo ruta
                // onClick={() => navigate("/totemPaymentsSamanes/paying")}
                // Modo modal
                // onClick={() => setOpenPayinModal(true)}
                onClick={() => setOpenPayinModal(true)}
              />
              <ButtonSecondary
                label="Factura con datos"
                className={styles.btnAction}
                // Modo ruta
                // onClick={() => navigate("/totemPaymentsSamanes/add-user-data")}
                // Modo modal
                onClick={() => setOpenAddUserDataModal(true)}
              />
            </div>
          ) : (
            <>
              <div className={styles.actions}>
                <ButtonPrimary
                  label="Limpiar datos"
                  className={styles.btnAction}
                  // Modo ruta
                  //onClick={() => navigate("/totemPaymentsSamanes/paying")}
                  // Modo modal
                  // onClick={() => setOpenPayinModal(true)}
                  onClick={() => setClientData(null)}
                />
                <ButtonSecondary
                  label="Editar datos"
                  className={styles.btnAction}
                  // Modo ruta
                  // onClick={() => navigate("/totemPaymentsSamanes/add-user-data")}
                  // Modo modal
                  onClick={() => setOpenAddUserDataModal(true)}
                />
              </div>

              <div className={styles.actions2}>
                <ButtonPrimary
                  label="Realizar pago"
                  className={`${styles.btnAction} ${styles.btnSuccess}`}
                  // Modo ruta
                  //onClick={() => navigate("/totemPaymentsSamanes/paying")}
                  // Modo modal
                  // onClick={() => setOpenPayinModal(true)}
                  onClick={() => setOpenPayinModal(true)}
                />
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={openPayingModal}
        onClose={() => setOpenPayinModal(false)}
      >
        <Box
          sx={{
            width: "85%",
            maxWidth: "55rem",
            height: "85%",
            maxHeight: "70rem",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#f3f5f9",
            borderRadius: "0.5rem",
          }}
        >
          <Paying dataParking={data} 
          // close={()=>setOpenPayinModal(false)}
          />
        </Box>
      </Modal>
      <Modal
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        open={openAddUserDataModal}
        onClose={() => setOpenAddUserDataModal(false)}
      >
        <Box
          sx={{
            width: "85%",
            maxWidth: "55rem",
            height: "85%",
            maxHeight: "70rem",
            overflowY: "auto",
            overflowX: "hidden",
            backgroundColor: "#f3f5f9",
            borderRadius: "0.5rem",
          }}
        >
          <AddUserData
            clientData={clientData}
            setClientData={setClientData}
            close={() => {
              setOpenAddUserDataModal(false);
            }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default Payment;
