// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../api/config";
import { motion } from "framer-motion";
import Notification from "../components/Notification";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [jobType, setJobType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    let errors = {};
    if (!name) errors.name = "Name is required";
    if (!email) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Enter a valid email";
    }
    if (!password || password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      setNotification({ 
        show: true, 
        message: "Please fix the form errors", 
        type: "error" 
      });
      return;
    }
    try {
      await axios.post(`${config.apiUrl}/auth/signup`, { name, email, password, job_type: jobType });
      const loginResponse = await axios.post(`${config.apiUrl}/auth/login`, { email, password });
      localStorage.setItem("authToken", loginResponse.data.token);
      localStorage.setItem("job_type", loginResponse.data.job_type);
      setNotification({ show: true, message: "Signup successful!", type: "success" });
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      setNotification({ 
        show: true, 
        message: error.response?.data?.message || "Signup failed", 
        type: "error" 
      });
    }
  };

  return (
    <div style={{width:'100%'}} className="flex justify-center items-center min-h-screen  p-4">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Welcome to AI HIRE ME</h1>
        <p className="text-center text-gray-600 mb-6">Join the best platform to get hired by top companies.</p>
        {step === 1 ? (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Select Your Job Role</h2>
            <label className="block text-gray-600 mb-2">Choose your job type to proceed:</label>
            <select onChange={(e) => setJobType(e.target.value)} className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100">
              <option value="">Select...</option>
              <option value="WebDeveloper">Web Developer</option>
              <option value="SoftwareEngineer">Software Engineer</option>
              <option value="DataScientist">Data Scientist</option>
              <option value="MachineLearningEngineer">Machine Learning Engineer</option>
              <option value="FrontendDeveloper">Frontend Developer</option>
              <option value="BackendDeveloper">Backend Developer</option>
              <option value="FullStackDeveloper">Full Stack Developer</option>
              <option value="DevOpsEngineer">DevOps Engineer</option>
              <option value="QAEngineer">QA Engineer</option>
              <option value="UIUXDesigner">UI/UX Designer</option>
              <option value="CloudArchitect">Cloud Architect</option>
              <option value="ProductManager">Product Manager</option>
            </select>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Next
            </motion.button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Create Your Account</h2>
            <input type="text" placeholder="Full Name" onChange={(e) => setName(e.target.value)} className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100" />
            {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100" />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full p-3 mb-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100" />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignup}
              className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Sign Up
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;
