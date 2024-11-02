// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import BlueprintEditor from './pages/BlueprintEditor';
import BlueprintGallery from './pages/BlueprintGallery';
import BlueprintDetails from './pages/BlueprintDetails';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> {/* Use element prop */}
        <Route path="/login" element={<LoginPage />} /> {/* Use element prop */}
        <Route path="/signup" element={<SignupPage />} /> {/* Use element prop */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* Use element prop */}
        <Route path="/blueprint-editor" element={<BlueprintEditor />} /> {/* Use element prop */}
        <Route path="/blueprint-gallery" element={<BlueprintGallery />} /> {/* Use element prop */}
        <Route path="/blueprint/:id" element={<BlueprintDetails />} /> {/* Use element prop */}
        <Route path="/profile" element={<ProfilePage />} /> {/* Use element prop */}
        <Route path="*" element={<ErrorPage />} /> {/* Fallback for undefined routes */}
      </Routes>
    </Router>
  );
};

export default App;
