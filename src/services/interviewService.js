import axios from "axios";

const API_URL = "https://talentforge-backend-sbpr.onrender.com/api/interviews";

const getToken = () => {
  return localStorage.getItem("token");
};

// Recruiter: Schedule Interview
export const scheduleInterview = async (data) => {
  const response = await axios.post(`${API_URL}/schedule`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Recruiter: Update Interview
export const updateInterview = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Recruiter: Cancel Interview
export const cancelInterview = async (id) => {
  const response = await axios.put(`${API_URL}/${id}/cancel`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Recruiter: Get Interviews for a Job
export const getInterviewsForJob = async (jobId) => {
  const response = await axios.get(`${API_URL}/job/${jobId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

// Student: Get Own Interviews
export const getStudentInterviews = async () => {
  const response = await axios.get(`${API_URL}/student`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};
