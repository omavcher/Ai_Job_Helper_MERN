// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";
import ResumeAnalyzer from '../component/ResumeAnalyzer';
import LiveCodingSection from '../component/LiveCodingSection';
import JobRoadmaps from '../component/JobRoadmaps';

const HomePage = () => {
  const navigate = useNavigate();

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
        <p>{new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        <h2>Hello, Fellow Developer</h2>
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

    </div>
  );
};

export default HomePage;
