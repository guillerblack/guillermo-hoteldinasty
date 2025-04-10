import React, { useContext } from "react";
// Componentes
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";

const FormularioReserva = () => {
  const { handleClick } = useContext(ContextoHabitacion);

  return (
    <form className="h-[200px] w-full lg:h-[70px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        <div className="flex-1 border-r">
          <AdultsDropdown />
        </div>
        <div className="flex-1 border-r">
          <KidsDropdown />
        </div>
        {/* Botón */}
        <button
          onClick={(e) => handleClick(e)}
          type="submit"
          className="btn btn-primary"
        >
          HABITACION DISPONIBLES
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;
