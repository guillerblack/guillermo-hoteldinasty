import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import api from "../utils/api";
import { FaEdit, FaTrash } from "react-icons/fa";
const Restaurante = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    booking_date: "",
    booking_time: "",
    quantity: 1,
    special_requests: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get("/api/services/category/food");
        setMenuItems(response.data);
      } catch (error) {
        console.error("Error al cargar el menú:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
    
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    setIsLoggedIn(!!token);
    setIsAdmin(userRole === "admin");
  }, []);

  const handleNewMenuItemChange = (e) => {
    const { name, value } = e.target;
    setNewMenuItem({
      ...newMenuItem,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      
      // Crear un objeto FormData para enviar la imagen
      const formData = new FormData();
      formData.append("name", newMenuItem.name);
      formData.append("description", newMenuItem.description);
      formData.append("price", parseFloat(newMenuItem.price));
      formData.append("category", "food");
      
      // Si hay una imagen seleccionada, agregarla al FormData
      if (selectedImage) {
        formData.append("image", selectedImage);
        console.log("Imagen seleccionada:", selectedImage.name);
      }
      
      // Log para depuración
      console.log("Datos a enviar:", {
        name: newMenuItem.name,
        description: newMenuItem.description,
        price: parseFloat(newMenuItem.price),
        category: "food",
        id: newMenuItem.id
      });
      
      let response;
      
      if (newMenuItem.id) {
        // Edición
        console.log(`Editando plato con ID: ${newMenuItem.id}`);
        response = await api.put(
          `/api/services/${newMenuItem.id}`,
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            },
            timeout: 10000 // Timeout de 10 segundos
          }
        );
        console.log("Respuesta de edición:", response.data);
        alert("Plato editado con éxito");
      } else {
        // Creación
        console.log("Creando nuevo plato");
        response = await api.post(
          "/api/services",
          formData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data"
            },
            timeout: 10000 // Timeout de 10 segundos
          }
        );
        console.log("Respuesta de creación:", response.data);
        alert("Plato agregado con éxito");
      }
      
      // Limpiar el formulario
      setNewMenuItem({
        name: "",
        description: "",
        price: "",
        id: undefined,
      });
      setSelectedImage(null);
      setPreviewImage("");
      setShowAddForm(false);
      
      // Recargar menú
      const menuResponse = await api.get("/api/services/category/food");
      setMenuItems(menuResponse.data);
    } catch (error) {
      console.error("Error completo:", error);
      
      // Mostrar información más detallada del error
      if (error.response) {
        console.error("Datos de respuesta:", error.response.data);
        console.error("Estado HTTP:", error.response.status);
        alert(`Error del servidor (${error.response.status}): ${error.response.data.message || 'Error desconocido'}`);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor");
        alert("No se pudo conectar con el servidor. Verifica tu conexión.");
      } else {
        console.error("Error de configuración:", error.message);
        alert(`Error al procesar la solicitud: ${error.message}`);
      }
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
      alert("Por favor, selecciona un plato del menú");
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

  const handleEditMenuItem = (item) => {
    setShowAddForm(true);
    setNewMenuItem({
      name: item.name,
      description: item.description,
      price: item.price,
      id: item.id, // Guardar el id para saber que es edición
    });
    setPreviewImage(item.image_url);
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este plato?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Plato eliminado con éxito");
      
      // Recargar menú
      const response = await api.get("/api/services/category/food");
      setMenuItems(response.data);
    } catch (error) {
      console.error("Error al eliminar plato:", error);
      alert("No se pudo eliminar el plato. Intenta de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando menú del restaurante...</p>
      </div>
    );
  }
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
      
      {/* Hero Section */}
      <div
        className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1920&q=80)`,
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
        <div className="absolute w-full h-full flex justify-center items-center">
          <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
            Nuestro Restaurante
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-accent">Menú del Restaurante</h1>
          
          {/* Botón para agregar plato (solo visible para administradores) */}
          {isAdmin && (
            <button
              onClick={() => {
                // Si estamos cerrando el formulario, simplemente cambiamos el estado
                if (showAddForm) {
                  setShowAddForm(false);
                } else {
                  // Si estamos abriendo el formulario, limpiamos los datos
                  setShowAddForm(true);
                  setNewMenuItem({
                    name: "",
                    description: "",
                    price: "",
                    id: undefined
                  });
                  setSelectedImage(null);
                  setPreviewImage("");
                }
              }}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              {showAddForm ? "Cancelar" : "Agregar Plato"}
            </button>
          )}
        </div>
        
        {/* Formulario para agregar plato (solo visible para administradores) */}
        {isAdmin && showAddForm && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {newMenuItem.id ? "Editar Plato" : "Agregar Nuevo Plato"}
            </h2>
          
            <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre del plato:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newMenuItem.name}
                  onChange={handleNewMenuItemChange}
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
                  value={newMenuItem.price}
                  onChange={handleNewMenuItemChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Imagen:
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  accept="image/*"
                />
                {previewImage && (
                  <div className="mt-2">
                    <img 
                      src={previewImage} 
                      alt="Vista previa" 
                      className="w-full h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción:
                </label>
                <textarea
                  name="description"
                  value={newMenuItem.description}
                  onChange={handleNewMenuItemChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  rows="3"
                ></textarea>
              </div>
              
              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
                >
                  {newMenuItem.id ? "Guardar Cambios" : "Guardar Plato"}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <p className="text-gray-600 mb-6">
          Disfruta de una experiencia gastronómica única en nuestro restaurante. Ofrecemos
          platos exquisitos preparados con los mejores ingredientes por nuestros chefs expertos.
        </p>
        
        {/* Mostrar platos del menú dinámicamente */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
  {menuItems.length > 0 ? ( 
    menuItems.map((item) => ( 
      <div key={item.id} className="p-4 bg-white shadow-lg rounded-lg relative"> 
        <img  
         src={getFullImageUrl(item.image_url)}
         alt={item.name}
          className="w-full h-48 object-cover mb-4 rounded" 
        /> 
        <h2 className="text-xl font-bold text-accent mb-2">{item.name}</h2> 
        <p className="text-gray-600 mb-2">{item.description}</p> 
        <div className="flex justify-between items-center"> 
          <span className="text-accent font-bold">${item.price.toFixed(2)}</span> 
        </div> 
        <button  
          onClick={() => handleSelectItem(item)} 
          className="mt-4 inline-block bg-accent text-white px-4 py-2 rounded hover:bg-opacity-80 transition w-full" 
        > 
          Reservar 
        </button> 
        {isAdmin && ( 
          <div className="absolute top-2 right-2 flex space-x-2"> 
            <button 
              onClick={() => handleEditMenuItem(item)} 
              className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 text-white flex items-center justify-center shadow-md" 
              title="Editar"
            > 
              <FaEdit /> 
            </button> 
            <button 
              onClick={() => handleDeleteMenuItem(item.id)} 
              className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md" 
              title="Eliminar"
            > 
              <FaTrash /> 
            </button> 
          </div> 
        )} 
      </div> 
    )) 
  ) : ( 
    <div className="col-span-3 text-center py-8"> 
      <p className="text-gray-500">No hay platos disponibles en este momento.</p> 
    </div> 
  )} 
</div>

        {/* Formulario de reserva */}
        <div id="booking-form" className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Reservar Plato</h2>
          
          {!isLoggedIn ? (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
              <p>Debes <a href="/login" className="font-bold underline">iniciar sesión</a> para reservar platos.</p>
            </div>
          ) : null}
          
          {selectedItem ? (
            <div className="bg-gray-100 p-4 rounded-lg mb-6 relative">
              <h3 className="font-bold text-lg">Plato seleccionado:</h3>
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
              <p>Por favor, selecciona un plato del menú para continuar.</p>
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
                min="08:00"
                max="22:00"
              />
              <p className="text-xs text-gray-500 mt-1">Horario disponible: 8:00 AM - 10:00 PM</p>
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
                placeholder="Alergias, preferencias, etc."
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

        {/* Información adicional */}
        <div className="bg-gray-100 py-12 mt-12 rounded-lg">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Información del Restaurante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Horario de Atención</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between"><span>Lunes - Jueves:</span><span>8:00 AM - 10:00 PM</span></li>
                  <li className="flex justify-between"><span>Viernes - Sábado:</span><span>8:00 AM - 11:00 PM</span></li>
                  <li className="flex justify-between"><span>Domingo:</span><span>9:00 AM - 9:00 PM</span></li>
                </ul>

                <h3 className="text-xl font-bold mt-8 mb-4">Contacto</h3>
                <p>Para reservas grandes o eventos especiales, contáctenos directamente:</p>
                <p className="mt-2"><strong>Teléfono:</strong> +34 123 456 789</p>
                <p><strong>Email:</strong> restaurante@hoteldinasty.com</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Sobre Nuestro Restaurante</h3>
                <p className="text-gray-700 mb-4">
                  Nuestro restaurante ofrece una experiencia gastronómica única, combinando sabores tradicionales con técnicas modernas.
                </p>
                <p className="text-gray-700 mb-4">
                  Nuestro chef ejecutivo, con más de 20 años de experiencia, ha diseñado un menú que satisface los paladares más exigentes.
                </p>
                <p className="text-gray-700">
                  El ambiente elegante y acogedor es perfecto para cenas románticas, reuniones familiares o comidas de negocios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Restaurante;