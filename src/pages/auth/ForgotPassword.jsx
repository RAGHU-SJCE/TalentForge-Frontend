import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      toast.success(response.message || "Password reset email sent!");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="auth-layout" style={{ flex: 1, minHeight: "auto", padding: "40px 20px" }}>
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Forgot Password</h2>
            <p>Enter your registered email address and we'll send you a link to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem" }}>
            <p style={{ margin: 0 }}>
              Remembered your password?{" "}
              <Link to="/login" style={{ fontWeight: "600" }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
