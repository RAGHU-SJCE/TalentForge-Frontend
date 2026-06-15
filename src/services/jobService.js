import axios from "axios";

const API =
  "https://talentforge-backend-sbpr.onrender.com/api/jobs";

const getToken = () =>
  localStorage.getItem("token");

// Get All Jobs
export const getAllJobs = async (queryString = "") => {
  const { data } =
    await axios.get(`${API}?${queryString}`);

  return data;
};

// Get Single Job
export const getJobById = async (id) => {
  const { data } =
    await axios.get(`${API}/${id}`);

  return data;
};

// Create Job
export const createJob = async (
  jobData
) => {
  const { data } =
    await axios.post(
      API,
      jobData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

  return data;
};

// Get Recruiter Jobs
export const getMyJobs = async () => {
  const { data } =
    await axios.get(
      `${API}/my-jobs`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

  return data;
};

// Delete Job
export const deleteJob = async (
  jobId
) => {
  const { data } =
    await axios.delete(
      `${API}/${jobId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

  return data;
};