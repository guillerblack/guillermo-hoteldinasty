import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Para redirección
import Header from "../componentes/Header"; // Ruta corregida
import Footer from "../componentes/Footer"; // Importar Footer
import api from "../utils/api"; // Importar la instancia de API configurada

const Login = () => {
  const [isRegister, setIsRegister] = useState(false); // Alternar entre login y registro
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("usuario"); // Estado para el rol (usuario o administrador)
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const [userEmail, setUserEmail] = useState(""); // Estado para el correo del usuario
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    // Verificar si hay una sesión activa
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiar errores previos
  
    try {
      if (isRegister) {
        // Registro de usuario - Siempre asignar el rol "usuario" independientemente de la selección
        const response = await api.post(
          "/api/auth/register",
          {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: "usuario", // Forzar siempre el rol de usuario
          }
        );
        alert("Usuario registrado con éxito.");
        setIsRegister(false); // Cambiar a modo de inicio de sesión
      } else {
        // Inicio de sesión - Corregir la ruta
        const response = await api.post("/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        if (!response.data.token) {
          throw new Error("Respuesta inválida del servidor.");
        }

        // Guardar el token, el rol y el correo en localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userRole", response.data.user?.role || "usuario");
        localStorage.setItem(
          "userEmail",
          response.data.user?.email || formData.email
        );

        setUserEmail(response.data.user?.email || formData.email); // Actualizar el estado del correo
        alert("Inicio de sesión exitoso.");
        navigate("/historial-reservas"); // Redirigir al historial de reservas
      }
    } catch (error) {
      console.error("Error en la autenticación:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Error en la autenticación. Intenta de nuevo."
      );
    }
  };

  const handleLogout = () => {
    // Cerrar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setUserEmail(""); // Limpiar el estado del correo
    alert("Sesión cerrada con éxito.");
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Header />
        {/* HeroSlider personalizado */}
        <div
          className="h-[600px] lg:h-[860px] bg-cover bg-center relative"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1557683316-973673baf926?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fGxvZ2lufGVufDB8fHx8MTY4MTEyNjA3MQ&ixlib=rb-1.2.1&q=80&w=1080)`,
          }}
        >
          {/* Overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>
          {/* Texto superpuesto */}
          <div className="absolute w-full h-full flex justify-center items-center">
            <h1 className="text-white text-4xl lg:text-6xl font-primary text-center">
              Bienvenido al Login {userEmail && `(${userEmail})`}
            </h1>
          </div>
        </div>
        <div className="flex flex-grow items-center justify-center">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
            {userEmail ? (
              // Mostrar botón de cerrar sesión si hay una sesión activa
              <button
                onClick={handleLogout}
                className="w-full py-2 mb-4 text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
                <h1 className="text-2xl font-bold mb-6 text-center text-accent">
                  {isRegister ? "Registro" : "Iniciar Sesión"}
                </h1>
                {/* Mostrar mensaje de error si existe */}
                {errorMessage && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {isRegister && (
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full mb-4 p-2 border rounded-lg"
                      required
                    />
                  )}
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo Electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded-lg"
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full py-2 text-white bg-accent hover:bg-accent-hover rounded-lg"
                  >
                    {isRegister ? "Registrarse" : "Iniciar Sesión"}
                  </button>
                </form>
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setIsRegister(!isRegister)}
                    className="text-accent hover:underline"
                  >
                    {isRegister
                      ? "¿Ya tienes cuenta? Inicia sesión"
                      : "¿No tienes cuenta? Regístrate"}
                  </button>
                </div>
              </>
            )}
            <div className="flex justify-center gap-4 mt-6">
              <button className="flex items-center gap-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
                <FaGoogle /> Google
              </button>
              <button className="flex items-center gap-2 text-white bg-blue-800 hover:bg-blue-900 px-4 py-2 rounded-lg">
                <FaFacebook /> Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;