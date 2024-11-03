import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BlueprintEditor from './pages/BlueprintEditor';
import BlueprintGallery from './pages/BlueprintGallery';
import BlueprintDetails from './pages/BlueprintDetails';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';
import { AuthProvider } from './pages/AuthProvider';
import Logor from './components/Logor'; // Import the Logo component

import backgroundImage from './images/background.png';
import './App.css'; // Import the CSS file

// Use in a style prop or inline CSS
const appStyle = {
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: 'cover',
  height: '100vh',
};

const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.75)', // Black with 75% opacity
};

// Create a wrapper component to determine when to show Logor
const AppContent = () => {
  const location = useLocation(); // Get current route

  return (
    <>
      {/* Only show Logor if the current route is not '/blueprint-editor' */}
      {location.pathname !== '/blueprint-editor' && <Logor />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/blueprint-editor" element={<BlueprintEditor />} />
        <Route path="/blueprint-gallery" element={<BlueprintGallery />} />
        <Route path="/blueprint/:id" element={<BlueprintDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <div className="App" style={appStyle}>
        <div style={overlayStyle}>
          <Router>
            <AppContent /> {/* Render the AppContent which includes conditional Logor */}
          </Router>
        </div>
      </div>
    </AuthProvider>
  );
};

export default App;
