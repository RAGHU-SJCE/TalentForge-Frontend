import {
  useEffect,
  useState,
} from "react";

import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from "../../services/notificationService";

const Notifications = () => {
  const [
    notifications,
    setNotifications,
  ] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications =
    async () => {
      try {
        const data =
          await getNotifications();

        setNotifications(
          data.notifications
        );
      } catch (error) {
        console.log(error);
      }
    };

  const handleRead =
    async (id) => {
      await markAsRead(id);
      fetchNotifications();
    };

  const handleDelete =
    async (id) => {
      await deleteNotification(id);
      fetchNotifications();
    };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>Notifications</h1>

      {notifications.length ===
      0 ? (
        <p>
          No Notifications
        </p>
      ) : (
        notifications.map(
          (notification) => (
            <div
              key={
                notification._id
              }
              style={{
                border:
                  "1px solid #ddd",
                padding:
                  "15px",
                marginBottom:
                  "10px",
                background:
                  notification.isRead
                    ? "#fff"
                    : "#f0f9ff",
              }}
            >
              <p>
                {
                  notification.message
                }
              </p>

              <p>
                Status:
                {" "}
                {notification.isRead
                  ? "Read"
                  : "Unread"}
              </p>

              {!notification.isRead && (
                <button
                  onClick={() =>
                    handleRead(
                      notification._id
                    )
                  }
                >
                  Mark Read
                </button>
              )}

              {" "}

              <button
                onClick={() =>
                  handleDelete(
                    notification._id
                  )
                }
              >
                Delete
              </button>
            </div>
          )
        )
      )}
    </div>
  );
};

export default Notifications;