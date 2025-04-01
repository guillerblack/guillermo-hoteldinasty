import React from "react";
//componentes
import Header from "./componentes/Header";
import Footer from "./componentes/Footer";
//paginas
import Inicio from "./paginas/Inicio";
import DetallesHabitacion from "./paginas/DetallesHabitacion";
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Importa BrowserRouter, Routes y Route

//react router
const router = createBrowserRouter([
  {
    path: "/",
    element: <Inicio />,
  },
  {
    path: "/habitacion/:id",
    element: <DetallesHabitacion />,
  },
]);

const App = () => {
  return (
    <div>
      <Header />
      <RouterProvider router={router} />
      <Footer />
    </div>
  );
};

export default App;
