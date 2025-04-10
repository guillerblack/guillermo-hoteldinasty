import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import HabitacionProvedor from "./contexto/ContextoHabitacion";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HabitacionProvedor>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </HabitacionProvedor>
);
