// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
