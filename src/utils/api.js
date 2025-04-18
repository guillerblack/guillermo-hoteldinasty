import axios from "axios";
import React, { useEffect } from "react";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchHabitaciones = async () => {
  try {
    const response = await api.get("/habitaciones");
    console.log(response.data);
  } catch (error) {
    console.error("Error al obtener habitaciones:", error);
  }
};

export const crearReserva = async (reserva) => {
  try {
    const response = await api.post("/reservas", reserva);
    console.log("Reserva creada:", response.data);
  } catch (error) {
    console.error("Error al crear reserva:", error);
  }
};

const Habitaciones = () => {
  useEffect(() => {
    const obtenerHabitaciones = async () => {
      await fetchHabitaciones();
    };

    obtenerHabitaciones();
  }, []);

  const manejarReserva = async () => {
    const nuevaReserva = {
      firebase_user_id: "user123",
      nombreUsuario: "Juan Pérez",
      correoUsuario: "juan@example.com",
      habitacion_id: 1,
      checkIn: "2025-04-20",
      checkOut: "2025-04-25",
      totalPersonas: 2,
      valorHabitacion: 500,
    };

    await crearReserva(nuevaReserva);
  };

  return (
    <div>
      <h1>Habitaciones</h1>
      <button onClick={manejarReserva}>Crear Reserva</button>
    </div>
  );
};

export default Habitaciones;
