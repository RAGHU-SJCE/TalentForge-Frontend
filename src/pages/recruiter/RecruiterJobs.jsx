import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { createJob, getMyJobs, deleteJob, updateJob } from "../../services/recruiterService";
import EmptyState from "../../components/EmptyState";
import {
  Building2, MapPin, Briefcase, TrendingUp, Banknote, Users, Pencil,
  Trash2, X, Check, Plus, Calendar, ChevronDown
} from "lucide-react";

const emptyForm = {
  title: "", company: "", location: "", salary: "", description: "",
  skillsRequired: "", employmentType: "Full-time", experienceLevel: "Entry",
  responsibilities: "", benefits: "", applicationDeadline: ""
};

const RecruiterJobs = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data.jobs || []);
    } catch { toast.error("Failed to fetch jobs"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      ...formData,
      skillsRequired: formData.skillsRequired.split(",").map(s => s.trim()).filter(Boolean),
      responsibilities: formData.responsibilities ? formData.responsibilities.split("\n").map(s => s.trim()).filter(Boolean) : [],
      benefits: formData.benefits ? formData.benefits.split("\n").map(s => s.trim()).filter(Boolean) : [],
    };
    try {
      if (editingId) {
        await updateJob(editingId, payload);
        toast.success("Job updated!");
      } else {
        await createJob(payload);
        toast.success("Job posted!");
      }
      setFormData(emptyForm);
      setShowForm(false);
      setEditingId(null);
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (job) => {
    setEditingId(job._id);
    setFormData({
      title: job.title || "", company: job.company || "",
      location: job.location || "", salary: job.salary || "",
      description: job.description || "",
      skillsRequired: (job.skillsRequired || []).join(", "),
      employmentType: job.employmentType || "Full-time",
      experienceLevel: job.experienceLevel || "Entry",
      responsibilities: (job.responsibilities || []).join("\n"),
      benefits: (job.benefits || []).join("\n"),
      applicationDeadline: job.applicationDeadline ? job.applicationDeadline.slice(0, 10) : "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelForm = () => { setShowForm(false); setEditingId(null); setFormData(emptyForm); };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      const data = await deleteJob(jobId);
      toast.success(data.message);
      fetchJobs();
    } catch { toast.error("Failed to delete job"); }
  };

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const EmpBadge = ({ text, color, bg, border }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: bg, color, border: `1px solid ${border}`, padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{text}</span>
  );

  return (
    <div>
      {/* Post Job Button (when form hidden) */}
      {!showForm && (
        <button onClick={() => setShowForm(true)}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: "linear-gradient(135deg, #2563eb, #7c3aed)", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", marginBottom: "24px", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}>
          <Plus size={16} /> Post New Job
        </button>
      )}

      {/* Job Form */}
      {showForm && (
        <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "28px", marginBottom: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#0f172a" }}>
              {editingId ? "✏️ Edit Job" : "📝 Post New Job"}
            </h2>
            <button onClick={cancelForm} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#64748b" }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {[
                { label: "Job Title *", name: "title", placeholder: "e.g. Senior React Developer" },
                { label: "Company Name *", name: "company", placeholder: "e.g. TechCorp Inc." },
                { label: "Location *", name: "location", placeholder: "e.g. Bangalore / Remote" },
                { label: "Salary", name: "salary", placeholder: "e.g. ₹8-12 LPA" },
              ].map(f => (
                <div key={f.name}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>{f.label}</label>
                  <input name={f.name} value={formData[f.name]} onChange={handleChange} placeholder={f.placeholder}
                    required={f.label.includes("*")} className="input-field" />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Job Type *</label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="input-field">
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Experience Level *</label>
                <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="input-field">
                  <option value="Entry">Entry Level</option>
                  <option value="Mid">Mid Level</option>
                  <option value="Senior">Senior Level</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Application Deadline</label>
                <input type="date" name="applicationDeadline" value={formData.applicationDeadline} onChange={handleChange} className="input-field" />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Skills Required *</label>
                <input name="skillsRequired" value={formData.skillsRequired} onChange={handleChange} placeholder="React, Node.js, MongoDB (comma separated)" required className="input-field" />
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Brief overview of the role..." className="input-field" style={{ minHeight: "80px", resize: "vertical" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Responsibilities (one per line)</label>
                <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="- Design scalable APIs&#10;- Lead code reviews" className="input-field" style={{ minHeight: "80px", resize: "vertical" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#64748b", marginBottom: "6px" }}>Benefits (one per line)</label>
                <textarea name="benefits" value={formData.benefits} onChange={handleChange} placeholder="- Health insurance&#10;- Remote work" className="input-field" style={{ minHeight: "80px", resize: "vertical" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button type="submit" disabled={submitting}
                style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 24px", background: "#2563eb", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}>
                <Check size={15} /> {submitting ? "Saving..." : editingId ? "Update Job" : "Post Job"}
              </button>
              <button type="button" onClick={cancelForm}
                style={{ padding: "10px 20px", background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Jobs List */}
      <div>
        <h2 style={{ margin: "0 0 16px 0", fontSize: "1.15rem", color: "#0f172a" }}>
          My Posted Jobs ({jobs.length})
        </h2>
        {jobs.length === 0 ? (
          <EmptyState icon={<Building2 size={48} />} title="No Jobs Posted" message="Post your first job to start finding great candidates." ctaText="Post a Job" onCtaClick={() => setShowForm(true)} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {jobs.map(job => (
              <div key={job._id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ height: "4px", background: "linear-gradient(90deg, #2563eb, #7c3aed)" }} />
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#0f172a" }}>{job.title}</h3>
                      <p style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Building2 size={13} /> {job.company}
                        <MapPin size={13} style={{ marginLeft: "4px" }} /> {job.location}
                      </p>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <EmpBadge text={job.employmentType || "Full-time"} color="#2563eb" bg="#eff6ff" border="#dbeafe" />
                        <EmpBadge text={job.experienceLevel || "Entry"} color="#10b981" bg="#ecfdf5" border="#d1fae5" />
                        {job.salary && <EmpBadge text={job.salary} color="#a16207" bg="#fefce8" border="#fde68a" />}
                        {job.applicationDeadline && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#94a3b8", fontSize: "12px" }}>
                            <Calendar size={12} /> Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => startEdit(job)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "7px 12px", background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                        <Pencil size={13} /> Edit
                      </button>
                      <button onClick={() => handleDelete(job._id)} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "7px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>

                  {job.skillsRequired?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                      {job.skillsRequired.slice(0, 5).map((s, i) => (
                        <span key={i} style={{ background: "#f8fafc", color: "#334155", padding: "2px 8px", borderRadius: "6px", fontSize: "11px", border: "1px solid #e2e8f0" }}>{s}</span>
                      ))}
                      {job.skillsRequired.length > 5 && <span style={{ fontSize: "11px", color: "#94a3b8" }}>+{job.skillsRequired.length - 5} more</span>}
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={() => onSelectJob(job._id, "applicants")}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                      <Users size={14} /> View Applicants
                    </button>
                    <button onClick={() => onSelectJob(job._id, "interviews")}
                      style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                      <Calendar size={14} /> Manage Interviews
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterJobs;
