// componentes/FormularioHabitacionReservada.js

import React, { useContext, useState } from "react";
import CheckIn from "./CheckIn";
import CheckOut from "./CheckOut";
import AdultsDropdown from "./AdultsDropdown";
import KidsDropdown from "./KidsDropdown";
import { ContextoHabitacion } from "../contexto/ContextoHabitacion";
import axios from "axios";
import { db, storage } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const FormularioHabitacionReservada = ({
  habitacionId,
  valorHabitacion,
  nombreHabitacion,
}) => {
  const { fechaInicio, fechaFin, adultos, niños } =
    useContext(ContextoHabitacion);
  const [valor, setValor] = useState(valorHabitacion);

  const handleReserva = async () => {
    try {
      await addDoc(collection(db, "reservas"), {
        habitacionId,
        nombreHabitacion,
        fechaInicio,
        fechaFin,
        adultos,
        niños,
        valor,
      });
      alert("Reserva guardada en Firestore.");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
    }
  };

  const handleFileUpload = async (file) => {
    const storageRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    console.log("Archivo subido:", downloadURL);
  };

  return (
    <div className="py-8 px-6 bg-accent/20 mb-12">
      <div className="flex flex-col space-y-4 mb-4">
        <h3 className="text-xl font-semibold">Tu reserva</h3>
        <div className="h-[60px]">
          <CheckIn />
        </div>
        <div className="h-[60px]">
          <CheckOut />
        </div>
        <div className="h-[60px]">
          <AdultsDropdown />
        </div>
        <div className="h-[60px]">
          <KidsDropdown />
        </div>
      </div>
      <button onClick={handleReserva} className="btn btn-lg btn-primary w-full">
        Reservar ahora por ${valor}
      </button>
    </div>
  );
};

export default FormularioHabitacionReservada;
