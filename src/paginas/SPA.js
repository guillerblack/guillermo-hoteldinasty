import React, { useEffect, useState } from "react";
import api from "../utils/api";
import Footer from "../componentes/Footer"; 
import Header from "../componentes/Header";
import { FaEdit, FaTrash } from "react-icons/fa";

const SPA = () => {
  const [servicios, setServicios] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    booking_date: "",
    booking_time: "",
    quantity: 1,
    special_requests: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newServiceForm, setNewServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    image_url: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await api.get("/spa/services");
        setServicios(response.data);
      } catch (error) {
        console.error("Error al cargar servicios:", error);
      }
    };
    fetchServicios();
    
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setIsAdmin(userRole === "admin");
  }, []);

  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewServiceForm({
      ...newServiceForm,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crear una URL para previsualizar la imagen
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append("name", newServiceForm.name);
      formData.append("description", newServiceForm.description);
      formData.append("price", parseFloat(newServiceForm.price));
      formData.append("duration", parseInt(newServiceForm.duration));
      formData.append("category", "spa");
      
      // Si hay un archivo seleccionado, agregarlo al FormData
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (newServiceForm.image_url) {
        // Si no hay archivo pero hay URL, usar la URL
        formData.append("image_url", newServiceForm.image_url);
      }
      
      if (newServiceForm.id) {
        // Edición
        formData.append("id", newServiceForm.id);
        await api.put(
          `/api/services/${newServiceForm.id}`,
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            },
          }
        );
        alert("Servicio editado con éxito");
      } else {
        // Creación
        await api.post(
          "/api/services",
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            },
          }
        );
        alert("Servicio agregado con éxito");
      }
      
      setNewServiceForm({
        name: "",
        description: "",
        price: "",
        duration: "",
        image_url: "",
        id: undefined,
      });
      setImageFile(null);
      setImagePreview(null);
      setShowAddForm(false);
      
      // Recargar servicios
      const response = await api.get("/spa/services");
      setServicios(response.data);
    } catch (error) {
      console.error("Error al agregar/editar servicio:", error);
      alert("No se pudo agregar/editar el servicio. Intenta de nuevo.");
    }
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm({
      ...bookingForm,
      [name]: value,
    });
  };

  const handleBookService = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para reservar servicios");
      return;
    }
    
    if (!selectedItem) {
      alert("Por favor, selecciona un servicio de SPA");
      return;
    }
    
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/service-bookings",
        {
          service_id: selectedItem.id,
          booking_date: bookingForm.booking_date,
          booking_time: bookingForm.booking_time,
          quantity: bookingForm.quantity,
          special_requests: bookingForm.special_requests,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      alert("Reserva realizada con éxito");
      setSelectedItem(null);
      setBookingForm({
        booking_date: "",
        booking_time: "",
        quantity: 1,
        special_requests: "",
      });
    } catch (error) {
      console.error("Error al realizar la reserva:", error);
      alert("No se pudo realizar la reserva. Intenta de nuevo.");
    }
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    // Desplazar a la sección de reserva
    document.getElementById("booking-form").scrollIntoView({ behavior: "smooth" });
  };

  const handleEditService = (servicio) => {
    setShowAddForm(true);
    setNewServiceForm({
      name: servicio.name,
      description: servicio.description,
      price: servicio.price,
      duration: servicio.duration,
      image_url: servicio.image_url,
      id: servicio.id,
    });
    
    // Si hay una imagen existente, mostrarla como preview
    if (servicio.image_url) {
      setImagePreview(servicio.image_url);
    }
  };
  
  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Servicio eliminado con éxito");
      // Recargar servicios
      const response = await api.get("/spa/services");
      setServicios(response.data);
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      alert("No se pudo eliminar el servicio. Intenta de nuevo.");
    }
  };

  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/img/service/default-service.jpg`;
    
    // Si la ruta ya es una URL completa, devolverla
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // Asegurarse de que la ruta comience con /
    if (!imagePath.startsWith('/')) {
      imagePath = '/' + imagePath;
    }
    
    // Devolver la URL completa
    return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
  };

  // Función para manejar errores de carga de imágenes
  const handleImgError = (e) => {
    console.error(`Error al cargar imagen: ${e.target.src}`);
    e.target.src = getFullImageUrl('/img/service/default-service.jpg');
    e.target.onerror = null; // Prevenir bucle infinito
  };
  
  return (
    <>
      <Header />
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-accent">SPA & Bienestar</h1>
          
          {/* Botón para agregar servicio (solo visible para administradores) */}
          {isAdmin && (
            <button
              onClick={() => {
                // Si estamos cerrando el formulario, simplemente cambiamos el estado
                if (showAddForm) {
                  setShowAddForm(false);
                } else {
                  // Si estamos abriendo el formulario, limpiamos los datos
                  setShowAddForm(true);
                  setNewServiceForm({
                    name: "",
                    description: "",
                    price: "",
                    duration: "",
                    image_url: "",
                    id: undefined
                  });
                  setImageFile(null);
                  setImagePreview(null);
                }
              }}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              {showAddForm ? "Cancelar" : "Agregar Servicio"}
            </button>
          )}
        </div>
        
        {/* Formulario para agregar servicio (solo visible para administradores) */}
        {isAdmin && showAddForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {newServiceForm.id ? "Editar Servicio" : "Agregar Nuevo Servicio"}
            </h2>
            <form onSubmit={handleAddService} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre del servicio:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newServiceForm.name}
                  onChange={handleNewServiceChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Precio:
                </label>
                <input
                  type="number"
                  name="price"
                  value={newServiceForm.price}
                  onChange={handleNewServiceChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Duración (minutos):
                </label>
                <input
                  type="number"
                  name="duration"
                  value={newServiceForm.duration}
                  onChange={handleNewServiceChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Imagen:
                </label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      className="h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción:
                </label>
                <textarea
                  name="description"
                  value={newServiceForm.description}
                  onChange={handleNewServiceChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
                >
                  {newServiceForm.id ? "Guardar Cambios" : "Agregar Servicio"}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Lista de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {servicios.map((servicio) => (
    <div
      key={servicio.id}
      className="bg-white shadow-md rounded-lg overflow-hidden relative"
    >
      <div className="relative">
        <img
               src={getFullImageUrl(servicio.image_url)}
               className="w-full h-48 object-cover mb-4 rounded" 
               onError={handleImgError}
             />
        {isAdmin && (
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={() => handleEditService(servicio)}
              className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center shadow-md"
              title="Editar"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDeleteService(servicio.id)}
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md"
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{servicio.name}</h3>
          <div className="text-lg font-bold text-accent">
            ${servicio.price}
          </div>
        </div>
        <p className="text-gray-600 mb-4">{servicio.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Duración: {servicio.duration} min
          </span>
          <button
            onClick={() => handleSelectItem(servicio)}
            className="mt-4 inline-block bg-accent text-white px-4 py-2 rounded hover:bg-opacity-80 transition w-full" 
            > 
            Reservar
          </button>
        </div>
      </div>
    </div>
          ))}
        </div>

        {/* Formulario de reserva */}
        <div id="booking-form" className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Reservar Servicio</h2>
          
          {!isLoggedIn ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
              <p>Debes <a href="/login" className="font-bold underline">iniciar sesión</a> para reservar servicios.</p>
            </div>
          ) : null}
          
          {selectedItem ? (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 relative">
              <h3 className="font-bold text-lg">Servicio seleccionado:</h3>
              <p>{selectedItem.name} - ${selectedItem.price.toFixed(2)}</p>
              <button 
                onClick={() => setSelectedItem(null)} 
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md"
                title="Eliminar selección"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
              <p>Por favor, selecciona un servicio de SPA para continuar.</p>
            </div>
          )}
          
          <form onSubmit={handleBookService} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Fecha de reserva:
              </label>
              <input
                type="date"
                name="booking_date"
                value={bookingForm.booking_date}
                onChange={handleBookingChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Hora de reserva:
              </label>
              <input
                type="time"
                name="booking_time"
                value={bookingForm.booking_time}
                onChange={handleBookingChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Cantidad de personas:
              </label>
              <input
                type="number"
                name="quantity"
                value={bookingForm.quantity}
                onChange={handleBookingChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
                max="10"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Solicitudes especiales:
              </label>
              <textarea
                name="special_requests"
                value={bookingForm.special_requests}
                onChange={handleBookingChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              disabled={!selectedItem || !isLoggedIn}
            >
              Reservar Ahora
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SPA;