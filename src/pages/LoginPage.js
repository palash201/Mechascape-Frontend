// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import AuthProvider context

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const { authenticateUser } = useAuth(); // Correct destructuring of login function

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
    setError(''); // Reset error message

    try {
      // Use the authenticateUser method from AuthProvider
      await authenticateUser(username, password);

      // Redirect to the dashboard or another page after successful login
      console.log("Navigating to dashboard"); // Debug log
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password.'); // Set an error message
    } finally {
      setLoading(false); // Reset loading state after login attempt
    }
  };

  return (
    <div className="max-w-md mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {error && <p className="text-red-500">{error}</p>} {/* Display error if exists */}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading} // Disable the button while logging in
        >
          {loading ? 'Logging in...' : 'Login'} {/* Change button text based on loading state */}
        </button>
      </form>
      <p className="mt-4">
        Don't have an account? <Link to="/signup" className="text-blue-500">Sign up</Link>
      </p>
    </div>
  );
};

export default LoginPage;
