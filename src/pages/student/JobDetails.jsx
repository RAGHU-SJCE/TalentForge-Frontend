import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getJobById } from "../../services/jobService";
import { applyToJob } from "../../services/applicationService";
import { saveJob } from "../../services/savedJobService";
import { Briefcase, TrendingUp, Banknote, ArrowLeft } from "lucide-react";

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const data = await getJobById(id);
      setJob(data.job);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load job details");
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      const data = await applyToJob(id);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  const handleSave = async () => {
    try {
      const data = await saveJob(id);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ height: "40px", background: "#e2e8f0", borderRadius: "8px", width: "60%", marginBottom: "20px", animation: "pulse 1.5s infinite" }}></div>
        <div style={{ height: "20px", background: "#e2e8f0", borderRadius: "4px", width: "40%", marginBottom: "40px", animation: "pulse 1.5s infinite" }}></div>
        <div style={{ height: "150px", background: "#e2e8f0", borderRadius: "8px", width: "100%", marginBottom: "20px", animation: "pulse 1.5s infinite" }}></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Job Not Found</h2>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <button className="btn btn-outline" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="card" style={{ marginBottom: "30px", padding: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--color-secondary)" }}>{job.title}</h1>
            <p style={{ fontSize: "1.1rem", color: "var(--color-text-muted)", marginBottom: "20px" }}>
              <strong>{job.company}</strong> &bull; {job.location}
            </p>
            
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", background: "var(--color-info-bg)", color: "var(--color-info)", padding: "6px 12px", borderRadius: "20px", fontSize: "0.875rem", fontWeight: "500" }}>
                <Briefcase size={16} /> {job.employmentType || "Full-time"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", background: "var(--color-warning-bg)", color: "var(--color-warning)", padding: "6px 12px", borderRadius: "20px", fontSize: "0.875rem", fontWeight: "500" }}>
                <TrendingUp size={16} /> {job.experienceLevel || "Entry Level"}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "5px", background: "var(--color-success-bg)", color: "var(--color-success)", padding: "6px 12px", borderRadius: "20px", fontSize: "0.875rem", fontWeight: "500" }}>
                <Banknote size={16} /> {job.salary || "Not specified"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", flexDirection: "column", minWidth: "200px" }}>
            <button className="btn btn-primary" style={{ padding: "12px", fontSize: "1rem" }} onClick={handleApply}>
              Apply Now
            </button>
            <button className="btn btn-outline" style={{ padding: "12px", fontSize: "1rem" }} onClick={handleSave}>
              Save for Later
            </button>
          </div>
        </div>

        <hr style={{ border: "0", borderTop: "1px solid var(--color-border)", margin: "30px 0" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
          <section>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--color-secondary)" }}>Job Description</h2>
            <p style={{ color: "var(--color-text-main)", whiteSpace: "pre-wrap", lineHeight: "1.7" }}>{job.description}</p>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--color-secondary)" }}>Responsibilities</h2>
              <ul style={{ paddingLeft: "20px", margin: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                {job.responsibilities.map((resp, index) => (
                  <li key={index} style={{ color: "var(--color-text-main)", lineHeight: "1.6" }}>{resp}</li>
                ))}
              </ul>
            </section>
          )}

          {job.skillsRequired && job.skillsRequired.length > 0 && (
            <section>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--color-secondary)" }}>Required Skills</h2>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {job.skillsRequired.map((skill, index) => (
                  <span key={index} style={{ background: "var(--color-background)", border: "1px solid var(--color-border)", padding: "6px 12px", borderRadius: "6px", fontSize: "0.9rem" }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <section>
              <h2 style={{ fontSize: "1.5rem", marginBottom: "15px", color: "var(--color-secondary)" }}>Benefits</h2>
              <ul style={{ paddingLeft: "20px", margin: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                {job.benefits.map((benefit, index) => (
                  <li key={index} style={{ color: "var(--color-text-main)", lineHeight: "1.6" }}>{benefit}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
