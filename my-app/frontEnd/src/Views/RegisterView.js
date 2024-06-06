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

    try {
      // Store the user's credentials in localStorage
      const user = { username, password };
      localStorage.setItem(username, JSON.stringify(user));
      
      // Navigate to the home page after successful registration
      navigate('/');
    } catch (error) {
      console.error('Failed to save user data:', error);
      alert('Failed to register. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
  <h2>Login</h2>
  {error && <div className="login-error">{error}</div>}
  <div className="input-group">
    <label htmlFor="username">Username</label>
    <input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
    />
  </div>
  <div className="input-group">
    <label htmlFor="password">Password</label>
    <input
      id="password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  <div className="register-prompt">
      Not a user? <button type="button" onClick={() => navigate('/register')}>Register here</button>
  </div>

  <button type="submit" className="login-button">Log In</button>
</form>

    </div>
  );
}

export default LoginPage;
