import axios from "axios";

const API =
  "http://localhost:5000/api/dashboard";

const getToken = () =>
  localStorage.getItem("token");

export const getStudentDashboard =
  async () => {
    const { data } =
      await axios.get(
        `${API}/student`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };