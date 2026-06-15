import axios from "axios";

const API =
  "https://talentforge-backend-production.up.railway.app/api/saved-jobs";

const getToken = () =>
  localStorage.getItem("token");

export const saveJob = async (jobId) => {
  const { data } = await axios.post(
    `${API}/${jobId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};

export const getSavedJobs =
  async () => {
    const { data } = await axios.get(
      API,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return data;
  };

export const unsaveJob = async (
  jobId
) => {
  const { data } = await axios.delete(
    `${API}/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};