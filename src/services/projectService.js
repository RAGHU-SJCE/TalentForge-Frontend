import axios from "axios";

const API =
  "https://talentforge-backend-production.up.railway.app/api/projects";

const getToken = () =>
  localStorage.getItem("token");

export const createProject =
  async (projectData) => {
    const { data } =
      await axios.post(
        API,
        projectData,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };

export const getMyProjects =
  async () => {
    const { data } =
      await axios.get(
        `${API}/my-projects`,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };

export const deleteProject = async (projectId) => {
  const { data } = await axios.delete(`${API}/${projectId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
};

export const updateProject = async (projectId, projectData) => {
  const { data } = await axios.put(`${API}/${projectId}`, projectData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
};