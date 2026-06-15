import axios from "axios";

const API_URL = "https://talentforge-backend-production.up.railway.app/api/auth";

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    userData
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    userData
  );

  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${API_URL}/forgot-password`,
    { email }
  );
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await axios.post(
    `${API_URL}/reset-password/${token}`,
    { password }
  );
  return response.data;
};