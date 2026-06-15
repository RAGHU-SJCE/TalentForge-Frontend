import { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, UserPlus, X, Check, UserMinus, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Network = () => {
  const { user } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("connections");
  const [darkMode, setDarkMode] = useState(() => document.documentElement.getAttribute("data-theme") === "dark");

  useEffect(() => {
    const obs = new MutationObserver(() => setDarkMode(document.documentElement.getAttribute("data-theme") === "dark"));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);


  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchNetwork = async () => {
    try {
      const [networkRes, sentRes] = await Promise.all([
        axios.get("http://localhost:5000/api/connections/network", { headers }),
        axios.get("http://localhost:5000/api/connections/sent", { headers }),
      ]);
      setPendingRequests(networkRes.data.pendingRequests || []);
      setConnections(networkRes.data.connections || []);
      setSentRequests(sentRes.data.sentRequests || []);
    } catch (error) {
      toast.error("Failed to load network");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNetwork(); }, []);

  const handleAcceptReject = async (id, action) => {
    try {
      await axios.put(`http://localhost:5000/api/connections/request/${id}/${action}`, {}, { headers });
      toast.success(`Request ${action}ed`);
      fetchNetwork();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this connection?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/connections/${id}/remove`, { headers });
      toast.success("Connection removed");
      fetchNetwork();
    } catch (error) {
      toast.error("Failed to remove connection");
    }
  };

  const handleWithdraw = async (id) => {
    if (!window.confirm("Withdraw this connection request?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/connections/request/${id}/withdraw`, { headers });
      toast.success("Request withdrawn");
      fetchNetwork();
    } catch (error) {
      toast.error("Failed to withdraw request");
    }
  };

  const getOtherUser = (conn) => {
    if (!user) return conn.requester;
    return conn.requester?._id === user.id ? conn.recipient : conn.requester;
  };

  const getRoleColor = (role) => {
    if (role === "recruiter") return "#8b5cf6";
    if (role === "professional") return "#0ea5e9";
    return "#10b981";
  };

  const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  const tabs = [
    { key: "connections", label: `Connections (${connections.length})`, icon: <UserCheck size={16} /> },
    { key: "incoming", label: `Requests (${pendingRequests.length})`, icon: <UserPlus size={16} /> },
    { key: "sent", label: `Sent (${sentRequests.length})`, icon: <Clock size={16} /> },
  ];

  if (loading) {
    return (
      <div style={{ padding: "40px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px", margin: "0 auto" }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ height: "80px", background: "#e2e8f0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "1.75rem", color: darkMode ? "#f1f5f9" : "#0f172a" }}>My Network</h1>
        <p style={{ margin: 0, color: darkMode ? "#94a3b8" : "#64748b" }}>Manage your professional connections</p>
      </div>


      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", borderBottom: `2px solid ${darkMode ? "#334155" : "#e2e8f0"}`, paddingBottom: "0" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              display: "flex", alignItems: "center", gap: "6px", padding: "10px 18px",
              background: "transparent", border: "none", cursor: "pointer", fontSize: "14px",
              fontWeight: activeTab === tab.key ? "700" : "500",
              color: activeTab === tab.key ? "#2563eb" : (darkMode ? "#94a3b8" : "#64748b"),
              borderBottom: activeTab === tab.key ? "2px solid #2563eb" : "2px solid transparent",
              marginBottom: "-2px", transition: "all 0.2s"
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>


      {/* Connections Tab */}
      {activeTab === "connections" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {connections.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <UserCheck size={48} style={{ marginBottom: "12px", opacity: 0.4 }} />
              <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>No connections yet</p>
              <p style={{ margin: "8px 0 0" }}>Start by sending connection requests</p>
            </div>
          ) : connections.map(conn => {
            const other = getOtherUser(conn);
            if (!other) return null;
            return (
              <div key={conn._id} style={{ background: darkMode ? "#1e293b" : "white", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Link to={`/user/${other._id}`} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: getRoleColor(other.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", color: "white", flexShrink: 0, overflow: "hidden" }}>
                    {other.profilePicture ? <img src={`http://localhost:5000${other.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(other.fullName)}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: "600", color: darkMode ? "#f1f5f9" : "#0f172a", fontSize: "15px" }}>{other.fullName}</p>
                    <span style={{ fontSize: "12px", color: getRoleColor(other.role), fontWeight: "500", textTransform: "capitalize" }}>{other.role}</span>
                  </div>
                </Link>
                <div style={{ display: "flex", gap: "8px" }}>
                  <Link to={`/messages?userId=${other._id}`} style={{ flex: 1, padding: "8px", textAlign: "center", background: darkMode ? "#1e3a5f" : "#eff6ff", color: "#2563eb", borderRadius: "8px", fontWeight: "600", fontSize: "13px", border: `1px solid ${darkMode ? "#2d5a9e" : "#dbeafe"}`, textDecoration: "none" }}>
                    Message
                  </Link>
                  <button onClick={() => handleRemove(conn._id)} style={{ padding: "8px 14px", background: darkMode ? "#2d1010" : "#fef2f2", color: "#ef4444", border: `1px solid ${darkMode ? "#5c1d1d" : "#fee2e2"}`, borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <UserMinus size={14} /> Remove
                  </button>
                </div>
              </div>

            );
          })}
        </div>
      )}

      {/* Incoming Requests Tab */}
      {activeTab === "incoming" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <UserPlus size={48} style={{ marginBottom: "12px", opacity: 0.4 }} />
              <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>No pending requests</p>
            </div>
          ) : pendingRequests.map(req => (
            <div key={req._id} style={{ background: darkMode ? "#1e293b" : "white", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Link to={`/user/${req.requester._id}`} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: getRoleColor(req.requester.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", color: "white", overflow: "hidden" }}>
                  {req.requester.profilePicture ? <img src={`http://localhost:5000${req.requester.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(req.requester.fullName)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: darkMode ? "#f1f5f9" : "#0f172a" }}>{req.requester.fullName}</p>
                  <span style={{ fontSize: "12px", color: getRoleColor(req.requester.role), textTransform: "capitalize" }}>{req.requester.role}</span>
                </div>
              </Link>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleAcceptReject(req._id, "accept")} style={{ background: "#10b981", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Check size={14} /> Accept
                </button>
                <button onClick={() => handleAcceptReject(req._id, "reject")} style={{ background: darkMode ? "#253352" : "#f1f5f9", color: darkMode ? "#94a3b8" : "#64748b", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, padding: "8px 16px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <X size={14} /> Decline
                </button>
              </div>
            </div>

          ))}
        </div>
      )}

      {/* Sent Requests Tab */}
      {activeTab === "sent" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {sentRequests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94a3b8" }}>
              <Clock size={48} style={{ marginBottom: "12px", opacity: 0.4 }} />
              <p style={{ fontSize: "16px", fontWeight: "500", margin: 0 }}>No sent requests</p>
            </div>
          ) : sentRequests.map(req => (
            <div key={req._id} style={{ background: darkMode ? "#1e293b" : "white", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, borderRadius: "12px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <Link to={`/user/${req.recipient._id}`} style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: getRoleColor(req.recipient.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", color: "white", overflow: "hidden" }}>
                  {req.recipient.profilePicture ? <img src={`http://localhost:5000${req.recipient.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(req.recipient.fullName)}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "600", color: darkMode ? "#f1f5f9" : "#0f172a" }}>{req.recipient.fullName}</p>
                  <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: "600" }}>⏳ Pending</span>
                </div>
              </Link>
              <button onClick={() => handleWithdraw(req._id)} style={{ background: darkMode ? "#2a1f00" : "#fef3c7", color: darkMode ? "#fbbf24" : "#92400e", border: `1px solid ${darkMode ? "#78450a" : "#fde68a"}`, padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                Withdraw
              </button>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default Network;
