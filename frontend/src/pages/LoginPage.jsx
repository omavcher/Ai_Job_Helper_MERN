// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../api/config";
import { motion } from "framer-motion";
import Notification from "../components/Notification";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${config.apiUrl}/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("job_type", res.data.user.job_type);
      setNotification({ show: true, message: "Login successful!", type: "success" });
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1500);
    } catch (error) {
      setNotification({ show: true, message: "Invalid credentials", type: "error" });
    }
  };

  return (
    <div style={{width:"1440px"}} className="flex justify-center items-center min-h-screen bg-white p-4">
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
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
          onChange={(e) => setPassword(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-br from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-200 transition"
          onClick={handleLogin}
        >
          Login
        </motion.button>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <span className="text-blue-500 cursor-pointer" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;