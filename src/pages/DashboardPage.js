// src/pages/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider'; // Import AuthProvider context
import api from '../api'; // Ensure you import your Axios instance

const DashboardPage = () => {
    const { authToken } = useAuth(); // Access authToken from AuthProvider
    const [user, setUser] = useState(null); // Local state for user data
    const [blueprintCount, setBlueprintCount] = useState(0);
    const [recentBlueprints, setRecentBlueprints] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authToken) {
            console.log("Navigating back to login");
            navigate('/login'); // Redirect to login if not authenticated
            return; // Prevent further execution
        }

        const fetchUserData = async () => {
            try {
                const response = await api.get('/user/data', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setUser(response.data); // Set user data

                // Fetch the number of blueprints
                const blueprintCountResponse = await api.get('/blueprint/count', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setBlueprintCount(blueprintCountResponse.data.count);
                console.log(blueprintCountResponse)

                // Fetch recent blueprints
                const recentResponse = await api.get('/blueprint/recent', {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setRecentBlueprints(recentResponse.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchUserData();
    }, [authToken, navigate]); // Run effect when authToken changes

    // Function to handle navigation to the blueprint editor
    const handleCreateBlueprint = () => {
        navigate('/blueprint-editor');
    };

    return (
        <div className="max-w-4xl mx-auto p-5">
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            {user && <p>Welcome, {user.username}!</p>} {/* Display username if available */}
            <div className="mb-6">
                <h2 className="text-2xl">Your Blueprints</h2>
                <p>Total Blueprints: {blueprintCount}</p>
                <button
                    onClick={handleCreateBlueprint}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                >
                    Create New Blueprint
                </button>
            </div>
            <div>
                <h2 className="text-2xl">Recent Blueprints</h2>
                {recentBlueprints.length > 0 ? (
                    <ul>
                        {recentBlueprints.map((blueprint) => (
                            <li key={blueprint.id} className="mb-2">
                                <a href={`/blueprint/${blueprint.id}`} className="text-blue-500">
                                    {blueprint.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recent blueprints found.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
