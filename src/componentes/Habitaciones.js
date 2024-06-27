import React, { useContext } from "react";
// Contexto
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
// Componentes
import Habitacion from "../componentes/Habitacion";

const Habitaciones = () => {
  const { habitaciones } = useContext(ContextoHabitacion);

  return (
    <section className="py-24">
      <div className="container mx-auto lg:px-0">
        {/* Grid de habitaciones */}
        <div className="grid grid-cols-1 max-w-sm mx-auto gap-[30px] lg:grid-cols-3 lg:max-w-none lg:mx-0">
          {habitaciones.map((habitacion) => (
            <Habitacion habitacion={habitacion} key={habitacion.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Habitaciones;
