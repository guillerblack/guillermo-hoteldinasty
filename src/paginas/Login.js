import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Para redirección
import Header from "../componentes/Header"; // Ruta corregida
import Footer from "../componentes/Footer"; // Importar Footer
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../utils/firebase"; // Importar Firebase auth
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false); // Alternar entre login y registro
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [role, setRole] = useState("usuario"); // Estado para el rol (usuario o administrador)
  const [errorMessage, setErrorMessage] = useState(""); // Mensaje de error
  const navigate = useNavigate(); // Hook para redirección

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        alert("Usuario registrado con éxito.");
      } else {
        await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        alert("Inicio de sesión exitoso.");
        navigate("/historial");
      }
    } catch (error) {
      setErrorMessage("Error en la autenticación: " + error.message);
    }
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
              Bienvenido al Login
            </h1>
          </div>
        </div>
        <div className="flex flex-grow items-center justify-center">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
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
              {/* Selector de Rol */}
              <div className="mb-4">
                <label className="block mb-2 text-gray-700">
                  Selecciona tu Rol:
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("usuario")}
                    className={`px-4 py-2 rounded-lg ${
                      role === "usuario"
                        ? "bg-accent text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Usuario
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`px-4 py-2 rounded-lg ${
                      role === "admin"
                        ? "bg-accent text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    Administrador
                  </button>
                </div>
              </div>
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
      <Footer /> {/* Agregar Footer */}
      {/* Mostrar opciones de administración si el rol es admin */}
      {(() => {
        const userRole = localStorage.getItem("userRole");
        if (userRole === "admin") {
          // Mostrar opciones de administración
          return (
            <div className="text-center mt-4">
              Opciones de administración disponibles
            </div>
          );
        }
        return null;
      })()}
    </>
  );
};

export default Login;
