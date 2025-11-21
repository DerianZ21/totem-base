import { useState } from "react";
import styles from "./addUserData.module.css";
import branding from "../../assets/branding_color.svg";
import { ButtonPrimary } from "../../components/buttons/Button";
import { Box, FormControl, FormLabel, TextField } from "@mui/material";
import { Client } from "../../models/client.model";

const baseTextFieldStyles = {
  "& .MuiOutlinedInput-root": {
    background: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "1px 0.2rem 0.5rem #3e485211",
  },
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "2px solid #3e48522f",
  },
  "& input::-webkit-outer-spin-button": { WebkitAppearance: "none", margin: 0 },
  "& input::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
};

// VALIDACIONES
const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validateCedula = (cedula: string) => {
  if (!/^\d{10}$/.test(cedula)) return false;

  //validación compleja
  return true;

  //validación compleja

  //const digits = cedula.split("").map(Number);
  // const validator = digits[9];
  //   let sum = 0;
  //   for (let i = 0; i < 9; i++) {
  //     let value = digits[i];
  //     if (i % 2 === 0) {
  //       value *= 2;
  //       if (value > 9) value -= 9;
  //     }
  //     sum += value;
  //   }
  //   const calculated = (10 - (sum % 10)) % 10;
  //   return calculated === validator;
};

interface AddUserDataProps {
  clientData: Client | null | undefined
  setClientData: (client: Client) => void;
  close: () => void;
}

const AddUserData: React.FC<AddUserDataProps> = ({clientData, setClientData, close}) => {
  
  const [form, setForm] = useState({
    idNumber: clientData?.idNumber ?? "",
    name: clientData?.name ?? "",
    email: clientData?.email ?? "",
    address: clientData?.address ?? "",
  });

  const [errors, setErrors] = useState({
    idNumber: "",
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  // FORMULARIO REAL
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // evita refresh

    let valid = true;
    const newErrors = { ...errors };

    if (!validateCedula(form.idNumber)) {
      newErrors.idNumber = "Cédula inválida";
      valid = false;
    }

    if (form.name.trim().length < 3) {
      newErrors.name = "Ingrese un nombre válido";
      valid = false;
    }

    if (!validateEmail(form.email)) {
      newErrors.email = "Correo inválido";
      valid = false;
    }

    if (form.address.trim().length < 5) {
      newErrors.address = "Ingrese una dirección válida";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      return;
    }

    console.log(" Datos validados para enviar:", form);
    setClientData(form as Client);
    close();
  };

  return (
    <div className={styles.main_add_user_data}>
      <img className={styles.branding_img} src={branding} />
      <h1 className={styles.tittle}>Datos del cliente</h1>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "70%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: "100%",
        }}
      >
        <div className={styles.imputsContent}>
          <FormControl fullWidth sx={{ mb: 3, gap: "0.75rem" }}>
            <FormLabel className={styles.field_tittle}>Cédula</FormLabel>
            <TextField
              type="number"
              value={form.idNumber}
              onChange={(e) => handleChange("idNumber", e.target.value)}
              error={!!errors.idNumber}
              helperText={errors.idNumber}
              className={`${styles.card} ${styles.txt_whatsapp_component}`}
              variant="outlined"
              sx={baseTextFieldStyles}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3, gap: "0.75rem" }}>
            <FormLabel className={styles.field_tittle}>
              Nombre del cliente
            </FormLabel>
            <TextField
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              className={`${styles.card} ${styles.txt_whatsapp_component}`}
              variant="outlined"
              sx={baseTextFieldStyles}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3, gap: "0.75rem" }}>
            <FormLabel className={styles.field_tittle}>Correo</FormLabel>
            <TextField
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              className={`${styles.card} ${styles.txt_whatsapp_component}`}
              variant="outlined"
              sx={baseTextFieldStyles}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3, gap: "0.75rem" }}>
            <FormLabel className={styles.field_tittle}>Dirección</FormLabel>
            <TextField
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
              className={`${styles.card} ${styles.txt_whatsapp_component}`}
              variant="outlined"
              sx={baseTextFieldStyles}
            />
          </FormControl>
        </div>

        <div className={styles.actions}>
          <ButtonPrimary
            className={styles.btnAction}
            label="Confirmar"
            type="submit"
          />
        </div>
      </Box>
    </div>
  );
};

export default AddUserData;
