import axios from "axios";

const API_URL = "https://talentforge-backend-sbpr.onrender.com/api/users";

const getToken = () => {
  return localStorage.getItem("token");
};

// Get Profile
export const getProfile = async () => {
  const response = await axios.get(
    `${API_URL}/profile`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Skills
export const updateSkills = async (skills) => {
  const response = await axios.put(
    `${API_URL}/skills`,
    { skills },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Bio
export const updateBio = async (bio) => {
  const response = await axios.put(
    `${API_URL}/bio`,
    { bio },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Experience
export const updateExperience = async (experience) => {
  const response = await axios.put(
    `${API_URL}/experience`,
    { experience },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Company Details
export const updateCompanyDetails = async (data) => {
  const response = await axios.put(
    `${API_URL}/company`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Advanced Profile
export const updateAdvancedProfile = async (data) => {
  const response = await axios.put(
    `${API_URL}/advanced`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Upload Resume
export const uploadResume = async (file) => {
  const formData = new FormData();

  formData.append("resume", file);

  const response = await axios.put(
    `${API_URL}/upload-resume`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
};