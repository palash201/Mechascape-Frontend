import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Rect } from 'fabric';
import api from '../api'; // Import the Axios instance

const BlueprintEditor = () => {
  const canvasRef = useRef(null);
  const [authToken, setAuthToken] = useState(null); // State for storing authentication token

  useEffect(() => {
    // Create a new Fabric.js canvas instance
    const canvas = new Canvas(canvasRef.current, {
      height: 600,
      width: 800,
      backgroundColor: '#f0f0f0',
    });

    // Create a rectangle object
    const rect = new Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 50,
      height: 50,
      selectable: true,
    });

    // Add the rectangle to the canvas
    canvas.add(rect);

    return () => {
      canvas.dispose();
    };
  }, []);

  // Function to generate a blueprint (replace with actual logic)
  const generateBlueprint = async () => {
    try {
      const response = await api.post('/blueprints/generate', {
        // Add parameters as needed for blueprint generation
      });
      console.log('Generated blueprint:', response.data);
    } catch (error) {
      console.error('Error generating blueprint:', error);
    }
  };

  // Function to save the blueprint
  const saveBlueprint = async (blueprintData) => {
    try {
      const response = await api.post('/blueprints/save', blueprintData, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include auth token if necessary
        },
      });
      console.log('Blueprint saved:', response.data);
    } catch (error) {
      console.error('Error saving blueprint:', error);
    }
  };

  // Function to load a blueprint
  const loadBlueprint = async (blueprintId) => {
    try {
      const response = await api.get(`/blueprints/${blueprintId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`, // Include auth token if necessary
        },
      });
      console.log('Loaded blueprint:', response.data);
      // Logic to render the loaded blueprint on the canvas
    } catch (error) {
      console.error('Error loading blueprint:', error);
    }
  };

  // Function to authenticate a user (login)
  const authenticateUser = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      setAuthToken(response.data.access_token); // Save the token in state
      console.log('User authenticated:', response.data);
    } catch (error) {
      console.error('Error authenticating user:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Blueprint Editor</h1>
      <canvas
        ref={canvasRef}
        className="border border-gray-300"
        width={800}
        height={600}
      ></canvas>
      <button onClick={generateBlueprint}>Generate Blueprint</button>
      <button onClick={() => saveBlueprint({ /* your blueprint data */ })}>Save Blueprint</button>
      <button onClick={() => loadBlueprint('blueprintId')}>Load Blueprint</button>
      <button onClick={() => authenticateUser('username', 'password')}>Login</button>
    </div>
  );
};

export default BlueprintEditor;
