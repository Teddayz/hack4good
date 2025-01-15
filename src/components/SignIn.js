// SignIn.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../firebase"; // Import signInUser
import "./SignIn.css"; // Optional: Use a CSS file for styling

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInUser(email, password); // Call the function without assigning its return value
      navigate("/resident"); // Navigate to home page after successful sign-in
    } catch (error) {
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password.");
      } else {
        console.error("Error signing in:", error);
        setError("Invalid Credentials. Please try again.");
      }
    }
  };
  

  const navigateToSignUp = () => {
    navigate("/signup");
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="signin-container">
      <div className="signin-bottom">
        <h2 className="signin-heading">Welcome Back</h2>
        <div className="signin-form">
          <input
            type="email"
            placeholder="Email Address"
            className="signin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="signin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="signin-error">{error}</p>}
          <button className="signin-button" onClick={handleSignIn}>
            Sign In
          </button>
          <button className="signin-link" onClick={navigateToForgotPassword}>
            Forgot Password?
          </button>
        </div>
        <button className="signin-link" onClick={navigateToSignUp}>
          Don't have an account? Sign up!
        </button>
      </div>
    </div>
  );
  
};

export default SignIn;
