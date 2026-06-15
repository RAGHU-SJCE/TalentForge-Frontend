import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getAllJobs } from "../../services/jobService";
import { applyToJob } from "../../services/applicationService";
import { saveJob } from "../../services/savedJobService";
import EmptyState from "../../components/EmptyState";
import { Search, Briefcase, TrendingUp, Banknote, MapPin, X, SlidersHorizontal, Bookmark } from "lucide-react";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ title: "", company: "", location: "", skill: "", employmentType: "", experienceLevel: "" });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getAllJobs("");
      setAllJobs(data.jobs || []);
      setJobs(data.jobs || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for instant response
  useEffect(() => {
    let filtered = allJobs;
    if (filters.title) filtered = filtered.filter(j => j.title?.toLowerCase().includes(filters.title.toLowerCase()));
    if (filters.company) filtered = filtered.filter(j => j.company?.toLowerCase().includes(filters.company.toLowerCase()));
    if (filters.location) filtered = filtered.filter(j => j.location?.toLowerCase().includes(filters.location.toLowerCase()));
    if (filters.skill) filtered = filtered.filter(j => j.skillsRequired?.some(s => s.toLowerCase().includes(filters.skill.toLowerCase())));
    if (filters.employmentType) filtered = filtered.filter(j => j.employmentType === filters.employmentType);
    if (filters.experienceLevel) filtered = filtered.filter(j => j.experienceLevel === filters.experienceLevel);
    setJobs(filtered);
  }, [filters, allJobs]);

  const handleApply = async (jobId) => {
    try {
      const data = await applyToJob(jobId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Application Failed");
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const data = await saveJob(jobId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  const clearFilters = () => setFilters({ title: "", company: "", location: "", skill: "", employmentType: "", experienceLevel: "" });
  const hasFilters = Object.values(filters).some(v => v);
  const handleFilterChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  return (
    <div style={{ padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "1.75rem" }}>Available Jobs</h1>
        <p style={{ margin: 0, color: "#64748b" }}>{jobs.length} opportunities found</p>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "16px 20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Main search */}
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" name="title" placeholder="Search job titles..." value={filters.title} onChange={handleFilterChange}
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#f8fafc" }} />
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: "150px" }}>
            <Briefcase size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" name="company" placeholder="Company name..." value={filters.company} onChange={handleFilterChange}
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#f8fafc" }} />
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: "150px" }}>
            <MapPin size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" name="location" placeholder="Location..." value={filters.location} onChange={handleFilterChange}
              style={{ width: "100%", padding: "10px 12px 10px 36px", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", background: "#f8fafc" }} />
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", background: showFilters ? "#eff6ff" : "#f8fafc", border: `1px solid ${showFilters ? "#bfdbfe" : "#e2e8f0"}`, borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px", color: showFilters ? "#2563eb" : "#334155", whiteSpace: "nowrap" }}>
            <SlidersHorizontal size={15} /> Filters {hasFilters && <span style={{ background: "#2563eb", color: "white", borderRadius: "50%", width: "18px", height: "18px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px" }}>{Object.values(filters).filter(v=>v).length}</span>}
          </button>
          {hasFilters && (
            <button onClick={clearFilters} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "10px 14px", background: "#fef2f2", border: "1px solid #fee2e2", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px", color: "#ef4444" }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={{ display: "flex", gap: "12px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", whiteSpace: "nowrap" }}>Job Type</label>
              <select name="employmentType" value={filters.employmentType} onChange={handleFilterChange}
                style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", background: "white", cursor: "pointer" }}>
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", whiteSpace: "nowrap" }}>Experience</label>
              <select name="experienceLevel" value={filters.experienceLevel} onChange={handleFilterChange}
                style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", background: "white", cursor: "pointer" }}>
                <option value="">All Levels</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid">Mid Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#64748b", whiteSpace: "nowrap" }}>Skills</label>
              <input type="text" name="skill" placeholder="e.g. React" value={filters.skill} onChange={handleFilterChange}
                style={{ padding: "8px 12px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "13px", width: "140px" }} />
            </div>
          </div>
        )}
      </div>

      {/* Job Cards */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[1,2,3].map(i => <div key={i} style={{ height: "140px", background: "#e2e8f0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />)}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState icon={<Search size={48} />} title="No Jobs Found" message="Try adjusting your search or clear filters." ctaText="Clear Filters" onCtaClick={clearFilters} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {jobs.map(job => (
            <div key={job._id} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "22px 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s", display: "flex", gap: "20px", alignItems: "flex-start" }}
              onMouseOver={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseOut={e => { e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}>
              
              {/* Company logo placeholder */}
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg,#2563eb15,#7c3aed15)", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
                🏢
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "1.1rem", color: "#0f172a" }}>
                      <Link to={`/job/${job._id}`} style={{ color: "inherit", textDecoration: "none" }}
                        onMouseOver={e => e.currentTarget.style.color = "#2563eb"}
                        onMouseOut={e => e.currentTarget.style.color = "#0f172a"}>
                        {job.title}
                      </Link>
                    </h3>
                    <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>
                      <span style={{ fontWeight: "600", color: "#334155" }}>{job.company}</span>
                      <span style={{ margin: "0 6px" }}>·</span>
                      <MapPin size={12} style={{ verticalAlign: "middle", marginRight: "2px" }} />{job.location}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                    <button onClick={() => handleSaveJob(job._id)} style={{ padding: "8px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", color: "#64748b", display: "flex", alignItems: "center" }}
                      title="Save job"
                      onMouseOver={e => { e.currentTarget.style.background = "#eff6ff"; e.currentTarget.style.color = "#2563eb"; }}
                      onMouseOut={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#64748b"; }}>
                      <Bookmark size={16} />
                    </button>
                    <Link to={`/job/${job._id}`} style={{ padding: "8px 16px", background: "#2563eb", color: "white", borderRadius: "8px", fontWeight: "600", fontSize: "13px", textDecoration: "none", display: "flex", alignItems: "center" }}>
                      View & Apply
                    </Link>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "#eff6ff", color: "#2563eb", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid #dbeafe" }}>
                    <Briefcase size={12} /> {job.employmentType || "Full-time"}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f0fdf4", color: "#16a34a", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid #bbf7d0" }}>
                    <TrendingUp size={12} /> {job.experienceLevel || "Entry"}
                  </span>
                  {job.salary && (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "#fefce8", color: "#a16207", padding: "3px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600", border: "1px solid #fef08a" }}>
                      <Banknote size={12} /> {job.salary}
                    </span>
                  )}
                </div>

                <p style={{ margin: "0 0 10px 0", color: "#64748b", fontSize: "13px", display: "-webkit-box", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {job.description}
                </p>

                {job.skillsRequired?.length > 0 && (
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {job.skillsRequired.slice(0, 4).map((s, i) => (
                      <span key={i} style={{ background: "#f8fafc", color: "#334155", padding: "2px 8px", borderRadius: "6px", fontSize: "12px", border: "1px solid #e2e8f0" }}>{s}</span>
                    ))}
                    {job.skillsRequired.length > 4 && <span style={{ color: "#94a3b8", fontSize: "12px", padding: "2px 0" }}>+{job.skillsRequired.length - 4} more</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;