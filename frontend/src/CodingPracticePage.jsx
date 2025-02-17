// Project made by Om Awchar
// LinkedIn: https://www.linkedin.com/in/omawchar/

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CodingPracticePage.css'; 
import { Link } from "react-router-dom";
import config from './api/config'
import axios from 'axios'; 
import Notification from './components/Notification';

const CodingPracticePage = () => {
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/code/code-problem-data`); 
        console.log(response.data);
        setChallenges(response.data); 
      } catch (error) {
        console.error("Error fetching challenges:", error);
      }
    };
    
    fetchChallenges();
  }, []);  

 
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [tags, setTags] = useState('');

  // Sorting states for each column
  const [statusSort, setStatusSort] = useState('asc');
  const [difficultySort, setDifficultySort] = useState('asc');
  const [titleSort, setTitleSort] = useState('asc');

  const handleCategoryChange = (e) => setSelectedCategory(e.target.value);
  const handleDifficultyChange = (e) => setSelectedDifficulty(e.target.value);
  const handleTagsChange = (e) => setTags(e.target.value);

  const handleRandomPick = () => {
    const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());

    const filteredChallenges = challenges.filter((challenge) => {
      const categoryMatch = !selectedCategory || challenge.category === selectedCategory;
      const difficultyMatch = !selectedDifficulty || challenge.difficulty === selectedDifficulty;
      const tagsMatch = !tagsArray.length || tagsArray.some(tag => challenge.name.toLowerCase().includes(tag));

      return categoryMatch && difficultyMatch && tagsMatch;
    });

    if (filteredChallenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredChallenges.length);
      const randomChallenge = filteredChallenges[randomIndex];
      navigate(`/problems/${randomChallenge._id}`);
      setNotification({
        show: true,
        message: 'Random challenge selected!',
        type: 'success'
      });
    } else {
      setNotification({
        show: true,
        message: 'No challenges match your filters.',
        type: 'warning'
      });
    }
  };

  const filteredChallenges = challenges.filter((challenge) => {
    const tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
    const categoryMatch = !selectedCategory || challenge.category === selectedCategory;
    const difficultyMatch = !selectedDifficulty || challenge.difficulty === selectedDifficulty;
    const tagsMatch = !tagsArray.length || tagsArray.some(tag => challenge.name.toLowerCase().includes(tag));

    return categoryMatch && difficultyMatch && tagsMatch;
  });

  // Sorting functions
  const sortByStatus = () => {
    const sorted = [...filteredChallenges].sort((a, b) => {
      if (a.status === 'Solved' && b.status !== 'Solved') {
        return -1; // 'Solved' comes first
      } else if (a.status !== 'Solved' && b.status === 'Solved') {
        return 1; // 'Solved' comes first
      } else {
        return 0; // Keep the order unchanged if both are 'Solved' or neither is 'Solved'
      }
    });
    setStatusSort(statusSort === 'asc' ? 'desc' : 'asc');
    setChallenges(sorted);
  };
  
  const difficultyOrder = ['Easy', 'Medium', 'Hard'];
  
  const sortByDifficulty = () => {
    const sorted = [...filteredChallenges].sort((a, b) => {
      const diffA = difficultyOrder.indexOf(a.difficulty);
      const diffB = difficultyOrder.indexOf(b.difficulty);
  
      if (difficultySort === 'asc') {
        return diffA - diffB; // Ascending order (Easy < Medium < Hard)
      } else {
        return diffB - diffA; // Descending order (Hard < Medium < Easy)
      }
    });
    setDifficultySort(difficultySort === 'asc' ? 'desc' : 'asc');
    setChallenges(sorted);
  };
  

  const sortByTitle = () => {
    const sorted = [...filteredChallenges].sort((a, b) => {
      if (titleSort === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setTitleSort(titleSort === 'asc' ? 'desc' : 'asc');
    setChallenges(sorted);
  };

  return (
    <div className="coding-practice-container">
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className='level-container-box'>
        <div className='filter-container-coder'>
          <select name='Lists' value={selectedCategory} onChange={handleCategoryChange}>
            <option value=''>Select Category</option>
            <option value='Hashing'>Hashing</option>
            <option value='Strings'>Strings</option>
            <option value='Tree'>Tree</option>
          </select>

          <select name='Difficulty' value={selectedDifficulty} onChange={handleDifficultyChange}>
            <option value=''>Select Difficulty</option>
            <option value='Easy'>Easy</option>
            <option value='Medium'>Medium</option>
            <option value='Hard'>Hard</option>
          </select>

          <input
            type='text'
            name='tags'
            placeholder='Enter tags (comma separated)'
            value={tags}
            onChange={handleTagsChange}
          />

          <button style={{display:'flex',alignItems:"center",justifyContent:"center" , gap:'10px'}} onClick={handleRandomPick}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path stroke="currentColor" d="M1 4.5h2.5l7 7h4M14.5 4.5h-4L9 6"/><path stroke="currentColor" d="m12 2 2.5 2.5L12 7M12 9l2.5 2.5L12 14M1 11.5h2.5L5 10"/></svg>  Pick Random</button>
          </div>

<div className="questions-of-code">
  <table>
    <thead>
      <tr>
        <th>
          <button onClick={sortByStatus}>Status {statusSort === 'asc' ? '↑' : '↓'}</button>
        </th>
        <th>
          <button onClick={sortByTitle}>Title {titleSort === 'asc' ? '↑' : '↓'}</button>
        </th>
        <th>Category</th>
        <th>
          <button onClick={sortByDifficulty}>Difficulty {difficultySort === 'asc' ? '↑' : '↓'}</button>
        </th>
      </tr>
    </thead>
    <tbody>
      {filteredChallenges.map((challenge) => (
        <tr key={challenge.id}>
          <td>
  {challenge.status === "Solved" && (
    <div
      className="status-svg"
      style={{
        color: "green", // Color is always green if the challenge is solved
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
        <path
          stroke="currentColor"
          d="M8 4.5v-2H2.5v8H8v2h5.5v-8H8ZM8 4.5V7M2.5 1v14"
        />
      </svg>
    </div>
  )}
</td>

          <td style={{color:"#6B63F8"}}><Link to={`/problems/${challenge._id}`}>{challenge.name}</Link></td>
          <td>{challenge.category}</td>
          <td>{challenge.difficulty}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
</div>
);
};

export default CodingPracticePage;