import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import 'regenerator-runtime/runtime';
import HomePage from "./pages/HomePage";
import SideMenu from "./component/SideMenu";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import PracticeQuestionsPage from "./pages/PracticeQuestionsPage";
import CodingPracticePage from "./CodingPracticePage";
import ResumeAnalyzerPage from "./ResumeAnalyzerPage";
import JobRoadmapsPage from "./JobRoadmapsPage";
import CommunityForumPage from "./CommunityForumPage";
import AskAiPage from "./AskAiPage";
import ChallengePage from "./pages/ChallengePage";
import InterviewPageAI from "./InterviewPageAI";
import LoadingSpinner from "./component/LoadingSpinner";

const NotFound = () => {
  return (
    <div className="main-content">
      <h1>404 - Page Not Found</h1>
    </div>
  );
};

function App() {
  const isAuthenticated = localStorage.getItem('token') !== null;

  return (
    <>
      <SideMenu />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected Routes */}
          <Route path="/practice-question" element={isAuthenticated ? <PracticeQuestionsPage /> : <Navigate to="/login" />} />
          <Route path="/live-coding" element={isAuthenticated ? <CodingPracticePage /> : <Navigate to="/login" />} />
          <Route path="/resume-analyzer-page" element={isAuthenticated ? <ResumeAnalyzerPage /> : <Navigate to="/login" />} />
          <Route path="/resume-analyzer" element={isAuthenticated ? <ResumeAnalyzerPage /> : <Navigate to="/login" />} />
          <Route path="/job-roadmaps" element={isAuthenticated ? <JobRoadmapsPage /> : <Navigate to="/login" />} />
          <Route path="/community-forum" element={isAuthenticated ? <CommunityForumPage /> : <Navigate to="/login" />} />
          <Route path="/ask-ai" element={isAuthenticated ? <AskAiPage /> : <Navigate to="/login" />} />
          <Route path="/problems/:id" element={isAuthenticated ? <ChallengePage /> : <Navigate to="/login" />} />
          <Route path="/mock-interview/ai/interview" element={isAuthenticated ? <InterviewPageAI /> : <Navigate to="/login" />} />

          {/* Other Routes */}
          <Route path="/lin" element={<LoadingSpinner />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
