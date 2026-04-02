import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import StudyPrep from "./pages/StudyPrep";
import PlacementPrep from "./pages/PlacementPrep";
import ProjectAssistant from "./pages/ProjectAssistant";
import ProgressTracker from "./pages/ProgressTracker";
import LearningPath from "./pages/LearningPath";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/study-prep"
          element={
            <ProtectedRoute>
              <StudyPrep />
            </ProtectedRoute>
          }
        />

        <Route
          path="/placement-prep"
          element={
            <ProtectedRoute>
              <PlacementPrep />
            </ProtectedRoute>
          }
        />

        <Route
          path="/project-assistant"
          element={
            <ProtectedRoute>
              <ProjectAssistant />
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressTracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learning-path"
          element={
            <ProtectedRoute>
              <LearningPath />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;