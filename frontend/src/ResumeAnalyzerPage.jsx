// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

// ResumeAnalyzerPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import mammoth from 'mammoth';
import './ResumeAnalyzerPage.css';
import config from './api/config';
import BuildResume from './component/BuildResume';
import Notification from './components/Notification';


const ResumeAnalyzerPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState(location.state?.resumeText || '');
  const [atsScore, setAtsScore] = useState(null);
  const [recommendation, setRecommendation] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isApiCalled, setIsApiCalled] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state
  const [selectedTemplate, setSelectedTemplate] = useState('template1'); // Store selected template
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    if (resumeText && !isApiCalled) {
      console.log('API Triggered');
      analyzeResume(resumeText);
      setIsApiCalled(true);
    }
  }, [resumeText]);

  const analyzeResume = async (text) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${config.apiUrl}/ai/analyze-resume`,
        { resumeText: text }, // Request body
        { headers: { Authorization: `Bearer ${token}` } } // Headers
      );
  
      console.log('Resume Analysis Response:', response.status, response.data);
      setAtsScore(response.data.atsScore);
      setRecommendation(response.data.recommendation);
  
      if (!response.data.atsScore || response.data.atsScore === 'N/A') {
        setNotification({
          show: true,
          message: 'Error: ATS score is unavailable. Please re-upload the resume.',
          type: 'error'
        });
      } else {
        setNotification({
          show: true,
          message: 'Resume analyzed successfully!',
          type: 'success'
        });
      }
  
      setShowResult(true);
      setLoading(false);
    } catch (error) {
      console.error('Error analyzing resume:', error);
  
      if (error.response) {
        if (error.response.status === 404) {
          setNotification({
            show: true,
            message: 'Error: Resume analysis service not found. Please try again later.',
            type: 'error'
          });
        } else {
          setNotification({
            show: true,
            message: `Error: ${error.response.data?.message || 'Could not analyze resume. Please try again.'}`,
            type: 'error'
          });
        }
      } else {
        setNotification({
          show: true,
          message: 'Error: Network issue. Please check your connection and try again.',
          type: 'error'
        });
      }
  
      setLoading(false);
    }
  };
  

  // Function to handle file upload
  const handleFileUpload = (file) => {
    const fileReader = new FileReader();

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileReader.onload = async (event) => {
        try {
          const result = await mammoth.extractRawText({ arrayBuffer: event.target.result });
          console.log('Extracted DOCX Text: ', result.value);

          navigate('/resume-analyzer-page', { state: { resumeText: result.value, fileURL: file } });
        } catch (err) {
          console.error('Error extracting text from DOCX:', err);
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="resume-analyzer-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {showResult && !errorMessage && resumeText && (
        <div className="resume-feedback-container">
          <div className="resume-feedback">
            <button className="close-btn535355353535" onClick={() => setShowResult(false)}>×</button>
            <h3>Resume Evaluation</h3>
            <div className="score">
              <p><strong>ATS Score:</strong> {atsScore ? atsScore : "Loading..."}</p>
              <div className="score-bar" style={{ width: `${atsScore}%` }}></div>
            </div>

            <div className="improvement-suggestions">
              <h4>Suggestions for Improvement:</h4>
              <p>{recommendation || "No recommendations available."}</p>
            </div>
          </div>
        </div>
      )}

      {/* BuildResume component for generating resumes */}
      <div className="build-resume-container">
        <BuildResume/>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
