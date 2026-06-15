const ErrorPage = ({ error }) => {
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
      <h1 style={{ fontSize: "48px", margin: 0, color: "#ef4444", fontWeight: "bold" }}>Oops!</h1>
      <h2 style={{ fontSize: "24px", color: "#0f172a", marginTop: "10px" }}>Something went wrong.</h2>
      <p style={{ color: "#64748b", maxWidth: "600px", marginBottom: "30px", fontSize: "16px", background: "white", padding: "20px", borderRadius: "8px", border: "1px solid #e2e8f0", wordWrap: "break-word" }}>
        {error?.message || "An unexpected error occurred in the application."}
      </p>
      <button
        onClick={() => window.location.href = "/"}
        style={{
          background: "#0f172a",
          color: "white",
          border: "none",
          padding: "12px 28px",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseOver={(e) => e.target.style.background = "#1e293b"}
        onMouseOut={(e) => e.target.style.background = "#0f172a"}
      >
        Refresh & Go Home
      </button>
    </div>
  );
};

export default ErrorPage;
