import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { signOut, onAuthStateChanged } from "firebase/auth"; // Importar Firebase Auth
import { auth } from "../utils/firebase"; // Importar configuración de Firebase
import logoWhite from "../assets/img/logo-white.svg";
import logoDark from "../assets/img/logo-dark.svg";

const Header = () => {
  const [header, setHeader] = useState(false);
  const navigate = useNavigate(); // Hook para navegación
  const [user, setUser] = useState(null); // Estado para el usuario autenticado

  useEffect(() => {
    // Monitorear el estado de autenticación
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Actualiza el estado del usuario
    });
    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setHeader(true) : setHeader(false);
    });
  }, []);

  const handleHabitacionesClick = () => {
    navigate("/"); // Navegar a la página de inicio
    setTimeout(() => {
      const formulario = document.getElementById("formulario-reserva");
      if (formulario) {
        formulario.scrollIntoView({ behavior: "smooth" }); // Desplazarse al formulario
      }
    }, 100); // Esperar un momento para asegurar que la página cargue
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cerrar sesión en Firebase
      alert("Sesión cerrada con éxito.");
      setUser(null); // Limpia el estado del usuario
      navigate("/"); // Redirigir a la página de inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header
      className={`${
        header ? "bg-white py-6 shadow-lg" : "bg-transparent py-8"
      } fixed z-50 w-full transition-all duration-500`}
    >
      <div className="container mx-auto flex flex-col items-center gap-y-6 lg:flex-row lg:justify-between lg:gap-y-0">
        {/* Logo */}
        <a href="/">
          {header ? (
            <img className="w-[160px]" src={logoDark} alt="Logo oscuro" />
          ) : (
            <img className="w-[160px]" src={logoWhite} alt="Logo blanco" />
          )}
        </a>
        {/* Navegación */}
        <nav
          className={`${
            header ? "text-primary" : "text-white"
          } flex gap-x-4 font-tertiary tracking-[3px] text-[15px] items-center uppercase lg:gap-x-8`}
        >
          <a href="/" className="hover:text-accent transition">
            Inicio
          </a>
          <button
            onClick={handleHabitacionesClick}
            className="hover:text-accent transition"
          >
            HABITACIONES
          </button>
          <a href="/restaurante" className="hover:text-accent transition">
            Restaurante
          </a>
          <a href="/spa" className="hover:text-accent transition">
            Spa
          </a>
          <a href="#contacto" className="hover:text-accent transition">
            Contacto
          </a>
          {/* Botón de Login o Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
            >
              Cerrar sesión
            </button>
          ) : (
            <a
              href="/login"
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-80 transition-all"
            >
              Login
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
