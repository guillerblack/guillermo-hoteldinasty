// paginas/HistorialReservas.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const HistorialReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [usuario, setUsuario] = useState({ nombre: "", correo: "" });

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = localStorage.getItem("token");

        const responseUser = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(responseUser.data);

        const responseReservas = await axios.get(
          "http://localhost:8000/api/mis-reservas",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setReservas(responseReservas.data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
    };

    fetchReservas();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta reserva?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/reservas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setReservas(reservas.filter((reserva) => reserva.id !== id));
      alert("Reserva eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar reserva:", error);
    }
  };

  const handlePagar = (reserva) => {
    alert(`Simulando pago de $${reserva.valor}`);
    // Aquí podrías redirigir a una pasarela o marcar como "pagado"
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Historial de Reservas</h1>
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
                  <td className="p-2">{reserva.habitacion_nombre}</td>
                  <td className="p-2">{reserva.check_in}</td>
                  <td className="p-2">{reserva.check_out}</td>
                  <td className="p-2">{reserva.adultos + reserva.niños}</td>
                  <td className="p-2">${reserva.valor}</td>
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
                    {/* Aquí podrías agregar otro botón para editar la fecha */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HistorialReservas;
