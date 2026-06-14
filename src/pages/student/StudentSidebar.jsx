import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const StudentSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h2>TalentForge</h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <li>
          <Link to="/student/dashboard" style={{ color: "white", textDecoration: "none" }}>
            🏠 Dashboard
          </Link>
        </li>

        <li>
          <Link to="/student/profile" style={{ color: "white", textDecoration: "none" }}>
            👤 My Profile
          </Link>
        </li>

        <li>
          <Link to="/student/jobs" style={{ color: "white", textDecoration: "none" }}>
            💼 Jobs
          </Link>
        </li>

        <li>
          <Link to="/student/applications" style={{ color: "white", textDecoration: "none" }}>
            📋 My Applications
          </Link>
        </li>

        <li>
          <Link to="/student/interviews" style={{ color: "white", textDecoration: "none" }}>
            🗓️ My Interviews
          </Link>
        </li>

        <li>
          <Link to="/student/profile" style={{ color: "white", textDecoration: "none" }}>
            📄 Resume
          </Link>
        </li>

        <li>
          <Link to="/student/saved-jobs" style={{ color: "white", textDecoration: "none" }}>
            📌 Saved Jobs
          </Link>
        </li>

        <li>
          <Link to="/student/projects" style={{ color: "white", textDecoration: "none" }}>
            📂 Projects
          </Link>
        </li>

        <li>
          <Link to="/student/notifications" style={{ color: "white", textDecoration: "none" }}>
            🔔 Notifications
          </Link>
        </li>

        <li>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            🚪 Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;