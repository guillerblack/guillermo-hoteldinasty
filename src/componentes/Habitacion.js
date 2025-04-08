import React from "react";
//link
import { Link } from "react-router-dom";
//iconos
import { BsPeople, BsArrowsFullscreen } from "react-icons/bs";
const Habitacion = ({ habitacion }) => {
  //destructrutura habitacion
  const { id, nombre, image, tamaño, maxPersonas, descripcion, valor } =
    habitacion;
  return (
    <div className="bg-white shadow-2xl min-h-[500px] group">
      {/*img */}
      <div className="overflow-hidden">
        <img
          className="group-hover:scale-110 transition-all duration-300 w-full"
          src={image}
          alt=""
        />
      </div>
      {/*detalles*/}
      <div
        className="bg-white shadow-lg max-w-[300px] mx-auto h-[60px]
      -translate-y-1/2 flex justify-center items-center uppercase 
      font-tertiary tracking-[1px] font-semibold text-[16px-base]"
      >
        <div className="flex justify-between w-[80%]">
          {/*tamaño */}
          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsArrowsFullscreen className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>ANCHO</div>
              <div>{tamaño}m2</div>
            </div>
          </div>

          {/*capacida habitacion */}

          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsPeople className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Max Personas</div>
              <div>{maxPersonas}</div>
            </div>
          </div>
        </div>
      </div>
      {/*name & descripcion*/}
      <div className="text-center">
        <Link to={`/habitacion/${id}`}>
          <h3 className="h3">{nombre}</h3>
        </Link>
        <p className="max-w-[300px] mx-auto mb-3 lg:mb-6">
          {descripcion
            ? descripcion.slice(0, 56) + "..."
            : "Descripción no disponible"}
        </p>
      </div>
      {/*btn*/}
      <Link
        to={`/habitacion/${id}`}
        className=" btn btn-secondary btn-sm max-w-[240px] mx-auto"
      >
        Reserva desde ${valor}
      </Link>
    </div>
  );
};

export default Habitacion;
