// paginas/PaginaReserva.js

import React from "react";
import FormularioHabitacionReservada from "../componentes/FormularioHabitacionReservada";

// Simulación de habitación para prueba (puedes conectarlo con props o contexto real luego)
const habitacionEjemplo = {
  id: 3,
  nombre: "Suite Familiar",
  valor: 180000,
};

const PaginaReserva = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Reservar Habitación</h1>
      <FormularioHabitacionReservada
        habitacionId={habitacionEjemplo.id}
        valorHabitacion={habitacionEjemplo.valor}
        nombreHabitacion={habitacionEjemplo.nombre}
      />
    </div>
  );
};

export default PaginaReserva;
