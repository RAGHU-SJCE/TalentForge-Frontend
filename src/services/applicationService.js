import axios from "axios";

const API =
  "https://talentforge-backend-sbpr.onrender.com/api/applications";

const getToken = () => {
  return localStorage.getItem("token");
};

export const applyToJob = async (jobId) => {
  const { data } = await axios.post(
    `${API}/apply/${jobId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};

export const getMyApplications =
  async () => {
    const { data } =
      await axios.get(
        `${API}/my-applications`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

    return data;
  };