import { useEffect, useState } from "react";
import { getNotifications, markAsRead, deleteNotification } from "../../services/notificationService";
import EmptyState from "../../components/EmptyState";
import axios from "axios";
import {
  BellOff, CheckCircle2, Trash2, Bell, Briefcase, UserCheck, AlertCircle,
  MessageSquare, Star, Info, CheckCheck
} from "lucide-react";
import { toast } from "react-toastify";

const typeConfig = {
  application: { icon: <Briefcase size={16} />, color: "#2563eb", bg: "#eff6ff" },
  connection:  { icon: <UserCheck size={16} />, color: "#10b981", bg: "#ecfdf5" },
  message:     { icon: <MessageSquare size={16} />, color: "#8b5cf6", bg: "#f5f3ff" },
  interview:   { icon: <Star size={16} />, color: "#f59e0b", bg: "#fffbeb" },
  default:     { icon: <Info size={16} />, color: "#64748b", bg: "#f8fafc" },
};

const getType = (msg = "") => {
  if (/application|applied|shortlist|rejected|accepted/i.test(msg)) return "application";
  if (/connect|request|accepted your/i.test(msg)) return "connection";
  if (/message/i.test(msg)) return "message";
  if (/interview/i.test(msg)) return "interview";
  return "default";
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all"); // all | unread | read
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch {
      toast.error("Failed to mark as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/notifications/mark-all-read",
        {}, { headers: { Authorization: `Bearer ${token}` } });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    } finally {
      setMarkingAll(false);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs = [
    { key: "all", label: `All (${notifications.length})` },
    { key: "unread", label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
    { key: "read", label: "Read" },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "780px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "1.5rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <Bell size={24} color="#2563eb" /> Notifications
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} disabled={markingAll}
            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
            <CheckCheck size={15} /> {markingAll ? "Marking..." : "Mark All Read"}
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            style={{ flex: 1, padding: "8px 12px", background: filter === tab.key ? "#2563eb" : "transparent", color: filter === tab.key ? "white" : "#64748b", border: "none", borderRadius: "7px", fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState icon={<BellOff size={48} />} title="No Notifications" message="Nothing here. Check back later!" />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map(n => {
            const type = getType(n.message);
            const cfg = typeConfig[type];
            return (
              <div key={n._id} style={{
                background: "white", borderRadius: "12px", padding: "16px 18px",
                border: `1px solid ${n.isRead ? "#e2e8f0" : "#dbeafe"}`,
                borderLeft: `4px solid ${n.isRead ? "#e2e8f0" : cfg.color}`,
                display: "flex", gap: "14px", alignItems: "flex-start",
                boxShadow: n.isRead ? "none" : "0 2px 8px rgba(37,99,235,0.06)",
                transition: "all 0.2s", opacity: n.isRead ? 0.75 : 1,
              }}>
                {/* Type icon */}
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: cfg.bg, color: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "2px" }}>
                  {cfg.icon}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: "0 0 4px 0", color: "#0f172a", fontWeight: n.isRead ? "400" : "600", fontSize: "14px", lineHeight: "1.5" }}>
                    {n.message}
                  </p>
                  <p style={{ margin: 0, color: "#94a3b8", fontSize: "12px" }}>
                    {new Date(n.createdAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                  {!n.isRead && (
                    <button onClick={() => handleRead(n._id)} title="Mark as read"
                      style={{ background: "#ecfdf5", color: "#10b981", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex" }}>
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                  <button onClick={() => handleDelete(n._id)} title="Delete"
                    style={{ background: "#fef2f2", color: "#ef4444", border: "none", padding: "6px", borderRadius: "6px", cursor: "pointer", display: "flex" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;