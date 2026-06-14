import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

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
      navigate("/student/dashboard");
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

      alert(
        "Login Successful"
      );

      if (
        data.user.role ===
        "student"
      ) {
        navigate(
          "/student/dashboard"
        );
      } else if (
        data.user.role ===
        "professional"
      ) {
        navigate(
          "/student/dashboard"
        );
      } else if (
        data.user.role ===
        "recruiter"
      ) {
        navigate(
          "/recruiter/dashboard"
        );
      } else if (
        data.user.role ===
        "admin"
      ) {
        navigate(
          "/admin/dashboard"
        );
      }
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        width: "400px",
        margin: "100px auto",
      }}
    >
      <h2>Login</h2>

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={
            formData.email
          }
          onChange={
            handleChange
          }
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom:
              "10px",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={
            formData.password
          }
          onChange={
            handleChange
          }
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom:
              "10px",
          }}
        />

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;