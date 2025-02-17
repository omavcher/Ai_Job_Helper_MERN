// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./LiveCodingSection.css";
import { Link, useNavigate } from 'react-router-dom';
import Notification from "../components/Notification";

const codeSnippets = [
  `function <span class="keyword">add</span>(a, b) {<br> &nbsp;&nbsp;return a + b;<br>}`,
  `<span class="keyword">const</span> fetchData = async () => {<br> &nbsp;&nbsp;<span class="function">const</span><br> response = await fetch(<span class="string">'https://api.example.com'</span>);<br> &nbsp;&nbsp;<span class="function">const</span> data = await response.json();<br> &nbsp;&nbsp;<span class="function">console.log</span>(data);<br>};`,
  `<span class="keyword">class</span> Person {<br> &nbsp;&nbsp;<span class="function">constructor</span>(name) {<br> &nbsp;&nbsp;&nbsp;&nbsp;this.name = name;<br> &nbsp;&nbsp;}<br> &nbsp;&nbsp;greet() {<br> &nbsp;&nbsp;&nbsp;&nbsp;<span class="function">console.log</span>(<span class="string">'Hello, '</span> + this.name);<br> &nbsp;&nbsp;}<br>}`
];

const LiveCodingSection = () => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [index, setIndex] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);  // Track question visibility
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    let i = 0;
    const code = codeSnippets[index];
    setDisplayedCode(""); // Reset before typing
    
    const interval = setInterval(() => {
      if (i < code.length) {
        setDisplayedCode((prev) => prev + code[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 75); // Slower typing speed

    return () => clearInterval(interval);
  }, [index]);

  useEffect(() => {
    const changeSnippet = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % codeSnippets.length);
    }, 7000); // Change snippet every 7 seconds

    return () => clearInterval(changeSnippet);
  }, []);

  const handleTryNow = () => {
    navigate("/live-coding");
    setNotification({
      show: true,
      message: 'Welcome to live coding practice!',
      type: 'info'
    });
  };

  return (
    <motion.div className="live-coding-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <span className='fullscreen-livc'>
        <Link to={"/live-coding"}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
            <path stroke="currentColor" d="M9 2.5h4.5V7M13.5 2.5 9 7M7 9l-4.5 4.5M7 13.5H2.5V9"/>
          </svg>
        </Link>
      </span>  
      
      <h2>Code in Real-Time, Get AI Hints</h2>
      <p>Practice coding challenges in our built-in editor with AI-powered suggestions.</p>
      
      {showQuestions ? (
        <motion.div className="questions-menu">
          {/* Render your questions list here */}
          <ul>
            <li><button >Question 1</button></li>
            <li><button>Question 2</button></li>
            <li><button >Question 3</button></li>
          </ul>
        </motion.div>
      ) : (
        <motion.div className="code-editor-ooojce5" transition={{ duration: 0.3 }}>
          <pre><code dangerouslySetInnerHTML={{ __html: displayedCode }}></code><span className="cursor">|</span></pre>
        </motion.div>
      )}
      
      {!showQuestions && (
        <button className="try-now-btn" onClick={handleTryNow}>Try Now</button>
      )}
    </motion.div>
  );
};

export default LiveCodingSection;
