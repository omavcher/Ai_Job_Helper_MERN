// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import config from './api/config';
import LoadingSpinner from './component/LoadingSpinner';
import Notification from './components/Notification';

const JobRoadmapsPage = () => {
  const [selectedRole, setSelectedRole] = useState('Full-Stack Developer');
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const jobRoles = [
    'Full-Stack Developer',
    'Data Scientist',
    'Software Engineer',
    'Product Manager',
    'Machine Learning Engineer',
    'DevOps Engineer',
    'Cloud Architect',
  ];

  // Phase colors for different levels
  const phaseColors = {
    Beginner: '#64b5f6', // Light Blue
    Intermediate: '#81c784', // Light Green
    Advanced: '#ffb74d', // Light Orange
  };

  const fetchRoadmapData = async (role) => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch(`${config.apiUrl}/ai/get-roadmap`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole: role, date: today }),
      });

      const data = await response.json();
      const aiResponse = data.response;

      // Clean the response string by removing the code block markdown
      const cleanedResponse = aiResponse.replace(/```json\n|\n```/g, '');

      const parsedData = JSON.parse(cleanedResponse);

      // Map the parsed data to the required format
      const mappedData = Object.keys(parsedData).map((phase) => {
        return {
          phase,
          skills: parsedData[phase].skills,
          projects: parsedData[phase].projects,
          resources: parsedData[phase].resources,
          estimatedTime: parsedData[phase].estimatedTime,
        };
      });

      // Store the fetched data in localStorage
      localStorage.setItem(`roadmapData_${role}`, JSON.stringify(mappedData));
      localStorage.setItem('selectedRole', role);

      setRoadmapData(mappedData); 
      setNotification({ show: true, message: "Roadmap loaded successfully!", type: "success" });
    } catch (error) {
      console.error('Error fetching roadmap data:', error);
      setNotification({ 
        show: true, 
        message: "Failed to load roadmap. Please try again.", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedRole = localStorage.getItem('selectedRole');
    const storedRoadmapData = localStorage.getItem(`roadmapData_${storedRole || selectedRole}`);

    // Clear localStorage or fetch new data when job role changes
    if (storedRole !== selectedRole) {
      localStorage.removeItem(`roadmapData_${storedRole}`);
      fetchRoadmapData(selectedRole);
    } else {
      if (storedRoadmapData) {
        setRoadmapData(JSON.parse(storedRoadmapData));
      } else {
        fetchRoadmapData(selectedRole);
      }
    }
  }, [selectedRole]);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <div className="job-roadmaps-container" style={{ width: "100%", padding: '30px', backgroundColor: 'white' }}>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="career-path-selector" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2rem', color: '#333', fontWeight: '600' }}>Select Job Role</h2>
        <select
          onChange={(e) => setSelectedRole(e.target.value)}
          value={selectedRole}
          className="role-dropdown"
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ddd',
            backgroundColor: '#fff',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {jobRoles.map((role, index) => (
            <option key={index} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>

      <div className="roadmap" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <VerticalTimeline layout="1-column" style={{ backgroundColor: '#0000', borderRadius: '8px' }}>
          {roadmapData.map((roadmap, index) => (
            <VerticalTimelineElement
              key={index}
              iconStyle={{
                background: phaseColors[roadmap.phase], 
                color: '#fff',
                borderRadius: '50%',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              icon={<div />}
              style={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '15px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
              lineStyle={{
                borderLeft: '3px solid black',
                transition: 'border-color 0.3s ease',
              }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>{roadmap.phase}</h3>
              <p style={{ fontSize: '1rem', color: '#555' }}><strong>Skills:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                {roadmap.skills?.map((skill, idx) => (
                  <li key={idx} style={{ color: 'blue', fontSize: '1rem', marginBottom: '5px' }}>
                    {skill}
                  </li>
                )) || <li>No skills listed</li>}
              </ul>
              <p style={{ fontSize: '1rem', color: '#555' }}><strong>Projects:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                {roadmap.projects?.map((project, idx) => (
                  <li key={idx} style={{ color: 'blue', fontSize: '1rem', marginBottom: '5px' }}>
                    {project}
                  </li>
                )) || <li>No projects listed</li>}
              </ul>
              <p style={{ fontSize: '1rem', color: '#555' }}><strong>Resources:</strong></p>
              <ul style={{ paddingLeft: '20px' }}>
                {roadmap.resources?.map((resource, idx) => (
                  <li key={idx} style={{ color: 'blue', fontSize: '1rem', marginBottom: '5px' }}>
                    {resource}
                  </li>
                )) || <li>No resources listed</li>}
              </ul>
              <p style={{ fontSize: '1rem', color: '#555' }}><strong>Estimated Time:</strong> {roadmap.estimatedTime || "Not available"}</p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </div>
  );
};

export default JobRoadmapsPage;
