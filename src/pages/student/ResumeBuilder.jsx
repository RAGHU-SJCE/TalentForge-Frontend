import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Download, Printer, User, Briefcase, Code, Award, FolderOpen, Link as LinkIcon, MapPin, Phone, Mail, Calendar } from "lucide-react";

const API = "http://localhost:5000";

const ResumeBuilder = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const resumeRef = useRef(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const [profileRes, projectsRes] = await Promise.all([
        axios.get(`${API}/api/users/profile`, { headers }),
        axios.get(`${API}/api/projects/my-projects`, { headers }),
      ]);
      setProfile(profileRes.data.user);
      setProjects(projectsRes.data.projects || []);
    } catch (e) {
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ height: "600px", background: "#e2e8f0", borderRadius: "16px", animation: "pulse 1.5s infinite" }} />
    </div>
  );

  if (!profile) return null;

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      {/* Controls — hidden on print */}
      <div className="hide-on-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: "0 0 4px 0", fontSize: "1.5rem" }}>Resume Builder</h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>Auto-generated from your profile. Click Print to save as PDF.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={handlePrint}
            style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Resume Document */}
      <div ref={resumeRef} id="resume-document"
        style={{ background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0", overflow: "hidden" }}>

        {/* Header with color accent */}
        <div style={{ background: "linear-gradient(135deg, #1e3a5f, #2563eb)", padding: "36px 40px", color: "white" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", fontWeight: "700", overflow: "hidden", border: "3px solid rgba(255,255,255,0.4)", flexShrink: 0 }}>
              {profile.profilePicture
                ? <img src={`${API}${profile.profilePicture}`} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : profile.fullName?.charAt(0)?.toUpperCase()
              }
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ margin: "0 0 4px 0", fontSize: "1.8rem", fontWeight: "700", letterSpacing: "-0.02em" }}>{profile.fullName}</h1>
              {profile.designation && <p style={{ margin: "0 0 10px 0", fontSize: "15px", opacity: 0.85 }}>{profile.designation}{profile.companyName ? ` at ${profile.companyName}` : ""}</p>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "13px", opacity: 0.9 }}>
                <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Mail size={13} /> {profile.email}</span>
                {profile.phone && <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Phone size={13} /> {profile.phone}</span>}
                {profile.location && <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><MapPin size={13} /> {profile.location}</span>}
                {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", color: "white", textDecoration: "none" }}><LinkIcon size={13} /> LinkedIn</a>}
                {profile.portfolioUrl && <a href={profile.portfolioUrl} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", color: "white", textDecoration: "none" }}><LinkIcon size={13} /> Portfolio</a>}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "36px 40px", display: "grid", gridTemplateColumns: "1fr 280px", gap: "32px" }}>

          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* About / Summary */}
            {profile.bio && (
              <section>
                <h2 style={sectionTitle}><User size={16} style={{ color: "#2563eb" }} /> Professional Summary</h2>
                <div style={divider} />
                <p style={{ margin: "12px 0 0", color: "#334155", lineHeight: "1.7", fontSize: "14px", whiteSpace: "pre-wrap" }}>{profile.bio}</p>
              </section>
            )}

            {/* Experience */}
            {profile.experience && (
              <section>
                <h2 style={sectionTitle}><Briefcase size={16} style={{ color: "#2563eb" }} /> Experience</h2>
                <div style={divider} />
                <p style={{ margin: "12px 0 0", color: "#334155", lineHeight: "1.7", fontSize: "14px", whiteSpace: "pre-wrap" }}>{profile.experience}</p>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section>
                <h2 style={sectionTitle}><FolderOpen size={16} style={{ color: "#2563eb" }} /> Projects</h2>
                <div style={divider} />
                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
                  {projects.map(p => (
                    <div key={p._id} style={{ borderLeft: "3px solid #2563eb", paddingLeft: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{p.title}</h3>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#2563eb", textDecoration: "none" }}>GitHub</a>}
                          {p.projectLink && <a href={p.projectLink} target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "#10b981", textDecoration: "none" }}>Live</a>}
                        </div>
                      </div>
                      <p style={{ margin: "0 0 6px", fontSize: "13px", color: "#64748b", lineHeight: "1.5" }}>{p.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {p.technologies.map((t, i) => (
                          <span key={i} style={{ background: "#eff6ff", color: "#2563eb", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "600" }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {profile.certifications?.length > 0 && (
              <section>
                <h2 style={sectionTitle}><Award size={16} style={{ color: "#2563eb" }} /> Certifications</h2>
                <div style={divider} />
                <ul style={{ margin: "12px 0 0", paddingLeft: "18px", color: "#334155", fontSize: "14px", lineHeight: "1.8" }}>
                  {profile.certifications.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Skills */}
            {profile.skills?.length > 0 && (
              <section>
                <h2 style={sectionTitle}><Code size={16} style={{ color: "#2563eb" }} /> Skills</h2>
                <div style={divider} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
                  {profile.skills.map((s, i) => (
                    <span key={i} style={{ background: "#f1f5f9", color: "#0f172a", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", border: "1px solid #e2e8f0" }}>{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {profile.education && (
              <section>
                <h2 style={sectionTitle}><Calendar size={16} style={{ color: "#2563eb" }} /> Education</h2>
                <div style={divider} />
                <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#334155", lineHeight: "1.6" }}>{profile.education}</p>
              </section>
            )}

            {/* Date of Birth */}
            {profile.dateOfBirth && (
              <section>
                <h2 style={sectionTitle}>Date of Birth</h2>
                <div style={divider} />
                <p style={{ margin: "10px 0 0", fontSize: "13px", color: "#334155" }}>
                  {new Date(profile.dateOfBirth).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#f8fafc", borderTop: "1px solid #e2e8f0", padding: "14px 40px", fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
          Generated via TalentForge · {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .hide-on-print { display: none !important; }
          body { margin: 0; padding: 0; }
          #resume-document { box-shadow: none !important; border-radius: 0 !important; border: none !important; }
        }
      `}</style>
    </div>
  );
};

const sectionTitle = {
  margin: 0, fontSize: "13px", fontWeight: "700", color: "#0f172a",
  textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: "6px"
};
const divider = { height: "2px", background: "linear-gradient(90deg, #2563eb40, transparent)", marginTop: "6px" };

export default ResumeBuilder;
