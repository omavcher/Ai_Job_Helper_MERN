// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import { useState, useEffect } from "react";
import { useNavigate , Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./JobRoadmaps.css";

const roadmaps = {
  "Software Engineer": [
    "Learn Programming Basics (Python, Java, C++)",
  ],
  "Data Scientist": [
    "Master Python & SQL",
  ],
  "UI/UX Designer": [
    "Learn Design Principles & Tools (Figma, Adobe XD)",
  ],
  "Cybersecurity Expert": [
    "Understand Networking & OS Security",
  ],
  "DevOps Engineer": [
    "Learn Linux & Cloud Platforms",
  ],
  "Game Developer": [
    "Learn Game Engines (Unity, Unreal Engine)",
  ],
  "AI Engineer": [
    "Master Python & Deep Learning Frameworks (TensorFlow, PyTorch)",
  ],
  "Cloud Engineer": [
    "Learn AWS, Azure, or Google Cloud",
  ],
  "Blockchain Developer": [
    "Understand Cryptography & Smart Contracts",
  ],
  "Product Manager": [
    "Understand Product Lifecycle & Market Research",
  ],
};

const careerKeys = Object.keys(roadmaps);

const JobRoadmaps = () => {
  const [selectedCareer, setSelectedCareer] = useState(careerKeys[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomCareer = careerKeys[Math.floor(Math.random() * careerKeys.length)];
      setSelectedCareer(randomCareer);
    }, Math.floor(Math.random() * 3000) + 5000); // Changes every 5-7 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="job-roadmaps-section"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span className='fullscreen-jobr' >
        <Link to={"/job-roadmaps"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path stroke="currentColor" d="M9 2.5h4.5V7M13.5 2.5 9 7M7 9l-4.5 4.5M7 13.5H2.5V9"/>
          </svg>
        </Link>
      </span>  
      <h2>Your Personalized Career Guide</h2>
      <p>Follow structured learning paths for different job roles.</p>

      <motion.div 
        className="roadmap-preview"
        key={selectedCareer}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3>{selectedCareer} Roadmap</h3>
        <p><strong>Step 1:</strong> {roadmaps[selectedCareer][0]}</p>
      </motion.div>

      <motion.button 
        className="view-roadmap-btn"
        onClick={() => navigate("/job-roadmaps")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        View Full Roadmap
      </motion.button>
    </motion.div>
  );
};

export default JobRoadmaps;