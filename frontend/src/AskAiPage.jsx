import React, { useState, useEffect, useRef } from 'react';
import './AskAiPage.css';
import config from './api/config';
import Notification from './components/Notification';
import Pricing from './component/Pricing';
const AskAiPage = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const [quota, setQuota] = useState(null); // 🟢 Track user quota
  const chatBoxRef = useRef(null); 
  const inputRef = useRef(null); 
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Fetch user quota on page load
  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.apiUrl}/auth/quota`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setQuota(data.quota);
        } else {
          console.error("Error fetching quota:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch quota:", error);
      }
    };

    fetchQuota();
  }, []);

  // Fetch AI response & update quota
  const fetchAIResponse = async (input) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.apiUrl}/ai/ask-ai`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      console.log(data);

      if (response.status === 403) {
        setNotification({ show: true, message: "Quota exceeded. Upgrade for unlimited access.", type: "error" });
        setQuota(0); // Ensure quota is set to 0
        return null; 
      }
      console.log(response);

      if (response.ok) {
        setQuota(data.quota); // 🟢 Update remaining quota
        return data.response;
      } else {
        return "Sorry, I couldn't process that request.";
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "Sorry, I couldn't process that request.";
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (userInput.trim() === '' || quota === 0) return;

    setConversation((prev) => [...prev, { user: userInput, ai: null }]);

    const aiResponse = await fetchAIResponse(userInput);
    if (aiResponse) {
      setConversation((prev) => [...prev, { user: null, ai: { text: aiResponse } }]);
    }

    setUserInput('');
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Auto-scroll
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [conversation]);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="ask-ai-page-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />

      <div className="ask-ai-header">
        <img style={{ height: "40px" }} src='https://cdn-icons-png.flaticon.com/512/17653/17653338.png' alt="AI Icon" />
        <h2>Ask AI</h2>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {conversation.map((message, index) => (
          <div key={index} className="message-container">
            {message.ai && (
              <div className="message ai-message">
                <p>{message.ai.text}</p>
              </div>
            )}

            {message.user && (
              <div className="message user-message">
                <p>{message.user}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {quota > 0 ? (
        <div className="input-container">
          <input
            ref={inputRef} 
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask something..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      ) : (
        <>
        <p className=" w-full flex justify-center items-center text-center">⚠️ Quota exceeded. Upgrade to ask more questions.</p>
        <Pricing/></>
      )}
    </div>
  );
};

export default AskAiPage;
