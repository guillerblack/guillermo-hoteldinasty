import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Importar la instancia de Axios

const RolesPermisos = () => {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole !== "admin") {
      navigate("/"); // Redirigir al inicio si no es administrador
    }
  }, [navigate]);

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        alert("No tienes permisos para acceder a esta sección.");
        navigate("/");
      } else {
        console.error("Error al cargar roles:", error);
      }
    }
  };

  const crearRol = async () => {
    try {
      await api.post("/roles", { name: nuevoRol }); // Crear un nuevo rol
      setNuevoRol("");
      fetchRoles();
    } catch (error) {
      console.error("Error al crear rol:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6">Gestión de Roles</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nuevo Rol"
          value={nuevoRol}
          onChange={(e) => setNuevoRol(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={crearRol} className="ml-2 btn btn-primary">
          Crear Rol
        </button>
      </div>
      <ul>
        {roles.map((rol) => (
          <li key={rol.id}>{rol.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default RolesPermisos;
