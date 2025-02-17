// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect,useRef } from 'react';
import { useNavigate, useParams , Link } from 'react-router-dom'; // Added useNavigate
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios'; // We'll use axios for API requests
import './ChallengePage.css';
import Notepad from '../component/NotePad';
import config from '../api/config'
import LoadingSpninner from '../component/LoadingSpinner';

const ChallengePage = () => {
  const problemListRef = useRef(null); // Reference for the problem list container
  const { id } = useParams(); // Capture the challenge ID from the URL
  const [challenge, setChallenge] = useState(null);  // State to store the challenge data
  const [language, setLanguage] = useState('javascript'); // Language state
  const [code, setCode] = useState(`function main() {
          console.log("Hello, World!");
      }
      main();`); // User's code input
  const [output, setOutput] = useState(''); // Compilation output
  const [isRunning, setIsRunning] = useState(false); // Flag for running the code
  const [theme, setTheme] = useState('light'); // Default theme
  const [showNotepad, setShowNotepad] = useState(false);
  const [showProblemList, setShowProblemList] = useState(false);
  const [filter, setFilter] = useState(''); // Filter state
  const [sortSolvedFirst, setSortSolvedFirst] = useState(false); // State to toggle sorting
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [submitResult, setSubmitResult] = useState(''); // Compilation output
  const [problems, setProblems] = useState([]); // State for storing the problem data


  const handleNavigateNext = () => {
    navigate(`/problems/${parseInt(id) + 1}`);
  };

  
const handleNavigateBack = () => {
  navigate(`/problems/${parseInt(id) - 1}`);
};

const languageBoilerplates = {
  javascript: `
      function main() {
          console.log("Hello, World!");
      }
      main();
  `,
  python: `
      def main():
          print("Hello, World!")
      
      if __name__ == "__main__":
          main()
  `,
  java: `
      public class Main {
          public static void main(String[] args) {
              System.out.println("Hello, World!");
          }
      }
  `,
  c: `
      #include <stdio.h>

      int main() {
          printf("Hello, World!\\n");
          return 0;
      }
  `,
  cpp: `
      #include <iostream>
      
      int main() {
          std::cout << "Hello, World!" << std::endl;
          return 0;
      }
  `
};
useEffect(() => {
  const handleClickOutside = (event) => {
    if (problemListRef.current && !problemListRef.current.contains(event.target)) {
      setShowProblemList(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await axios.post(`${config.apiUrl}/code/code-problem-by-id`, { id });

        const challengeData = response.data;
console.log(response.data);

        if (challengeData) {
          setChallenge(challengeData);
        }
      } catch (error) {
        console.error('Error fetching challenge data:', error);
      }
    };

    fetchChallenge();
  }, [id]);

  const handleRunCode = async () => {
    setIsRunning(true);
    try {


      const response = await axios.post(`${config.apiUrl}/ai/compile`, {
        script: code,
        language,
      });

      setOutput(response.data.output); 
    } catch (error) {
      setOutput('Error executing code');
    } finally {
      setIsRunning(false);
    }
  };


  const handleSubmitProblem = async () => {
    setIsRunning(true);
    try {
      const response = await axios.post(`${config.apiUrl}/ai/submit-problem`, {
        script: code,
        language,
        description: challenge.description,
        input: challenge.input,
        output: challenge.output,
      });

      setSubmitResult(response.data);
    } catch (error) {
      setOutput('Error executing code');
    } finally {
      setIsRunning(false);
    }
  };


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };



  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/code/code-problem-data`);
        setProblems(response.data); // Store fetched problems in state
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);


  const filteredProblems = problems
    .filter((problem) => problem.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      if (sortSolvedFirst) {
        if (a.status === 'solved' && b.status !== 'solved') return -1;
        if (a.status !== 'solved' && b.status === 'solved') return 1;
      }
      return 0;
    });

  if (!challenge) {
    return <LoadingSpninner/>;
  }
  const handleSortClick = () => setSortSolvedFirst((prev) => !prev); // Toggle sorting order

  return (
    <div className="challenge-page-container">
<div className='chllange-top-hearder-container'>

<div  className='chllange-top-hearder-tank-11'>
  <button  onClick={() => setShowProblemList(!showProblemList)} style={{color:"black",display:"flex",alignItems:"center",gap:"10px"}}> <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAWElEQVR4nGNgGAWDBkhJSf0HYZpbwoDFUiky8OCwYBSgAILhRykwNjZmlZKSWg/CNIlkKajhIItoZcF/umS2oQuk6BFEkpKS5cgW0KKo6KCZBVKjqWjYAgDufJSSn/vOnQAAAABJRU5ErkJggg==" alt="numbered-list"></img> Problem List
</button>
</div>

<div ref={problemListRef} className={`chlladproblem-list ${showProblemList ? 'show' : ''}`}>
  <div className='cc-problem-header-container'>
    <Link to={`/live-coding`}>
    <h1>Problem List <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M5.5 2.5 11 8l-5.5 5.5"/></svg></h1>
    </Link>
    <button onClick={() => setShowProblemList(false)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="m3 3 10 10M13 3 3 13"/></svg></button>
  </div>


<div className='problem-list-serise-ccx'>

  <div className='problem-list-serise-filter'>
    <button  onClick={handleSortClick}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M1.5 14.5v-13h13v13h-13ZM4 5.5h4.5M10.5 5.5H12M4 10.5h1.5M7.5 10.5H12"/><circle cx="9.5" cy="5.5" r="1" stroke="currentColor"/><circle cx="6.5" cy="10.5" r="1" stroke="currentColor"/></svg></button>
    <input
            type="text"
            placeholder="Search problems..."
            value={filter}
            onChange={handleFilterChange}
          />
    </div>

<div className='problem-list-qued-d'>

  {filteredProblems.map((problem) => (
              <Link key={problem.id} to={`/problems/${problem._id}`} className="problem-list-qued-d-condd">
                {problem.status === 'solved' ? (
            <svg
              style={{ color: 'green', marginLeft: '10px' }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1 7.5a3.5 3.5 0 0 1 6.855-1H15V11h-2V8.5h-1V11h-2V8.5H7.855A3.502 3.502 0 0 1 1 7.5ZM4.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              style={{ color: 'black', marginLeft: '10px' }}
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="M1 7.5a3.5 3.5 0 0 1 6.855-1H15V11h-2V8.5h-1V11h-2V8.5H7.855A3.502 3.502 0 0 1 1 7.5ZM4.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                clipRule="evenodd"
              />
            </svg>
          )}
                <p style={{justifyContent:"start"}}>{`${problem.name}`}</p>
                <span style={{marginLeft:"auto"}}>{problem.difficulty}</span>
              </Link>
            ))}
  
</div>




</div>
</div>



<div className={`chllange-top-hearder-tank-22 ${showProblemList ? 'blurred' : ''}`}>
  <button onClick={handleRunCode}   style={{color:"black",display:"flex",alignItems:"center",gap:"10px"}}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABRklEQVR4nO2ZMU7EMBBFP0JAA1VIpP8tGpQqBU1KbsAhuAIFHIArUNJS0nKBvcByAGpaum1QxJpig0INdpyx/KRpIz3Z8XyPgUKhUPiNpLuu6w5hHUme5Jtz7grWRTQWyZemac5hXUQ7mU9JD1VVncCyiCahd+fcNYA9WBbRVCvn3AUyEPGSviQ9kTyFcRE/brcPkjcA9mFZRJPQK8lLWBfRrrYknyWdwbiIH2tD8r5t2yPrIn4R6UCBRJKnAwUWSZYOFEEkSTpQRJFZ04HmEfGSBkmP0dLBjCI+ajqYW0Sx0kEqEYVOB0VE/16NtemtxQx+9iGH43dluiGajygcQ2Nd18fRBX6IIGE7xjODi9XG+lV3m8PwYW16HMQMBnRD1K4cguyH2LT+rMAUXTkEi+jKIVhEVw6BpNu+7w+CfKxQKBTwR74BypBtskDnV4gAAAAASUVORK5CYII=" alt="play--v1"/> Run</button>
  <button onClick={handleSubmitProblem}  >Submit</button>
  <button onClick={() => setShowNotepad(!showNotepad)}><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAeElEQVR4nO2WSw6AIAxE5xJUmYT7X8igt9G4YGsiVNA4LyGEDX3Q8gGEeCMk9yfa9wTghASoFFBFSB3DXRcRf3EVc/RjxGuB3E0AAMxsIrmc4xjjllJiNwFrCe6UgrX0IYT57jzwqIGqlRdav15NwR0EctW2C4FBHLba4UHa0IsFAAAAAElFTkSuQmCC" alt="note"/></button>
</div>

<div className='chllange-top-hearder-tank-33'></div>



</div>


      <div className={`page-content ${showProblemList ? 'blurred' : ''}`}>
        <div className="left-pane">

        {!showNotepad && (
          <div className="challenge-details">

<div className='challenge-details-hear-container'>
          <h1>{`${challenge.name}`}</h1>

          <div className='challenge-details-hear-tag-container'>
<span><p>{challenge.category}</p></span>
<span><p>{challenge.difficulty}</p></span>

</div>

            </div>


            <p className='mt-3'> {challenge.description}</p>

            <div className="challenge-example mt-4">
              <h3>Example:</h3>
              <br></br>
              <pre><strong>Input:</strong> {challenge.example.input}</pre>
              <pre><strong>Output:</strong> {challenge.example.output}</pre>
            </div>

            <div className="challenge-solution mt-3">
              <p> {challenge.solution.explanation}</p>
              <hr className='mt-5'></hr>
              <p className='mt-3'><strong>Time Complexity:</strong> {challenge.solution.timeComplexity}</p>
              <p className='mt-3'><strong>Space Complexity:</strong> {challenge.solution.spaceComplexity}</p>
              
            </div>

          </div>
        )}
          {showNotepad && (
          <div className="notepad">
            <Notepad/>
          </div>
        )}


{submitResult && submitResult.result && (
  <div className="submit-result-container">
    <h2 className={`submit-result ${submitResult.result}`}>
      {submitResult.result === 'successful' ? 'Code executed successfully!' : 'Code execution failed!'}
    </h2>
    <h3 className="submit-conclusion">{submitResult.conclusion}</h3>
    <p className="submit-output">{submitResult.output}</p>
  </div>
)}

{output && (
  <div className="output">
    <h3>Output:</h3>
    <pre>{output}</pre>
  </div>
)}


        </div>
        

        
        {/* Right Pane with Monaco Editor */}
        <div className="right-pane">

<div className='code-playground-header-container'>
 {/* Language Selection Dropdown */}
 <div className="language-selector">
        <label htmlFor="language">Choose Language: </label>
        <select 
          id="language" 
          value={language} 
          onChange={(e) => {
            setLanguage(e.target.value);
            setCode(languageBoilerplates[e.target.value]); // Update the editor with boilerplate
          }}
        >
          <option value="javascript">Javascript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
      </div>

      <div className='options'>
          <label>Theme:</label>
          <select onChange={(e) => setTheme(e.target.value)} value={theme}>
            <option value="light">Light</option>
            <option value="vs-dark">Dark</option>
          </select>
        </div>
        </div>
        
          <div className="code-playground">
            <MonacoEditor
              height="400px"
              language={language}
              value={code}
              onChange={(newValue) => setCode(newValue)}
              theme={theme} 
            />
          </div>
        

         


        </div>

        
      </div>
    </div>
  );
};

export default ChallengePage;
