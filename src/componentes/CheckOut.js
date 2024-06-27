import React, { useState } from "react";
//captura fechas
import DatePicker from "react-datepicker";
//datepicker css
import "react-datepicker/dist/react-datepicker.css";
import "../datepicker.css";

//iconos
import { BsCalendar } from "react-icons/bs";

const CheckOut = () => {
  const [endDate, setEndtDate] = useState(false);
  return (
    <div className="items- center w-full h-full">
      {/*icon*/}
      <div className="absolute z-10 pr-8">
        <div>
          <BsCalendar className="text-accent text-base" />
        </div>
      </div>
      <DatePicker
        className="w-full h-full"
        selected={endDate}
        placeholderText="Check out"
        onChange={(date) => setEndtDate(date)}
      />
    </div>
  );
};

export default CheckOut;
