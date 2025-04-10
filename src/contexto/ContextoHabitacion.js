import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api"; // Importar la instancia de Axios
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
  const [fechaInicio, setFechaInicio] = useState(null); // Nueva fecha de inicio
  const [fechaFin, setFechaFin] = useState(null); // Nueva fecha de fin

  // Actualizar el total cuando cambien adultos o niños
  useEffect(() => {
    setTotal(adultos + niños); // Simplificado
  }, [adultos, niños]);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await api.get("/habitaciones"); // Usar api.get
        setHabitaciones(response.data);
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
      }
    };
    fetchHabitaciones();
  }, []);

  // Filtrar habitaciones según el total de personas
  const handleClick = (e) => {
    e.preventDefault();
    const nuevasHabitaciones = habitacionesOriginales.filter((habitacion) => {
      return total <= habitacion.maxPersonas;
    });
    setHabitaciones(nuevasHabitaciones);
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reservas", {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        adultos,
        niños,
      });
      alert("Reserva creada con éxito.");
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Error al crear la reserva.");
    }
  };

  return (
    <ContextoHabitacion.Provider
      value={{
        habitaciones,
        setHabitaciones,
        adultos,
        setAdultos,
        niños,
        setNiños,
        handleClick,
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        handleReserva,
      }}
    >
      {children}
    </ContextoHabitacion.Provider>
  );
};

export default HabitacionProveedor;
