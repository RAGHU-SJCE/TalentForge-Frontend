import { useState } from "react";
import RecruiterJobs from "./RecruiterJobs";
import RecruiterApplicants from "./RecruiterApplicants";
import InterviewManagement from "./InterviewManagement";

const RecruiterDashboard = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJobId, setSelectedJobId] = useState(null);

  const handleSelectJob = (jobId, targetTab) => {
    setSelectedJobId(jobId);
    setActiveTab(targetTab);
  };

  const navButtonStyle = (tabName) => ({
    padding: "10px 20px",
    background: activeTab === tabName ? "#3b82f6" : "#e5e7eb",
    color: activeTab === tabName ? "white" : "black",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
    fontWeight: "bold",
  });

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Recruiter Dashboard</h1>
      
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button 
          style={navButtonStyle("jobs")} 
          onClick={() => { setActiveTab("jobs"); setSelectedJobId(null); }}
        >
          My Jobs
        </button>
        <button 
          style={navButtonStyle("applicants")} 
          onClick={() => setActiveTab("applicants")}
        >
          Applicants
        </button>
        <button 
          style={navButtonStyle("interviews")} 
          onClick={() => setActiveTab("interviews")}
        >
          Interviews
        </button>
      </div>

      <div style={{ background: "#f9fafb", padding: "20px", borderRadius: "8px", minHeight: "60vh" }}>
        {activeTab === "jobs" && <RecruiterJobs onSelectJob={handleSelectJob} />}
        {activeTab === "applicants" && <RecruiterApplicants jobId={selectedJobId} />}
        {activeTab === "interviews" && <InterviewManagement jobId={selectedJobId} />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;