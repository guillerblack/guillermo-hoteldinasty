import React, { useContext, useState, useEffect } from "react";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import { auth } from "../utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
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

  // Monitorear el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          nombre: currentUser.displayName || "Usuario",
          correo: currentUser.email,
        });
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Calcular el total de días entre check-in y check-out
  useEffect(() => {
    if (fechaInicio && fechaFin) {
      const diffTime = Math.abs(fechaFin - fechaInicio);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDias(diffDays);
    }
  }, [fechaInicio, fechaFin]);

  // Seleccionar automáticamente una habitación según el número de personas
  useEffect(() => {
    const totalPersonas = adultos + niños;
    if (totalPersonas > 0) {
      const fetchHabitaciones = async () => {
        try {
          const response = await axios.get(
            "http://127.0.0.1:8000/api/habitaciones"
          );
          const habitaciones = response.data;
          const habitacionAdecuada = habitaciones.find(
            (hab) => hab.capacidad >= totalPersonas
          );
          if (habitacionAdecuada) {
            setHabitacionSeleccionada(habitacionAdecuada);
            setValor(habitacionAdecuada.valor * totalDias);
          } else {
            alert(
              "No hay habitaciones disponibles para esta cantidad de personas."
            );
          }
        } catch (error) {
          console.error("Error al obtener habitaciones:", error);
        }
      };
      fetchHabitaciones();
    }
  }, [adultos, niños, totalDias]);

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
        nombreUsuario: user.nombre,
        correoUsuario: user.correo,
        checkIn: fechaInicio,
        checkOut: fechaFin,
        habitacionId: habitacionSeleccionada.id,
        nombreHabitacion: habitacionSeleccionada.nombre,
        valorHabitacion: habitacionSeleccionada.valor,
        totalPersonas: adultos + niños,
        totalDias,
      };

      await axios.post("http://127.0.0.1:8000/api/reservas", reserva);
      alert("Reserva realizada con éxito.");
      navigate("/historial-reservas");
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
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
