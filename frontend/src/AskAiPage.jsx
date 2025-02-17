import React, { useState, useEffect, useRef } from 'react';
import './AskAiPage.css';
import config from './api/config';

const AskAiPage = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);
  const chatBoxRef = useRef(null); // Reference for chat scrolling
  const inputRef = useRef(null); // Reference for input auto-focus

  // Fetch AI response
  const fetchAIResponse = async (input) => {
    try {
      const response = await fetch(`${config.apiUrl}/ai/ask-ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "Sorry, I couldn't process that request.";
    }
  };

  // Send message and update conversation
  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    // Add user message
    setConversation((prev) => [...prev, { user: userInput, ai: null }]);

    // Fetch AI response
    const aiResponse = await fetchAIResponse(userInput);
    setConversation((prev) => [...prev, { user: null, ai: { text: aiResponse } }]);

    // Clear input field after sending message
    setUserInput('');
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Auto-scroll to the bottom when conversation updates
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [conversation]);

  // Auto-focus on input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="ask-ai-page-container">
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

      <div className="input-container">
        <input
          ref={inputRef} // Auto-focus input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask something..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default AskAiPage;
