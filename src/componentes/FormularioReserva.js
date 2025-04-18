import React, { useContext, useState } from "react";
// Componentes
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import { crearReserva } from "../utils/firestore";

const FormularioReserva = ({ habitacionId, valorHabitacion }) => {
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

  const handleReserva = async () => {
    const reserva = {
      firebase_user_id: "user123", // Reemplaza con el ID del usuario autenticado
      nombreUsuario: "Juan Pérez",
      correoUsuario: "juan@example.com",
      habitacion_id: habitacionId,
      checkIn: "2025-04-20",
      checkOut: "2025-04-25",
      totalPersonas: adultos + niños,
      valorHabitacion,
    };
    await crearReserva(reserva);
    alert("Reserva creada con éxito");
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

        {/* Botón para reservar */}
        <button onClick={handleReserva} className="btn btn-secondary">
          Reservar
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;
