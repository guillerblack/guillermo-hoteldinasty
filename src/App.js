import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Componentes
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";
// Páginas
import Inicio from "./paginas/Inicio";
import DetallesHabitacion from "./paginas/DetallesHabitacion";
import RolesPermisos from "./paginas/RolesPermisos";
import HistorialReservas from "./paginas/HistorialReservas";
import Dashboard from "./paginas/Dashboard";
import Login from "./paginas/Login";
import Restaurante from "./paginas/Restaurante"; // Importar Restaurante
import SPA from "./paginas/SPA"; // Importar SPA

// Configuración de rutas
const router = createBrowserRouter([
  { path: "/", element: <Inicio /> },
  { path: "/login", element: <Login /> },
  { path: "/habitacion/:id", element: <DetallesHabitacion /> },
  { path: "/roles", element: <RolesPermisos /> },
  { path: "/historial", element: <HistorialReservas /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/restaurante", element: <Restaurante /> }, // Ruta para Restaurante
  { path: "/spa", element: <SPA /> }, // Ruta para SPA
]);

const App = () => {
  return (
    <RouterProvider router={router}>
      <Header />
      <Footer />
    </RouterProvider>
  );
};

export default App;
