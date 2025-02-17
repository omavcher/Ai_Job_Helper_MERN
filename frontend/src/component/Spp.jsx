import React, { useState, useEffect } from 'react';

const Spp = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  
  // Initialize SpeechRecognition API (for speech-to-text conversion)
  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      alert('Speech Recognition API is not supported in this browser');
      return;
    }

    const SpeechRecognitionInstance = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognitionInstance();
    recognitionInstance.continuous = true; // Keep listening
    recognitionInstance.lang = 'en-US'; // Set language
    recognitionInstance.interimResults = true; // Get intermediate results as well

    recognitionInstance.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptText = event.results[i][0].transcript;
        currentTranscript += transcriptText;
      }
      setTranscript(currentTranscript); // Update transcript as speech is recognized
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error);
    };

    setRecognition(recognitionInstance);
  }, []);

  // Start recording
  const startRecording = async () => {
    if (recognition) {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-4">Audio Recorder</h2>
        <div className="flex justify-center gap-4 mt-6">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Stop Recording
            </button>
          )}
        </div>
        {transcript && (
          <div className="mt-4">
            <h3 className="font-semibold text-xl text-gray-700">Transcription:</h3>
            <p className="text-gray-600">{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Spp;
