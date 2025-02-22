// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React ,{useEffect , useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./HomePage.css";
import ResumeAnalyzer from '../component/ResumeAnalyzer';
import LiveCodingSection from '../component/LiveCodingSection';
import JobRoadmaps from '../component/JobRoadmaps';
import Pricing from '../component/Pricing';
import axios from 'axios'; 
import config from '../api/config';

const HomePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Auth Token:', token); // Debug log to ensure the token exists

      if (!token) {
        console.log('No token found'); // Debug log if no token found
        setIsAuthenticated(false);
        return;
      }

      // Make the API call to fetch user details
      const response = await axios.get(`${config.apiUrl}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      // If successful, set authentication state and user details
      setIsAuthenticated(true);
      setUserDetails(response.data);

        } catch (error) {
      console.error('Error fetching user details:', error); // Log any error that occurs
      setIsAuthenticated(false); // Set authentication state to false in case of error
    }
  };
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch user details when the component mounts or token changes
    fetchUserDetails();
  }, [token]);  // This will re-run fetchUserDetails whenever the token changes




  const handleRedirectjonb = () => {
    navigate('/job-roadmaps'); // replace with your desired path
  };

  const handleRedirectforme = () => {
    navigate('/community-forum'); // replace with your desired path
  };

  const handleRedirectaiask = () => {
    navigate('/ask-ai'); // replace with your desired path
  }

  return (
    <div className="homepage-cointainer">
      <div className='header-info-cointainer-hm'>

       <div className='header-info-container-section mb-2'>
      {!isAuthenticated && (
        <span className='header-info-container-section-span1 auth-links'>
          <Link to='/login' className="auth-button">Login</Link>
          <Link to='/signup' className="auth-button">Sign Up</Link>
        </span>
      )}
      <span className='header-info-container-section-span2 logo-container'>
        <h1>Ai Hire Me</h1>
        <img src='/logo.png' alt='logo' className="logo" />
      </span>
    </div>



        <p>{new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        <h2>Hello, {userDetails ? userDetails.name: "Fellow Developer"} 👋</h2>
        <div className='home-page-hear-btss'>
          <h1>How can you help today?</h1>
          <span className='home-page-hear-btss-span'>
            <button onClick={handleRedirectaiask} className='ai-ask-btn-hm' style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <img style={{ height: "20px" }} src='https://cdn-icons-png.flaticon.com/512/17653/17653338.png' alt="AI Icon" />
              Ask AI
            </button>
            <button className='jijc-btn-hm' onClick={handleRedirectjonb}>Job Roadmaps</button>
          </span>
        </div>
      </div>

      <div className='homepage-section-onainer'>
        <ResumeAnalyzer />
        <LiveCodingSection />
      </div>

      <div className='homepage-section-onainer'>
        <JobRoadmaps />
      </div>

      {userDetails?.userSubscription === "free" && <Pricing />}

    </div>
  );
};

export default HomePage;
