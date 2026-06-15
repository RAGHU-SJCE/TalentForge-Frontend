import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

const Login = () => {
  const { user, login } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  // Redirect if already logged in
  useEffect(() => {
    if (!user) return;

    if (user.role === "student") {
      navigate("/student/dashboard");
    } else if (
      user.role === "professional"
    ) {
      navigate("/professional/dashboard");
    } else if (
      user.role === "recruiter"
    ) {
      navigate(
        "/recruiter/dashboard"
      );
    } else if (
      user.role === "admin"
    ) {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data =
        await loginUser(
          formData
        );

      login(
        data.user,
        data.token
      );

      toast.success("Login Successful");

      if (data.user.role === "student") {
        navigate("/student/dashboard");
      } else if (data.user.role === "professional") {
        navigate("/professional/dashboard");
      } else if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard");
      } else if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="auth-layout" style={{ flex: 1, minHeight: "auto", padding: "40px 20px" }}>
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Welcome Back</h2>
          <p>Login to TalentForge to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="input-field"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
            <Link to="/forgot-password" style={{ fontSize: "0.875rem", color: "var(--color-primary)" }}>
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Sign In
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem" }}>
          <p style={{ margin: 0 }}>
            Don't have an account?{" "}
            <Link to="/register" replace style={{ fontWeight: "600" }}>
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Login;