import React, { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import {
  fetchReservas,
  crearReserva,
  eliminarReserva,
} from "../utils/firestore";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";
import { onAuthStateChanged } from "firebase/auth";

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

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [formData, setFormData] = useState({
    nombre_cliente: "",
    correo: "",
    nombre_habitacion: "",
    fecha_entrada: "",
    fecha_salida: "",
  });
  const [usuario, setUsuario] = useState(null);

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario(user);
        cargarReservas(user.uid); // Cargar reservas si el usuario está autenticado
      } else {
        alert("Debes iniciar sesión para ver tu historial de reservas.");
        setUsuario(null);
      }
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar el componente
  }, []);

  // Cargar reservas desde Firebase
  const cargarReservas = async (userId) => {
    try {
      const data = await fetchReservas(userId);
      setReservas(data);
    } catch (error) {
      console.error("Error al obtener las reservas:", error);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar nueva reserva
  const handleAddReserva = async (e) => {
    e.preventDefault();

    const habitacionSeleccionada = habitacionesValidas.find(
      (h) => h.nombre === formData.nombre_habitacion
    );

    if (!habitacionSeleccionada) {
      alert("Seleccione una habitación válida.");
      return;
    }

    if (!usuario) {
      alert("Debes iniciar sesión para agregar una reserva.");
      return;
    }

    const nuevaReserva = {
      firebase_user_id: usuario.uid,
      nombreUsuario: usuario.displayName || "Usuario Anónimo",
      correoUsuario: usuario.email,
      ...formData,
      cantidad_personas: habitacionSeleccionada.personas,
      precio_total: habitacionSeleccionada.precio,
    };

    try {
      const reservaCreada = await crearReserva(nuevaReserva);
      setReservas([...reservas, reservaCreada]);
      setFormData({
        nombre_cliente: "",
        correo: "",
        nombre_habitacion: "",
        fecha_entrada: "",
        fecha_salida: "",
      });
      alert("Reserva agregada con éxito.");
    } catch (error) {
      console.error("Error al agregar reserva:", error);
      alert("Error al agregar reserva.");
    }
  };

  // Eliminar reserva
  const handleDeleteReserva = async (id) => {
    try {
      await eliminarReserva(id);
      setReservas(reservas.filter((r) => r.id !== id));
      alert("Reserva eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
      alert("Error al eliminar reserva.");
    }
  };

  return (
    <>
      <Header />
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1920&q=80)`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
            Historial de Reservas
          </h1>
        </div>
      </div>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-accent">
          Gestión de Reservas
        </h1>

        {/* Formulario para agregar nueva reserva */}
        <form
          onSubmit={handleAddReserva}
          className="mb-8 p-4 bg-white shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Agregar Reserva
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              name="nombre_cliente"
              placeholder="Nombre del cliente"
              value={formData.nombre_cliente}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />

            <input
              type="email"
              name="correo"
              placeholder="Correo del cliente"
              value={formData.correo}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />

            <select
              name="nombre_habitacion"
              value={formData.nombre_habitacion}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            >
              <option value="">Seleccionar habitación</option>
              {habitacionesValidas.map((habitacion) => (
                <option key={habitacion.id} value={habitacion.nombre}>
                  {habitacion.nombre}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="fecha_entrada"
              value={formData.fecha_entrada}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />

            <input
              type="date"
              name="fecha_salida"
              value={formData.fecha_salida}
              onChange={handleChange}
              className="p-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover"
          >
            Agregar Reserva
          </button>
        </form>

        {/* Tabla de reservas */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-accent text-white">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Correo</th>
                <th className="px-4 py-2">Habitación</th>
                <th className="px-4 py-2">Check-in</th>
                <th className="px-4 py-2">Check-out</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length > 0 ? (
                reservas.map((reserva) => (
                  <tr key={reserva.id} className="text-center border-b">
                    <td className="px-4 py-2">{reserva.id}</td>
                    <td className="px-4 py-2">{reserva.nombreUsuario}</td>
                    <td className="px-4 py-2">{reserva.correoUsuario}</td>
                    <td className="px-4 py-2">{reserva.nombre_habitacion}</td>
                    <td className="px-4 py-2">{reserva.fecha_entrada}</td>
                    <td className="px-4 py-2">{reserva.fecha_salida}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteReserva(reserva.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-4 py-2 text-center">
                    No hay reservas disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistorialReservas;
