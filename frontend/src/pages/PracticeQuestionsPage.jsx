// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect } from 'react';
import './PracticeQuestionsPage.css';
import axios from 'axios'; // We can use axios, but in this case, fetch is used
import config from '../api/config';
import LoadingSpinner from '../component/LoadingSpinner';

const PracticeQuestionsPage = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [timer, setTimer] = useState(30);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTimerOver, setShowTimerOver] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(true);
  const [showAnswerSection, setShowAnswerSection] = useState(false);
  const [aiRespose, setAiRespose] = useState('');
  const [showAiResposeing, setshowAiResposeing] = useState(false);

  function formatAdvice(advice) {
    // Split the advice by '**' to handle line breaks and bold text
    return advice.split('**').map((part, index) => {
      // Check for a pattern where the part starts with "*"
      if (part.startsWith('*')) {
        // Remove the "*" and make the rest bold
        const formattedPart = part.slice(1).trim(); // Remove the '*' and trim any spaces
        return (
          <span key={index}>
            <strong>{formattedPart}</strong>
            {index < advice.split('**').length - 1 && <br />} {/* Insert line break if not the last part */}
          </span>
        );
      }
      
      // Otherwise, return the part normally (handle other text)
      return (
        <span key={index}>
          {part}
          {index < advice.split('**').length - 1 && <br />} {/* Insert line break if not the last part */}
        </span>
      );
    });
  }
  
  
  
  // Fetch the questions on page load
  useEffect(() => {
    const storedJobType = localStorage.getItem('job_type');
    if (storedJobType) {
      setSelectedRole(storedJobType);
    } else {
      setSelectedRole('Developer');
    }

    // Fetching the questions from API
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/code/interview-questions/${storedJobType || 'WebDeveloper'}`);
        const data = await response.json();
        setQuestions(data.questions); // Assuming the response contains a 'questions' key
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();

    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarkedQuestions')) || [];
    setBookmarkedQuestions(storedBookmarks);
  }, []);

  // Handle timer
  useEffect(() => {
    if (timer === 0) {
      setShowTimerOver(true);  // Show "Timer Over" when timer reaches 0
      // Hide the "Timer Over" message after 5 seconds
      setTimeout(() => {
        setShowTimerOver(false);
      }, 5000);  // 5000ms = 5 seconds
    }
  }, [timer]);
  
  // Start the timer
  const handleStartTimer = () => {
    setTimerRunning(true);
    setShowTimerOver(false);
    setTimer(30); // Reset timer to 30 seconds
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowTimerOver(true); // Show timer over message
          return 0;
        }
        return prev - 1; // Decrement by 1 second
      });
    }, 1000);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedQuestion || !answer) return; 
  
    setShowTimerOver(false);
  
    try {
      const storedJobType = localStorage.getItem('job_type');
      const response = await axios.post(`${config.apiUrl}/ai/interview-ai-res`, {
        question: selectedQuestion.question,
        difficulty: selectedQuestion.difficulty,
        answer: answer,
        storedJobType,
      });

console.log(response.data);
setshowAiResposeing(true);
setAiRespose(response.data);

  
      if (response.status === 200) {
      } else {
        alert('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('An error occurred while submitting the answer');
    }
  
    setIsAnswering(false); 
    setAnswer(''); 
    setShowAnswerSection(false); 
  };

  const handleBackToQuestionList = () => {
    setIsAnswering(false);
    setAnswer('');
    setSelectedQuestion(null);
    setShowQuestionList(true);
    setShowAnswerSection(false);
  };

  const handleShowAiResposeing = () => {
    setshowAiResposeing(false);
    setShowQuestionList(true)
  };

  const handleRemoveBookmark = (questionToRemove) => {
    const updatedBookmarks = bookmarkedQuestions.filter(q => q !== questionToRemove);
    setBookmarkedQuestions(updatedBookmarks);
    localStorage.setItem('bookmarkedQuestions', JSON.stringify(updatedBookmarks));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Pagination Logic
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = (questions || []) // Ensure it's an array
  .filter(q => q.question?.toLowerCase().includes(searchTerm.toLowerCase()))
  .slice(indexOfFirstQuestion, indexOfLastQuestion);

  if (!questions) {
    return <LoadingSpinner/>;
  }
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="practice-page-container">
{showAiResposeing && (
  <div className='practice-page-ai-ans-container'>
  <header>
    <h1>AI Interviewer</h1> 
    <button onClick={handleShowAiResposeing}><i className="fa-solid fa-circle-xmark"></i></button>
  </header>

  <div className='practice-page-ai-ans-main-container'>
    <div className="ai-response-section">
      <h3 className="response-header">{aiRespose.result}</h3>
      <p className="improvement-section">
        <strong>Areas to Improve:</strong>
        <span>{aiRespose.area_to_improve}</span>
      </p>
      <p className="advise-section">
        <strong>Advice:</strong>
        <span>{formatAdvice(aiRespose.advise)}</span>
      </p>
    </div>
  </div>
</div>

)}



      <div className="practice-header">
        <h1>Practice Interview Questions</h1>
        <h3>{selectedRole} Interview Questions</h3>
        <input
          type="text"
          placeholder="Search Questions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-bar"
        />
      </div>

      <div className="practice-main-content">
        {!isAnswering && showQuestionList && (
          <div className="question-list-container">
            {currentQuestions.map((q, index) => (
              <div
                key={index}
                className="question-card"
                onClick={() => {
                  setSelectedQuestion(q);
                  setIsAnswering(true);
                  setShowQuestionList(false);
                  setShowAnswerSection(true);
                }}
              >
                <p className="question-text">{q.question}</p>
                <span className={`difficulty-level ${q.difficulty === 'Hard' ? 'red-defi' : q.difficulty === 'Medium' ? 'yellow-defi' : 'green-defi'}`} >
                  {q.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}

        {showAnswerSection && (
          <div className="answer-section-container">
            <div className="answer-section-header">
              <button onClick={handleBackToQuestionList} className="back-btn">
                <i className="fa-solid fa-angles-left"></i>
              </button>

              <span>
                <button onClick={handleStartTimer} className="start-timer-btn">
                  Start Timer
                </button>
                {timerRunning && <p className="timer">{timer}s</p>}
              </span>
            </div>

            <div className="question-detail">
              <p className="question-text">{selectedQuestion?.question}</p>
            </div>

            <div className="answer-container">
              <textarea
                value={answer}
                onChange={handleAnswerChange}
                className="answer-box"
                placeholder="Type your answer here..."
              ></textarea>
            </div>

            <button onClick={handleSubmitAnswer} className="submit-answer-btn">
              Submit Answer
            </button>

            <div className="ai-feedback">
              <p>Feedback: Your response is clear but could use more examples.</p>
            </div>
          </div>
        )}

        {/* Timer Over Message with Pulsating Effect */}
        {showTimerOver && (
          <div className="timer-over-message">
            <p>Timer Over!</p>
          </div>
        )}
      </div>

      {showBookmarked && (
        <div className="bookmarked-questions">
          <span>
            <h3>Bookmarked Questions</h3>
            <button onClick={() => setShowBookmarked(!showBookmarked)}><i className="fa-solid fa-xmark"></i></button>
          </span>
          <ul>
            {bookmarkedQuestions.map((q, index) => (
              <li key={index}>
                <p>{q.question}</p>
                <button onClick={() => handleRemoveBookmark(q)} className="remove-bookmark-btn">
                  <i className="fa-solid fa-trash"></i>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        <span>{currentPage}</span>
        <button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastQuestion >= questions.length}>Next</button>
      </div>
    </div>
  );
};

export default PracticeQuestionsPage;
