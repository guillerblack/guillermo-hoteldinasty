import React from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
// Importar componentes de Swiper React
import { Swiper, SwiperSlide } from "swiper/react";
// Importar estilos de Swiper
import "swiper/css";
import "swiper/css/effect-fade";
// Importar módulos requeridos
import { EffectFade, Autoplay } from "swiper";
// Imágenes
import Img1 from "../assets/img/heroSlider/1.jpg";
import Img2 from "../assets/img/heroSlider/2.jpg";
import Img3 from "../assets/img/heroSlider/3.jpg";

const slides = [
  {
    title: "HOTEL DINASTY",
    bg: Img1,
    btnText: "Ver nuestras habitaciones",
  },
  {
    title: "Bienvenido Hotel Dinasty",
    bg: Img2,
    btnText: "Ver nuestras habitaciones",
  },
  {
    title: "dinasty tu otro hogar",
    bg: Img3,
    btnText: "Ver nuestras habitaciones",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate(); // Hook para navegación

  const handleHabitacionesClick = () => {
    navigate("/"); // Navegar a la página de inicio
    setTimeout(() => {
      const formulario = document.getElementById("formulario-reserva");
      if (formulario) {
        formulario.scrollIntoView({ behavior: "smooth" }); // Desplazarse al formulario
      }
    }, 100); // Esperar un momento para asegurar que la página cargue
  };

  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect={"fade"}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="heroSlider h-[600px] lg:h-[860px]"
    >
      {slides.map((slide, index) => {
        // Desestructurar slide
        const { title, bg, btnText } = slide;
        return (
          <SwiperSlide
            className="h-full bg-pink-400 relative flex justify-center items-center"
            key={index}
          >
            <div className="z-20 text-white text-center">
              <div className="uppercase font-tertiary tracking-[6px] mb-5">
                Simplemente disfruta y relájate
              </div>
              <h1 className="text-[32px] font-primary uppercase tracking-[2px] max-w-[920px] lg:text-[68px] leading-tight mb-6">
                {title}
              </h1>
              <button
                onClick={handleHabitacionesClick} // Usar la función para redirigir
                className="btn btn-lg btn-primary mx-auto"
              >
                {btnText}
              </button>
            </div>
            <div className="absolute top-0 w-full h-full">
              <img className="object-cover h-full w-full" src={bg} alt="" />
            </div>
            {/* Overlays */}
            <div className="absolute w-full h-full bg-black/70"></div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HeroSlider;
