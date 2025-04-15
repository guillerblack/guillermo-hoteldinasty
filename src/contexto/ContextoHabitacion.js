import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api"; // Importar la instancia de Axios
// Datos
import { habitacionData } from "../data";

// Creación del contexto
export const ContextoHabitacion = createContext();

const HabitacionProveedor = ({ children }) => {
  // Estados iniciales
  const [habitaciones, setHabitaciones] = useState(habitacionData); // Habitaciones filtradas
  const [habitacionesOriginales] = useState(habitacionData); // Habitaciones originales
  const [adultos, setAdultos] = useState(1); // Número de adultos
  const [niños, setNiños] = useState(0); // Número de niños
  const [total, setTotal] = useState(0); // Total de personas
  const [fechaInicio, setFechaInicio] = useState(null); // Fecha de check-in
  const [fechaFin, setFechaFin] = useState(null); // Fecha de check-out

  // Actualizar el total cuando cambien adultos o niños
  useEffect(() => {
    setTotal(adultos + niños); // Sumar adultos y niños
  }, [adultos, niños]);

  // Cargar habitaciones desde el backend Laravel
  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await api.get("/habitaciones"); // Obtener habitaciones desde la API
        setHabitaciones(response.data); // Actualizar habitaciones
      } catch (error) {
        console.error("Error al cargar habitaciones:", error);
      }
    };
    fetchHabitaciones();
  }, []);

  // Filtrar habitaciones según el total de personas
  const handleClick = (e) => {
    e.preventDefault();
    if (total === 0) {
      alert("Por favor selecciona al menos un adulto o niño.");
      return;
    }
    const nuevasHabitaciones = habitacionesOriginales.filter((habitacion) => {
      return total <= habitacion.maxPersonas; // Filtrar por capacidad
    });
    if (nuevasHabitaciones.length === 0) {
      alert("No hay habitaciones disponibles para esta cantidad de personas.");
    }
    setHabitaciones(nuevasHabitaciones);
  };

  // Crear una reserva
  const handleReserva = async (e) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona las fechas de check-in y check-out.");
      return;
    }
    if (fechaFin <= fechaInicio) {
      alert("La fecha de check-out debe ser posterior a la fecha de check-in.");
      return;
    }
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
