import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "#f8fafc",
      textAlign: "center",
      padding: "20px"
    }}>
      <h1 style={{ fontSize: "120px", margin: 0, color: "#4f46e5", fontWeight: "bold" }}>404</h1>
      <h2 style={{ fontSize: "32px", color: "#0f172a", marginTop: "10px" }}>Page Not Found</h2>
      <p style={{ color: "#64748b", maxWidth: "500px", marginBottom: "30px", fontSize: "18px" }}>
        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <button
        onClick={() => navigate("/")}
        style={{
          background: "#4f46e5",
          color: "white",
          border: "none",
          padding: "12px 28px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseOver={(e) => e.target.style.background = "#4338ca"}
        onMouseOut={(e) => e.target.style.background = "#4f46e5"}
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default NotFound;
