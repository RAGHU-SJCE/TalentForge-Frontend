import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  User, Briefcase, FolderGit2, MessageSquare, UserPlus, MapPin, Phone,
  Calendar, Link as LinkIcon, BookOpen, Award, Star, ThumbsUp, UserCheck,
  Globe, GitBranch, Clock, Building2
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const API = "https://talentforge-backend-sbpr.onrender.com";

const getRoleColor = (role) => {
  if (role === "recruiter") return "#8b5cf6";
  if (role === "professional") return "#0ea5e9";
  return "#10b981";
};

const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(null); // null | "pending" | "accepted"
  const [sendingRequest, setSendingRequest] = useState(false);

  // Endorsements
  const [endorsements, setEndorsements] = useState([]);
  const [myEndorsedSkills, setMyEndorsedSkills] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Project stars
  const [projectStars, setProjectStars] = useState({});

  // Active tab
  const [activeTab, setActiveTab] = useState("about");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [profileRes, statusRes] = await Promise.all([
        axios.get(`${API}/api/users/${id}/public`, { headers }),
        axios.get(`${API}/api/connections/status/${id}`, { headers }),
      ]);

      setProfileUser(profileRes.data.user);
      setProjects(profileRes.data.projects || []);

      const conn = statusRes.data.connection;
      if (conn) setConnectionStatus(conn.status);

      const connected = conn?.status === "accepted";
      setIsConnected(connected);

      // Record profile view (fire and forget)
      axios.post(`${API}/api/profile-views/${id}/view`, {}, { headers }).catch(() => {});

      // Fetch endorsements
      const [endRes, myEndRes] = await Promise.all([
        axios.get(`${API}/api/endorsements/${id}`, { headers }),
        axios.get(`${API}/api/endorsements/${id}/mine`, { headers }),
      ]);
      setEndorsements(endRes.data.endorsements || []);
      setMyEndorsedSkills(myEndRes.data.endorsedSkills || []);

    } catch (error) {
      toast.error("User not found");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  // Fetch project stars after projects load
  useEffect(() => {
    if (!projects.length) return;
    const ids = projects.map(p => p._id);
    axios.post(`${API}/api/project-stars/bulk-stars`, { projectIds: ids }, { headers })
      .then(res => setProjectStars(res.data.data || {}))
      .catch(() => {});
  }, [projects]);

  const handleConnect = async () => {
    setSendingRequest(true);
    try {
      await axios.post(`${API}/api/connections/request`, { recipientId: id }, { headers });
      toast.success("Connection request sent!");
      setConnectionStatus("pending");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleEndorse = async (skill) => {
    if (!isConnected) { toast.error("You must be connected to endorse skills"); return; }
    try {
      const res = await axios.post(`${API}/api/endorsements/endorse`, { profileId: id, skill }, { headers });
      if (res.data.endorsed) {
        setMyEndorsedSkills(prev => [...prev, skill]);
        setEndorsements(prev => {
          const existing = prev.find(e => e.skill === skill);
          if (existing) return prev.map(e => e.skill === skill ? { ...e, count: e.count + 1 } : e);
          return [...prev, { skill, count: 1, endorsers: [] }];
        });
        toast.success(`Endorsed "${skill}"!`);
      } else {
        setMyEndorsedSkills(prev => prev.filter(s => s !== skill));
        setEndorsements(prev => prev.map(e => e.skill === skill ? { ...e, count: Math.max(0, e.count - 1) } : e).filter(e => e.count > 0));
        toast.info(`Endorsement removed`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to endorse");
    }
  };

  const handleStarProject = async (projectId) => {
    try {
      const res = await axios.post(`${API}/api/project-stars/${projectId}/star`, {}, { headers });
      setProjectStars(prev => ({
        ...prev,
        [projectId]: { starred: res.data.starred, starCount: res.data.starCount }
      }));
      toast.success(res.data.starred ? "⭐ Project starred!" : "Star removed");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to star project");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", maxWidth: "880px", margin: "0 auto" }}>
        {[1,2,3].map(i => <div key={i} style={{ height: i === 1 ? "200px" : "120px", background: "#e2e8f0", borderRadius: "16px", marginBottom: "20px", animation: "pulse 1.5s infinite" }} />)}
      </div>
    );
  }

  if (!profileUser) return null;

  const isOwn = currentUser?.id === id;
  const getEndorsementCount = (skill) => endorsements.find(e => e.skill === skill)?.count || 0;
  const isEndorsed = (skill) => myEndorsedSkills.includes(skill);

  const tabs = [
    { key: "about", label: "About" },
    { key: "skills", label: `Skills${profileUser.skills?.length ? ` (${profileUser.skills.length})` : ""}` },
    { key: "projects", label: `Projects (${projects.length})` },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "880px", margin: "0 auto" }}>

      {/* Profile Header Card */}
      <div className="card" style={{ padding: "0", overflow: "hidden", marginBottom: "20px" }}>
        {/* Banner */}
        <div style={{ height: "100px", background: `linear-gradient(135deg, ${getRoleColor(profileUser.role)}30, #7c3aed20)`, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #2563eb, #7c3aed)", opacity: 0.15 }} />
        </div>

        <div style={{ padding: "0 32px 28px" }}>
          {/* Avatar */}
          <div style={{ marginTop: "-40px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: getRoleColor(profileUser.role), display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "700", color: "white", border: "4px solid var(--color-surface)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", overflow: "hidden" }}>
              {profileUser.profilePicture
                ? <img src={`${API}${profileUser.profilePicture}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : getInitials(profileUser.fullName)}
            </div>

            {/* Action Buttons */}
            {!isOwn && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {connectionStatus === "accepted" ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--color-success-bg)", color: "var(--color-success)", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", border: "1px solid var(--color-success)" }}>
                    <UserCheck size={15} /> Connected
                  </span>
                ) : connectionStatus === "pending" ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--color-warning-bg)", color: "var(--color-warning)", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", border: "1px solid var(--color-warning)" }}>
                    <Clock size={15} /> Pending
                  </span>
                ) : (
                  <button onClick={handleConnect} disabled={sendingRequest}
                    className="btn btn-primary"
                    style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "13px" }}>
                    <UserPlus size={15} /> {sendingRequest ? "Sending..." : "Connect"}
                  </button>
                )}
                <Link to={`/messages?userId=${id}`}
                  className="btn btn-outline"
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>
                  <MessageSquare size={15} /> Message
                </Link>
              </div>
            )}
            {isOwn && (
              <Link to={`/${profileUser.role}/profile`}
                className="btn btn-outline"
                style={{ padding: "8px 18px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>
                Edit Profile
              </Link>
            )}
          </div>

          {/* Name & Role */}
          <h1 style={{ margin: "0 0 6px 0", fontSize: "1.5rem", color: "var(--color-secondary)" }}>{profileUser.fullName}</h1>

          {profileUser.designation && (
            <p style={{ margin: "0 0 4px 0", fontSize: "15px", color: "var(--color-text-main)", fontWeight: "500" }}>{profileUser.designation}
              {profileUser.companyName && <span style={{ color: "var(--color-text-muted)" }}> at {profileUser.companyName}</span>}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "12px" }}>
            <span style={{ background: `${getRoleColor(profileUser.role)}20`, color: getRoleColor(profileUser.role), padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "capitalize", border: `1px solid ${getRoleColor(profileUser.role)}30` }}>
              {profileUser.role}
            </span>
            {profileUser.location && (
              <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-text-muted)", fontSize: "13px" }}>
                <MapPin size={13} /> {profileUser.location}
              </span>
            )}
            {profileUser.linkedinUrl && (
              <a href={profileUser.linkedinUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-primary)", fontSize: "13px", textDecoration: "none", fontWeight: "500" }}>
                <LinkIcon size={13} /> LinkedIn
              </a>
            )}
            {profileUser.portfolioUrl && (
              <a href={profileUser.portfolioUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--color-primary)", fontSize: "13px", textDecoration: "none", fontWeight: "500" }}>
                <Globe size={13} /> Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "12px", padding: "6px", boxShadow: "var(--shadow-sm)" }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: "10px 16px", background: activeTab === tab.key ? "var(--color-primary)" : "transparent",
              color: activeTab === tab.key ? "white" : "var(--color-text-muted)",
              border: "none", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", transition: "all 0.2s"
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* About Tab */}
      {activeTab === "about" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Bio */}
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 14px 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}>
              <User size={18} color="var(--color-primary)" /> About
            </h2>
            <p style={{ margin: 0, color: "var(--color-text-main)", lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
              {profileUser.bio || "No bio provided."}
            </p>
          </div>

          {/* Info Grid */}
          <div className="card" style={{ padding: "24px" }}>
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 18px 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}>
              <Briefcase size={18} color="var(--color-primary)" /> Details
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {profileUser.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-text-main)", fontSize: "14px" }}>
                  <Phone size={16} color="var(--color-text-light)" /> {profileUser.phone}
                </div>
              )}
              {profileUser.dateOfBirth && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-text-main)", fontSize: "14px" }}>
                  <Calendar size={16} color="var(--color-text-light)" /> {new Date(profileUser.dateOfBirth).toLocaleDateString()}
                </div>
              )}
              {profileUser.education && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-text-main)", fontSize: "14px" }}>
                  <BookOpen size={16} color="var(--color-text-light)" /> {profileUser.education}
                </div>
              )}
              {profileUser.experience && profileUser.role !== "recruiter" && (
                <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", color: "var(--color-text-main)", fontSize: "14px", gridColumn: "1 / -1" }}>
                  <Briefcase size={16} color="var(--color-text-light)" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ whiteSpace: "pre-wrap" }}>{profileUser.experience}</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Details (Recruiter) */}
          {profileUser.role === "recruiter" && (profileUser.companyName || profileUser.industry || profileUser.companyWebsite) && (
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 18px 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}>
                <Building2 size={18} color="var(--color-primary)" /> Company Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {profileUser.companyName && <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-main)" }}><strong>Company:</strong> {profileUser.companyName}</p>}
                {profileUser.industry && <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-main)" }}><strong>Industry:</strong> {profileUser.industry}</p>}
                {profileUser.companyWebsite && <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-main)" }}><strong>Website:</strong> <a href={profileUser.companyWebsite} target="_blank" rel="noreferrer" style={{ color: "var(--color-primary)" }}>{profileUser.companyWebsite}</a></p>}
                {profileUser.companyDescription && <p style={{ margin: "8px 0 0", color: "var(--color-text-muted)", fontSize: "14px", whiteSpace: "pre-wrap" }}>{profileUser.companyDescription}</p>}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profileUser.certifications?.length > 0 && (
            <div className="card" style={{ padding: "24px" }}>
              <h2 style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 0 14px 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}>
                <Award size={18} color="var(--color-primary)" /> Certifications
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {profileUser.certifications.map((cert, i) => (
                  <span key={i} style={{ background: "var(--color-info-bg)", color: "var(--color-info)", padding: "5px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "500", border: "1px solid var(--color-border)" }}>
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skills + Endorsements Tab */}
      {activeTab === "skills" && (
        <div className="card" style={{ padding: "24px" }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: "1.1rem", color: "var(--color-secondary)" }}>Skills & Endorsements</h2>
          {!isOwn && isConnected && (
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--color-text-muted)" }}>
              Click <ThumbsUp size={12} style={{ verticalAlign: "middle" }} /> on a skill to endorse it
            </p>
          )}
          {!isOwn && !isConnected && (
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "var(--color-warning)", background: "var(--color-warning-bg)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--color-warning)" }}>
              🔒 Connect with {profileUser.fullName.split(" ")[0]} to endorse their skills
            </p>
          )}

          {profileUser.skills?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {profileUser.skills.map((skill, idx) => {
                const count = getEndorsementCount(skill);
                const alreadyEndorsed = isEndorsed(skill);
                return (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyConennt: "space-between", justifyContent: "space-between", padding: "12px 16px", background: "var(--color-background)", borderRadius: "10px", border: "1px solid var(--color-border)" }}>
                    <span style={{ fontWeight: "500", color: "var(--color-secondary)", fontSize: "14px" }}>{skill}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {count > 0 && (
                        <span style={{ fontSize: "12px", color: "var(--color-text-muted)", background: "var(--color-border)", padding: "2px 8px", borderRadius: "12px" }}>
                          {count} endorsement{count !== 1 ? "s" : ""}
                        </span>
                      )}
                      {!isOwn && (
                        <button onClick={() => handleEndorse(skill)}
                          style={{
                            display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px",
                            background: alreadyEndorsed ? "var(--color-primary)" : "var(--color-surface)",
                            color: alreadyEndorsed ? "white" : "var(--color-text-muted)",
                            border: `1px solid ${alreadyEndorsed ? "var(--color-primary)" : "var(--color-border)"}`,
                            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600",
                            transition: "all 0.2s"
                          }}>
                          <ThumbsUp size={13} /> {alreadyEndorsed ? "Endorsed" : "Endorse"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "var(--color-text-light)", margin: 0 }}>No skills listed.</p>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {projects.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-light)" }}>
              <FolderGit2 size={48} style={{ marginBottom: "12px", opacity: 0.4 }} />
              <p style={{ margin: 0 }}>No projects yet</p>
            </div>
          ) : projects.map(proj => {
            const stars = projectStars[proj._id] || { starCount: 0, starred: false };
            return (
              <div key={proj._id} className="card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ height: "4px", background: "linear-gradient(90deg, #2563eb, #7c3aed)" }} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-secondary)" }}>{proj.title}</h3>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      {!isOwn && (
                        <button onClick={() => handleStarProject(proj._id)}
                          style={{
                            display: "flex", alignItems: "center", gap: "4px", padding: "6px 12px",
                            background: stars.starred ? "var(--color-warning-bg)" : "var(--color-surface)",
                            color: stars.starred ? "var(--color-warning)" : "var(--color-text-muted)",
                            border: `1px solid ${stars.starred ? "var(--color-warning)" : "var(--color-border)"}`,
                            borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600"
                          }}>
                          <Star size={13} fill={stars.starred ? "var(--color-warning)" : "none"} />
                          {stars.starCount > 0 && stars.starCount} {stars.starred ? "Starred" : "Star"}
                        </button>
                      )}
                      {isOwn && stars.starCount > 0 && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--color-warning)", fontWeight: "600" }}>
                          <Star size={13} fill="var(--color-warning)" /> {stars.starCount}
                        </span>
                      )}
                      {proj.projectLink && (
                        <a href={proj.projectLink} target="_blank" rel="noreferrer"
                          style={{ background: "var(--color-success-bg)", color: "var(--color-success)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "700", border: "1px solid var(--color-success)", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
                          <Globe size={10} /> Live
                        </a>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: "0 0 14px 0", color: "var(--color-text-muted)", fontSize: "14px", lineHeight: "1.6" }}>{proj.description}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {proj.technologies.map((tech, i) => (
                      <span key={i} style={{ background: "var(--color-info-bg)", color: "var(--color-info)", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", border: "1px solid var(--color-border)" }}>{tech}</span>
                    ))}
                  </div>
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: "5px", color: "var(--color-text-main)", fontSize: "12px", fontWeight: "600", textDecoration: "none", padding: "5px 10px", border: "1px solid var(--color-border)", borderRadius: "6px", background: "var(--color-background)" }}>
                      <GitBranch size={13} /> View on GitHub
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicProfile;
