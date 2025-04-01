import React from "react";
//componentes
import Habitaciones from "../componentes/Habitaciones";
import FormularioReserva from "../componentes/FormularioReserva";
import HeroSlider from "../componentes/HeroSlider";
const Inicio = () => {
  return (
    <>
      <HeroSlider />.
      <div className="container mx-auto relative">
        <div
          className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute 
          lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12"
        >
          <FormularioReserva />
        </div>
      </div>
      <Habitaciones />
    </>
  );
};

export default Inicio;
