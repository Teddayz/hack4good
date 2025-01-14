// firebase.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';

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
