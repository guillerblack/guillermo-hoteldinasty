import React from "react";
// Componentes
import Habitaciones from "../componentes/Habitaciones";
import FormularioReserva from "../componentes/FormularioReserva";
import HeroSlider from "../componentes/HeroSlider";
import Header from "../componentes/Header"; // Importar Header
import Footer from "../componentes/Footer"; // Importar Footer

const Inicio = () => {
  return (
    <>
      <Header /> {/* Agregar Header */}
      <HeroSlider />
      <div className="container mx-auto relative">
        <div
          id="formulario-reserva" // Asegúrate de que este identificador esté presente
          className="bg-accent/20 mt-4 p-4 lg:shadow-xl lg:absolute 
          lg:left-0 lg:right-0 lg:p-0 lg:z-30 lg:-top-12"
        >
          <FormularioReserva />
        </div>
      </div>
      <Habitaciones />
      <Footer /> {/* Agregar Footerr */}
    </>
  );
};

export default Inicio;
