import React, { useEffect, useState } from "react";
import Header from "../componentes/Header";
import Footer from "../componentes/Footer";
import api from "../utils/api";
import ModalEditarReserva from "../componentes/ModalEditarReserva";
import { useNavigate } from 'react-router-dom';
import ModalEditarServicio from "../componentes/ModalEditarServicio";
import { FaSearch } from 'react-icons/fa';

const ReservasAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [serviceBookings, setServiceBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bookings');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [selectedServiceBooking, setSelectedServiceBooking] = useState(null);
  
  // Estados para la búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filteredServiceBookings, setFilteredServiceBookings] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
      navigate('/login');
      return;
    }

    // Verificar si el usuario es administrador
    if (userRole !== 'admin') {
      navigate('/');
      alert('Acceso denegado. Se requieren permisos de administrador.');
      return;
    }

    // Función para cargar los datos
    const fetchData = async () => {
      try {
        setLoading(true);

        // Obtener todas las reservas de habitaciones
        const bookingsResponse = await api.get('/api/bookings/all');
        console.log('Respuesta de reservas:', bookingsResponse.data);
        // Asegurarse de que bookings sea un array
        const bookingsData = Array.isArray(bookingsResponse.data.bookings)
          ? bookingsResponse.data.bookings
          : (Array.isArray(bookingsResponse.data) ? bookingsResponse.data : []);
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);

        // Obtener todas las reservas de servicios
        const serviceBookingsResponse = await api.get('/api/service-bookings');
        console.log('Respuesta de servicios:', serviceBookingsResponse.data);
        // Asegurarse de que serviceBookings sea un array
        const serviceBookingsData = Array.isArray(serviceBookingsResponse.data)
          ? serviceBookingsResponse.data
          : [];
        setServiceBookings(serviceBookingsData);
        setFilteredServiceBookings(serviceBookingsData);

        // Obtener todos los usuarios
        const usersResponse = await api.get('/api/users');
        console.log('Respuesta de usuarios:', usersResponse.data);
        // Asegurarse de que users sea un array
        const usersData = Array.isArray(usersResponse.data)
          ? usersResponse.data
          : [];
        setUsers(usersData);
        setFilteredUsers(usersData);

        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError(`Error al cargar los datos: ${err.message || 'Error desconocido'}`);
        setLoading(false);

        // Si el error es de autenticación, redirigir al login
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Efecto para filtrar los datos cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm === '') {
      // Si no hay término de búsqueda, mostrar todos los datos
      setFilteredBookings(bookings);
      setFilteredServiceBookings(serviceBookings);
      setFilteredUsers(users);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();

    // Filtrar reservas de habitaciones
    const filteredRoomBookings = bookings.filter(booking => 
      (booking.id && booking.id.toString().includes(searchTermLower)) ||
      (booking.user_name && booking.user_name.toLowerCase().includes(searchTermLower)) ||
      (booking.room_name && booking.room_name.toLowerCase().includes(searchTermLower)) ||
      (booking.status && booking.status.toLowerCase().includes(searchTermLower))
    );
    setFilteredBookings(filteredRoomBookings);

    // Filtrar reservas de servicios
    const filteredServices = serviceBookings.filter(booking => 
      (booking.id && booking.id.toString().includes(searchTermLower)) ||
      (booking.service_name && booking.service_name.toLowerCase().includes(searchTermLower)) ||
      (booking.booking_date && booking.booking_date.includes(searchTermLower)) ||
      (booking.status && booking.status.toLowerCase().includes(searchTermLower))
    );
    setFilteredServiceBookings(filteredServices);

    // Filtrar usuarios
    const filteredUsersList = users.filter(user => 
      (user.id && user.id.toString().includes(searchTermLower)) ||
      (user.name && user.name.toLowerCase().includes(searchTermLower)) ||
      (user.email && user.email.toLowerCase().includes(searchTermLower)) ||
      (user.role && user.role.toLowerCase().includes(searchTermLower))
    );
    setFilteredUsers(filteredUsersList);
  }, [searchTerm, bookings, serviceBookings, users]);

  // Función para manejar el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para eliminar una reserva de habitación
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Actualizar la lista de reservas
        setBookings(bookings.filter(booking => booking.id !== bookingId));
        alert('Reserva eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar la reserva:', error);
        alert('Error al eliminar la reserva: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Función para cancelar una reserva (cambiar estado a cancelado)
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      try {
        const token = localStorage.getItem('token');
        await api.put(`/api/bookings/${bookingId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Actualizar la lista de reservas
        setBookings(bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
        alert('Reserva cancelada con éxito');
      } catch (error) {
        console.error('Error al cancelar la reserva:', error);
        alert('Error al cancelar la reserva: ' + (error.response?.data?.message || error.message));
      }
    }
  };
  // Función para editar una reserva
  const handleEditBooking = (booking) => {
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  // Función para guardar los cambios de la reserva
  const handleSaveBooking = async (bookingId, formData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Guardando cambios de reserva:', bookingId, formData);

      // Asegurarse de que las fechas estén en el formato correcto (YYYY-MM-DD)
      const updatedFormData = {
        ...formData,
        check_in_date: formData.checkInDate || formData.check_in_date,
        check_out_date: formData.checkOutDate || formData.check_out_date,
        num_adults: parseInt(formData.numAdults || formData.num_adults || 1),
        num_children: parseInt(formData.numChildren || formData.num_children || 0)
      };

      // Eliminar campos duplicados para evitar confusiones en el backend
      if (updatedFormData.checkInDate) delete updatedFormData.checkInDate;
      if (updatedFormData.checkOutDate) delete updatedFormData.checkOutDate;
      if (updatedFormData.numAdults) delete updatedFormData.numAdults;
      if (updatedFormData.numChildren) delete updatedFormData.numChildren;

      // Añadir logs para depuración
      console.log('Datos enviados al servidor:', updatedFormData);

      await api.put(`/api/bookings/${bookingId}`, updatedFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar la lista de reservas
      setBookings(bookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            check_in_date: updatedFormData.check_in_date,
            check_out_date: updatedFormData.check_out_date,
            num_adults: updatedFormData.num_adults,
            num_children: updatedFormData.num_children
          };
        }
        return booking;
      }));

      setShowEditModal(false);
      alert('Reserva actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la reserva:', error);
      // Mostrar más detalles del error
      if (error.response && error.response.data) {
        console.error('Detalles del error:', error.response.data);
      }
      alert('Error al actualizar la reserva: ' + (error.response?.data?.message || error.message));
    }
  };

  // Función para eliminar una reserva de servicio
  const handleDeleteServiceBooking = async (bookingId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta reserva de servicio?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/api/service-bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Actualizar la lista de reservas de servicios
        setServiceBookings(serviceBookings.filter(booking => booking.id !== bookingId));
        alert('Reserva de servicio eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar la reserva de servicio:', error);
        alert('Error al eliminar la reserva de servicio: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Función para cancelar una reserva de servicio
  const handleCancelServiceBooking = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva de servicio?')) {
      try {
        const token = localStorage.getItem('token');
        // Change from PUT to PATCH to match the backend route
        await api.patch(`/api/service-bookings/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update the state to reflect the cancellation
        setServiceBookings(serviceBookings.map(booking =>
          booking.id === id
            ? { ...booking, status: 'cancelled' }
            : booking
        ));
        
        alert('Reserva de servicio cancelada con éxito');
      } catch (error) {
        console.error('Error al cancelar la reserva de servicio:', error);
        alert('Error al cancelar la reserva de servicio: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // Función para editar una reserva de servicio
  const handleEditServiceBooking = (booking) => {
    setSelectedServiceBooking(booking);
    setShowEditServiceModal(true);
  };

  // Función para guardar los cambios de la reserva de servicio
  const handleSaveServiceBooking = async (bookingId, formData) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Guardando cambios de reserva de servicio:', bookingId, formData);

      await api.put(`/api/service-bookings/${bookingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar la lista de reservas de servicios
      setServiceBookings(serviceBookings.map(booking => {
        if (booking.id === bookingId) {
          return {
            ...booking,
            booking_date: formData.booking_date,
            booking_time: formData.booking_time,
            quantity: formData.quantity,
            special_requests: formData.special_requests
          };
        }
        return booking;
      }));

      setShowEditServiceModal(false);
      alert('Reserva de servicio actualizada con éxito');
    } catch (error) {
      console.error('Error al actualizar la reserva de servicio:', error);
      alert('Error al actualizar la reserva de servicio: ' + (error.response?.data?.message || error.message));
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Actualizar la lista de usuarios
      setUsers(users.filter(user => user.id !== userId));
      alert("Usuario eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      
      // Mostrar mensaje específico según el tipo de error
      if (error.response) {
        if (error.response.status === 409) {
          alert(error.response.data.message || "No se puede eliminar el usuario porque tiene elementos asociados");
        } else {
          alert(error.response.data.message || "Error al eliminar el usuario");
        }
      } else {
        alert("Error de conexión. Intente nuevamente más tarde.");
      }
    }
  };

  // Función para cambiar el rol de un usuario
  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      await api.patch(`/api/users/${userId}/update-role`, { role: newRole }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualizar la lista de usuarios
      setUsers(users.map(user => {
        if (user.id === userId) {
          return { ...user, role: newRole };
        }
        return user;
      }));

      alert(`Rol de usuario actualizado a ${newRole} con éxito`);
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      alert('Error al actualizar el rol del usuario: ' + (error.response?.data?.message || error.message));
    }
  };

  // En la función que carga los usuarios
const fetchUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    // Verificar la estructura de la respuesta y procesarla adecuadamente
    const userData = Array.isArray(response.data) ? response.data : 
                    (Array.isArray(response.data[0]) ? response.data[0] : []);
    
    console.log('Datos de usuarios procesados:', userData);
    setUsers(userData);
    setFilteredUsers(userData);
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  }
};

  if (loading) return (
    <>
      <Header />
      <div className="container mx-auto p-4">Cargando...</div>
    </>
  );


  if (error) return (
    <>
      <Header />
      <div className="container mx-auto p-4 text-red-500">{error}</div>
    </>
  );

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 mt-40">
        <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

       {/* Barra de búsqueda */}
       <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar por ID, nombre, estado..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${activeTab === 'bookings' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              Reservas de Habitaciones {filteredBookings.length > 0 && `(${filteredBookings.length})`}
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'serviceBookings' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
              onClick={() => setActiveTab('serviceBookings')}
            >
              Reservas de Servicios {filteredServiceBookings.length > 0 && `(${filteredServiceBookings.length})`}
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Usuarios {filteredUsers.length > 0 && `(${filteredUsers.length})`}
            </button>
          </div>
        </div>


        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Reservas de Habitaciones</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Usuario</th>
                    <th className="py-2 px-4 border">Habitación</th>
                    <th className="py-2 px-4 border">Check-in</th>
                    <th className="py-2 px-4 border">Check-out</th>
                    <th className="py-2 px-4 border">Estado</th>
                    <th className="py-2 px-4 border">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                {filteredBookings.length > 0 ? (
                    filteredBookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="py-2 px-4 border">{booking.id}</td>
                        <td className="py-2 px-4 border">{booking.user_name || booking.user_id}</td>
                        <td className="py-2 px-4 border">{booking.room_name || booking.room_id}</td>
                        <td className="py-2 px-4 border">{new Date(booking.check_in_date).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border">{new Date(booking.check_out_date).toLocaleDateString()}</td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded text-white ${booking.status === 'confirmed' ? 'bg-green-500' :
                              booking.status === 'cancelled' ? 'bg-red-500' :
                                booking.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 border flex space-x-2">
                          <button
                            onClick={() => handleEditBooking(booking)}
                            className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                            disabled={booking.status === 'cancelled'}
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-4 text-center">
                        {searchTerm ? "No se encontraron reservas que coincidan con la búsqueda" : "No hay reservas disponibles"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

{activeTab === 'serviceBookings' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Reservas de Servicios</h2>
    <div className="overflow-x-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Reservas de Servicios</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Usuario</th>
            <th className="py-2 px-4 border-b">Servicio</th>
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">Hora</th>
            <th className="py-2 px-4 border-b">Cantidad</th>
            <th className="py-2 px-4 border-b">Estado</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredServiceBookings.length > 0 ? (
            filteredServiceBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{booking.id}</td>
                <td className="py-2 px-4 border-b">
                  {users.find(u => u.id === booking.user_id)?.name || booking.user_id}
                </td>
                <td className="py-2 px-4 border-b">{booking.service_name}</td>
                <td className="py-2 px-4 border-b">{booking.booking_date}</td>
                <td className="py-2 px-4 border-b">{booking.booking_time}</td>
                <td className="py-2 px-4 border-b">{booking.quantity}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded text-white ${booking.status === 'confirmed' ? 'bg-green-500' :
                    booking.status === 'cancelled' ? 'bg-red-500' :
                      booking.status === 'completed' ? 'bg-blue-500' : 'bg-yellow-500'
                    }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditServiceBooking(booking)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleCancelServiceBooking(booking.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      disabled={booking.status === 'cancelled'}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => handleDeleteServiceBooking(booking.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="py-4 text-center">
                {searchTerm ? "No se encontraron reservas de servicios que coincidan con la búsqueda" : "No hay reservas de servicios disponibles"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{activeTab === 'users' && (
  <div>
    <h2 className="text-xl font-semibold mb-4">Gestión de Usuarios</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Rol</th>
            <th className="py-2 px-4 border">Fecha de Registro</th>
            <th className="py-2 px-4 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="py-2 px-4 border">{user.id}</td>
                <td className="py-2 px-4 border">{user.name}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">
                  <span className={`px-2 py-1 rounded text-white ${
                    user.role === 'admin' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-2 px-4 border">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="py-2 px-4 border flex space-x-2">
                  <button
                    onClick={() => handleRoleChange(user.id, user.role === 'admin' ? 'user' : 'admin')}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  >
                    {user.role === 'admin' ? 'Hacer Usuario' : 'Hacer Admin'}
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    disabled={user.id === parseInt(localStorage.getItem('userId'))}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="py-4 text-center">
                {searchTerm ? "No se encontraron usuarios que coincidan con la búsqueda" : "No hay usuarios disponibles"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
)}
      </div>

      {/* Modales de edición */}
      {showEditModal && selectedBooking && (
          <ModalEditarReserva
            reserva={selectedBooking}
            onClose={() => setShowEditModal(false)}
            onSave={handleSaveBooking}
          />
        )}

        {showEditServiceModal && selectedServiceBooking && (
          <ModalEditarServicio
            servicio={selectedServiceBooking}
            onClose={() => setShowEditServiceModal(false)}
            onSave={handleSaveServiceBooking}
          />
        )}

      <Footer />
    </>
  );
};

export default ReservasAdmin;