import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import StudentDashboard from "../pages/student/StudentDashboard";
import Profile from "../pages/student/Profile";
import Jobs from "../pages/student/Jobs";
import MyApplications from "../pages/student/MyApplications";
import Notifications from "../pages/student/Notifications";
import SavedJobs from "../pages/student/SavedJobs";
import Projects from "../pages/student/Projects";
import JobDetails from "../pages/student/JobDetails";

import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import MyInterviews from "../pages/student/MyInterviews";
import NotFound from "../pages/NotFound";
import PublicProfile from "../pages/PublicProfile";
import CandidateSearch from "../pages/recruiter/CandidateSearch";
import Network from "../pages/Network";
import Messaging from "../pages/Messaging";
import ResumeBuilder from "../pages/student/ResumeBuilder";


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

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPassword />}
      />

      <Route
        path="/user/:id"
        element={
          <ProtectedRoute>
            <PublicProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/network"
        element={
          <ProtectedRoute>
            <Network />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messaging />
          </ProtectedRoute>
        }
      />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/profile" element={<ProtectedRoute allowedRoles={["student"]}><Profile /></ProtectedRoute>} />
      <Route path="/student/jobs" element={<ProtectedRoute allowedRoles={["student"]}><Jobs /></ProtectedRoute>} />
      <Route path="/job/:id" element={<ProtectedRoute allowedRoles={["student", "professional"]}><JobDetails /></ProtectedRoute>} />
      <Route path="/student/applications" element={<ProtectedRoute allowedRoles={["student"]}><MyApplications /></ProtectedRoute>} />
      <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={["student"]}><Notifications /></ProtectedRoute>} />
      <Route path="/student/saved-jobs" element={<ProtectedRoute allowedRoles={["student"]}><SavedJobs /></ProtectedRoute>} />
      <Route path="/student/projects" element={<ProtectedRoute allowedRoles={["student"]}><Projects /></ProtectedRoute>} />
      <Route path="/student/interviews" element={<ProtectedRoute allowedRoles={["student"]}><MyInterviews /></ProtectedRoute>} />
      <Route path="/student/resume-builder" element={<ProtectedRoute allowedRoles={["student"]}><ResumeBuilder /></ProtectedRoute>} />


      {/* Professional Routes */}
      <Route path="/professional/dashboard" element={<ProtectedRoute allowedRoles={["professional"]}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/professional/profile" element={<ProtectedRoute allowedRoles={["professional"]}><Profile /></ProtectedRoute>} />
      <Route path="/professional/jobs" element={<ProtectedRoute allowedRoles={["professional"]}><Jobs /></ProtectedRoute>} />
      <Route path="/professional/applications" element={<ProtectedRoute allowedRoles={["professional"]}><MyApplications /></ProtectedRoute>} />
      <Route path="/professional/notifications" element={<ProtectedRoute allowedRoles={["professional"]}><Notifications /></ProtectedRoute>} />
      <Route path="/professional/saved-jobs" element={<ProtectedRoute allowedRoles={["professional"]}><SavedJobs /></ProtectedRoute>} />
      <Route path="/professional/projects" element={<ProtectedRoute allowedRoles={["professional"]}><Projects /></ProtectedRoute>} />
      <Route path="/professional/interviews" element={<ProtectedRoute allowedRoles={["professional"]}><MyInterviews /></ProtectedRoute>} />
      <Route path="/professional/resume-builder" element={<ProtectedRoute allowedRoles={["professional"]}><ResumeBuilder /></ProtectedRoute>} />


      {/* Recruiter Routes */}
      <Route path="/recruiter/dashboard" element={<ProtectedRoute allowedRoles={["recruiter"]}><RecruiterDashboard /></ProtectedRoute>} />
      <Route path="/recruiter/search" element={<ProtectedRoute allowedRoles={["recruiter"]}><CandidateSearch /></ProtectedRoute>} />
      <Route path="/recruiter/profile" element={<ProtectedRoute allowedRoles={["recruiter"]}><Profile /></ProtectedRoute>} />
      <Route path="/recruiter/notifications" element={<ProtectedRoute allowedRoles={["recruiter"]}><Notifications /></ProtectedRoute>} />

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

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default AppRoutes;