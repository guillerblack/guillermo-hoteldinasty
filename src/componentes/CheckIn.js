import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";
import { BsCalendar } from "react-icons/bs";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";

const CheckIn = () => {
  const { fechaInicio, setFechaInicio } = useContext(ContextoHabitacion);

  return (
    <div className="relative flex items-center h-full">
      {/* Icono del calendario */}
      <div className="absolute left-4">
        <BsCalendar className="text-accent text-2xl" />
      </div>
      {/* Selector de fecha */}
      <DatePicker
        className="w-full h-14 pl-12 text-lg border rounded-md focus:outline-none"
        selected={fechaInicio}
        placeholderText="Check In"
        onChange={(date) => setFechaInicio(date)}
      />
    </div>
  );
};

export default CheckIn;
