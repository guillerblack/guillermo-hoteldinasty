// paginas/HistorialReservas.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import api from '../utils/api';

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [serviciosReservados, setServiciosReservados] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nuevaReserva, setNuevaReserva] = useState({
    roomName: "",
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Por favor, inicia sesión para ver tu historial de reservas.");
      navigate("/login");
      return;
    }

    const fetchUsuario = async () => {
      try {
        const response = await api.get("/api/auth/profile");
        setUsuario(response.data);
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        alert("Sesión expirada. Por favor, inicia sesión nuevamente.");
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [navigate]);

  // Obtener reservas del backend
  useEffect(() => {
    const fetchReservas = async () => {
      if (!usuario) return;

      try {
        const token = localStorage.getItem("token");
        // Corregir la ruta para obtener las reservas del usuario
        const response = await api.get("/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Asegurarse de que reservas sea siempre un array
        const reservasData = response.data?.bookings || response.data || [];
        setReservas(Array.isArray(reservasData) ? reservasData : []);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        // Si hay un error, establecer un array vacío
        setReservas([]);
      }
    };

    fetchReservas();
  }, [usuario]);

  // Obtener servicios reservados del backend
  useEffect(() => {
    const fetchServiciosReservados = async () => {
      if (!usuario) return;

      try {
        const token = localStorage.getItem("token");
        // Obtener las reservas de servicios del usuario
        const response = await api.get("/api/service-bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Asegurarse de que serviciosReservados sea siempre un array
        const serviciosData = response.data || [];
        setServiciosReservados(Array.isArray(serviciosData) ? serviciosData : []);
      } catch (error) {
        console.error("Error al obtener servicios reservados:", error);
        // Si hay un error, establecer un array vacío
        setServiciosReservados([]);
      }
    };

    fetchServiciosReservados();
  }, [usuario]);

  // Manejar el envío del formulario para agregar una nueva reserva
  const handleAgregarReserva = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      // Corregir la ruta para crear una nueva reserva
      const response = await api.post(
        "/api/bookings",
        {
          roomName: nuevaReserva.roomName,
          checkInDate: nuevaReserva.checkInDate,
          checkOutDate: nuevaReserva.checkOutDate,
          numAdults: Math.floor(nuevaReserva.guests),
          numChildren: 0,
          totalPrice: 100 // Precio por defecto, idealmente esto vendría de la habitación seleccionada
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Reserva creada con éxito.");
      setReservas([...reservas, response.data]); // Agregar la nueva reserva al estado
      setNuevaReserva({
        roomName: "",
        checkInDate: "",
        checkOutDate: "",
        guests: 1,
      }); // Limpiar el formulario
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      alert("No se pudo crear la reserva. Intenta de nuevo.");
    }
  };

  const handleCancelarReserva = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas cancelar esta reserva?"
    );
    if (!confirmacion) return;
  
    try {
      const token = localStorage.getItem("token");
      
      // Cambiar a PATCH y usar la ruta correcta con el status
      await api.patch(`/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert("Reserva cancelada con éxito.");
      
      // Actualizar el estado local - marcar como cancelada
      setReservas(
        reservas.map((reserva) => 
          reserva.id === id 
            ? { ...reserva, status: 'cancelled' } 
            : reserva
        )
      );
    } catch (error) {
      console.error("Error al cancelar la reserva:", error);
      alert("No se pudo cancelar la reserva. Intenta de nuevo.");
    }
  };
  
  const handleCancelarServicio = async (id) => {
    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas cancelar este servicio?"
    );
    if (!confirmacion) return;
  
    try {
      const token = localStorage.getItem("token");
      
      // Usar la ruta correcta para cancelar servicios
      await api.patch(`/api/service-bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      alert("Servicio cancelado con éxito.");
      
      // Actualizar el estado local - marcar como cancelado
      setServiciosReservados(
        serviciosReservados.map((servicio) => 
          servicio.id === id 
            ? { ...servicio, status: 'cancelled' } 
            : servicio
        )
      );
    } catch (error) {
      console.error("Error al cancelar el servicio:", error);
      alert("No se pudo cancelar el servicio. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando historial de reservas...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      {/* HeroSlider personalizado */}
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1556761175-4b46a572b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGhvdGVsfGVufDB8fHx8MTY4MTEyNjA3MQ&ixlib=rb-1.2.1&q=80&w=1080)`,
        }}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        {/* Texto superpuesto */}
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
            Historial de Reservas
          </h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tus Reservas</h1>

        {/* Formulario para agregar una nueva reserva */}
        <form onSubmit={handleAgregarReserva} className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Agregar Nueva Reserva</h2>
          <div className="mb-4">
            <label className="block mb-2">Nombre de la Habitación:</label>
            <input
              type="text"
              value={nuevaReserva.roomName}
              onChange={(e) =>
                setNuevaReserva({ ...nuevaReserva, roomName: e.target.value })
              }
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Fecha de Check-in:</label>
            <input
              type="date"
              value={nuevaReserva.checkInDate}
              onChange={(e) =>
                setNuevaReserva({
                  ...nuevaReserva,
                  checkInDate: e.target.value,
                })
              }
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Fecha de Check-out:</label>
            <input
              type="date"
              value={nuevaReserva.checkOutDate}
              onChange={(e) =>
                setNuevaReserva({
                  ...nuevaReserva,
                  checkOutDate: e.target.value,
                })
              }
              className="border p-2 w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Número de Huéspedes:</label>
            <input
              type="number"
              value={nuevaReserva.guests}
              onChange={(e) =>
                setNuevaReserva({
                  ...nuevaReserva,
                  guests: parseInt(e.target.value),
                })
              }
              className="border p-2 w-full"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-accent text-white px-4 py-2 rounded hover:bg-accent-hover"
          >
            Agregar Reserva
          </button>
        </form>

        {/* Tabla de reservas de habitaciones */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Reservas de Habitaciones</h2>
          {reservas.length === 0 ? (
            <p className="text-gray-500">No tienes reservas de habitaciones.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Habitación</th>
                    <th className="py-2 px-4 border">Check-in</th>
                    <th className="py-2 px-4 border">Check-out</th>
                    <th className="py-2 px-4 border">Huéspedes</th>
                    <th className="py-2 px-4 border">Precio</th>
                    <th className="py-2 px-4 border">Estado</th>
                    <th className="py-2 px-4 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.id} className="border">
                      <td className="py-2 px-4 border">
                        {reserva.room_name || reserva.roomName}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(
                          reserva.check_in_date || reserva.checkInDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(
                          reserva.check_out_date || reserva.checkOutDate
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {(reserva.num_adults || reserva.numAdults || 0) +
                          (reserva.num_children || reserva.numChildren || 0)}
                      </td>
                      <td className="py-2 px-4 border">
                        ${reserva.total_price || reserva.totalPrice}
                      </td>
                      <td className="py-2 px-4 border">
                        <span
                          className={`px-2 py-1 rounded ${
                            (reserva.status === "confirmed" ||
                              reserva.status === "pending") &&
                            "bg-green-100 text-green-800"
                          } ${
                            reserva.status === "cancelled" &&
                            "bg-red-100 text-red-800"
                          }`}
                        >
                          {reserva.status === "confirmed"
                            ? "Confirmada"
                            : reserva.status === "cancelled"
                            ? "Cancelada"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">
                        {reserva.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancelarReserva(reserva.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabla de servicios reservados */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Servicios Reservados</h2>
          {serviciosReservados.length === 0 ? (
            <p className="text-gray-500">No tienes servicios reservados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border">Servicio</th>
                    <th className="py-2 px-4 border">Categoría</th>
                    <th className="py-2 px-4 border">Fecha</th>
                    <th className="py-2 px-4 border">Hora</th>
                    <th className="py-2 px-4 border">Cantidad</th>
                    <th className="py-2 px-4 border">Precio Total</th>
                    <th className="py-2 px-4 border">Estado</th>
                    <th className="py-2 px-4 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {serviciosReservados.map((servicio) => (
                    <tr key={servicio.id} className="border">
                      <td className="py-2 px-4 border">
                        {servicio.service_name}
                      </td>
                      <td className="py-2 px-4 border">
                        {servicio.category === "food" ? "Restaurante" : 
                         servicio.category === "spa" ? "SPA" : 
                         servicio.category}
                      </td>
                      <td className="py-2 px-4 border">
                        {new Date(servicio.booking_date).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-4 border">
                        {servicio.booking_time}
                      </td>
                      <td className="py-2 px-4 border">
                        {servicio.quantity}
                      </td>
                      <td className="py-2 px-4 border">
                        ${servicio.total_price}
                      </td>
                      <td className="py-2 px-4 border">
                        <span
                          className={`px-2 py-1 rounded ${
                            (servicio.status === "confirmed" ||
                              servicio.status === "pending") &&
                            "bg-green-100 text-green-800"
                          } ${
                            servicio.status === "cancelled" &&
                            "bg-red-100 text-red-800"
                          } ${
                            servicio.status === "completed" &&
                            "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {servicio.status === "confirmed"
                            ? "Confirmado"
                            : servicio.status === "cancelled"
                            ? "Cancelado"
                            : servicio.status === "completed"
                            ? "Completado"
                            : "Pendiente"}
                        </span>
                      </td>
                      <td className="py-2 px-4 border">
                        {(servicio.status !== "cancelled" && servicio.status !== "completed") && (
                          <button
                            onClick={() => handleCancelarServicio(servicio.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Cancelar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HistorialReservas;