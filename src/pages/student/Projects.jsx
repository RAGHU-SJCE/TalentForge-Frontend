import { useEffect, useState } from "react";
import { createProject, getMyProjects, deleteProject, updateProject } from "../../services/projectService";
import { toast } from "react-toastify";
import EmptyState from "../../components/EmptyState";
import { Globe, FolderOpen, GitBranch, Pencil, Trash2, X, Check } from "lucide-react";


const defaultForm = { title: "", description: "", technologies: "", githubLink: "", projectLink: "" };

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const data = await getMyProjects();
      setProjects(data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProject({ ...form, technologies: form.technologies.split(",").map(t => t.trim()).filter(Boolean) });
      toast.success("Project Added Successfully");
      setForm(defaultForm);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const data = await deleteProject(id);
      toast.success(data.message);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setEditForm({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      githubLink: project.githubLink || "",
      projectLink: project.projectLink || "",
    });
  };

  const cancelEdit = () => { setEditingId(null); setEditForm(defaultForm); };

  const handleUpdate = async (id) => {
    try {
      await updateProject(id, { ...editForm, technologies: editForm.technologies.split(",").map(t => t.trim()).filter(Boolean) });
      toast.success("Project updated successfully");
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update project");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "1.75rem" }}>My Projects</h1>
        <p style={{ margin: 0, color: "#64748b" }}>Showcase your work to recruiters and professionals</p>
      </div>

      <div style={{ display: "flex", gap: "28px", flexWrap: "wrap", alignItems: "flex-start" }}>

        {/* Add Project Form */}
        <div style={{ flex: "0 0 340px", minWidth: "280px" }}>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", position: "sticky", top: "80px" }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "1.2rem", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "white", width: "28px", height: "28px", borderRadius: "8px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>+</span>
              Add New Project
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { label: "Project Title *", name: "title", placeholder: "e.g. E-Commerce Platform", required: true },
                { label: "Technologies *", name: "technologies", placeholder: "e.g. React, Node.js, MongoDB", required: true },
                { label: "GitHub Repository", name: "githubLink", placeholder: "https://github.com/user/repo" },
                { label: "Live Demo URL", name: "projectLink", placeholder: "https://myproject.vercel.app" },
              ].map(field => (
                <div key={field.name} className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">{field.label}</label>
                  <input name={field.name} className="input-field" placeholder={field.placeholder} value={form[field.name]} onChange={handleChange} required={field.required} />
                </div>
              ))}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Description *</label>
                <textarea name="description" className="input-field" placeholder="Briefly describe what this project does and what you learned..." value={form.description} onChange={handleChange} required style={{ minHeight: "90px", resize: "vertical" }} />
              </div>
              <button type="submit" disabled={submitting} className="btn btn-primary" style={{ width: "100%", marginTop: "4px" }}>
                {submitting ? "Adding..." : "Add Project"}
              </button>
            </form>
          </div>
        </div>

        {/* Projects Grid */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          {projects.length === 0 ? (
            <EmptyState icon={<FolderOpen size={48} />} title="No Projects Yet" message="Showcase your skills by adding your best projects here." />
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
              {projects.map(project => (
                <div key={project._id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column" }}>
                  
                  {/* Color banner */}
                  <div style={{ height: "6px", background: "linear-gradient(90deg, #2563eb, #7c3aed)" }} />

                  <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                    {editingId === project._id ? (
                      /* Edit Mode */
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <input name="title" value={editForm.title} onChange={handleEditChange} className="input-field" placeholder="Project Title" />
                        <input name="technologies" value={editForm.technologies} onChange={handleEditChange} className="input-field" placeholder="Technologies (comma separated)" />
                        <input name="githubLink" value={editForm.githubLink} onChange={handleEditChange} className="input-field" placeholder="GitHub URL" />
                        <input name="projectLink" value={editForm.projectLink} onChange={handleEditChange} className="input-field" placeholder="Live Demo URL" />
                        <textarea name="description" value={editForm.description} onChange={handleEditChange} className="input-field" rows="3" placeholder="Description" style={{ resize: "vertical" }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button onClick={() => handleUpdate(project._id)} style={{ flex: 1, background: "#10b981", color: "white", border: "none", padding: "9px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <Check size={14} /> Save
                          </button>
                          <button onClick={cancelEdit} style={{ flex: 1, background: "#f1f5f9", color: "#64748b", border: "1px solid #e2e8f0", padding: "9px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                            <X size={14} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* View Mode */
                      <>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a", flex: 1 }}>{project.title}</h3>
                          {project.projectLink && (
                            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" style={{ background: "#ecfdf5", color: "#10b981", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", border: "1px solid #d1fae5", textDecoration: "none", whiteSpace: "nowrap", marginLeft: "8px" }}>
                              <Globe size={10} style={{ marginRight: "3px" }} />Live
                            </a>
                          )}
                        </div>

                        <p style={{ color: "#64748b", fontSize: "0.875rem", flex: 1, lineHeight: "1.5", marginBottom: "12px" }}>{project.description}</p>

                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} style={{ background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", border: "1px solid #dbeafe" }}>{tech}</span>
                          ))}
                        </div>

                        <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                          {project.githubLink && (
                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", padding: "8px", background: "#f8fafc", color: "#334155", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
                              <GitBranch size={14} /> GitHub
                            </a>

                          )}
                          <button onClick={() => startEdit(project)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", padding: "8px", background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(project._id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px 12px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fee2e2", borderRadius: "8px", fontSize: "12px", cursor: "pointer" }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;