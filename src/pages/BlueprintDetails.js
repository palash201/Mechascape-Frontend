// src/pages/BlueprintDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import the useAuth hook from AuthProvider
import api from '../api'; // Import the Axios instance for API requests

const BlueprintDetails = () => {
  // Get the blueprint ID from the URL parameters
  const { id } = useParams(); 
  // Access the token from AuthProvider
  const { authToken } = useAuth(); 
  // State to hold the fetched blueprint data
  const [blueprint, setBlueprint] = useState(null); 
  // State for loading status
  const [loading, setLoading] = useState(true); 
  // State for any error messages
  const [error, setError] = useState(null); 
  // Hook to navigate to different routes
  const navigate = useNavigate(); 

  // Fetch blueprint details when the component mounts or when `id` or `authToken` changes
  useEffect(() => {
    // Function to fetch blueprint details from the server
    const fetchBlueprintDetails = async () => {
      // Check if the authToken is present
      if (!authToken) {
        console.warn('No authentication token found. Redirecting to login.');
        navigate('/login'); // Redirect to login if no token
        return; // Stop further execution
      }

      try {
        // Log the token for debugging (remove this in production)
        console.log('Auth Token:', authToken);

        // Make an API call to fetch the blueprint details
        const response = await api.get(`/blueprint/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`, // Pass the auth token in headers
          },
        });

        // Set the fetched data to the `blueprint` state
        setBlueprint(response.data);
      } catch (err) {
        console.error('Error fetching blueprint details:', err);

        // Check if the error is a 401 (Unauthorized) and redirect to login
        if (err.response && err.response.status === 401) {
          navigate('/login');
        } else {
          // Set a generic error message if the request fails for other reasons
          setError('Failed to fetch blueprint details.');
        }
      } finally {
        // Stop the loading state after the fetch is complete
        setLoading(false);
      }
    };

    fetchBlueprintDetails(); // Invoke the function
  }, [id, authToken, navigate]); // Dependencies for the useEffect hook

  // Show a loading state while the data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show an error message if an error occurred during data fetching
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Render the blueprint details if data is successfully fetched
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Blueprint Details for ID: {id}</h1>
      <h2 className="text-xl mb-2">Name: {blueprint.name}</h2>
      <p className="mb-2"><strong>Description:</strong> {blueprint.description}</p>
      
      {/* Button to edit the blueprint */}
      <button
        onClick={() => navigate('/blueprint-editor', { state: { onLoadBlueprintId: id } })} // Pass the ID to the blueprint editor
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
      >
        Edit
      </button>
    </div>
  );
};

export default BlueprintDetails;
