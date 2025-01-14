// SignUp.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUpUser } from '../firebase'; // Import signUpUser

const SignUp = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();  // Prevent default form behavior
        try {
            if (!firstName || !lastName || !email || !password) {
                alert('All fields are required');
                return;
            }

            // Create user with email and password
            const user = await signUpUser(email, password);
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
            <div className="top-section">
                <h1>Join Us</h1>
            </div>

            <div className="form-container">
                <button className="back-button" onClick={() => navigate('/signIn')}>Back</button>
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
                    <button type="submit" className="submit-button">Sign Up</button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
