import axios from "axios";

const API =
  "https://talentforge-backend-production.up.railway.app/api/notifications";

const getToken = () =>
  localStorage.getItem("token");

export const getNotifications =
  async () => {
    const { data } =
      await axios.get(API, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

    return data;
  };

export const markAsRead =
  async (id) => {
    const { data } =
      await axios.put(
        `${API}/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };

export const deleteNotification =
  async (id) => {
    const { data } =
      await axios.delete(
        `${API}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };