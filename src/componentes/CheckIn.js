import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BsCalendar } from "react-icons/bs";

const CheckIn = ({ onChange }) => { // Accept onChange prop
  const [startDate, setStartDate] = useState(false);
  return (
    <div className="relative flex items-center h-full max-w-[250px] mx-auto">
      <div className="absolute z-10 pr-8">
        <BsCalendar className="text-accent text-base" />
      </div>
      <DatePicker
        className="w-full h-full pl-12"
        selected={startDate}
        placeholderText="Check In"
        onChange={(date) => {
          setStartDate(date);
          onChange(date); // Call onChange with the selected date
        }}
        minDate={new Date()}
      />
    </div>
  );
};

export default CheckIn;
