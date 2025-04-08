import React, { useState } from "react";
import axios from "axios"; // Importar axios
import LogoWhite from "../assets/img/logo-white.svg";

const Footer = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContacto = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/contacto", formData);
      alert("Mensaje enviado con éxito.");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert("Error al enviar el mensaje.");
    }
  };

  return (
    <footer id="contacto" className="bg-gray-800 text-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start">
        {/* Logo e información */}
        <div className="text-center md:text-left mb-4 md:mb-0 w-full md:w-1/3">
          <a href="/">
            <img src={LogoWhite} alt="Logo" className="h-60 mb-4" />
          </a>
          <p>2024 Proyecto SENA ADSO Ficha: 2675857.</p>
        </div>

        {/* Formulario de contacto */}
        <div className="w-full md:w-1/3 text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-xl font-bold mb-2">Contacto</h2>
          <form onSubmit={handleContacto}>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-black"
            />
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-black"
            />
            <textarea
              name="mensaje"
              placeholder="Mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              className="w-full mb-2 p-2 rounded text-black"
            />
            <button
              type="submit"
              className="w-full py-2 bg-accent text-white rounded hover:bg-accent-hover"
            >
              Enviar
            </button>
          </form>
        </div>

        {/* Mapa */}
        <div className="w-full md:w-1/3 h-64 ml-4">
          <h2 className="text-xl font-bold mb-2">Ubicación</h2>
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509374!2d-122.419415484681!3d37.77492977975954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f0b1b1b1%3A0x1b1b1b1b1b1b!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1610000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg shadow-lg"
          ></iframe>
        </div>
      </div>

      <div className="container mx-auto text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm">
          &copy; 2024 Hotel Dinasty. Todos los derechos reservados.
        </p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/terminos" className="hover:underline">
            Términos y condiciones
          </a>
          <a href="/politica-privacidad" className="hover:underline">
            Política de privacidad
          </a>
          <a href="/faq" className="hover:underline">
            Preguntas frecuentes
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
