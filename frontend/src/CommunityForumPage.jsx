import React, { useState } from 'react';
import './CommunityForumPage.css'; // Import the local CSS

const CommunityForumPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [threads, setThreads] = useState([
    {
      id: 1,
      title: 'Tips for Cracking Coding Interviews',
      category: 'Job Interview Tips',
      content: 'Share your strategies for preparing for coding interviews.',
      user: 'JohnDoe',
      upvotes: 12,
      downvotes: 2,
      comments: [
        { user: 'JaneSmith', content: 'Practice leetcode daily!' },
        { user: 'CoderX', content: 'Focus on data structures and algorithms.' },
      ],
    },
    {
      id: 2,
      title: 'Python for Beginners',
      category: 'Coding Questions',
      content: 'What are the best resources for learning Python?',
      user: 'AlexTech',
      upvotes: 8,
      downvotes: 1,
      comments: [
        { user: 'SarahC', content: 'I recommend the Python documentation.' },
        { user: 'DevGuy', content: 'Check out Codecademy for interactive lessons.' },
      ],
    },
    // More threads can be added here
  ]);

  const categories = ['Job Interview Tips', 'Coding Questions', 'Success Stories', 'Mentorship Program'];

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleUpvote = (threadId) => {
    setThreads(threads.map(thread =>
      thread.id === threadId ? { ...thread, upvotes: thread.upvotes + 1 } : thread
    ));
  };

  const handleDownvote = (threadId) => {
    setThreads(threads.map(thread =>
      thread.id === threadId ? { ...thread, downvotes: thread.downvotes + 1 } : thread
    ));
  };

  return (
    <div className="community-forum-container">
      <h1>Community Forum</h1>
      <div className="forum-header">
        <select onChange={handleCategoryChange} value={selectedCategory} className="category-dropdown">
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <input type="text" placeholder="Search discussions..." className="search-bar" />
      </div>

      <div className="forum-threads">
        {threads
          .filter(thread => !selectedCategory || thread.category === selectedCategory)
          .map((thread) => (
            <div key={thread.id} className="forum-thread">
              <h3>{thread.title}</h3>
              <p><strong>Posted by:</strong> {thread.user}</p>
              <p>{thread.content}</p>
              <div className="thread-voting">
                <button onClick={() => handleUpvote(thread.id)}>&#x2191; {thread.upvotes}</button>
                <button onClick={() => handleDownvote(thread.id)}>&#x2193; {thread.downvotes}</button>
              </div>
              <div className="thread-comments">
                <h4>Comments:</h4>
                {thread.comments.map((comment, index) => (
                  <div key={index} className="comment">
                    <p><strong>{comment.user}:</strong> {comment.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      <div className="mentorship-section">
        <h3>Mentorship Program</h3>
        <p>Looking for a mentor? Or want to offer mentorship? Let us know!</p>
        <div className="mentorship-btns">
          <button className="mentorship-btn">Request Mentorship</button>
          <button className="mentorship-btn">Offer Mentorship</button>
        </div>
      </div>
    </div>
  );
};

export default CommunityForumPage;
