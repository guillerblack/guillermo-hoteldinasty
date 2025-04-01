import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import HabitacionProveedor from "./contexto/ContextoHabitacion";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HabitacionProveedor>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HabitacionProveedor>
);
