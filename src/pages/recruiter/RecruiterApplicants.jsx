import { useState, useEffect } from "react";
import { getApplicantsForJob, updateApplicationStatus } from "../../services/recruiterService";
import { toast } from "react-toastify";
import EmptyState from "../../components/EmptyState";
import { MousePointerClick, FileDown, Search, Trophy, FileText, Inbox } from "lucide-react";

const RecruiterApplicants = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [skillFilter, setSkillFilter] = useState("");
  const [sortByMatch, setSortByMatch] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  useEffect(() => {
    applyFilters();
  }, [applications, searchTerm, statusFilter, skillFilter, sortByMatch]);

  const fetchApplicants = async (id) => {
    try {
      const data = await getApplicantsForJob(id);
      setApplications(data.applications);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch applicants");
    }
  };

  const applyFilters = () => {
    let result = applications;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(app => 
        app.student.fullName.toLowerCase().includes(lowerSearch) || 
        app.student.email.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(app => app.status === statusFilter);
    }

    if (skillFilter) {
      const lowerSkill = skillFilter.toLowerCase();
      result = result.filter(app => 
        app.student.skills && app.student.skills.some(skill => skill.toLowerCase().includes(lowerSkill))
      );
    }

    if (sortByMatch) {
      result.sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    }

    setFilteredApplications([...result]);
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const data = await updateApplicationStatus(applicationId, status);
      toast.success(data.message);
      fetchApplicants(jobId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (!jobId) {
    return (
      <EmptyState 
        icon={<MousePointerClick size={48} />}
        title="Select a Job"
        message="Please select a job from the 'My Jobs' tab to view its applicants."
      />
    );
  }

  const exportToCSV = () => {
    if (filteredApplications.length === 0) {
      toast.info("No applicants to export.");
      return;
    }

    const headers = ["Name", "Email", "Match Score (%)", "Status"];
    const rows = filteredApplications.map(app => [
      `"${app.student.fullName}"`,
      `"${app.student.email}"`,
      app.matchPercentage !== undefined ? app.matchPercentage : "N/A",
      `"${app.status}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `applicants_job_${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h2 style={{ margin: 0 }}>Applicants</h2>
        <button 
          onClick={exportToCSV}
          style={{ background: "#10b981", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "8px" }}
        >
          <FileDown size={18} /> Export CSV
        </button>
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "20px", background: "#f9fafb", padding: "15px", borderRadius: "8px", flexWrap: "wrap" }}>
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", flex: 1, minWidth: "200px" }}
        />
        
        <input 
          type="text" 
          placeholder="Filter by skill..." 
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />

        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        
        <label style={{ display: "flex", alignItems: "center", gap: "8px", background: "white", padding: "8px 12px", borderRadius: "4px", border: "1px solid #ddd", cursor: "pointer" }}>
          <input 
            type="checkbox" 
            checked={sortByMatch}
            onChange={(e) => setSortByMatch(e.target.checked)}
          />
          Sort by Highest Match
        </label>
        
        <button onClick={() => { setSearchTerm(""); setStatusFilter("All"); setSkillFilter(""); setSortByMatch(false); }} style={{ padding: "8px 16px", borderRadius: "4px", border: "none", background: "#e5e7eb", cursor: "pointer" }}>
          Clear
        </button>
      </div>

      {applications.length === 0 ? (
        <EmptyState 
          icon={<Inbox size={48} />}
          title="No Applicants Yet"
          message="There are no applicants for this job yet. Check back later!"
        />
      ) : filteredApplications.length === 0 ? (
        <EmptyState 
          icon={<Search size={48} />}
          title="No Matches Found"
          message="No applicants match your current filters. Try adjusting them."
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {filteredApplications.map((application, index) => {
            const isTopMatch = sortByMatch && index === 0 && application.matchPercentage > 0;
            const matchColor = application.matchPercentage >= 80 ? "#10b981" : application.matchPercentage >= 50 ? "#f59e0b" : "#ef4444";
            
            return (
            <div key={application._id} style={{ border: isTopMatch ? "2px solid #4f46e5" : "1px solid #e2e8f0", padding: "20px", borderRadius: "8px", background: isTopMatch ? "#f5f3ff" : "white", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", position: "relative" }}>
              {isTopMatch && (
                <div style={{ position: "absolute", top: "-12px", left: "20px", background: "#4f46e5", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Trophy size={14} /> Top Candidate
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px", marginTop: isTopMatch ? "10px" : "0" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                    <h3 style={{ margin: "0", color: "#0f172a" }}>{application.student.fullName}</h3>
                    {application.matchPercentage !== undefined && (
                      <span style={{ background: matchColor, color: "white", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
                        {application.matchPercentage}% Match
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 10px 0", color: "#64748b" }}>{application.student.email}</p>
                  
                  {application.student.skills && application.student.skills.length > 0 && (
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "10px" }}>
                      {application.student.skills.map((skill, index) => (
                        <span key={index} style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "#475569" }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <p style={{ margin: "0" }}>Current Status: <strong style={{ color: "#4f46e5" }}>{application.status}</strong></p>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                  {application.student.resume && (
                    <a 
                      href={`https://talentforge-backend-production.up.railway.app/${application.student.resume.replace(/\\/g, "/")}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ background: "#f1f5f9", color: "#475569", textDecoration: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "14px", fontWeight: "500", border: "1px solid #cbd5e1", display: "flex", alignItems: "center", gap: "4px" }}
                    >
                      <FileText size={16} /> View Resume
                    </a>
                  )}
                  
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {application.status !== "Shortlisted" && <button onClick={() => handleStatusUpdate(application._id, "Shortlisted")} style={{ background: "#f59e0b", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Shortlist</button>}
                    {application.status !== "Interview" && <button onClick={() => handleStatusUpdate(application._id, "Interview")} style={{ background: "#3b82f6", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Interview</button>}
                    {application.status !== "Selected" && <button onClick={() => handleStatusUpdate(application._id, "Selected")} style={{ background: "#10b981", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Select</button>}
                    {application.status !== "Rejected" && <button onClick={() => handleStatusUpdate(application._id, "Rejected")} style={{ background: "#ef4444", color: "white", border: "none", padding: "6px 12px", borderRadius: "4px", cursor: "pointer" }}>Reject</button>}
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecruiterApplicants;
