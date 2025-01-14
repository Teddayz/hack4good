import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "./firebaseConfig";

const auth = getAuth(app);

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Logged in user:", userCredential.user);
  } catch (error) {
    console.error("Error logging in:", error);
  }
};
