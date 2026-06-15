import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSavedJobs, unsaveJob } from "../../services/savedJobService";
import { toast } from "react-toastify";
import EmptyState from "../../components/EmptyState";
import { Bookmark, MapPin, Building2, Briefcase } from "lucide-react";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const data = await getSavedJobs();
      setSavedJobs(data.savedJobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async (jobId) => {
    try {
      const data = await unsaveJob(jobId);
      toast.success(data.message);
      fetchSavedJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove saved job");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <Bookmark size={32} color="var(--color-primary)" />
        <h1 style={{ margin: 0, color: "var(--color-secondary)", fontSize: "2rem" }}>Saved Jobs</h1>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState 
          icon={<Bookmark size={48} />}
          title="No Saved Jobs"
          message="You haven't saved any jobs yet. Browse available jobs and save them for later."
          ctaText="Browse Jobs"
          ctaLink="/student/jobs"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {savedJobs.map((saved) => (
            <div
              key={saved._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                padding: "25px",
                borderLeft: "4px solid var(--color-warning)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <div style={{ background: "var(--color-background)", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                    <Building2 size={32} color="var(--color-text-light)" />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.25rem", color: "var(--color-secondary)" }}>
                      <Link to={`/job/${saved.job?._id}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                        {saved.job?.title}
                      </Link>
                    </h3>
                    <p style={{ margin: "0 0 10px 0", fontSize: "1rem", fontWeight: "500", color: "var(--color-text-main)" }}>
                      {saved.job?.company}
                    </p>
                    
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <MapPin size={16} /> {saved.job?.location || "Remote"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Briefcase size={16} /> {saved.job?.employmentType || "Full-time"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                  <Link to={`/job/${saved.job?._id}`} className="btn btn-primary" style={{ fontSize: "0.875rem" }}>
                    View Details
                  </Link>
                  <button onClick={() => handleRemove(saved.job?._id)} className="btn btn-outline" style={{ fontSize: "0.875rem", color: "var(--color-danger)", borderColor: "var(--color-danger-bg)" }}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedJobs;