import React, { useState, useEffect } from "react";
import axios from "axios";

const RolesPermisos = () => {
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState("");

  const fetchRoles = async () => {
    const response = await axios.get("http://localhost:8000/api/roles");
    setRoles(response.data);
  };

  const crearRol = async () => {
    await axios.post("http://localhost:8000/api/roles", { name: nuevoRol });
    setNuevoRol("");
    fetchRoles();
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
