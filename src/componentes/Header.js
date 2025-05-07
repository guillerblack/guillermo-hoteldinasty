import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import logoWhite from "../assets/img/logo-white.svg";
import logoDark from "../assets/img/logo-dark.svg";

const Header = () => {
  const [header, setHeader] = useState(false);
  const navigate = useNavigate(); // Hook para navegación
  const [userEmail, setUserEmail] = useState(null); // Estado para el correo del usuario

  useEffect(() => {
    // Escuchar el scroll para cambiar el estilo del header
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setHeader(true) : setHeader(false);
    });

    // Verificar si hay un usuario autenticado
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || null); // Establecer el correo si existe

    return () => {
      window.removeEventListener("scroll", () => {}); // Limpiar el evento
    };
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

  const handleLogout = () => {
    // Cerrar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setUserEmail(null); // Limpiar el correo
    alert("Sesión cerrada con éxito.");
    navigate("/login"); // Redirigir al login
  };

  return (
<header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
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
          {userEmail && localStorage.getItem("userRole") === "admin" ? (
            <>
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
              <a href="/admin/reservas" className="hover:text-accent transition">
                Reservas Admin
              </a>
            </>
          ) : (
            <>
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
              {/* Botón de Reservas */}
              {userEmail && (
                <a href="/historial-reservas" className="hover:text-accent transition">
                  Mis Reservas
                </a>
              )}
            </>
          )}
          {/* Botón de Login o Logout */}
          {userEmail ? (
            <>
              <span className="text-blue-800 font-bold mr-4">
                Hola, <span className="font-normal">{userEmail}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                Cerrar sesión
              </button>
            </>
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
