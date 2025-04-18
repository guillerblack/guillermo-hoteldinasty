import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// Componentes
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";
// Páginas
import Inicio from "./paginas/Inicio";
import DetallesHabitacion from "./paginas/DetallesHabitacion";
import HistorialReservas from "./paginas/HistorialReservas";
import Login from "./paginas/Login";
import Restaurante from "./paginas/Restaurante";
import SPA from "./paginas/SPA";

// Layout principal con Header y Footer
const MainLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

// Configuración de rutas
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Inicio />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: <Login />, // Sin Header ni Footer
  },
  {
    path: "/habitacion/:id",
    element: (
      <MainLayout>
        <DetallesHabitacion />
      </MainLayout>
    ),
  },
  {
    path: "/historial",
    element: (
      <MainLayout>
        <HistorialReservas />
      </MainLayout>
    ),
  },
  {
    path: "/restaurante",
    element: (
      <MainLayout>
        <Restaurante />
      </MainLayout>
    ),
  },
  {
    path: "/spa",
    element: (
      <MainLayout>
        <SPA />
      </MainLayout>
    ),
  },
  // Agrega otras rutas que necesiten el layout principal aquí
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
