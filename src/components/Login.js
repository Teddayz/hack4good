import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      // Authenticate the user
      const userCredential = await signInWithEmailAndPassword(auth, username, password);

      // Save user credentials in Firestore (optional)
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        username,
        role: username === "resident@gmail.com" ? "resident" : username === "admin" ? "admin" : "guest",
      });

      // Navigate based on role
      if (username === "resident@gmail.com") navigate("/resident");
      else if (username === "admin") navigate("/admin");
      else alert("Invalid credentials");
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username (Email):
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

export default Login;
