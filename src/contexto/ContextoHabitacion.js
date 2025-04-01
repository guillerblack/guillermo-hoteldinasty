import React, { createContext, useEffect, useState } from "react";
// Datos
import { habitacionData } from "../data";

// Creación del contexto
export const ContextoHabitacion = createContext();

const HabitacionProveedor = ({ children }) => {
  // Estados iniciales
  const [habitaciones, setHabitaciones] = useState(habitacionData);
  const [habitacionesOriginales] = useState(habitacionData); // Mantener todas las habitaciones originales
  const [adultos, setAdultos] = useState(1); // Cambiado a número
  const [niños, setNiños] = useState(0); // Cambiado a número
  const [total, setTotal] = useState(0);

  // Actualizar el total cuando cambien adultos o niños
  useEffect(() => {
    setTotal(adultos + niños); // Simplificado
  }, [adultos, niños]);

  // Filtrar habitaciones según el total de personas
  const handleClick = (e) => {
    e.preventDefault();
    const nuevasHabitaciones = habitacionesOriginales.filter((habitacion) => {
      return total <= habitacion.maxPersonas;
    });
    setHabitaciones(nuevasHabitaciones);
  };

  return (
    <ContextoHabitacion.Provider
      value={{
        habitaciones,
        adultos,
        setAdultos,
        niños,
        setNiños,
        handleClick,
      }}
    >
      {children}
    </ContextoHabitacion.Provider>
  );
};

export default HabitacionProveedor;
