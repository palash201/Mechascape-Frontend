// src/pages/ProfilePage.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import AuthProvider context

const ProfilePage = () => {
  const { user, updateUser } = useAuth(); // Access user and updateUser from AuthProvider
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Initialize state with user data from context
      setUsername(user.username);
      setEmail(user.email);
      setLoading(false); // Data is ready
    } else {
      // Redirect to login if user is not authenticated
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // Call updateUser from AuthProvider to update user profile
      await updateUser({ username, email, password });
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-5">
      <h1 className="text-2xl font-bold mb-4">Profile Page</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleUpdateProfile}>
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
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
