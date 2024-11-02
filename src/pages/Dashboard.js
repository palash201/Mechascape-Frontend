// src/pages/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <Link to="/blueprint-editor" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Create New Blueprint
      </Link>
      <div className="mt-5">
        <h2 className="text-2xl">Your Blueprints</h2>
        {/* Ideally, you would map over user blueprints here */}
        {/* Example placeholder for future blueprints */}
        <p className="mt-2">No blueprints available. Create one now!</p>
      </div>
    </div>
  );
};

export default Dashboard;
