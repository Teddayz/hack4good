import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCl6DCKGh9TINXn9nuzfq6KdM8XgToZy1A",
  authDomain: "hack4good-2d884.firebaseapp.com",
  projectId: "hack4good-2d884",
  storageBucket: "hack4good-2d884.firebasestorage.app",
  messagingSenderId: "674470747933",
  appId: "1:674470747933:web:ace9db60fa6aedaf04cbf4",
  measurementId: "G-FG7GJF25L8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Function to save order to Firestore
export const saveOrderToFirestore = async (order) => {
  try {
    const { id, ...orderData } = order;
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding order: ", error);
    throw error;
  }
};
