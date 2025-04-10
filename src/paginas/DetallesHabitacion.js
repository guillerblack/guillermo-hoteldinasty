import React, { useContext } from "react";
import { useParams } from "react-router-dom";
// Componentes
import FormularioHabitacionReservada from "../componentes/FormularioHabitacionReservada";
import Header from "../componentes/Header"; // Importar Header
import Footer from "../componentes/Footer"; // Importar Footer
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
// Iconos
import { FaCheck } from "react-icons/fa";

const DetallesHabitacion = () => {
  const { habitaciones } = useContext(ContextoHabitacion);
  const { id } = useParams();

  // Obtener la habitación
  const habitacion = habitaciones.find((habitacion) => {
    return habitacion.id === Number(id);
  });

  if (!habitacion) {
    return <p>Habitación no encontrada.</p>;
  }

  const { nombre, descripcion, facilities, imageLg, valor } = habitacion;

  return (
    <>
      <Header /> {/* Agregar Header */}
      <section>
        {/* Banner */}
        <div className="bg-room bg-cover bg-center h-[560px] relative flex justify-center items-center">
          {/* Overlay */}
          <div className="absolute w-full h-full bg-black/70"></div>
          {/* Título */}
          <h1 className="text-6xl text-white z-20 font-primary text-center">
            Detalles & Información {nombre}
          </h1>
        </div>
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row h-full py-24 ">
            {/* Izquierda */}
            <div className="w-full h-full lg:w-[60%] px-6 ">
              <h2 className="h2">{nombre}</h2>
              <p>{descripcion}</p>
              <img className="mb-8" src={imageLg} alt="" />
              {/* Instalaciones */}
              <div className="mt-12">
                <h3 className="h3 mb-3">Instalaciones de la habitación</h3>
                <p className="mb-12">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  placeat eos sed voluptas unde veniam eligendi a. Quaerat
                  molestiae hic omnis temporibus quos consequuntur nam
                  voluptatum ea accusamus, corrupti nostrum eum placeat
                  quibusdam quis beatae quae labore earum architecto algo
                  debitis.
                </p>
                {/* Grid */}
                <div className="grid grid-cols-3 gap-6 mb-12">
                  {facilities.map((item, index) => {
                    const { name, icon } = item;
                    return (
                      <div
                        className="flex items-center gap-x-3 flex-1"
                        key={index}
                      >
                        <div className="text-3xl text-accent">{icon}</div>
                        <div className="text-base">{name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* Derecha */}
            <div className="w-full h-full lg:w-[40%] ">
              {/* Formulario de habitación reservada */}
              <FormularioHabitacionReservada
                habitacionId={habitacion.id}
                valorHabitacion={habitacion.valor}
                nombreHabitacion={habitacion.nombre}
              />

              {/* Normas */}
              <div>
                <h3 className="h3">Normas del hotel</h3>
                <p className="mb-6">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  placeat eos sed voluptas unde veniam eligendi quis beatae quae
                  labore earum architecto.
                </p>
                <ul className="flex flex-col gap-y-4">
                  <li className="flex items-center gap-x-4">
                    <FaCheck className="text-accent" />
                    Check-in: 8:00 AM - 6:00 PM
                  </li>
                  <li className="flex items-center gap-x-4">
                    <FaCheck className="text-accent" />
                    Check-out: 7:30 AM - 10:00 PM
                  </li>
                  <li className="flex items-center gap-x-4">
                    <FaCheck className="text-accent" />
                    No se permiten mascotas
                  </li>
                  <li className="flex items-center gap-x-4">
                    <FaCheck className="text-accent" />
                    Prohibido fumar
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer /> {/* Agregar Footer */}
    </>
  );
};

export default DetallesHabitacion;
