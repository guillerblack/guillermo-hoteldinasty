import React, { createContext, useEffect, useState } from "react";
// Datos
import { habitacionData } from "../data";
// Creación del contexto
export const ContextoHabitacion = createContext();

const HabitacionProveedor = ({ children }) => {
  const [habitaciones, setHabitaciones] = useState(habitacionData);
  const [adultos, setAdultos] = useState("1 adulto");
  const [niños, setNiños] = useState("0 niños");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(Number(adultos[0]) + Number(niños[0]));
  }, [adultos, niños]); // Agregar dependencias para useEffect

  const handleClick = (e) => {
    e.preventDefault();
    // Filtrar habitaciones basadas en el número total de personas
    const nuevasHabitaciones = habitacionData.filter((habitacion) => {
      return total <= habitacion.maxPersonas;
    });
    setHabitaciones(nuevasHabitaciones);
  };

  console.log(habitaciones);

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
