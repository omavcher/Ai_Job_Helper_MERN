// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SideMenu.css";
import axios from 'axios'; 
import config from '../api/config';
import Notification from '../components/Notification';
import SideMenuTire from "./SideMenuTire";

const SideMenu = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [notification, setNotification] = useState({
    message: '',
    type: '',
    isVisible: false
  });
  const [showPopup, setShowPopup] = useState(false); 

  function navigateToLinkedIn() {
    window.location.href = "https://www.linkedin.com/in/omawchar/"; 
  }


  const togglePopup = () => {
    setShowPopup(!showPopup);
  };
  
  // Function to fetch user details from the backend
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    
    setIsAuthenticated(false);
    setUserDetails(null);

    // Replace alert with notification
    setNotification({
      message: "Logged out successfully!",
      type: "success",
      isVisible: true
    });

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
  };

  return (
    <>
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
      
      <div className="side-menu">
        {isAuthenticated && userDetails ? (
          <div className="sidemenu_profile" onClick={togglePopup}>
            <img
              src={userDetails.profileImage || "https://imgs.search.brave.com/L8g0q2VTDqc0PX3hfAVBBNx6gKLd9JE0Gld8jH4BjvQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjE5/NDAwODEwL3Bob3Rv/L21yLXdoby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9aGFy/VHhXX0lSbDA2Q25o/LTRrbkNudHh3WWlx/V282eWlBeEpUcld5/U0ppRT0"}
              alt="User"
              className="sidemenu-profile-img"
            />
            <div>
              <h3 className="sidemenu_username">{userDetails.name}</h3>
              <p className="sidemenu_profession">{userDetails.job_type}</p>
            </div>

            {/* Small Popup with Logout Button */}
            {showPopup && (
              <div className="profile-popupx">
                <div className="popup-user-info-container">
                  <img src={userDetails.profileImage || "https://imgs.search.brave.com/L8g0q2VTDqc0PX3hfAVBBNx6gKLd9JE0Gld8jH4BjvQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvNjE5/NDAwODEwL3Bob3Rv/L21yLXdoby5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9aGFy/VHhXX0lSbDA2Q25o/LTRrbkNudHh3WWlx/V282eWlBeEpUcld5/U0ppRT0"} alt="User"></img>
                    
                   <span className="popup-user-infospan">
                    <h2>{userDetails.name}</h2>
                    <span>{userDetails.email}</span>
                    </span>

                  </div>
                  <Link to='/setting' className="pop-btn-s4x"><i class="fa-solid fa-gear"></i> Setting</Link>
                <button className="pop-btn-s4x" onClick={handleLogout} ><i class="fa-solid fa-arrow-right-from-bracket"></i>   Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-options">
          </div>
        )}

        {/* Navigation Links */}
        <nav className="side-menunav-links mt-3">
          <Link to="/" className="side-menu-nav-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M1.5 14.5v-8l6.5-5 6.5 5v8h-13Z"/><path fill="currentColor" d="m9.5 5 .848 2.151L12.5 8l-2.152.849L9.5 11l-.849-2.151L6.5 8l2.151-.849L9.5 5ZM5.5 9l.566 1.434L7.5 11l-1.434.566L5.5 13l-.566-1.434L3.5 11l1.434-.566L5.5 9Z"/></svg>Home</Link>
          <Link to="/practice-question" className="side-menu-nav-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M13.5 1.5v1a4 4 0 0 1-4 4H8M10.5 6.5v.742a4 4 0 0 1-3.75 3.992L2.5 11.5"/><path stroke="currentColor" d="M2.5 15v-3.5c0-5.523 4.477-10 10-10H14"/><path fill="currentColor" d="m2.5 1 .424 1.076L4 2.5l-1.076.424L2.5 4l-.424-1.076L1 2.5l1.076-.424L2.5 1ZM11.5 10l.707 1.793L14 12.5l-1.793.707L11.5 15l-.707-1.793L9 12.5l1.793-.707L11.5 10ZM13.5 7l.424 1.076L15 8.5l-1.076.424L13.5 10l-.424-1.076L12 8.5l1.076-.424L13.5 7Z"/></svg>AI Practice Questions</Link>
          <Link to="/live-coding" className="side-menu-nav-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M8 15C1.5 12.5 2.5 3 2.5 3L8 1l5.5 2s.246 2.338-.3 5"/><path fill="currentColor" d="m10.5 7 .99 2.51 2.51.99-2.51.99L10.5 14l-.99-2.51L7 10.5l2.51-.99L10.5 7ZM6.5 4l.707 1.793L9 6.5l-1.793.707L6.5 9l-.707-1.793L4 6.5l1.793-.707L6.5 4Z"/></svg> AI Live Coding</Link>
          <Link to="/resume-analyzer" className="side-menu-nav-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M2.5 6V1.5H11L13.5 4v10.5H10"/><path stroke="currentColor" d="M10.5 1.5v3h3M1.5 15v-4.5l2-2h2V15M7.5 8v7M1.5 12.5h4"/></svg> AI Resume Analyzer</Link>
          <Link to="/job-roadmaps" className="side-menu-nav-item"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M2.5 11 12 1.5 14.5 4 5 13.5H2.5V11ZM9.5 4 12 6.5"/><path fill="currentColor" d="m4 1 .849 2.151L7 4l-2.151.849L4 7l-.849-2.151L1 4l2.151-.849L4 1ZM13 8l.566 1.434L15 10l-1.434.566L13 12l-.566-1.434L11 10l1.434-.566L13 8ZM10 11.5l.424 1.076L11.5 13l-1.076.424L10 14.5l-.424-1.076L8.5 13l1.076-.424L10 11.5Z"/></svg> AI Roadmap</Link>
        </nav>

        <div className="settings text-center">
  {isAuthenticated && userDetails?.userQuota === 0 && userDetails?.userSubscription !== "paid" ? (
    <SideMenuTire />
  ) : (
    <div>
      {/* Show quota only if the user is NOT a paid subscriber */}
      {userDetails?.userSubscription !== "paid" && isAuthenticated && (
       <h2
       className={`heading-font text-xl font-semibold ${
         userDetails?.userQuota <= 3 ? "flash-red" : ""
       }`}
     >
       Your Quota: {userDetails?.userQuota}
     </h2>
     
      )}

      {/* Show Premium Badge if user is subscribed */}
      {userDetails?.userSubscription === "paid" && (
        <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-purple-900 to-purple-500 text-white px-4 py-1 rounded-md shadow-md">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2l2.39 4.84L18 7.26l-3.81 3.71.9 5.27L10 13.77l-4.29 2.47.9-5.27L2 7.26l5.61-.42L10 2z" />
          </svg>
          <span className="font-bold uppercase tracking-wide">Premium User</span>
        </div>
      )}
    </div>
  )}
</div>




        <div className="side-menu-invite-box">
          <h2 className="heading-font">AI Hire Me</h2>
          <p className="body-font">💡 Need help with tech interviews? I built this AI tool to assist you with technical job prep! 🚀 Let's connect on</p>
          <button onClick={navigateToLinkedIn} className="invite-btn-side-menu" role="button"><i className="fa-brands fa-linkedin"></i> LinkedIn</button>
        </div>
      </div>
      {showPopup && <div className="overlay" onClick={() => setShowPopup(false)}></div>}
    </>
  );
};

export default SideMenu;