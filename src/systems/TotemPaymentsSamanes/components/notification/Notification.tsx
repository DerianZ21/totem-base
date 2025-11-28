import { useEffect } from "react";
import styles from "./notification.module.css";
import { Dialog } from "@mui/material";
import errorIcon from "../../assets/error.svg";
import infoIcon from "../../assets/info.svg";
import warnIcon from "../../assets/warn.svg";
import successIcon from "../../assets/success.svg";
import { StatusNotification } from "../../models/notification/Notification";

interface NotificationProps {
  open: boolean;
  status: StatusNotification;
  message: string;
  tittle: string;
  close: () => void;
  closeTime: number;
}

const Notification: React.FC<NotificationProps> = ({
  tittle,
  open,
  status,
  message,
  close,
  closeTime,
}) => {
  const parameters = {
    info: {
      color: "#2979ff",
      icon: infoIcon,
    },
    success: {
      color: "#2e7d32",
      icon: successIcon,
    },
    error: {
      color: "#d32f2f",
      icon: errorIcon,
    },
    warning: {
      color: "#ed6c02",
      icon: warnIcon,
    },
  };

  useEffect(() => {
    setTimeout(() => {
      close();
    }, closeTime);
  }, [closeTime, close]);

  return (
    <Dialog
      open={open}
      onClose={close}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        },
      }}
    >
      <div className={styles.main_notification}>
        <img className={styles.icon} src={parameters[status].icon} />
        <h1 className={styles.tittle}>{tittle}</h1>
        <p className={styles.message}>{message}</p>
      </div>
    </Dialog>
  );
};

export default Notification;
