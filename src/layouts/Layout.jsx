import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { LayoutDashboard, User, Briefcase, ClipboardList, Calendar, Bookmark, FolderOpen, Bell, Menu, X, ArrowLeft, Users, MessageSquare, Search, LogOut, Moon, Sun, FileText, Rocket } from "lucide-react";

import axios from "axios";


const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [unreadCount, setUnreadCount] = useState(0);
  const searchRef = useRef(null);


  // Apply dark mode to html element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Poll unread notification count every 30s
  useEffect(() => {
    if (!user) return;
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://talentforge-backend-production.up.railway.app/api/notifications/unread-count",
          { headers: { Authorization: `Bearer ${token}` } });
        setUnreadCount(res.data.count || 0);
      } catch (e) {}
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/dashboard")) return "Dashboard";
    if (path.includes("/profile")) return "My Profile";
    if (path.includes("/jobs")) return "Jobs";
    if (path.includes("/applications")) return "Applications";
    if (path.includes("/notifications")) return "Notifications";
    if (path.includes("/saved-jobs")) return "Saved Jobs";
    if (path.includes("/projects")) return "Projects";
    if (path.includes("/resume-builder")) return "Resume Builder";

    if (path.includes("/interviews")) return "Interviews";
    if (path.includes("/network")) return "My Network";
    if (path.includes("/messages")) return "Messages";
    if (path.includes("/search")) return "Search Candidates";
    return "TalentForge";
  };

  const handleLogout = () => { logout(); navigate("/"); };
  const isDashboard = location.pathname.endsWith("/dashboard");
  const hasSidebar = user?.role === "student" || user?.role === "professional" || user?.role === "recruiter";

  // Close search on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://talentforge-backend-production.up.railway.app/api/connections/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSearchResults(res.data.users || []);
        setSearchOpen(true);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const studentLinks = [
    { name: "Dashboard", path: "/student/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Profile", path: "/student/profile", icon: <User size={20} /> },
    { name: "Jobs", path: "/student/jobs", icon: <Briefcase size={20} /> },
    { name: "My Applications", path: "/student/applications", icon: <ClipboardList size={20} /> },
    { name: "My Interviews", path: "/student/interviews", icon: <Calendar size={20} /> },
    { name: "My Network", path: "/network", icon: <Users size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Saved Jobs", path: "/student/saved-jobs", icon: <Bookmark size={20} /> },
    { name: "Projects", path: "/student/projects", icon: <FolderOpen size={20} /> },
    { name: "Resume Builder", path: "/student/resume-builder", icon: <FileText size={20} /> },
    { name: "Notifications", path: "/student/notifications", icon: <Bell size={20} /> },
  ];


  const professionalLinks = [
    { name: "Dashboard", path: "/professional/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Profile", path: "/professional/profile", icon: <User size={20} /> },
    { name: "Jobs", path: "/professional/jobs", icon: <Briefcase size={20} /> },
    { name: "My Applications", path: "/professional/applications", icon: <ClipboardList size={20} /> },
    { name: "My Interviews", path: "/professional/interviews", icon: <Calendar size={20} /> },
    { name: "My Network", path: "/network", icon: <Users size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Saved Jobs", path: "/professional/saved-jobs", icon: <Bookmark size={20} /> },
    { name: "Projects", path: "/professional/projects", icon: <FolderOpen size={20} /> },
    { name: "Resume Builder", path: "/professional/resume-builder", icon: <FileText size={20} /> },
    { name: "Notifications", path: "/professional/notifications", icon: <Bell size={20} /> },
  ];


  const recruiterLinks = [
    { name: "Dashboard", path: "/recruiter/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Search Candidates", path: "/recruiter/search", icon: <Search size={20} /> },
    { name: "My Profile", path: "/recruiter/profile", icon: <User size={20} /> },
    { name: "My Network", path: "/network", icon: <Users size={20} /> },
    { name: "Messages", path: "/messages", icon: <MessageSquare size={20} /> },
    { name: "Notifications", path: "/recruiter/notifications", icon: <Bell size={20} /> },
  ];

  const sidebarLinks = user?.role === "recruiter" ? recruiterLinks : (user?.role === "professional" ? professionalLinks : studentLinks);

  const getRoleColor = (role) => {
    if (role === "recruiter") return "#8b5cf6";
    if (role === "professional") return "#0ea5e9";
    return "#10b981";
  };

  const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#f8fafc", overflow: "hidden" }}>

      {/* Sidebar Overlay */}
      {hasSidebar && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1040 }} />
      )}

      {/* Sidebar */}
      {hasSidebar && (
        <aside style={{
          position: "fixed", top: 0, left: sidebarOpen ? 0 : "-260px",
          width: "260px", height: "100vh", background: "#0f172a", color: "white",
          zIndex: 1050, transition: "left 0.3s ease", display: "flex",
          flexDirection: "column", boxShadow: sidebarOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none"
        }}>
          {/* Sidebar Header */}
          <div style={{ height: "64px", display: "flex", alignItems: "center", padding: "0 20px", borderBottom: "1px solid #1e293b", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🚀</div>
              <span style={{ fontWeight: "700", fontSize: "18px", color: "#f1f5f9" }}>TalentForge</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer" }}><X size={22} /></button>
          </div>

          {/* User mini profile */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: getRoleColor(user?.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", flexShrink: 0, overflow: "hidden" }}>
              {user?.profilePicture ? <img src={`https://talentforge-backend-production.up.railway.app${user.profilePicture}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(user?.fullName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.fullName}</p>
              <span style={{ fontSize: "12px", color: getRoleColor(user?.role), fontWeight: "500", textTransform: "capitalize" }}>{user?.role}</span>
            </div>
          </div>

          {/* Nav Links */}
          <nav style={{ flex: 1, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            {sidebarLinks.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
                    borderRadius: "8px", textDecoration: "none",
                    color: isActive ? "white" : "#94a3b8",
                    background: isActive ? "linear-gradient(135deg, #2563eb20, #7c3aed20)" : "transparent",
                    borderLeft: isActive ? "3px solid #2563eb" : "3px solid transparent",
                    fontWeight: isActive ? "600" : "500", fontSize: "14px",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "#1e293b"; }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ color: isActive ? "#60a5fa" : "#64748b", position: "relative" }}>
                    {link.icon}
                    {link.name === "Notifications" && unreadCount > 0 && (
                      <span style={{ position: "absolute", top: "-5px", right: "-6px", background: "#ef4444", color: "white", fontSize: "9px", fontWeight: "800", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #0f172a" }}>
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </span>
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div style={{ padding: "16px" }}>
            <button onClick={handleLogout} style={{ width: "100%", background: "#ef444420", color: "#f87171", border: "1px solid #ef444430", padding: "10px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "14px" }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top Header */}
        <header style={{
          height: "64px",
          background: darkMode ? "#1e293b" : "#ffffff",
          borderBottom: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", position: "sticky", top: 0, zIndex: 1000,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
        }}>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            {hasSidebar && (
              <button onClick={() => setSidebarOpen(true)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-secondary)", display: "flex", alignItems: "center", padding: "6px" }}>
                <Menu size={22} />
              </button>
            )}
            {getPageTitle() === "TalentForge" ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Rocket size={20} color="var(--color-primary)" />
                <span style={{ fontWeight: "700", fontSize: "18px", color: "var(--color-secondary)", letterSpacing: "-0.015em" }}>TalentForge</span>
              </div>
            ) : (
              <h1 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "var(--color-secondary)" }}>{getPageTitle()}</h1>
            )}

          </div>

          {/* Global Search */}
          {hasSidebar && (
            <div ref={searchRef} style={{ position: "relative", flex: 1, maxWidth: "380px", margin: "0 20px" }}>
              <div style={{ position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8", pointerEvents: "none" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search people, skills, companies..."
                  style={{
                    width: "100%", padding: "9px 12px 9px 36px", borderRadius: "24px",
                    border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                    fontSize: "14px",
                    background: darkMode ? "#0f172a" : "#f8fafc",
                    color: darkMode ? "#f1f5f9" : "#0f172a",
                    outline: "none", transition: "all 0.2s"
                  }}
                  onFocus={e => { e.target.style.borderColor = "#2563eb"; e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = darkMode ? "#334155" : "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />

                {searchLoading && <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", border: "2px solid #2563eb", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />}
              </div>

              {searchOpen && searchResults.length > 0 && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
                  background: darkMode ? "#1e293b" : "white",
                  borderRadius: "12px",
                  border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)", zIndex: 2000, overflow: "hidden"
                }}>
                  {searchResults.map(u => (
                    <div key={u._id}
                      onClick={() => { navigate(`/user/${u._id}`); setSearchQuery(""); setSearchOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", cursor: "pointer", borderBottom: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`, transition: "background 0.15s" }}
                      onMouseOver={e => e.currentTarget.style.background = darkMode ? "#253352" : "#f8fafc"}
                      onMouseOut={e => e.currentTarget.style.background = darkMode ? "#1e293b" : "white"}
                    >
                      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: getRoleColor(u.role), display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "13px", color: "white", flexShrink: 0, overflow: "hidden" }}>
                        {u.profilePicture ? <img src={`https://talentforge-backend-production.up.railway.app${u.profilePicture}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : getInitials(u.fullName)}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: "600", fontSize: "14px", color: darkMode ? "#f1f5f9" : "#0f172a" }}>{u.fullName}</p>
                        <p style={{ margin: 0, fontSize: "12px", color: darkMode ? "#94a3b8" : "#64748b" }}>
                          <span style={{ textTransform: "capitalize", color: getRoleColor(u.role) }}>{u.role}</span>
                          {u.companyName && ` · ${u.companyName}`}
                          {u.designation && ` · ${u.designation}`}
                        </p>
                        {u.skills?.length > 0 && (
                          <p style={{ margin: "2px 0 0", fontSize: "11px", color: darkMode ? "#64748b" : "#94a3b8", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                            {u.skills.slice(0, 3).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searchOpen && searchQuery && !searchLoading && searchResults.length === 0 && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: darkMode ? "#1e293b" : "white", borderRadius: "12px", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", padding: "16px", textAlign: "center", color: darkMode ? "#64748b" : "#94a3b8", fontSize: "14px", zIndex: 2000 }}>
                  No users found for "{searchQuery}"
                </div>
              )}

            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Dark Mode Toggle */}
            <button onClick={() => setDarkMode(d => !d)}
              title={darkMode ? "Light Mode" : "Dark Mode"}
              style={{ background: darkMode ? "#334155" : "#f8fafc", border: "1px solid var(--color-border)", padding: "7px", borderRadius: "8px", cursor: "pointer", color: darkMode ? "#fbbf24" : "#64748b", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            {!isDashboard && (
              <button onClick={() => navigate(-1)} style={{ background: darkMode ? "#1e293b" : "#f8fafc", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, padding: "7px 14px", borderRadius: "20px", cursor: "pointer", fontWeight: "500", color: darkMode ? "#cbd5e1" : "#334155", display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
                <ArrowLeft size={14} /> Back
              </button>
            )}
            {!hasSidebar && (
              <button onClick={handleLogout} style={{ background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", padding: "7px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                Logout
              </button>
            )}

          </div>

        </header>

        <main style={{ flex: 1, position: "relative", overflowX: "hidden" }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Layout;
