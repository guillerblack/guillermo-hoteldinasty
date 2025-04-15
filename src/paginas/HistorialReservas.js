// paginas/HistorialReservas.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase"; // Firebase Auth
import Header from "../componentes/Header"; // Importar Header
import Footer from "../componentes/Footer"; // Importar Footer

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]); // Estado para las reservas
  const [usuario, setUsuario] = useState(null); // Estado para el usuario autenticado
  const [loading, setLoading] = useState(true); // Estado para mostrar un indicador de carga

  // Monitorear el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUsuario({
          nombre: currentUser.displayName || "Usuario",
          correo: currentUser.email,
        });
      } else {
        alert("Por favor, inicia sesión para ver tu historial de reservas.");
        setUsuario(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Obtener reservas del backend Laravel
  useEffect(() => {
    const fetchReservas = async () => {
      if (!usuario) return;

      try {
        const token = localStorage.getItem("token"); // Token de autenticación
        const response = await axios.get(
          "http://127.0.0.1:8000/api/mis-reservas",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setReservas(response.data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [usuario]);

  // Eliminar una reserva
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reserva?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://127.0.0.1:8000/api/reservas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservas(reservas.filter((reserva) => reserva.id !== id));
      alert("Reserva eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
    }
  };

  // Simular pago de una reserva
  const handlePagar = (reserva) => {
    alert(`Simulando pago de $${reserva.valor}`);
    // Aquí podrías redirigir a una pasarela de pago o marcar como "pagado"
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
      <Header /> {/* Agregar Header */}
      {/* HeroSlider */}
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://img.lovepik.com/bg/20240429/3D-General-Calendar-Background-Render-A-Stunning-Visual-for-Your_8465229_wh1200.jpg)`,
        }}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        {/* Texto superpuesto */}
        <div className="absolute w-full h-full flex flex-col justify-center items-center text-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary">
            Historial de Reservas
          </h1>
          {usuario && (
            <p className="text-white text-lg mt-4">
              Aquí puedes gestionar tus reservas, <br />
              <strong>{usuario.correo}</strong>
            </p>
          )}
        </div>
      </div>
      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Tus Reservas</h1>
        {reservas.length === 0 ? (
          <p>No tienes reservas registradas.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Habitación</th>
                  <th className="p-2">Check-in</th>
                  <th className="p-2">Check-out</th>
                  <th className="p-2">Personas</th>
                  <th className="p-2">Valor</th>
                  <th className="p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="border-t">
                    <td className="p-2">{reserva.nombreHabitacion}</td>
                    <td className="p-2">{reserva.checkIn}</td>
                    <td className="p-2">{reserva.checkOut}</td>
                    <td className="p-2">{reserva.totalPersonas}</td>
                    <td className="p-2">${reserva.valorHabitacion}</td>
                    <td className="p-2 flex gap-2">
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded"
                        onClick={() => handlePagar(reserva)}
                      >
                        Pagar
                      </button>
                      <button
                        className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => handleEliminar(reserva.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer /> {/* Agregar Footer */}
    </>
  );
};

export default HistorialReservas;
