import { useAuth } from "../../context/AuthContext";

const StudentNavbar = () => {
  const { user } = useAuth();

  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      <h3>Student Dashboard</h3>

      <div>
        Welcome {user?.fullName || "Student"} 👋
      </div>
    </div>
  );
};

export default StudentNavbar;