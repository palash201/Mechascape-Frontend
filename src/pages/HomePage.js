// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">Welcome to Mechascape!</h1>
      <p className="mb-6">An AI-powered tool for creating, modifying, and visualizing steampunk-inspired blueprints.</p>
      <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Login
      </Link>
      <Link to="/signup" className="ml-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Sign Up
      </Link>
    </div>
  );
};

export default HomePage;
