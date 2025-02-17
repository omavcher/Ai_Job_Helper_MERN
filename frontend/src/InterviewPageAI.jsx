// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect, useRef } from 'react';
import './InterviewPageAI.css'; // Make sure to style the page

const InterviewPageAI = () => {
  const videoRef = useRef(null); // Using a ref to directly access the video element
  const [videoStream, setVideoStream] = useState(null);
  const [talkAiValue, setAiTalkValue] = useState(false); // State to control animation
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [transcriptText, setTranscriptText] = useState(""); // State to store transcript text

  // Countdown Timer Logic
  useEffect(() => {
    if (showCountdown) {
      let timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Cleanup interval on unmount
    }
  }, [showCountdown]);

  useEffect(() => {
    if (countdown === 0) {
      setShowCountdown(false); // Hide countdown when it reaches 0
      welcomeUser(); // Call the welcome function after countdown ends
    }
  }, [countdown]);

  // Welcome Function using Speech Synthesis
  const welcomeUser = () => {
    const message = "Welcome to your AI interview. Let's begin!";
    
    // Set the transcript text
    setTranscriptText(message);

    // Delay the speech to allow the text to display first
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(message);
      window.speechSynthesis.speak(utterance); // Speak the message
    }, 500); // Delay speech for 500ms (you can adjust this delay as needed)
  };

  const startInterview = () => {
    setCountdown(10); // Reset countdown
    setShowCountdown(true); // Start countdown
  };

  // Video Stream Logic
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
      }
    };

    startVideo();

    return () => {
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="ai-nx4interview-container">
      {showCountdown && (
        <div className="fullscreen-countdown">
          <p>Prepare yourself - The Interview is about to begin.</p>
          <div className="countdown-number">{countdown}</div>
        </div>
      )}

      <div className='ai-443view-container-top-33'>
        <div className='ai-human-video-dsd333'>
          <div className='user-human-camera-inda5'>
            <span className='name-stajd-cd'>Om Awchar</span>
            <video ref={videoRef} className='' autoPlay playsInline></video>
          </div>
          <div className='aiinf-ai-camera-inda5'>
            <span className='name-stajd-cd'>AI</span>
            <img src='https://media.istockphoto.com/id/1029035836/photo/ai-robot-thinking.jpg?s=612x612&w=is&k=20&c=RUA1Moqa3_aXJ9E3tq_QuSc9Jo9TlAlG8mXh6tbV0go=' alt="AI Image" />
            <div className={`ai-cir-outer-3 ${talkAiValue ? 'wave-animation' : ''}`} />
          </div>
        </div>

        <div className='ai-trancript-cdcsd'>
          <header>Transcripts</header>
          <img src='https://interview.talently.ai/_next/image?url=%2Fimages%2Fgif%2Fmock-interview-creation.gif&w=1080&q=75' alt="Interview Gif" />
          <p>Click Start Interview to get started. You must share your screen to attempt the interview. This is to prevent plagiarism during the interview.</p>
          <div className="transcript-text">
            <p style={{color:'red'}}>{transcriptText}</p> 
          </div>
        </div>
      </div>

      <div className='ai-contrios339'>
        <button onClick={startInterview}>Start Interview</button>
      </div>
    </div>
  );
};

export default InterviewPageAI;
