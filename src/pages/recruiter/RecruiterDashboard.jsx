import { useState } from "react";
import RecruiterJobs from "./RecruiterJobs";
import RecruiterApplicants from "./RecruiterApplicants";
import InterviewManagement from "./InterviewManagement";
import RecruiterAnalytics from "./RecruiterAnalytics";
import { LayoutDashboard, Briefcase, Users, Calendar, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import useDarkMode from "../../hooks/useDarkMode";


const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const dark = useDarkMode();

  const handleSelectJob = (jobId, targetTab) => {
    setSelectedJobId(jobId);
    setActiveTab(targetTab);
  };

  const navButtonStyle = (tabName) => ({
    padding: "10px 20px",
    background: activeTab === tabName
      ? (dark ? "#253352" : "#ffffff")
      : "transparent",
    color: activeTab === tabName
      ? (dark ? "#f1f5f9" : "#0f172a")
      : (dark ? "#94a3b8" : "#64748b"),
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    fontWeight: activeTab === tabName ? "600" : "500",
    fontSize: "0.875rem",
    boxShadow: activeTab === tabName
      ? (dark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)")
      : "none",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: 1,
    justifyContent: "center"
  });


  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "20px" }}>
        <h1 style={{ margin: 0, color: "var(--color-secondary)", fontSize: "1.75rem" }}>Recruiter Dashboard</h1>
        
        {/* Quick Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            to="/recruiter/search"
            className="btn btn-outline"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Search size={18} /> Search Candidates
          </Link>
          <button 
            className="btn btn-primary" 
            onClick={() => { setActiveTab("jobs"); setSelectedJobId(null); }}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Plus size={18} /> Post New Job
          </button>
        </div>
      </div>
      
      {/* Segmented Control Navigation */}
      <div style={{ 
        display: "flex", 
        marginBottom: "24px", 
        background: dark ? "#0f172a" : "#e2e8f0", 
        border: dark ? "1px solid #334155" : "none",
        padding: "4px", 
        borderRadius: "8px", 
        width: "100%",
        maxWidth: "600px"
      }}>

        <button style={navButtonStyle("analytics")} onClick={() => { setActiveTab("analytics"); setSelectedJobId(null); }}>
          <LayoutDashboard size={18} /> Analytics
        </button>
        <button style={navButtonStyle("jobs")} onClick={() => { setActiveTab("jobs"); setSelectedJobId(null); }}>
          <Briefcase size={18} /> My Jobs
        </button>
        <button style={navButtonStyle("applicants")} onClick={() => setActiveTab("applicants")}>
          <Users size={18} /> Applicants
        </button>
        <button style={navButtonStyle("interviews")} onClick={() => setActiveTab("interviews")}>
          <Calendar size={18} /> Interviews
        </button>
      </div>

      <div style={{ background: "transparent", minHeight: "60vh" }}>
        {activeTab === "analytics" && <RecruiterAnalytics />}
        {activeTab === "jobs" && <RecruiterJobs onSelectJob={handleSelectJob} />}
        {activeTab === "applicants" && <RecruiterApplicants jobId={selectedJobId} />}
        {activeTab === "interviews" && <InterviewManagement jobId={selectedJobId} />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;