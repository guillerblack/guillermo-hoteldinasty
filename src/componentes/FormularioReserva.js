import React, { useContext, useState } from "react";
// Componentes
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";

const FormularioReserva = () => {
  const { handleClick } = useContext(ContextoHabitacion);

  // Estado para manejar adultos y niños
  const [adultos, setAdultos] = useState(1);
  const [niños, setNiños] = useState(0);

  // Manejar cambios en los dropdowns
  const handleAdultosChange = (value) => {
    setAdultos(value);
  };

  const handleNiñosChange = (value) => {
    setNiños(value);
  };

  return (
    <form className="h-[200px] w-full lg:h-[70px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        {/* Dropdown para adultos */}
        <div className="flex-1 border-r">
          <AdultsDropdown value={adultos} onChange={handleAdultosChange} />
        </div>

        {/* Dropdown para niños */}
        <div className="flex-1 border-r">
          <KidsDropdown value={niños} onChange={handleNiñosChange} />
        </div>

        {/* Botón para buscar habitaciones */}
        <button
          onClick={(e) => handleClick(e)}
          type="submit"
          className="btn btn-primary"
        >
          HABITACIONES DISPONIBLES
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;
