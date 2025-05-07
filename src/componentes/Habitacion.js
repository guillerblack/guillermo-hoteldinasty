import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import { BsArrowsFullscreen, BsPeople } from "react-icons/bs"; // Add this import
import PropTypes from 'prop-types';

const Habitacion = ({
  habitacion,
  isAdmin,
  onDelete,
  onEdit
}) => {
  if (!habitacion) {
    return <div className="bg-white shadow-2xl min-h-[500px] group">Error: No se recibió la información de la habitación</div>;
  }

  const {
    id = 0,
    nombre = 'Nombre no disponible',
    image = '/img/default-room.jpg',
    tamaño = 0,
    maxPersonas = 0,
    descripcion = 'Descripción no disponible',
    valor = 0
  } = habitacion;

  // Agregar log para depuración
  console.log("Datos de habitación:", { id, nombre, image, tamaño, maxPersonas, valor });
  
  const baseUrl = 'http://localhost:5000';
  let imageUrl;
  
  try {
    if (!image || image === 'null') {
      // Usar una imagen por defecto desde el backend
      imageUrl = `${baseUrl}/img/default-room.jpg`;
    } else if (image.startsWith('http')) {
      imageUrl = image;
    } else {
      // Asegurarse de que la ruta comience con /
      imageUrl = `${baseUrl}${image.startsWith('/') ? image : `/${image}`}`;
    }
    
    console.log("URL de imagen final:", imageUrl);
  } catch (error) {
    console.error("Error al procesar la URL de la imagen:", error);
    imageUrl = `${baseUrl}/img/default-room.jpg`;
  }

  const valorNumerico = Number(valor);

  return (
    <div className="bg-white shadow-2xl min-h-[500px] group relative">
      {/* Botones de acción para administradores (ahora en la esquina superior derecha) */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex space-x-2 z-10">
          <button
            onClick={() => onEdit(habitacion)}
            className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center shadow-md"
            title="Editar"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => onDelete(habitacion.id)}
            className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md"
            title="Eliminar"
          >
            <FaTrash size={20} />
          </button>
        </div>
      )}
      
      {/* Imagen */}
      <div className="overflow-hidden h-[300px]">
        <img 
          src={imageUrl}
          alt={nombre || "Habitación"} 
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          onError={(e) => {
            console.log("Error al cargar imagen:", image);
            e.target.onerror = null;
            // Usar una imagen por defecto desde el backend
            e.target.src = `${baseUrl}/img/default-room.jpg`;
          }}
        />
      </div>
      {/* Detalles */}
      <div className="bg-white shadow-lg max-w-[300px] mx-auto h-[60px] -translate-y-1/2 flex justify-center items-center uppercase font-tertiary tracking-[1px] font-semibold text-[16px-base]">
        <div className="flex justify-between w-[80%]">
          {/* Tamaño */}
          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsArrowsFullscreen className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>ANCHO</div>
              <div>{tamaño || 'N/A'}m2</div>
            </div>
          </div>
          {/* Capacidad */}
          <div className="flex items-center gap-x-2">
            <div className="text-accent">
              <BsPeople className="text-[15px]" />
            </div>
            <div className="flex gap-x-1">
              <div>Max Personas</div>
              <div>{maxPersonas || 'N/A'}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Nombre y descripción */}
      <div className="text-center">
        <Link to={`/habitacion/${id}`}>
          <h3 className="h3">{nombre || 'Nombre no disponible'}</h3>
        </Link>
        <p className="max-w-[300px] mx-auto mb-3 lg:mb-6">
          {descripcion
            ? descripcion.slice(0, 56) + "..."
            : "Descripción no disponible"}
        </p>
      </div>
      {/* Botón de reserva */}
      <div className="gap-y-3" >
        <Link
          to={`/habitacion/${id}`}
          className="btn btn-secondary btn-sm max-w-[240px] mx-auto"
        >
          Reserva desde ${valorNumerico || 'N/A'}
        </Link>
      </div>
    </div>
  );
};
Habitacion.propTypes = {
  habitacion: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    image: PropTypes.string,
    tamaño: PropTypes.number,
    maxPersonas: PropTypes.number,
    descripcion: PropTypes.string,
    valor: PropTypes.number
  }).isRequired,
  isAdmin: PropTypes.bool,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func
};

export default Habitacion;