import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../componentes/Footer"; // Importar Footer
import Header from "../componentes/Header";

const SPA = () => {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/servicios");
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
      {/* Imagen estática con el mismo tamaño del HeroSlider */}
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://d2e5ushqwiltxm.cloudfront.net/wp-content/uploads/sites/90/2023/07/31085507/DSC_7463-Edit-1170x780.jpg)`,
        }}
      >
        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        {/* Texto superpuesto */}
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
            Bienvenido al SPA & Bienestar
          </h1>
        </div>
      </div>
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-accent">SPA & Bienestar</h1>
        <p className="text-gray-600 mb-6">
          Relájate y disfruta de una experiencia única en nuestro SPA. Ofrecemos
          servicios de masajes, tratamientos faciales, sauna y mucho más para
          garantizar tu bienestar.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-accent mb-2">Masajes</h2>
            <p className="text-gray-600">
              Relájate con nuestros masajes terapéuticos y de relajación.
            </p>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-accent mb-2">
              Tratamientos Faciales
            </h2>
            <p className="text-gray-600">
              Rejuvenece tu piel con nuestros tratamientos personalizados.
            </p>
          </div>
          <div className="p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold text-accent mb-2">Sauna</h2>
            <p className="text-gray-600">
              Disfruta de un momento de relajación en nuestro sauna privado.
            </p>
          </div>
        </div>
      </div>
      <Footer /> {/* Agregar Footer */}
    </>
  );
};

export default SPA;
