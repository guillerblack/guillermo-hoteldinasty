import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Obtener habitaciones
export const fetchHabitaciones = async () => {
  const habitacionesRef = collection(db, "habitaciones");
  const snapshot = await getDocs(habitacionesRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Crear nueva reserva
export const crearReserva = async (reserva) => {
  const reservasRef = collection(db, "reservas");
  const docRef = await addDoc(reservasRef, reserva);
  return { id: docRef.id, ...reserva };
};

// Obtener reservas por usuario
export const fetchReservas = async (userId) => {
  const reservasRef = collection(db, "reservas");
  const q = query(reservasRef, where("firebase_user_id", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Eliminar reserva
export const eliminarReserva = async (id) => {
  const reservaRef = doc(db, "reservas", id);
  await deleteDoc(reservaRef);
};
