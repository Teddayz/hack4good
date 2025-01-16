import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser, setUserRole } from '../firebase'; // Import signUpUser and setUserRole
import { updateProfile } from 'firebase/auth'; // Import updateProfile from Firebase
import './SignUp.css';
import { auth } from '../firebaseConfig';  // Adjust the path based on your actual file structure

const SignUp = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('resident'); // Add role state

    const handleSignUp = async (e) => {
        e.preventDefault();  // Prevent default form behavior
        try {
            if (!firstName || !lastName || !email || !password || !role) {
                alert('All fields are required');
                return;
            }
    
            // Create user with email and password
            const user = await signUpUser(email, password);
    
            // Set display name for the new user
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`, // Set the display name to first and last name
            });
    
            // Store user role in your database or user profile
            // You'll need to implement this function in your firebase.js
            await setUserRole(user.uid, role);
    
            // Log the current user and display name to check if it's set correctly
            const currentUser = auth.currentUser;
            console.log("Current user display name:", currentUser ? currentUser.displayName : "No user found");
            console.log('User account created:', user);
            
            alert('Your account was successfully created! Please sign in to continue.');
            navigate('/signIn');  // Redirect to the sign-in page
        } catch (error) {
            switch (error.code) {
                case 'auth/email-already-in-use':
                    alert('An account with this email address already exists! Try logging in instead.');
                    break;
                case 'auth/weak-password':
                    alert('Password must contain at least 6 characters!');
                    break;
                default:
                    alert(`Error: ${error.message}`);
                    break;
            }
        }
    };
    

    return (
        <div className="container">
            <button className="back-button" onClick={() => navigate('/signIn')}>Back</button>
            <div className="form-container">
                <h2>Create Account</h2>
                <form className="form" onSubmit={handleSignUp}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password (min 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="role-selector">
                        <label>Account Type:</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="resident">Resident</option>
                            <option value="admin">Administrator</option>
                        </select>
                    </div>
                    <button type="submit" className="submit-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
