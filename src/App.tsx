// src/App.tsx
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FlashcardLearning from "./FlashcardLearning";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Authentication from "./pages/Authentication";
import CreateLessonPage from "./pages/CreateLessonPage";
import HomePage from "./pages/Home/HomePage";
import LandingPage from "./pages/LandingPage";
import LessonsPage from "./pages/LessonsPage";
import Profile from "./pages/Profile/Profile";
import ManageCustomerPage from "./pages/UsersManagement/index";
import ManageFlashcardPage from "./pages/FLashcardsManagement/index";
import ManageTopicPage from "./pages/TopicsManagement/index";
import ManageLessonPage from "./pages/LessonsManagement/index";
import { HelmetProvider } from "react-helmet-async";
import ThemeProvider from "./theme/ThemeProvider";

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>  
          <div className="h-full flex flex-col ">
            <Router>
              <div>
                <NavBar />
              </div>
              <Routes>
                <Route path="/login" element={<Authentication />} />
                <Route
                  path="/homepage"
                  element={
                    // <ProtectedRoute>
                    <HomePage />
                    // </ProtectedRoute>
                  }
                />
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/topics"
                  element={
                    <ProtectedRoute>
                      <LessonsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/topics/:id"
                  element={
                    <ProtectedRoute>
                      <LessonsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/:id"
                  element={
                    <ProtectedRoute>
                      <FlashcardLearning />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lessons/create"
                  element={
                    <ProtectedRoute>
                      <CreateLessonPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route path="/manager/users" element={<ManageCustomerPage />} />
                <Route path="/manager/flashcards" element={<ManageFlashcardPage />} />
                <Route path="/manager/topics" element={<ManageTopicPage />} />
                <Route path="/manager/lessons" element={<ManageLessonPage />} />
              </Routes>
            </Router>
            <div className="footer mt-auto justify-self-end text-secondary-text-color self-center">
              WorkWise All Right Reserved,2024
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
