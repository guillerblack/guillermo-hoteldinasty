import React from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

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
    title: "Dinasty, tu otro hogar",
    bg: Img3,
    btnText: "Ver nuestras habitaciones",
  },
];

const HeroSlider = () => {
  const navigate = useNavigate();

  const handleHabitacionesClick = () => {
    navigate("/");
    setTimeout(() => {
      const formulario = document.getElementById("formulario-reserva");
      if (formulario) {
        formulario.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Swiper
      modules={[EffectFade, Autoplay]}
      effect="fade"
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      className="heroSlider h-[600px] lg:h-[860px]"
    >
      {slides.map((slide, index) => {
        const { title, bg, btnText } = slide;
        return (
          <SwiperSlide key={index} className="relative h-full">
            {/* Fondo */}
            <div className="absolute top-0 w-full h-full z-0">
              <img className="object-cover w-full h-full" src={bg} alt="" />
            </div>

            {/* Overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-10"></div>

            {/* Contenido centrado */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white text-center px-4">
              <p className="uppercase font-tertiary tracking-[6px] mb-4 text-sm lg:text-base drop-shadow-md">
                Simplemente disfruta y relájate
              </p>
              <h1 className="text-[32px] lg:text-[64px] font-primary uppercase tracking-[2px] leading-tight mb-6 drop-shadow-md max-w-[90%]">
                {title}
              </h1>
              <button
                onClick={handleHabitacionesClick}
                className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/80 transition duration-300"
              >
                {btnText}
              </button>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HeroSlider;
