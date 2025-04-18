import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../utils/firebase";
import { crearReserva } from "../utils/firestore";

const habitacionesValidas = [
  { id: 1, nombre: "Habitación Superior de Élite", personas: 2, precio: 200 },
  { id: 2, nombre: "Habitación de Lujo Supremo", personas: 2, precio: 220 },
  { id: 3, nombre: "Habitación Deluxe Premium", personas: 3, precio: 250 },
  { id: 4, nombre: "Habitación de Lujo Exclusivo", personas: 2, precio: 230 },
  { id: 5, nombre: "Habitación familiar", personas: 4, precio: 300 },
  { id: 6, nombre: "Habitación Prestigio", personas: 2, precio: 210 },
  { id: 7, nombre: "Habitación Opulencia", personas: 3, precio: 240 },
  { id: 8, nombre: "Habitación Imperial", personas: 2, precio: 260 },
];

const Habitacion = () => {
  const { id } = useParams(); // Obtener el ID de la habitación desde la URL
  const navigate = useNavigate();

  const habitacionSeleccionada = habitacionesValidas.find(
    (habitacion) => habitacion.id === parseInt(id)
  );

  const manejarReserva = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Debes iniciar sesión para realizar una reserva.");
      navigate("/login");
      return;
    }

    const nuevaReserva = {
      firebase_user_id: user.uid,
      nombreUsuario: user.displayName || "Usuario Anónimo",
      correoUsuario: user.email,
      nombre_habitacion: habitacionSeleccionada.nombre,
      fecha_entrada: new Date().toISOString(), // Fecha actual como check-in
      fecha_salida: new Date(
        new Date().setDate(new Date().getDate() + 1)
      ).toISOString(), // Check-out un día después
      cantidad_personas: habitacionSeleccionada.personas,
      precio_total: habitacionSeleccionada.precio,
    };

    try {
      await crearReserva(nuevaReserva);
      alert("Reserva creada con éxito.");
      navigate("/historial"); // Redirigir al historial de reservas
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("Hubo un error al crear la reserva.");
    }
  };

  if (!habitacionSeleccionada) {
    return <p>Habitación no encontrada.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        {habitacionSeleccionada.nombre}
      </h1>
      <p>Capacidad: {habitacionSeleccionada.personas} personas</p>
      <p>Precio: ${habitacionSeleccionada.precio} por noche</p>
      <button
        onClick={manejarReserva}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Reservar ahora
      </button>
    </div>
  );
};

export default Habitacion;
