import React, { useContext, useState, useEffect } from "react";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const FormularioHabitacionReserva = ({
  habitacionId,
  valorHabitacion,
  nombreHabitacion,
}) => {
  const { fechaInicio, fechaFin, adultos, niños } =
    useContext(ContextoHabitacion);
  const [valor, setValor] = useState(valorHabitacion);
  const [user, setUser] = useState(null);
  const [totalDias, setTotalDias] = useState(0);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState(null);
  const navigate = useNavigate();

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await api.get("/api/auth/profile");
          setUser(response.data);
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      };
      fetchUser();
    }
  }, []);

  // Calcular el total de días entre check-in y check-out
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const diffTime = Math.abs(fechaFin - fechaInicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDias(diffDays > 0 ? diffDays : 1);
    }
  }, [fechaInicio, fechaFin]);

  // Usar la habitación actual en lugar de buscar una nueva
  useEffect(() => {
    if (habitacionId && nombreHabitacion && valorHabitacion) {
      setHabitacionSeleccionada({
        id: habitacionId,
        nombre: nombreHabitacion,
        valor: valorHabitacion,
        capacidad: adultos + niños
      });
      
      // Actualizar el valor total según los días
      if (totalDias > 0) {
        setValor(valorHabitacion * totalDias);
      }
    } else {
      // Si no hay habitación preseleccionada, intentar obtenerla del backend
      const fetchHabitaciones = async () => {
        try {
          const response = await api.get("/api/rooms");
          if (response.data && response.data.rooms && response.data.rooms.length > 0) {
            const totalPersonas = adultos + niños;
            const habitacionAdecuada = response.data.rooms.find(
              (hab) => hab.maxPersonas >= totalPersonas
            );

            if (habitacionAdecuada) {
              setHabitacionSeleccionada({
                id: habitacionAdecuada.id,
                nombre: habitacionAdecuada.nombre || habitacionAdecuada.name,
                valor: habitacionAdecuada.precio || habitacionAdecuada.price,
                capacidad: habitacionAdecuada.maxPersonas
              });
              
              if (totalDias > 0) {
                setValor((habitacionAdecuada.precio || habitacionAdecuada.price) * totalDias);
              }
            }
          } else {
            // Usar datos de ejemplo si no hay datos del backend
            setHabitacionSeleccionada({
              id: 1,
              nombre: "Habitación Estándar",
              valor: 100,
              capacidad: 2
            });
            setValor(100 * (totalDias > 0 ? totalDias : 1));
          }
        } catch (error) {
          console.error("Error al obtener habitaciones:", error);
          // Usar datos de ejemplo en caso de error
          setHabitacionSeleccionada({
            id: 1,
            nombre: "Habitación Estándar",
            valor: 100,
            capacidad: 2
          });
          setValor(100 * (totalDias > 0 ? totalDias : 1));
        }
      };
      
      fetchHabitaciones();
    }
  }, [habitacionId, nombreHabitacion, valorHabitacion, adultos, niños, totalDias]);

  // Manejar la reserva
  const handleReserva = async () => {
    if (!user) {
      alert("Por favor, inicia sesión para realizar una reserva.");
      navigate("/login");
      return;
    }

    if (!fechaInicio || !fechaFin || !habitacionSeleccionada) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      const reserva = {
        roomId: habitacionSeleccionada.id,
        checkInDate: fechaInicio.toISOString().split('T')[0],
        checkOutDate: fechaFin.toISOString().split('T')[0],
        numAdults: adultos,
        numChildren: niños,
        totalPrice: valor
      };

      await api.post("/api/bookings", reserva);
      alert("Reserva realizada con éxito.");
      navigate("/historial-reservas");
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert(
        "Hubo un problema al realizar la reserva. Por favor, intenta de nuevo más tarde."
      );
    }
  };

  return (
    <div className="py-8 px-6 bg-accent/20 mb-12">
      <div className="flex flex-col space-y-4 mb-4">
        <h3 className="text-xl font-semibold">Tu reserva</h3>
        <div className="h-[60px]">
          <CheckIn />
        </div>
        <div className="h-[60px]">
          <CheckOut />
        </div>
        <div className="h-[60px]">
          <AdultsDropdown />
        </div>
        <div className="h-[60px]">
          <KidsDropdown />
        </div>
      </div>
      {habitacionSeleccionada && (
        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h4 className="font-bold">Habitación Seleccionada:</h4>
          <p>Nombre: {habitacionSeleccionada.nombre}</p>
          <p>Capacidad: {habitacionSeleccionada.capacidad} personas</p>
          <p>Precio por noche: ${habitacionSeleccionada.valor}</p>
          <p>
            Total por {totalDias} días: ${valor}
          </p>
        </div>
      )}
      <button onClick={handleReserva} className="btn btn-lg btn-primary w-full">
        Reservar ahora por ${valor}
      </button>
    </div>
  );
};

export default FormularioHabitacionReserva;