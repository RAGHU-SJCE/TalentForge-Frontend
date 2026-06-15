import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

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
        await registerUser(
          formData
        );

      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <div className="auth-layout" style={{ flex: 1, minHeight: "auto", padding: "40px 20px" }}>
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h2 style={{ fontSize: "2rem", marginBottom: "10px" }}>Create an Account</h2>
          <p>Join TalentForge today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className="input-field"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: "30px" }}>
            <label className="form-label">Account Type</label>
            <select
              name="role"
              className="input-field"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Role</option>
              <option value="student">Student</option>
              <option value="recruiter">Recruiter</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem" }}>
          <p style={{ margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" replace style={{ fontWeight: "600" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Register;