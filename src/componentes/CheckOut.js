import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";

const CheckOut = () => {
  const { fechaFin, setFechaFin } = useContext(ContextoHabitacion);

  return (
    <div className="relative flex items-center h-full">
      {/* Icono del calendario */}
      <div className="absolute left-3">
        <BsCalendar className="text-accent text-lg" />
      </div>
      {/* Selector de fecha */}
      <DatePicker
        className="w-full h-10 pl-10 border rounded-md focus:outline-none"
        selected={fechaFin}
        placeholderText="Check Out"
        onChange={(date) => setFechaFin(date)}
      />
    </div>
  );
};

export default CheckOut;
