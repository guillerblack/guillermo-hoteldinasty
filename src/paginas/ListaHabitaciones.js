import React, { useEffect, useState } from "react";
import { fetchHabitaciones } from "../utils/firestore";
import Footer from "../componentes/Footer";
import Header from "../componentes/Header";

const ListaHabitaciones = () => {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerHabitaciones = async () => {
      try {
        const data = await fetchHabitaciones();
        setHabitaciones(data);
      } catch (error) {
        console.error("Error al obtener las habitaciones:", error);
      } finally {
        setLoading(false);
      }
    };

    obtenerHabitaciones();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Cargando habitaciones...</p>;
  }

  return (
    <>
      <Header />
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1600585154340-be6161c2a7a6?auto=format&fit=crop&w=1920&q=80)`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
            Habitaciones Disponibles
          </h1>
        </div>
      </div>

      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold mb-6 text-accent">
          Nuestras Habitaciones
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habitaciones.map((habitacion) => (
            <div
              key={habitacion.id}
              className="p-4 bg-white shadow-lg rounded-lg"
            >
              <img
                src={habitacion.imagen}
                alt={habitacion.nombre}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{habitacion.nombre}</h2>
              <p className="text-gray-700 mb-2">{habitacion.descripcion}</p>
              <p className="text-gray-900 font-bold mb-4">
                Precio: ${habitacion.precio} por noche
              </p>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ListaHabitaciones;
