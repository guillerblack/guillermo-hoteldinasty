import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { crearReserva } from "../utils/firestore";

const FormularioHabitacionReservada = ({
  habitacionId,
  valorHabitacion,
  nombreHabitacion,
}) => {
  const navigate = useNavigate();

  const manejarReserva = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva.");
      navigate("/login");
      return;
    }

    const reserva = {
      firebase_user_id: user.uid, // Asegúrate que este campo se llame así en Firestore
      nombreUsuario: user.displayName || "Usuario Anónimo",
      correoUsuario: user.email,
      habitacion_id: habitacionId, // Puedes usar este o nombreHabitacion
      nombreHabitacion: nombreHabitacion, // O usar este
      checkIn: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0], // Formato YYYY-MM-DD
      totalPersonas: 2, // Ajusta según sea necesario
      valorHabitacion: valorHabitacion, // Asegúrate que sea un número
      // Agrega los campos que usa HistorialReservas si son diferentes
      nombre_cliente: user.displayName || "Usuario Anónimo", // Campo usado en HistorialReservas
      correo: user.email, // Campo usado en HistorialReservas
      nombre_habitacion: nombreHabitacion, // Campo usado en HistorialReservas
      fecha_entrada: new Date().toISOString().split("T")[0], // Campo usado en HistorialReservas
      fecha_salida: new Date(new Date().setDate(new Date().getDate() + 1))
        .toISOString()
        .split("T")[0], // Campo usado en HistorialReservas
      cantidad_personas: 2, // Campo usado en HistorialReservas
      precio_total: valorHabitacion, // Campo usado en HistorialReservas
    };

    try {
      await crearReserva(reserva);
      alert("Reserva creada con éxito.");
      navigate("/historial"); // <-- CORREGIDO: Ruta correcta
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Hubo un error al crear la reserva. Revisa la consola."); // Mensaje más útil
    }
  };

  return (
    <div>
      <h2>Reservar {nombreHabitacion}</h2>
      <p>Precio: ${valorHabitacion}</p>
      <button
        onClick={manejarReserva}
        className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
      >
        {" "}
        {/* Estilo consistente */}
        Reservar ahora
      </button>
    </div>
  );
};

export default FormularioHabitacionReservada;
