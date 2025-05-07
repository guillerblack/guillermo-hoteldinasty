import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api";

// Crear el contexto
export const ContextoHabitacion = createContext();

const HabitacionProvedor = ({ children }) => {
  // Estados
  const [habitaciones, setHabitaciones] = useState([]);
  const [adultos, setAdultos] = useState(1);
  const [niños, setNiños] = useState(0);
  const [total, setTotal] = useState(0);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar habitaciones al montar el componente
  useEffect(() => {
    const cargarHabitaciones = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/rooms');
        console.log('Respuesta del API:', response.data);
  
        if (response.data && response.data.rooms && response.data.rooms.length > 0) {
          // Mapear las habitaciones para asegurar que tienen todos los campos necesarios
          const habitacionesFormateadas = response.data.rooms.map(room => {
            // Si necesitas asegurar que cada habitación tenga ciertas propiedades, hazlo aquí
            return room;
          });
  
          setHabitaciones(habitacionesFormateadas);
          setHabitacionesFiltradas(habitacionesFormateadas);
        } else {
          console.warn('No se recibieron habitaciones del servidor.');
          setHabitaciones([]);
          setHabitacionesFiltradas([]);
        }
      } catch (error) {
        console.error('Error al cargar habitaciones:', error);
        setError('Error al cargar las habitaciones');
        setHabitaciones([]);
        setHabitacionesFiltradas([]);
      } finally {
        setLoading(false);
      }
    };
    cargarHabitaciones();
  }, []);

  // Filtrar habitaciones por cantidad de personas
  useEffect(() => {
    setTotal(adultos + niños);
  }, [adultos, niños]);

  // Filtrar habitaciones por capacidad cuando cambia el total de personas
  useEffect(() => {
    const filtrarHabitaciones = () => {
      const habitacionesFiltradas = habitaciones.filter(
        (habitacion) => habitacion.maxPersonas >= total
      );
      setHabitacionesFiltradas(habitacionesFiltradas);
    };
    filtrarHabitaciones();
  }, [total, habitaciones]);

  // Manejar el clic en el botón de búsqueda
  const handleClick = (e) => {
    e.preventDefault();
    
    if (!fechaInicio || !fechaFin) {
      setHabitaciones(habitacionesFiltradas);
      return;
    }

    setHabitaciones(habitacionesFiltradas);
    const seccionHabitaciones = document.querySelector('.py-24');
    if (seccionHabitaciones) {
      seccionHabitaciones.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Calcular precio total según días de estancia
  const calcularPrecioTotal = (precioBase) => {
    if (!fechaInicio || !fechaFin) return precioBase;
    
    const diffTime = Math.abs(fechaFin - fechaInicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 0 ? precioBase : precioBase * diffDays;
  };

  // Verificar disponibilidad de habitación
  const verificarDisponibilidad = async (habitacionId) => {
    try {
      const response = await api.post(`/api/rooms/check-availability`, {
        roomId: habitacionId,
        checkInDate: fechaInicio ? fechaInicio.toISOString().split('T')[0] : null,
        checkOutDate: fechaFin ? fechaFin.toISOString().split('T')[0] : null
      });
      return response.data.available;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return false;
    }
  };

  // Obtener habitación por ID
  const obtenerHabitacionPorId = (id) => {
    return habitaciones.find((habitacion) => habitacion.id === Number(id));
  };

  // Obtener reservas del usuario actual
  const obtenerReservasUsuario = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      const response = await api.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(response.data.bookings || []);
    } catch (err) {
      setError(err.message || "Error al obtener reservas");
      console.error("Error al obtener reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva reserva
  const crearReserva = async (datosReserva) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      const response = await api.post("/api/bookings", datosReserva, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (err) {
      setError(err.message || "Error al crear la reserva");
      console.error("Error al crear la reserva:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar una reserva
  const cancelarReserva = async (reservaId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }
      
      await api.patch(`/api/bookings/${reservaId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservas(reservas.filter(r => r.id !== reservaId));
      return true;
    } catch (err) {
      setError(err.message || "Error al cancelar la reserva");
      console.error("Error al cancelar la reserva:", err);
      throw err;
    } finally {
      setLoading(false);
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
        fechaInicio,
        setFechaInicio,
        fechaFin,
        setFechaFin,
        handleClick,
        total,
        habitacionesFiltradas,
        calcularPrecioTotal,
        verificarDisponibilidad,
        obtenerHabitacionPorId,
        reservas,
        loading,
        error,
        obtenerReservasUsuario,
        crearReserva,
        cancelarReserva
      }}
    >
      {children}
    </ContextoHabitacion.Provider>
  );
};

export default HabitacionProvedor;