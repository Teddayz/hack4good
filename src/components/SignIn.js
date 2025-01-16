// SignIn.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInUser } from "../firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "./SignIn.css"; // Optional: Use a CSS file for styling

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
        const userCredential = await signInUser(email, password);
        
        // Get user role from Firestore
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        
        if (!userDoc.exists()) {
            setError("User data not found. Please contact support.");
            return;
        }

        const userRole = userDoc.data().role;
        
        // Redirect based on role - using exact component names
        if (userRole === 'admin') {
            navigate('/admin');
        } else if (userRole === 'resident') {
            navigate('/resident');
        } else {
            setError("Invalid user role");
        }
    } catch (error) {
        console.error("Sign in error:", error.code, error.message);
        setError("Invalid credentials. Please try again.");
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
