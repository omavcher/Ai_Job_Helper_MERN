import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voice, setVoice] = useState(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Choose the best female voice available
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes('Google UK English Female') || // UK English Female
          voice.name.includes('Google US English Female') || // US English Female
          voice.name.includes('Microsoft Hazel') // Windows default soft female voice
      );
      setVoice(femaleVoice || voices[0]); // Fallback to the first available voice
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices; // Re-load voices if changed
  }, []);

  const speakText = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);

      const speech = new SpeechSynthesisUtterance(text);
      speech.voice = voice;
      speech.lang = 'en-US'; // English (United States)
      speech.rate = 1; // Normal speed (can adjust for a faster/slower effect)
      speech.pitch = 1.1; // Slightly higher pitch for a soft, pleasant voice
      speech.volume = 1; // Maximum volume

      speech.onend = () => setIsSpeaking(false); // Reset speaking status when done
      window.speechSynthesis.speak(speech);
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Text-to-Speech with Realistic Female Voice</h2>
      <textarea
        rows="4"
        cols="50"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text here..."
        style={{ padding: '10px', fontSize: '16px', width: '80%' }}
      />
      <br />
      <button
        onClick={speakText}
        disabled={isSpeaking}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '18px',
          cursor: 'pointer',
          background: '#6200ea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {isSpeaking ? 'Speaking...' : 'Convert to Audio'}
      </button>
    </div>
  );
};

export default TextToSpeech;
