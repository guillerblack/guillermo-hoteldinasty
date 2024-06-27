import React, { useEffect, useState } from "react";
import logoWhite from "../assets/img/logo-white.svg";
import logoDark from "../assets/img/logo-dark.svg";

const Header = () => {
  const [header, setHeader] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      window.scrollY > 50 ? setHeader(true) : setHeader(false);
    });
  }, []);

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
          <a href="/" className="hover:text-accent transition">
            Habitaciones
          </a>
          <a href="/" className="hover:text-accent transition">
            Restaurante
          </a>
          <a href="/" className="hover:text-accent transition">
            Spa
          </a>
          <a href="/" className="hover:text-accent transition">
            Contacto
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
