import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import StudentDashboard from "../pages/student/StudentDashboard";
import Profile from "../pages/student/Profile";
import Jobs from "../pages/student/Jobs";
import MyApplications from "../pages/student/MyApplications";
import Notifications from "../pages/student/Notifications";
import SavedJobs from "../pages/student/SavedJobs";
import Projects from "../pages/student/Projects";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import MyInterviews from "../pages/student/MyInterviews";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}

      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* Student Routes */}

      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/jobs"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/applications"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <MyApplications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/notifications"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/saved-jobs"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/projects"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/interviews"
        element={
          <ProtectedRoute
            allowedRoles={["student"]}
          >
            <MyInterviews />
          </ProtectedRoute>
        }
      />

      {/* Recruiter Routes */}

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["recruiter"]}
          >
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["admin"]}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default AppRoutes;