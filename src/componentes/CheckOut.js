import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";

const CheckOut = () => {
  const { fechaInicio, fechaFin, setFechaFin } = useContext(ContextoHabitacion);

  return (
    <div className="relative flex items-center h-full">
      <div className="absolute left-4">
        <BsCalendar className="text-accent text-2xl" />
      </div>
      <DatePicker
        className="w-full h-14 pl-12 text-lg border rounded-md focus:outline-none"
        selected={fechaFin}
        placeholderText="Check Out"
        onChange={(date) => setFechaFin(date)}
        minDate={fechaInicio || new Date()} // No permite seleccionar fechas anteriores al check-in
      />
    </div>
  );
};

export default CheckOut;
