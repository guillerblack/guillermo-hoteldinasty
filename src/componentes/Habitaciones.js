import React, { useContext, useState, useEffect } from "react";
// Contexto
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
// Componentes
import Habitacion from "../componentes/Habitacion";
import api from "../utils/api";
import { toast } from "react-toastify"; // Importación de toast
import axios from "axios"; // Importar axios para FormData

const Habitaciones = () => {
  const { habitaciones, setHabitaciones, loading, error } = useContext(ContextoHabitacion);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabitacion, setNewHabitacion] = useState({
    nombre: "",
    descripcion: "",
    tamano: "",
    maxPersonas: "",
    valor: "",
    imageFile: null, // Cambia image por imageFile
  });
  const [localLoading, setLocalLoading] = useState(false);
  const [editHabitacion, setEditHabitacion] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    tamano: "",
    maxPersonas: "",
    valor: "",
    image: "",
    imageFile: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setIsAdmin(userRole === "admin");
  }, []);

  const handleNewHabitacionFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("La imagen es demasiado grande. El tamaño máximo es de 5MB.");
        return;
      }
      setNewHabitacion({
        ...newHabitacion,
        imageFile: file,
      });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddHabitacion = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
  
    if (
      !newHabitacion.nombre ||
      !newHabitacion.descripcion ||
      !newHabitacion.tamano ||
      !newHabitacion.maxPersonas ||
      !newHabitacion.valor ||
      !newHabitacion.imageFile
    ) {
      toast.error("Por favor, completa todos los campos obligatorios e incluye una imagen.");
      setLocalLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append("nombre", newHabitacion.nombre);
      formDataToSend.append("descripcion", newHabitacion.descripcion);
      formDataToSend.append("tamano", parseInt(newHabitacion.tamano));
      formDataToSend.append("maxPersonas", parseInt(newHabitacion.maxPersonas));
      formDataToSend.append("valor", parseFloat(newHabitacion.valor));
      formDataToSend.append("image", newHabitacion.imageFile);
  
      // Log all FormData entries
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0]+ ': ' + pair[1]);
      }
  
      // Usar axios directamente en lugar de api.post para tener más control
      const response = await axios.post(`${process.env.REACT_APP_API_URL || ''}/api/rooms`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          // No establecer Content-Type, axios lo hará automáticamente con el boundary correcto
        },
      });
      
      console.log("Respuesta del servidor:", response.data);
  
      toast.success("Habitación agregada con éxito");
      setNewHabitacion({
        nombre: "",
        descripcion: "",
        tamano: "",
        maxPersonas: "",
        valor: "",
        imageFile: null,
      });
      setImagePreview(null);
      setShowAddForm(false);
  
      const updatedResponse = await api.get("/api/rooms");
      if (updatedResponse.data && updatedResponse.data.rooms) {
        setHabitaciones(updatedResponse.data.rooms);
      }
    } catch (error) {
      console.error("Error al agregar habitación:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("No se pudo agregar la habitación. Intenta de nuevo.");
      }
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleDeleteHabitacion = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta habitación?")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/rooms/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabitaciones(habitaciones.filter((h) => h.id !== id));
      toast.success("Habitación eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar habitación:", error);
      // Mostrar mensaje específico si hay reservas activas
      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.message);
      } else {
        toast.error("No se pudo eliminar la habitación.");
      }
    }
  };

  const handleEditHabitacion = (habitacion) => {
    setEditHabitacion(habitacion);
    setShowAddForm(false);
    setIsEditing(true);
    setFormData({
      id: habitacion.id,
      nombre: habitacion.nombre || "",
      descripcion: habitacion.descripcion || "",
      tamano: habitacion.tamano || "",
      maxPersonas: habitacion.maxPersonas || "",
      valor: habitacion.valor || "",
      image: habitacion.image || "",
      imageFile: null
    });
    setImagePreview(habitacion.image || null);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditHabitacion({
      ...editHabitacion,
      [name]: value,
    });
  };

  const handleUpdateHabitacion = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      // Si estamos usando el formulario con carga de archivos
      if (formData.imageFile) {
        await handleSubmit(e);
        return;
      }
      
      const token = localStorage.getItem("token");
      
      // Corregir la URL para que apunte al backend correcto
      await axios.put(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/rooms/${editHabitacion.id}`,
        {
          nombre: editHabitacion.nombre,
          descripcion: editHabitacion.descripcion,
          tamano: parseInt(editHabitacion.tamano),
          maxPersonas: parseInt(editHabitacion.maxPersonas),
          valor: parseFloat(editHabitacion.valor),
          image: editHabitacion.image, // Asegurarse de enviar la imagen existente
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Agregar logs para depuración
      console.log("Habitación actualizada con éxito");
      
      toast.success("Habitación actualizada con éxito.");
      setEditHabitacion(null);
      setIsEditing(false);
  
      // Obtener la lista actualizada de habitaciones desde el backend
      const updatedResponse = await api.get("/api/rooms");
      if (updatedResponse.data && updatedResponse.data.rooms) {
        setHabitaciones(updatedResponse.data.rooms);
      }
    } catch (error) {
      console.error("Error al actualizar habitación:", error);
      // Agregar más detalles del error para depuración
      console.log("Error completo:", error);
      if (error.response) {
        console.log("Datos de respuesta:", error.response.data);
        console.log("Estado HTTP:", error.response.status);
        console.log("Cabeceras:", error.response.headers);
      }
      toast.error("No se pudo actualizar la habitación.");
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error("La imagen es demasiado grande. El tamaño máximo es de 5MB.");
        return;
      }
      setFormData({
        ...formData,
        imageFile: file,
      });
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    // Corregir el mapeo de nombres de campos
    if (name === "tamaño") {
      setFormData({
        ...formData,
        tamano: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validar campos requeridos
      if (!formData.nombre || !formData.descripcion || !formData.tamano || 
          !formData.maxPersonas || !formData.valor) {
        toast.error("Por favor, completa todos los campos obligatorios");
        setIsLoading(false);
        return;
      }
  
      // Crear un FormData para enviar el archivo
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('maxPersonas', parseInt(formData.maxPersonas));
      formDataToSend.append('valor', parseFloat(formData.valor));
      formDataToSend.append('tamano', parseInt(formData.tamano));
      
      // Agregar logs para depuración
      console.log("Datos a enviar:", {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        maxPersonas: parseInt(formData.maxPersonas),
        valor: parseFloat(formData.valor),
        tamano: parseInt(formData.tamano)
      });
      
      // Si hay un archivo nuevo, agregarlo
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
        console.log("Archivo de imagen adjuntado:", formData.imageFile.name);
      } else if (formData.image) {
        // Si no hay archivo nuevo pero hay una URL, usar esa
        formDataToSend.append('image', formData.image);
        console.log("URL de imagen existente:", formData.image);
      }
      
      // Imprimir todas las entradas del FormData para depuración
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      const token = localStorage.getItem("token");
      const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Usar axios directamente en lugar de api.post/put para tener más control
      if (isEditing) {
        // Verificar que el ID exista
        if (!formData.id) {
          toast.error("Error: No se pudo identificar la habitación a editar");
          setIsLoading(false);
          return;
        }
        
        // Actualizar habitación existente
        console.log(`Actualizando habitación ID: ${formData.id}`);
        
        const response = await axios.put(
          `${baseUrl}/api/rooms/${formData.id}`,
          formDataToSend,
          { 
            headers: { 
              Authorization: `Bearer ${token}`
            },
            timeout: 10000 // Timeout de 10 segundos
          }
        );
        
        console.log("Respuesta del servidor (edición):", response.data);
        toast.success("Habitación actualizada con éxito");
        setEditHabitacion(null);
        setIsEditing(false);
      } else {
        // Crear nueva habitación
        // Verificar que se haya proporcionado una imagen para habitaciones nuevas
        if (!formData.imageFile && !formData.image) {
          toast.error("Por favor, selecciona una imagen para la habitación");
          setIsLoading(false);
          return;
        }
        
        console.log("Creando nueva habitación");
        
        const response = await axios.post(
          `${baseUrl}/api/rooms`, 
          formDataToSend, 
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            timeout: 10000 // Timeout de 10 segundos
          }
        );
        
        console.log("Respuesta del servidor (creación):", response.data);
        toast.success("Habitación agregada con éxito");
        setShowAddForm(false);
      }
      
      // Limpiar el formulario
      setFormData({
        id: null,
        nombre: "",
        descripcion: "",
        tamano: "",
        maxPersonas: "",
        valor: "",
        image: "",
        imageFile: null
      });
      setImagePreview(null);
      
      // Actualizar lista de habitaciones
      console.log("Actualizando lista de habitaciones...");
      const updatedResponse = await api.get("/api/rooms");
      if (updatedResponse.data && updatedResponse.data.rooms) {
        console.log("Habitaciones actualizadas:", updatedResponse.data.rooms.length);
        setHabitaciones(updatedResponse.data.rooms);
      } else {
        console.warn("No se recibieron datos de habitaciones en la respuesta");
      }
    } catch (error) {
      console.error('Error completo:', error);
      
      // Mostrar información más detallada del error
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error('Datos de respuesta:', error.response.data);
        console.error('Estado HTTP:', error.response.status);
        console.error('Cabeceras:', error.response.headers);
        
        toast.error(error.response.data.message || 
                  `Error del servidor (${error.response.status}): ${error.response.data.error || 'Detalles no disponibles'}`);
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        console.error('No se recibió respuesta del servidor');
        toast.error('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Algo ocurrió al configurar la solicitud
        console.error('Error de configuración:', error.message);
        toast.error(`Error al procesar la solicitud: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setFormData({
      id: null,
      nombre: "",
      descripcion: "",
      tamano: "",
      maxPersonas: "",
      valor: "",
      image: "",
      imageFile: null
    });
    setImagePreview(null);
    setIsEditing(false);
    setEditHabitacion(null);
    setShowAddForm(false);
  };

  const onRoomUpdated = async () => {
    // Actualizar lista de habitaciones
    const updatedResponse = await api.get("/api/rooms");
    if (updatedResponse.data && updatedResponse.data.rooms) {
      setHabitaciones(updatedResponse.data.rooms);
    }
  };

  return (
    <section className="py-24">
      <div className="container mx-auto lg:px-0">
        {/* Título y botón de agregar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-accent">Nuestras Habitaciones</h2>
          {isAdmin && (
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditHabitacion(null);
                setIsEditing(false);
                // Limpiar el formulario cuando se hace clic en "Agregar Habitación"
                setFormData({
                  id: null,
                  nombre: "",
                  descripcion: "",
                  tamano: "",
                  maxPersonas: "",
                  valor: "",
                  image: "",
                  imageFile: null
                });
                setImagePreview(null);
              }}
              className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
            >
              {showAddForm ? "Cancelar" : "Agregar Habitación"}
            </button>
          )}
        </div>

        {/* Formulario para agregar habitación */}
        {isAdmin && showAddForm && !isEditing && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Agregar Nueva Habitación</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre de la habitación:
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tamaño (m²):
                </label>
                <input
                  type="number"
                  name="tamano"
                  value={formData.tamano || ""}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Capacidad máxima:
                </label>
                <input
                  type="number"
                  name="maxPersonas"
                  value={formData.maxPersonas || ""}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Precio por noche:
                </label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor || ""}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2">
    Imagen de la habitación
  </label>
  <input
    type="file" 
    accept="image/*" 
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    onChange={handleFileChange} 
  />
  
  {/* Vista previa de la imagen */}
  {imagePreview && (
    <div className="mt-2">
      <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
      <img
        src={imagePreview}
        alt="Vista previa"
        className="w-full max-h-40 object-cover rounded"
      />
    </div>
  )}
</div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción:
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  rows="3"
                ></textarea>
              </div>
              <div className="col-span-2">
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar Habitación"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulario para editar habitación */}
        {isAdmin && editHabitacion && (
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Editar Habitación</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Nombre de la habitación:
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tamaño (m²):
                </label>
                <input
                  type="number"
                  name="tamano"
                  value={formData.tamano}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Capacidad máxima:
                </label>
                <input
                  type="number"
                  name="maxPersonas"
                  value={formData.maxPersonas}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Precio por noche:
                </label>
                <input
                  type="number"
                  name="valor"
                  value={formData.valor}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Imagen de la habitación
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  onChange={handleFileChange}
                />
                
                {/* Vista previa de la imagen */}
                {(imagePreview || formData.image) && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                    <img 
                      src={imagePreview || formData.image} 
                      alt="Vista previa" 
                      className="w-full max-h-40 object-cover rounded"
                    />
                  </div>
                )}
              </div>
              <div className="col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Descripción:
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleFormDataChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                  rows="3"
                ></textarea>
              </div>
              <div className="col-span-2 flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setEditHabitacion(null);
                    setIsEditing(false);
                  }}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition"
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de habitaciones */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <p>Error al cargar habitaciones: {error}</p>
          </div>
        ) : habitaciones.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
            <p>No hay habitaciones disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitaciones.map((habitacion) => (
              <Habitacion
                key={habitacion.id}
                habitacion={habitacion}
                isAdmin={isAdmin}
                onEdit={handleEditHabitacion}
                onDelete={handleDeleteHabitacion}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Habitaciones;