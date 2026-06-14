import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

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

      alert(data.message);

      // Redirect to Login Page
      navigate("/login");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Registration Failed"
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
      <h2>Register</h2>

      <form
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="fullName"
          placeholder="Name"
          value={
            formData.fullName
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
          type="email"
          name="email"
          placeholder="Email"
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
          placeholder="Password"
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

        <select
          name="role"
          value={
            formData.role
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
        >
          <option value="">
            Select Role
          </option>

          <option value="student">
            Student
          </option>

          <option value="recruiter">
            Recruiter
          </option>

          <option value="professional">
            Professional
          </option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;