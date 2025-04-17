import React, { useContext, useState } from "react";
// Componentes
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import Habitacion from "./Habitacion";

const FormularioReserva = () => {
  // Obtener valores y funciones del contexto
  const {
    habitaciones,
    handleClick,
    setCheckIn, // Función para actualizar la fecha de check-in
    setCheckOut, // Función para actualizar la fecha de check-out
  } = useContext(ContextoHabitacion);
  const [selectedRooms, setSelectedRooms] = useState([]);

  const handleRoomSelect = (roomId) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(roomId)
        ? prevSelected.filter((id) => id !== roomId)
        : [...prevSelected, roomId]
    );
  };

  return (
    <form className="h-full w-full lg:h-[600px] xl:h-[400px]">
      <div className="flex flex-col w-full h-full lg:flex-row">
        {/* Componente CheckIn */}
        <div className="flex-1 border-r">
          <CheckIn onChange={(date) => setCheckIn(date)} /> {/* Pasamos la función de actualización */}
        </div>
        {/* Componente CheckOut */}
        <div className="flex-1 border-r">
          <CheckOut onChange={(date) => setCheckOut(date)} /> {/* Pasamos la función de actualización */}
        </div>
        <div className="flex-1 border-r">
          <AdultsDropdown />
        </div>
        <div className="flex-1 border-r">
          <KidsDropdown />
        </div>
      </div>
      <div className="flex flex-wrap -mx-2 mb-4">
        {habitaciones.map((habitacion) => (
          <div
            key={habitacion.id}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2"
          >
            <Habitacion
              habitacion={habitacion}
              onSelect={handleRoomSelect}
              isSelected={selectedRooms.includes(habitacion.id)}
            />
          </div>
        ))}
      </div>
      <div className="mt-4">
        {/* Botón "Check now" */}
        <button
          onClick={(e) => {
            e.preventDefault();
            handleClick(e, selectedRooms);
          }}
          type="submit"
          className="btn btn-primary"
        >
          Check now
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;
