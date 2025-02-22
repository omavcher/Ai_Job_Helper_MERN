import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect, useMemo } from "react";
import "./App.css";
import 'regenerator-runtime/runtime';

// Lazy loading components for performance
const SideMenu = lazy(() => import("./component/SideMenu"));
const Footer = lazy(() => import("./component/Footer"));
const LoadingSpinner = lazy(() => import("./component/LoadingSpinner"));

// Lazy loading pages
const HomePage = lazy(() => import("./pages/HomePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const PracticeQuestionsPage = lazy(() => import("./pages/PracticeQuestionsPage"));
const CodingPracticePage = lazy(() => import("./CodingPracticePage"));
const ResumeAnalyzerPage = lazy(() => import("./ResumeAnalyzerPage"));
const JobRoadmapsPage = lazy(() => import("./JobRoadmapsPage"));
const CommunityForumPage = lazy(() => import("./CommunityForumPage"));
const AskAiPage = lazy(() => import("./AskAiPage"));
const ChallengePage = lazy(() => import("./pages/ChallengePage"));
const InterviewPageAI = lazy(() => import("./InterviewPageAI"));
const SettingPage = lazy(() => import("./pages/SettingPage"));

// 404 Not Found Page
const NotFound = () => (
  <div className="main-content">
    <h1>404 - Page Not Found</h1>
  </div>
);

// SEO Titles & Descriptions
const pageTitles = {
  "/": "AI Hire Me - Smart Job Application Platform",
  "/login": "Login - AI Hire Me",
  "/signup": "Sign Up - AI Hire Me",
  "/practice-question": "Practice Questions - AI Hire Me",
  "/live-coding": "Live Coding - AI Hire Me",
  "/resume-analyzer": "Resume Analyzer - AI Hire Me",
  "/job-roadmaps": "Job Roadmaps - AI Hire Me",
  "/community-forum": "Community Forum - AI Hire Me",
  "/ask-ai": "Ask AI - AI Hire Me",
  "/mock-interview/ai/interview": "AI Mock Interview - AI Hire Me",
  "/setting": "Settings - AI Hire Me",
};

const App = () => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('token');

  // Update page title dynamically
  useEffect(() => {
    document.title = pageTitles[location.pathname] || "AI Hire Me";
  }, [location.pathname]);

  // Memoized protected routes list
  const protectedRoutes = useMemo(() => [
    { path: "/practice-question", element: <PracticeQuestionsPage /> },
    { path: "/live-coding", element: <CodingPracticePage /> },
    { path: "/resume-analyzer", element: <ResumeAnalyzerPage /> },
    { path: "/job-roadmaps", element: <JobRoadmapsPage /> },
    { path: "/community-forum", element: <CommunityForumPage /> },
    { path: "/ask-ai", element: <AskAiPage /> },
    { path: "/problems/:id", element: <ChallengePage /> },
    { path: "/mock-interview/ai/interview", element: <InterviewPageAI /> },
    { path: "/setting", element: <SettingPage /> }
  ], []);

  return (
    <>
      <Suspense fallback={<LoadingSpinner aria-label="Loading..." />}>
        <SideMenu />
      </Suspense>
      <div className="main-content">
        <Suspense fallback={<LoadingSpinner aria-label="Loading page..." />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            {/* Protected Routes */}
            {protectedRoutes.map(({ path, element }) => (
              <Route key={path} path={path} element={isAuthenticated ? element : <Navigate to="/login" />} />
            ))}

            {/* Other Routes */}
            <Route path="/lin" element={<LoadingSpinner />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Suspense fallback={<LoadingSpinner aria-label="Loading footer..." />}>
        <Footer />
      </Suspense>
    </>
  );
};

export default App;
