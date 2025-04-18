// filepath: src/utils/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSHsc5zIBBwVgbaNSDZS1nEHUDxXuUB3k",
  authDomain: "hotel-dinasty2834916.firebaseapp.com",
  databaseURL: "https://hotel-dinasty2834916-default-rtdb.firebaseio.com",
  projectId: "hotel-dinasty2834916",
  storageBucket: "hotel-dinasty2834916.firebasestorage.app",
  messagingSenderId: "603492990430",
  appId: "1:603492990430:web:b47d4d2bb52d108ee1b14f",
  measurementId: "G-E0SQKEZ24H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);
