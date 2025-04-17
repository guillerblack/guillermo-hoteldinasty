import React, { createContext, useEffect, useState } from "react";
// Datos
import { habitacionData } from "../data";
// Creación del contexto
export const ContextoHabitacion = createContext();

const HabitacionProveedor = ({ children }) => {
  const [habitaciones, setHabitaciones] = useState(habitacionData);
  const [adultos, setAdultos] = useState("1 adulto");
  const [niños, setNiños] = useState("0 niños");
  const [checkIn, setCheckIn] = useState(null);  // State for check-in date
  const [checkOut, setCheckOut] = useState(null); // State for check-out date
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(Number(adultos[0]) + Number(niños[0]));
  }, [adultos, niños]);

  const handleClick = (e, selectedRooms) => { // Receive selectedRooms
    e.preventDefault();

    // Basic validation (can be improved)
    if (!checkIn || !checkOut) {
      console.error("Please select check-in and check-out dates.");
      // You might want to display an error message to the user here
      return;
    }

    if (selectedRooms.length === 0) {
        console.error("Please select at least one room.");
        // Display error to the user
        return;
    }


    // Collect all booking data
    const bookingData = {
      rooms: selectedRooms,
      checkIn: checkIn.toISOString(), // Format dates as ISO strings
      checkOut: checkOut.toISOString(),
      adults: parseInt(adultos[0]),
      children: parseInt(niños[0]),
    };

    console.log("Booking data:", bookingData);

    // TODO: Send bookingData to the backend API
    // Example using fetch (replace with your actual API endpoint and method):
    /*
    fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Handle successful booking (e.g., display confirmation)
    })
    .catch((error) => {
      console.error('Error:', error);
      // Handle error (e.g., display error message)
    });
    */

    // For now, simulate a successful booking
    alert("Booking successful! (Data logged to console)");
  };


  return (
    <ContextoHabitacion.Provider
      value={{
        habitaciones,
        adultos,
        setAdultos,
        niños,
        setNiños,
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        handleClick,
      }}
    >
      {children}
    </ContextoHabitacion.Provider>
  );
};

export default HabitacionProveedor;
