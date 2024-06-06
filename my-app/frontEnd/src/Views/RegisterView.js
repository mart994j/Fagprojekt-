import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS/RegisterScreen.css'; // Ensure this path matches the location of your CSS file

function RegisterPage() {
  const [username, setUsername] = useState(''); // State for username
  const [password, setPassword] = useState(''); // State for password
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Check if the username already exists in localStorage
    if (localStorage.getItem(username)) {
      alert('Username already exists. Please choose another one.');
      return;
    }

    // Store the user's credentials in localStorage
    const user = { username, password };
    localStorage.setItem(username, JSON.stringify(user));

    // Navigate to the home page after successful registration
    navigate('/');
  };

  // Render the registration form
  return (
    <div className="register-container"> {/* Container with centering styling */}
      <form onSubmit={handleSubmit} className="register-form"> {/* Form with specific styling */}
        <h2>Register</h2> {/* Title */}
        <div className="input-group"> {/* Group for each input for consistent styling */}
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group"> {/* Repeat input-group styling for password */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button> {/* Styled submit button */}
      </form>
    </div>
  );
}

export default RegisterPage;
