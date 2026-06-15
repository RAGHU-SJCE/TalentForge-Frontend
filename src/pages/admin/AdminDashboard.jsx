import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Users, Briefcase, ShieldCheck, Trash2, Search,
  RefreshCw, UserCheck, BarChart2, FolderOpen
} from "lucide-react";

const API = "https://talentforge-backend-sbpr.onrender.com";

const ROLE_COLORS = {
  student: { bg: "#ecfdf5", color: "#10b981", border: "#d1fae5" },
  professional: { bg: "#eff6ff", color: "#2563eb", border: "#dbeafe" },
  recruiter: { bg: "#f5f3ff", color: "#8b5cf6", border: "#ede9fe" },
  admin: { bg: "#fefce8", color: "#a16207", border: "#fde68a" },
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Navigation tabs: "users" | "jobs" | "projects"
  const [activeTab, setActiveTab] = useState("users");

  // State
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({ total: 0, student: 0, professional: 0, recruiter: 0, admin: 0, jobsCount: 0, projectsCount: 0 });
  
  const [usersLoading, setUsersLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // Fetch counts & main stats
  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API}/api/admin/dashboard`, { headers });
      const { totalUsers, totalStudents, totalRecruiters, totalJobs, totalProjects } = res.data.dashboard || {};
      setStats(prev => ({
        ...prev,
        total: totalUsers || 0,
        student: totalStudents || 0,
        recruiter: totalRecruiters || 0,
        jobsCount: totalJobs || 0,
        projectsCount: totalProjects || 0
      }));
    } catch (e) {
      console.error("Failed to load dashboard statistics.");
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/users`, { headers });
      const allUsers = res.data.users || [];
      setUsers(allUsers);
      
      // Compute detailed local roles breakdown
      const rolesStats = { student: 0, professional: 0, recruiter: 0, admin: 0 };
      allUsers.forEach(u => {
        if (rolesStats[u.role] !== undefined) rolesStats[u.role]++;
      });
      
      setStats(prev => ({
        ...prev,
        total: allUsers.length,
        student: rolesStats.student,
        professional: rolesStats.professional,
        recruiter: rolesStats.recruiter,
        admin: rolesStats.admin
      }));
    } catch (e) {
      toast.error("Failed to load users list");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/jobs`, { headers });
      setJobs(res.data.jobs || []);
    } catch (e) {
      toast.error("Failed to load jobs");
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/projects`, { headers });
      setProjects(res.data.projects || []);
    } catch (e) {
      toast.error("Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "jobs") fetchJobs();
    if (activeTab === "projects") fetchProjects();
  };

  // Tab change handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearch("");
    if (tab === "users" && users.length === 0) fetchUsers();
    if (tab === "jobs" && jobs.length === 0) fetchJobs();
    if (tab === "projects" && projects.length === 0) fetchProjects();
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/admin/users/${userId}`, { headers });
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success("User deleted successfully");
      fetchStats();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to delete user");
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Delete job posting "${title}"?`)) return;
    try {
      await axios.delete(`${API}/api/admin/jobs/${jobId}`, { headers });
      setJobs(prev => prev.filter(j => j._id !== jobId));
      toast.success("Job posting deleted");
      fetchStats();
    } catch (e) {
      toast.error("Failed to delete job");
    }
  };

  const handleDeleteProject = async (projectId, title) => {
    if (!window.confirm(`Delete project "${title}"?`)) return;
    try {
      await axios.delete(`${API}/api/admin/projects/${projectId}`, { headers });
      setProjects(prev => prev.filter(p => p._id !== projectId));
      toast.success("Project deleted");
      fetchStats();
    } catch (e) {
      toast.error("Failed to delete project");
    }
  };

  // Search filter implementations
  const filteredUsers = users.filter(u => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch = !search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const filteredJobs = jobs.filter(j => {
    return !search || j.title?.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase());
  });

  const filteredProjects = projects.filter(p => {
    return !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
  });

  const StatCard = ({ label, value, icon, color }) => (
    <div style={{ background: "var(--color-surface)", borderRadius: "14px", padding: "20px 24px", border: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
      <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", color }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "26px", fontWeight: "800", color: "var(--color-secondary)" }}>{value}</p>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-muted)" }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto", color: "var(--color-text-main)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px", color: "var(--color-secondary)" }}>
            <ShieldCheck size={26} color="#2563eb" /> Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "14px" }}>Admin operations panel</p>
        </div>
        <button onClick={handleRefresh} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-text-main)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <StatCard label="Total Users" value={stats.total} icon={<Users size={22} />} color="#2563eb" />
        <StatCard label="Job Postings" value={stats.jobsCount} icon={<Briefcase size={22} />} color="#8b5cf6" />
        <StatCard label="Student Projects" value={stats.projectsCount} icon={<FolderOpen size={22} />} color="#10b981" />
      </div>

      {/* View Switcher Tabs */}
      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--color-border)", paddingBottom: "1px", marginBottom: "24px" }}>
        <button onClick={() => handleTabChange("users")}
          style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: activeTab === "users" ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === "users" ? "#2563eb" : "var(--color-text-muted)", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
          Registered Users
        </button>
        <button onClick={() => handleTabChange("jobs")}
          style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: activeTab === "jobs" ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === "jobs" ? "#2563eb" : "var(--color-text-muted)", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
          Job Postings
        </button>
        <button onClick={() => handleTabChange("projects")}
          style={{ padding: "12px 20px", background: "transparent", border: "none", borderBottom: activeTab === "projects" ? "2px solid #2563eb" : "2px solid transparent", color: activeTab === "projects" ? "#2563eb" : "var(--color-text-muted)", fontWeight: "600", cursor: "pointer", fontSize: "14px" }}>
          Projects Explorer
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={{ background: "var(--color-surface)", borderRadius: "14px", padding: "16px 20px", marginBottom: "20px", border: "1px solid var(--color-border)", display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={
              activeTab === "users" ? "Search by name or email..." :
              activeTab === "jobs" ? "Search jobs by title or company..." : "Search projects by title or description..."
            }
            style={{ width: "100%", padding: "9px 12px 9px 36px", border: "1px solid var(--color-border)", background: "var(--color-background)", color: "var(--color-text-main)", borderRadius: "8px", fontSize: "14px" }} />
        </div>
        
        {activeTab === "users" && (
          <div style={{ display: "flex", gap: "8px" }}>
            {["all", "student", "professional", "recruiter", "admin"].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)}
                style={{ padding: "8px 14px", background: roleFilter === r ? "#2563eb" : "var(--color-surface)", color: roleFilter === r ? "white" : "var(--color-text-muted)", border: "1px solid " + (roleFilter === r ? "#2563eb" : "var(--color-border)"), borderRadius: "20px", cursor: "pointer", fontWeight: "600", fontSize: "12px", textTransform: "capitalize" }}>
                {r === "all" ? `All (${stats.total})` : r}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* CONTENT LIST CARD */}
      <div style={{ background: "var(--color-surface)", borderRadius: "14px", border: "1px solid var(--color-border)", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ overflowX: "auto" }}>
          {activeTab === "users" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["User", "Email", "Role Badge", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  [1,2,3].map(i => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      {[1,2,3,4,5].map(j => (
                        <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "16px", background: "var(--color-border)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-light)" }}>No users found</td></tr>
                ) : filteredUsers.map((u, idx) => {
                  const rc = ROLE_COLORS[u.role] || ROLE_COLORS.student;
                  const initials = u.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";
                  return (
                    <tr key={u._id} style={{ borderBottom: idx !== filteredUsers.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                      <td style={{ padding: "14px 20px" }}>
                        <div 
                          onClick={() => navigate(`/user/${u._id}`)}
                          style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}
                        >
                          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: rc.color + "20", color: rc.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", flexShrink: 0, overflow: "hidden", border: `1px solid ${rc.border}` }}>
                            {u.profilePicture ? <img src={`${API}${u.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : initials}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "var(--color-text-main)" }}
                               onMouseOver={e => e.currentTarget.style.color = "#2563eb"}
                               onMouseOut={e => e.currentTarget.style.color = "var(--color-text-main)"}>
                              {u.fullName}
                            </p>
                            {u.designation && <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-light)" }}>{u.designation}</p>}
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--color-text-muted)", fontSize: "13px" }}>{u.email}</td>
                      <td style={{ padding: "14px 20px" }}>
                        <span style={{ display: "inline-block", padding: "5px 14px", background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`, borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize" }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: "14px 20px", color: "var(--color-text-light)", fontSize: "12px" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ padding: "14px 20px" }}>
                        {u.role !== "admin" && (
                          <button onClick={() => handleDeleteUser(u._id, u.fullName)}
                            style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {activeTab === "jobs" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Job Title", "Company", "Location", "Recruiter", "Created", "Action"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobsLoading ? (
                  [1,2,3].map(i => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      {[1,2,3,4,5,6].map(j => (
                        <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "16px", background: "var(--color-border)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredJobs.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-light)" }}>No jobs postings found</td></tr>
                ) : filteredJobs.map((j, idx) => (
                  <tr key={j._id} style={{ borderBottom: idx !== filteredJobs.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <td 
                      onClick={() => navigate(`/job/${j._id}`)}
                      style={{ padding: "14px 20px", fontWeight: "600", fontSize: "14px", color: "var(--color-text-main)", cursor: "pointer" }}
                      onMouseOver={e => e.currentTarget.style.color = "#2563eb"}
                      onMouseOut={e => e.currentTarget.style.color = "var(--color-text-main)"}
                    >
                      {j.title}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--color-text-muted)", fontSize: "13px" }}>{j.company}</td>
                    <td style={{ padding: "14px 20px", color: "var(--color-text-muted)", fontSize: "13px" }}>{j.location}</td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--color-text-main)" }}>
                      {j.recruiter ? (
                        <div 
                          onClick={() => navigate(`/user/${j.recruiter._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <p style={{ margin: 0, fontWeight: "500" }}
                             onMouseOver={e => e.currentTarget.style.color = "#2563eb"}
                             onMouseOut={e => e.currentTarget.style.color = "var(--color-text-main)"}>
                            {j.recruiter.fullName}
                          </p>
                          <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-light)" }}>{j.recruiter.email}</p>
                        </div>
                      ) : "System"}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--color-text-light)", fontSize: "12px" }}>
                      {new Date(j.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button onClick={() => handleDeleteJob(j._id, j.title)}
                        style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === "projects" && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--color-background)", borderBottom: "1px solid var(--color-border)" }}>
                  {["Project Name", "Technologies", "Creator", "Created At", "Action"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectsLoading ? (
                  [1,2,3].map(i => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      {[1,2,3,4,5].map(j => (
                        <td key={j} style={{ padding: "16px 20px" }}><div style={{ height: "16px", background: "var(--color-border)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} /></td>
                      ))}
                    </tr>
                  ))
                ) : filteredProjects.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "var(--color-text-light)" }}>No student projects found</td></tr>
                ) : filteredProjects.map((p, idx) => (
                  <tr key={p._id} style={{ borderBottom: idx !== filteredProjects.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <td 
                      onClick={() => {
                        const link = p.githubLink || p.projectLink;
                        if (link) {
                          window.open(link, "_blank");
                        } else if (p.createdBy) {
                          navigate(`/user/${p.createdBy._id}`);
                        }
                      }}
                      style={{ padding: "14px 20px", cursor: "pointer" }}
                    >
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "var(--color-text-main)" }}
                         onMouseOver={e => e.currentTarget.style.color = "#2563eb"}
                         onMouseOut={e => e.currentTarget.style.color = "var(--color-text-main)"}>
                        {p.title}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--color-text-muted)", maxWidth: "400px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.description}</p>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {p.technologies?.map(tech => (
                          <span key={tech} style={{ fontSize: "11px", background: "var(--color-background)", padding: "2px 8px", borderRadius: "10px", color: "var(--color-text-main)", border: "1px solid var(--color-border)" }}>{tech}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: "13px", color: "var(--color-text-main)" }}>
                      {p.createdBy ? (
                        <div 
                          onClick={() => navigate(`/user/${p.createdBy._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <p style={{ margin: 0, fontWeight: "500" }}
                             onMouseOver={e => e.currentTarget.style.color = "#2563eb"}
                             onMouseOut={e => e.currentTarget.style.color = "var(--color-text-main)"}>
                            {p.createdBy.fullName}
                          </p>
                          <p style={{ margin: 0, fontSize: "11px", color: "var(--color-text-light)" }}>{p.createdBy.email}</p>
                        </div>
                      ) : "Unknown"}
                    </td>
                    <td style={{ padding: "14px 20px", color: "var(--color-text-light)", fontSize: "12px" }}>
                      {new Date(p.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <button onClick={() => handleDeleteProject(p._id, p.title)}
                        style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "600", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Trash2 size={13} /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;