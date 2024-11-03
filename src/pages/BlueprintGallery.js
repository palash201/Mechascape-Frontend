// src/pages/BlueprintGallery.js
import React, { useEffect, useState, useContext } from 'react';
import { useAuth } from './AuthProvider'; // Import AuthProvider context
import api from '../api'; // Import the Axios instance
import { useNavigate } from 'react-router-dom';

const BlueprintGallery = () => {
  const [blueprints, setBlueprints] = useState([]); // State to store user blueprints
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages
  const { token } = useAuth(); // Access token from AuthProvider
  const navigate = useNavigate(); // Use navigate for redirection

  useEffect(() => {
    const fetchBlueprints = async () => {
      try {
        const response = await api.get('/blueprint', {
          headers: {
            Authorization: `Bearer ${token}`, // Include auth token for authorization
          },
        });
        setBlueprints(response.data); // Set fetched blueprints to state
      } catch (err) {
        console.error('Error fetching blueprints:', err);
        setError('Failed to fetch blueprints. Please try again later.'); // Set error message
        navigate('/login'); // Redirect to login if fetching fails
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchBlueprints();
  }, [token, navigate]); // Include token and navigate in dependencies

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Show error message
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-4">Blueprint Gallery</h1>
      {blueprints.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blueprints.map((blueprint) => (
            <div key={blueprint.id} className="border rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold">{blueprint.name}</h2>
              <p className="text-gray-700 mb-2">{blueprint.description}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => navigate(`/blueprint/${blueprint.id}`)} // Navigate to blueprint details
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2">No blueprints available. Create one now!</p>
      )}
    </div>
  );
};

export default BlueprintGallery;
