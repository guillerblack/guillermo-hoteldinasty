import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import api from "../utils/api";

const habitacionesValidas = [
  { id: 1, nombre: "Habitación Superior de Élite", personas: 2, precio: 200 },
  { id: 2, nombre: "Habitación de Lujo Supremo", personas: 2, precio: 220 },
  { id: 3, nombre: "Habitación Deluxe Premium", personas: 3, precio: 250 },
  { id: 4, nombre: "Habitación de Lujo Exclusivo", personas: 2, precio: 230 },
  { id: 5, nombre: "Habitación familiar", personas: 4, precio: 300 },
  { id: 6, nombre: "Habitación  Prestigio", personas: 2, precio: 210 },
  { id: 7, nombre: "Habitación Opulencia ", personas: 3, precio: 240 },
  { id: 8, nombre: "habitacion  Imperial ", personas: 2, precio: 260 },
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

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const res = await api.get("/reservas");
        setReservas(res.data.reservas || res.data);
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      }
    };
    fetchReservas();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddReserva = async (e) => {
    e.preventDefault();

    const habitacionSeleccionada = habitacionesValidas.find(
      (h) => h.nombre === formData.nombre_habitacion
    );

    if (!habitacionSeleccionada) {
      alert("Seleccione una habitación válida.");
      return;
    }

    const nuevaReserva = {
      ...formData,
      cantidad_personas: habitacionSeleccionada.personas,
      precio_total: habitacionSeleccionada.precio,
    };

    try {
      const response = await api.post("/reservas", nuevaReserva);
      setReservas([...reservas, response.data]);
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

  const handleDeleteReserva = async (id) => {
    try {
      await api.delete(`/reservas/${id}`);
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
            Dashboard de Reservas
          </h1>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-accent">
          Gestión de Reservas
        </h1>
        
        {/* Formulario */}
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
                    <td className="px-4 py-2">{reserva.nombre_cliente}</td>
                    <td className="px-4 py-2">{reserva.correo}</td>
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
