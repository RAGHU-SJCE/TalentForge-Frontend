import axios from "axios";

const API =
  "https://talentforge-backend-sbpr.onrender.com/api/dashboard";

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