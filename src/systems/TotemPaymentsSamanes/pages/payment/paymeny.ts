import { CajaFacturacion } from "../../models/caja/caja.model";
import { WebEnvConfig } from "../../config/env";

const selectCashRegister = (
  CashRegisters: CajaFacturacion[]
): CajaFacturacion => {
    
  if (CashRegisters.length < 1) {
    throw new Error("No hay cajas registradas");
  }

  const selectedCashRegister: CajaFacturacion | undefined = CashRegisters.find(
    (cashRegister) => cashRegister.id === WebEnvConfig.idCashRegister
  );

  if (!selectedCashRegister) {
    throw new Error("Caja inexistente");
  }

  return selectedCashRegister;
};

export { selectCashRegister };
