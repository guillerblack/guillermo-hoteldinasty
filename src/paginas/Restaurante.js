import React, { useEffect, useState } from "react";
import api from "../utils/api"; // Importar la instancia de Axios
import Footer from "../componentes/Footer"; // Importar Footer
import Header from "../componentes/Header"; // Importar Header

const Restaurante = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await api.get("/servicios"); // Usar api.get
        setServicios(response.data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServicios();
  }, []);

  return (
    <>
      <Header /> {/* Agregar Header */}
      {/* Imagen estática con el mismo estilo del HeroSlider */}
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://www.dishmiami.com/wp-content/uploads/2020/11/milarestaurants_123884480_666408660744937_7484582519028930626_n.jpg)`,
        }}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        {/* Texto superpuesto */}
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
            Bienvenido al Restaurante Gourmet
          </h1>
        </div>
      </div>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-accent">
          Restaurante Gourmet
        </h1>
        <p className="text-gray-600 mb-6">
          Descubre una experiencia culinaria única en nuestro restaurante.
          Ofrecemos una amplia variedad de platos internacionales y locales
          preparados con ingredientes frescos y de alta calidad.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-accent mb-2">Desayunos</h2>
            <p className="text-gray-600">
              Comienza tu día con nuestros deliciosos desayunos buffet.
            </p>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-accent mb-2">Almuerzos</h2>
            <p className="text-gray-600">
              Disfruta de una selección de platos principales y acompañamientos.
            </p>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-accent mb-2">Cenas</h2>
            <p className="text-gray-600">
              Vive una experiencia gastronómica inolvidable con nuestras cenas
              gourmet.
            </p>
          </div>
        </div>
      </div>
      <Footer /> {/* Agregar Footer */}
    </>
  );
};

export default Restaurante;
