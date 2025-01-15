import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig'; // Make sure to import db

// Import Firestore functions
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

// Sign up function
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object on success
  } catch (error) {
    throw error; // Throw error to be caught in the component
  }
};

// Sign in function
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object on success
  } catch (error) {
    throw error; // Throw error to be caught in the component
  }
};

// Function to save order to Firestore
export const saveOrderToFirestore = async (order) => {
  try {
    // Add order to the Firestore "orders" collection
    await addDoc(collection(db, "orders"), {
      ...order,
      createdAt: serverTimestamp(), // Timestamp for the order
    });
  } catch (error) {
    console.error("Error saving order:", error);
    throw error;
  }
};
