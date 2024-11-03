// src/AuthProvider.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../api'; // Adjust the import based on your api setup

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(Cookies.get('authToken') || null);
  const [refreshTimer, setRefreshTimer] = useState(null); // Timer for refreshing token

  useEffect(() => {
    // Initial user state setup if a token exists
    const token = Cookies.get('authToken');
    if (token) {
      setAuthToken(token);
      // Optionally, decode the token to set user info
      // const decoded = jwtDecode(token);
      // setUser(decoded.user); // This assumes you store user data in the token
    }
  }, []);

  const setupRefreshTimer = (token) => {
    if (!token) return; // Check if token is undefined
  
    try {
      const payload = token.split('.')[1]; // Get the payload part
      const decodedPayload = JSON.parse(atob(payload)); // Decode the payload
      const exp = decodedPayload.exp; // Get expiration time
      const expirationTime = exp * 1000; // Convert expiration time to milliseconds
      const currentTime = Date.now();
  
      // Calculate how much time is left until the token expires
      const timeUntilExpiration = expirationTime - currentTime;
  
      // Set a timer to refresh the token a few minutes before it expires
      const refreshTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0); // Refresh 5 minutes before expiration
  
      const timer = setInterval(() => {
        refreshAuthToken();
      }, refreshTime);
  
      setRefreshTimer(timer);
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  };

  const refreshAuthToken = async () => {
    try {
      const response = await api.post('/auth/refresh', {
        // Include any necessary parameters for refreshing the token
      });
      const newToken = response.data.access_token;
      setAuthToken(newToken);
      Cookies.set('authToken', newToken, { expires: 7 }); // Update cookie
      console.log('Token refreshed successfully');
    } catch (error) {
      console.error('Error refreshing token:', error);
      logoutUser(); // Optionally log out the user on refresh failure
    }
  };

  const authenticateUser = async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      });
      const token = response.data.access_token;


      // Set the user and token in context
      setAuthToken(token);

      // Store token in cookies
      Cookies.set('authToken', token, { expires: 7 }); 
      
      // You may also want to set up a refresh timer here if necessary
    } catch (error) {
      console.error('Error authenticating user:', error);
      throw error; // Rethrow error for handling in the login page
    }
  };

  const logoutUser = () => {
    setAuthToken(null);
    Cookies.remove('authToken'); // Clear token from cookies
    if (refreshTimer) {
      clearInterval(refreshTimer); // Clear the timer on logout
    }
  };

  return (
    <AuthContext.Provider value={{ authToken, authenticateUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
