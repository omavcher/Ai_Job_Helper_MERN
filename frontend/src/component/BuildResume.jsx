// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect } from 'react';
import { jsPDF } from "jspdf";
import './BuildResume.css';
import axios from 'axios'; 
import config from '../api/config'
import Notification from '../components/Notification';

const BuildResume = () => {
  
  const [activeSection, setActiveSection] = useState('experience');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    job_type: '',
    });
  const [resumeData, setResumeData] = useState({
    position: userDetails.job_type,
    company: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    skills: [],
    education: [],
    experience: '',
    bulletPoints: []
  });


  const [showColorPicker, setShowColorPicker] = useState(false);
  const [themeColor, setThemeColor] = useState('palevioletred');
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          console.log('No token found');
          return;
        }

        const response = await axios.get(`${config.apiUrl}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserDetails(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array means this runs once when component mounts

  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDownloadPDF = () => {
    // Check if all required fields are filled
    if (
      !userDetails.name ||
      !userDetails.email ||
      !resumeData.position ||
      !resumeData.company ||
      !resumeData.city ||
      !resumeData.state ||
      !resumeData.startDate ||
      !resumeData.endDate ||
      resumeData.skills.length === 0 ||
      resumeData.education.length === 0
    ) {
      setNotification({
        show: true,
        message: 'Please fill in all required fields before downloading the resume.',
        type: 'info'
      });
      return;
    }
  
    const doc = new jsPDF();
    const resumeContent = document.querySelector('.resume-doc');
    const margin = 5;
    const pageWidth = doc.internal.pageSize.getWidth() - margin * 2;
    const pageHeight = doc.internal.pageSize.getHeight() - margin * 2;
  
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
  
    doc.html(resumeContent, {
      callback: function (doc) {
        doc.save(`${userDetails.name.replace(/\s+/g, '_')}_resume.pdf`);
        setNotification({
          show: true,
          message: 'Resume downloaded successfully!',
          type: 'success'
        });
      },
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: 500,
    });
  };
  

  // Add this function to handle theme color change
  const handleThemeChange = (color) => {
    setThemeColor(color);
    setShowColorPicker(false);
  };

  const handleNextSection = () => {
    if (activeSection === 'experience') {
      setActiveSection('education');
    } else if (activeSection === 'education') {
      setActiveSection('skills');
    }
  };

  const handlePrevSection = () => {
    if (activeSection === 'skills') {
      setActiveSection('education');
    } else if (activeSection === 'education') {
      setActiveSection('experience');
    }
  };

  const handleAddEducation = () => {
    if (resumeData.education.length < 2) {
      setResumeData({
        ...resumeData,
        education: [...resumeData.education, {
          institution: '',
          course: '',
          eduStartDate: '',
          eduEndDate: ''
        }]
      });
    } else {
      alert('Maximum 2 education entries allowed');
    }
  };

  const handleAddSkill = () => {
    if (resumeData.skills.length < 8) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, { name: '', level: 'Beginner' }]
      });
    } else {
      alert('Maximum 8 skills allowed');
    }
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = resumeData.skills.map((skill, i) => {
      if (i === index) {
        return { ...skill, [field]: value };
      }
      return skill;
    });
    setResumeData({
      ...resumeData,
      skills: updatedSkills
    });
  };

  const handleAIGenerate = async () => {
    if (!resumeData.position || !resumeData.company || !resumeData.city || !resumeData.state) {
      setNotification({
        show: true,
        message: 'Please fill in Position Title, Company Name, City and State before generating AI content',
        type: 'warning'
      });
      return;
    }

    try {
      const response = await axios.post(`${config.apiUrl}/ai/resume-data-get`, {
        position: resumeData.position,
        company: resumeData.company,
        city: resumeData.city,
        state: resumeData.state
      });

      const data = response.data;
      
      setResumeData(prevData => ({
        ...prevData,
        experience: data.experience,
        bulletPoints: data.bulletPoints
      }));
      
      setNotification({
        show: true,
        message: 'AI content generated successfully!',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to generate AI content. Please try again.',
        type: 'error'
      });
    }
  };

  return (
    <div className="build-resume-container-build">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="build-resume-left-section8">

        <div className='w-full flex justify-between'>
        <button className="theme-button" onClick={() => setShowColorPicker(true)}>
          <i className="fa-solid fa-palette"></i> Theme
        </button>

        {/* Add color picker overlay */}
        {showColorPicker && (
          <div className="color-picker-overlay">
            <div className="color-picker-container">
              <h3>Select Theme Color</h3>
              <div className="color-options">
                <button onClick={() => handleThemeChange('#ff69b4')} style={{backgroundColor: '#ff69b4'}}></button>
                <button onClick={() => handleThemeChange('#4169e1')} style={{backgroundColor: '#4169e1'}}></button>
                <button onClick={() => handleThemeChange('#32cd32')} style={{backgroundColor: '#32cd32'}}></button>
                <button onClick={() => handleThemeChange('#ff8c00')} style={{backgroundColor: '#ff8c00'}}></button>
                <button onClick={() => handleThemeChange('#8a2be2')} style={{backgroundColor: '#8a2be2'}}></button>
              </div>
              <button className="close-btn" onClick={() => setShowColorPicker(false)}>Close</button>
            </div>
          </div>
        )}

<span className='nest-padj-e'>
        <button onClick={handlePrevSection}>
        <i className="fa-solid fa-left-long"></i>
        </button>
        <button onClick={handleNextSection}>
        <i className="fa-solid fa-right-long"></i>
        </button>
</span>



</div>
        <form>

          {activeSection === 'experience' ? (
            <div className="profesnal-inpiscc33">

     <div className="profesnal-inpiscc3-sectin-1">
      <label>
            Position Title
            <input
              type="text"
              name="position"
              value={resumeData.position}
              onChange={handleChange}
            />
          </label>

          <label>
            Company Name
            <input
              type="text"
              name="company"
              value={resumeData.company}
              onChange={handleChange}
            />
          </label>
     </div>
          
     <div className="profesnal-inpiscc3-sectin-1">

          <label>
            City
            <input
              type="text"
              name="city"
              value={resumeData.city}
              onChange={handleChange}
            />
          </label>

          <label>
            State
            <input
              type="text"
              name="state"
              value={resumeData.state}
              onChange={handleChange}
            />
          </label>
          </div>

          <div className="profesnal-inpiscc3-sectin-1">

          <label>
            Start Date
            <input
              type="date"
              name="startDate"
              value={resumeData.startDate}
              onChange={handleChange}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              name="endDate"
              value={resumeData.endDate}
              onChange={handleChange}
            />
          </label>
          </div>

      <div className="ai-btn-sunds-contai">
          <button 
            className='ai-summ-btn4' 
            type="button"
            onClick={handleAIGenerate}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path stroke="currentColor" d="M14.5 9V5.5h-13v9H9M1.5 5.5v-4h13v4h-13ZM3 3.5h1M5 3.5h1M7 3.5h1"/>
              <path fill="currentColor" d="m12 8.5.99 2.51 2.51.99-2.51.99L12 15.5l-.99-2.51L8.5 12l2.51-.99L12 8.5ZM8 7l.566 1.434L10 9l-1.434.566L8 11l-.566-1.434L6 9l1.434-.566L8 7Z"/>
            </svg> Generate from AI
          </button>
      </div>

</div>
          ) : activeSection === 'education' ? (
            <div className="education-inputs">
              {resumeData.education.map((edu, index) => (
                <div key={index}>
                  <div className="profesnal-inpiscc3-sectin-1">
                    <label>
                      Institution Name
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const updatedEducation = resumeData.education.map((item, i) => 
                            i === index ? { ...item, institution: e.target.value } : item
                          );
                          setResumeData({
                            ...resumeData,
                            education: updatedEducation
                          });
                        }}
                      />
                    </label>

                    <label>
                      Course/Degree
                      <input
                        type="text"
                        value={edu.course}
                        onChange={(e) => {
                          const updatedEducation = resumeData.education.map((item, i) => 
                            i === index ? { ...item, course: e.target.value } : item
                          );
                          setResumeData({
                            ...resumeData,
                            education: updatedEducation
                          });
                        }}
                      />
                    </label>
                  </div>

                  <div className="profesnal-inpiscc3-sectin-1">
                    <label>
                      Start Date
                      <input
                        type="date"
                        value={edu.eduStartDate}
                        onChange={(e) => {
                          const updatedEducation = resumeData.education.map((item, i) => 
                            i === index ? { ...item, eduStartDate: e.target.value } : item
                          );
                          setResumeData({
                            ...resumeData,
                            education: updatedEducation
                          });
                        }}
                      />
                    </label>

                    <label>
                      End Date
                      <input
                        type="date"
                        value={edu.eduEndDate}
                        onChange={(e) => {
                          const updatedEducation = resumeData.education.map((item, i) => 
                            i === index ? { ...item, eduEndDate: e.target.value } : item
                          );
                          setResumeData({
                            ...resumeData,
                            education: updatedEducation
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className="add-education-btn" 
                onClick={handleAddEducation}
              >
                <i className="fa-solid fa-plus"></i> Add Education
              </button>
            </div>
          ) : activeSection === 'skills' ? (
            <div className="skills-inputs">
              <h3>Skills</h3>
              {resumeData.skills.map((skill, index) => (
                <div key={index} className="profesnal-inpiscc3-sectin-1">
                  <label>
                    Skill Name
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                    />
                  </label>
                  <label>
                    Skill Level
                    <select
                      value={skill.level}
                      onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
                      style={{
                        appearance: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none',
                        padding: '8px 12px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'white',
                        fontSize: '14px',
                        width: '100%',
                        cursor: 'pointer',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        '&:focus': {
                          border: '2px solid #cab3f8',
                          boxShadow: '0 0 5px rgba(180, 151, 237, 0.6)'
                        }
                      }}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </label>
                </div>
              ))}
              <button 
                type="button" 
                className="add-education-btn" 
                onClick={handleAddSkill}
              >
                <i className="fa-solid fa-plus"></i> Add Skill
              </button>
            </div>
          ) : (
            <div className="education-inputs">
              <div className="profesnal-inpiscc3-sectin-1">
                <label>
                  Institution Name
                  <input
                    type="text"
                    name="institution"
                    value={resumeData.education.institution}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      education: {
                        ...resumeData.education,
                        institution: e.target.value
                      }
                    })}
                  />
                </label>

                <label>
                  Course/Degree
                  <input
                    type="text"
                    name="course"
                    value={resumeData.education.course}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      education: {
                        ...resumeData.education,
                        course: e.target.value
                      }
                    })}
                  />
                </label>
              </div>

              <div className="profesnal-inpiscc3-sectin-1">
                <label>
                  Start Date
                  <input
                    type="date"
                    name="eduStartDate"
                    value={resumeData.education.eduStartDate}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      education: {
                        ...resumeData.education,
                        eduStartDate: e.target.value
                      }
                    })}
                  />
                </label>

                <label>
                  End Date
                  <input
                    type="date"
                    name="eduEndDate"
                    value={resumeData.education.eduEndDate}
                    onChange={(e) => setResumeData({
                      ...resumeData,
                      education: {
                        ...resumeData.education,
                        eduEndDate: e.target.value
                      }
                    })}
                  />
                </label>
              </div>
            </div>
          )}



<div className="form-actions">
  <button 
    type="button" 
    className="download-pdf-btn"
    onClick={handleDownloadPDF}
  >
    <i className="fa-solid fa-download"></i> Download PDF
  </button>
</div>



        </form>
      </div>

      <div className="preview-resume-left-section8">
        <div className="resume-doc">
          <header style={{ backgroundColor: themeColor }}></header>

          <div className='resume-doc-user-detail'>
            <h1 style={{ color: themeColor }}>{userDetails.name || 'Your Name'}</h1>
            
            <span style={{borderBottom: `1px solid ${themeColor}`}} className='resume-doc-user-detail-spand'>
              <p style={{ color: themeColor }} >{resumeData.city} , {resumeData.state}</p>
              <strong>{resumeData.position}</strong>
              <p style={{ color: themeColor }} >{userDetails.email || 'your.email@example.com'}</p>
            </span>
          </div>

      <p className='resume-doc-user-skills-area'>
        {resumeData.experience?.split(' ').slice(0, 38).join(' ')}
      </p>

<div className='resume-doc-professnal-experina-sa'>
<header style={{ color: themeColor, borderBottom: `2px solid ${themeColor}` }} >Professional Experience</header>
<h3 style={{ color: themeColor , fontSize:'1.2rem' , fontWeight:'bold' , padding:'0px 10px' , margin:'0'}}>{resumeData.position}</h3>
<span className='oc-dsjohofs'> <p>{resumeData.company}, {resumeData.city} , {resumeData.state} </p>  <p>{resumeData.startDate} - {resumeData.endDate} </p> </span>

<div style={{width:'100%',display:'flex',alignItems:'start',padding:'0 25px'}}> 
  <ul style={{listStyleType:"disc" , fontSize:'0.8rem' , marginTop:'10px'}}>
    <li>{resumeData.experience?.length > 150 ? 
      `${resumeData.experience.substring(0, 150)}` : 
      resumeData.experience}
    </li>
    {resumeData.bulletPoints.map((point, index) => (
      <li key={index}>
        {point.length > 150 ? `${point.substring(0, 150)}` : point}
      </li>
    ))}
  </ul>
</div>
</div>


<div className='resume-doc-educta-5dvdxv'>
  <header style={{ color: themeColor, borderBottom: '2px solid ' + themeColor, marginBottom:'10px'}} >Education</header>
  
  {resumeData.education.map((edu, index) => (
    <div key={index}>
      <h3 style={{ color: themeColor, fontSize:'0.9rem', fontWeight:'bold', padding:'0px 10px', margin:'0'}}>
        {edu.institution}
      </h3>
      <span className='oc-dsjohofs'> 
        <p>{edu.course}</p>  
        <p>{edu.eduStartDate} - {edu.eduEndDate}</p> 
      </span>
    </div>
  ))}
</div>






<div className='resumecdcdcd-5dvdxv'>
<header style={{ color: themeColor, borderBottom: '2px solid ' + themeColor, marginBottom:'10px'}} >Skills</header>

<div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'space-evenly'}}>
  <div style={{width:'50%'}}>
    {resumeData.skills.slice(0, Math.ceil(resumeData.skills.length/2)).map((skill, index) => (
      <span key={index} style={{width:'100%', display:'flex', gap:'10px', alignItems:'center', justifyContent:'space-evenly', padding:'1px 30px'}}>
        <p>{skill.name}</p>  <p>{skill.level}</p>
      </span>
    ))}
  </div>

  <div style={{width:'50%'}}>
    {resumeData.skills.slice(Math.ceil(resumeData.skills.length/2)).map((skill, index) => (
      <span key={index} style={{width:'100%', display:'flex', gap:'10px', alignItems:'center', justifyContent:'space-evenly', padding:'1px 30px'}}>
        <p>{skill.name}</p>  <p>{skill.level}</p>
      </span>
    ))}
  </div>
</div>







</div>





        </div>
      </div>
    </div>
  );
};

export default BuildResume;
