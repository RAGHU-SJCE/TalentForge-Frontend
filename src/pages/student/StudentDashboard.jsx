import { useEffect, useState } from "react";
import { getStudentDashboard } from "../../services/dashboardService";
import { Briefcase, FolderGit2, Award, ExternalLink, Activity, ArrowRight, Users, Eye, UserPlus } from "lucide-react";
import StatusBadge from "../../components/StatusBadge";
import EmptyState from "../../components/EmptyState";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";


const StudentDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [profileViewers, setProfileViewers] = useState([]);
  const [viewCount, setViewCount] = useState(0);
  const [connectingId, setConnectingId] = useState(null);
  const [connectedIds, setConnectedIds] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchDashboard();
    fetchSuggestions();
    fetchProfileViews();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data = await getStudentDashboard();
      setDashboard(data.dashboard);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get("https://talentforge-backend-sbpr.onrender.com/api/suggestions", { headers });
      setSuggestions(res.data.suggestions || []);
    } catch (e) { console.log(e); }
  };

  const fetchProfileViews = async () => {
    try {
      const res = await axios.get("https://talentforge-backend-sbpr.onrender.com/api/profile-views/my-views", { headers });
      setProfileViewers(res.data.viewers || []);
      setViewCount(res.data.totalViews || 0);
    } catch (e) { console.log(e); }
  };

  const handleConnect = async (userId) => {
    setConnectingId(userId);
    try {
      await axios.post("https://talentforge-backend-sbpr.onrender.com/api/connections/request", { recipientId: userId }, { headers });
      toast.success("Connection request sent!");
      setConnectedIds(prev => [...prev, userId]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setConnectingId(null);
    }
  };

  const getRoleColor = (role) => {
    if (role === "recruiter") return "#8b5cf6";
    if (role === "professional") return "#0ea5e9";
    return "#10b981";
  };

  const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";



  if (!dashboard) {
    return (
      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto", display: "grid", gap: "20px" }}>
        <div style={{ height: "150px", background: "var(--color-border)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s infinite" }}></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          <div style={{ height: "120px", background: "var(--color-border)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s infinite", animationDelay: "0.2s" }}></div>
          <div style={{ height: "120px", background: "var(--color-border)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s infinite", animationDelay: "0.4s" }}></div>
          <div style={{ height: "120px", background: "var(--color-border)", borderRadius: "var(--radius-lg)", animation: "pulse 1.5s infinite", animationDelay: "0.6s" }}></div>
        </div>
      </div>
    );
  }

  const MetricCard = ({ title, value, icon, color }) => (
    <div className="card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px", flex: 1, minWidth: "250px", animation: "fadeIn 0.5s ease-out" }}>
      <div style={{ background: `var(--color-${color}-bg)`, color: `var(--color-${color})`, padding: "16px", borderRadius: "var(--radius-lg)", display: "flex" }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: "0 0 4px 0", color: "var(--color-text-muted)", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{title}</p>
        <p style={{ margin: 0, fontSize: "2rem", fontWeight: "700", color: "var(--color-secondary)", lineHeight: "1" }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "30px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", animation: "fadeIn 0.5s ease-out" }}>
        <h2 style={{ margin: 0, color: "var(--color-secondary)", display: "flex", alignItems: "center", gap: "10px", fontSize: "1.75rem" }}>
          <Activity size={28} color="var(--color-primary)" /> Dashboard Overview
        </h2>
      </div>

      {/* Upcoming Interview Widget */}
      {dashboard.nextInterview && (
        <div style={{
          background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-info) 100%)",
          color: "white",
          padding: "30px",
          borderRadius: "var(--radius-lg)",
          boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          animation: "fadeIn 0.5s ease-out"
        }}>
          <div>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", padding: "6px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Upcoming Interview
            </span>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "1.75rem", color: "white" }}>{dashboard.nextInterview.job?.title} @ {dashboard.nextInterview.job?.company}</h2>
            <p style={{ margin: 0, color: "#e0e7ff", display: "flex", alignItems: "center", gap: "6px", fontSize: "1.05rem" }}>
              {new Date(dashboard.nextInterview.interviewDate).toLocaleString()}
            </p>
          </div>
          {dashboard.nextInterview.meetingLink && (
            <a 
              href={dashboard.nextInterview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                background: "white",
                color: "var(--color-primary)",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                fontSize: "1rem"
              }}
            >
              Join Meeting <ExternalLink size={20} />
            </a>
          )}
        </div>
      )}

      {/* Profile Completion Meter */}
      {dashboard.profileCompletion && (
        <div className="card" style={{ padding: "24px", marginBottom: "30px", animation: "fadeIn 0.5s ease-out" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-secondary)" }}>Profile Setup</h3>
            <span style={{ fontWeight: "700", color: dashboard.profileCompletion.percentage === 100 ? "var(--color-success)" : "var(--color-primary)", fontSize: "1.1rem" }}>
              {dashboard.profileCompletion.percentage}%
            </span>
          </div>
          <div style={{ background: "var(--color-border)", height: "8px", borderRadius: "4px", overflow: "hidden", marginBottom: "16px" }}>
            <div style={{ 
              background: dashboard.profileCompletion.percentage === 100 ? "var(--color-success)" : "var(--color-primary)", 
              width: `${dashboard.profileCompletion.percentage}%`, 
              height: "100%",
              transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
            }} />
          </div>
          
          {dashboard.profileCompletion.missingActions.length > 0 && (
            <div style={{ background: "var(--color-warning-bg)", padding: "16px", borderRadius: "var(--radius-md)", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
              <p style={{ margin: "0 0 8px 0", color: "#b45309", fontWeight: "600", fontSize: "0.9rem" }}>Complete your profile to stand out:</p>
              <ul style={{ margin: 0, paddingLeft: "24px", fontSize: "0.9rem", color: "#92400e", display: "flex", flexDirection: "column", gap: "4px" }}>
                {dashboard.profileCompletion.missingActions.map((action, index) => (
                  <li key={index}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", marginBottom: "40px" }}>
        <MetricCard title="Jobs Applied" value={dashboard.totalApplications} icon={<Briefcase size={32} strokeWidth={1.5} />} color="primary" />
        <MetricCard title="Projects Added" value={dashboard.totalProjects} icon={<FolderGit2 size={32} strokeWidth={1.5} />} color="success" />
        <MetricCard title="Skills Listed" value={dashboard.skillsCount} icon={<Award size={32} strokeWidth={1.5} />} color="warning" />
      </div>

      <div style={{ animation: "fadeIn 0.5s ease-out" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, color: "var(--color-secondary)", fontSize: "1.25rem" }}>Recent Applications</h3>
          <Link to="/student/applications" style={{ color: "var(--color-primary)", textDecoration: "none", fontSize: "0.9rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {dashboard.recentApplications?.length === 0 ? (
          <EmptyState 
            icon={<Briefcase size={48} />}
            title="No Applications Yet"
            message="You haven't applied to any jobs yet. Start exploring jobs to kickstart your career!"
            ctaText="Browse Jobs"
            onCtaClick={() => window.location.href = '/student/jobs'}
          />
        ) : (
          <div className="card" style={{ padding: "0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                <tr>
                  <th style={{ padding: "16px 24px", color: "var(--color-text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Job Title</th>
                  <th style={{ padding: "16px 24px", color: "var(--color-text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company</th>
                  <th style={{ padding: "16px 24px", color: "var(--color-text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date Applied</th>
                  <th style={{ padding: "16px 24px", color: "var(--color-text-muted)", fontWeight: "600", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentApplications?.map((application, index) => (
                  <tr key={application._id} style={{ borderBottom: index !== dashboard.recentApplications.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <td style={{ padding: "20px 24px", fontWeight: "600", color: "var(--color-secondary)" }}>{application.job?.title}</td>
                    <td style={{ padding: "20px 24px", color: "var(--color-text-main)" }}>{application.job?.company}</td>
                    <td style={{ padding: "20px 24px", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>{new Date(application.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "20px 24px" }}><StatusBadge status={application.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom row: People You May Know + Who Viewed My Profile */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginTop: "24px" }}>

        {/* People You May Know */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="#2563eb" /> People You May Know
            </h3>
            <Link to="/network" style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", textDecoration: "none" }}>View all</Link>
          </div>
          {suggestions.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>No suggestions right now.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {suggestions.slice(0, 5).map(u => (
                <div key={u._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <Link to={`/user/${u._id}`} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flex: 1, minWidth: 0 }}>
                    <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: getRoleColor(u.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "white", flexShrink: 0, overflow: "hidden" }}>
                      {u.profilePicture ? <img src={`https://talentforge-backend-sbpr.onrender.com${u.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(u.fullName)}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{u.fullName}</p>
                      <p style={{ margin: 0, fontSize: "11px", color: getRoleColor(u.role), fontWeight: "500", textTransform: "capitalize" }}>{u.role}{u.companyName ? ` · ${u.companyName}` : ""}</p>
                    </div>
                  </Link>
                  {connectedIds.includes(u._id) ? (
                    <span style={{ fontSize: "11px", color: "#10b981", fontWeight: "600", flexShrink: 0 }}>Sent ✓</span>
                  ) : (
                    <button onClick={() => handleConnect(u._id)} disabled={connectingId === u._id}
                      style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontWeight: "600", flexShrink: 0, whiteSpace: "nowrap" }}>
                      <UserPlus size={12} /> {connectingId === u._id ? "..." : "Connect"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Who Viewed My Profile */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <Eye size={18} color="#8b5cf6" /> Who Viewed My Profile
            </h3>
            {viewCount > 0 && (
              <span style={{ fontSize: "12px", color: "#64748b", background: "#f8fafc", padding: "3px 10px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                {viewCount} view{viewCount !== 1 ? "s" : ""} (30 days)
              </span>
            )}
          </div>
          {profileViewers.length === 0 ? (
            <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>No profile views yet. Share your profile!</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {profileViewers.slice(0, 5).map(v => (
                <Link to={`/user/${v.viewedBy._id}`} key={v._id} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: getRoleColor(v.viewedBy.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "white", flexShrink: 0, overflow: "hidden" }}>
                    {v.viewedBy.profilePicture ? <img src={`https://talentforge-backend-sbpr.onrender.com${v.viewedBy.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(v.viewedBy.fullName)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: "600", fontSize: "13px", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.viewedBy.fullName}</p>
                    <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
                      <span style={{ color: getRoleColor(v.viewedBy.role), textTransform: "capitalize" }}>{v.viewedBy.role}</span>
                      {v.viewedBy.designation && ` · ${v.viewedBy.designation}`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;