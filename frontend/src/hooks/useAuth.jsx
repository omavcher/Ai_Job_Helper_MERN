import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../api/config'; // Your API config

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);  // Log the token to see if it's retrieved correctly
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
  
    // Make an API request to verify the token
    const verifyToken = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('API Response:', response.data); // Log the response to check it
        if (response.data) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error authenticating:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
  
    verifyToken();
  }, []);
  

  return { isAuthenticated, loading };
};

export default useAuth;
