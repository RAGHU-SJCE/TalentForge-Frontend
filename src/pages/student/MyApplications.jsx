import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";
import ApplicationTimeline from "../../components/ApplicationTimeline";
import EmptyState from "../../components/EmptyState";
import { Building2, MapPin, Calendar, Briefcase, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px", color: "var(--color-secondary)", fontSize: "2rem" }}>Application Tracker</h1>

      {applications.length === 0 ? (
        <EmptyState 
          icon={<ClipboardList size={48} />}
          title="No Applications Yet"
          message="You haven't applied to any jobs yet. Start exploring jobs to kickstart your career!"
          ctaText="Browse Jobs"
          ctaLink="/student/jobs"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {applications.map((application) => (
            <div
              key={application._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "25px",
                borderLeft: "4px solid var(--color-primary)"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }}>
                <div style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
                  <div style={{ background: "var(--color-background)", padding: "12px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                    <Building2 size={32} color="var(--color-text-light)" />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.25rem", color: "var(--color-secondary)" }}>
                      <Link to={`/job/${application.job?._id}`} style={{ color: "inherit" }}>
                        {application.job?.title}
                      </Link>
                    </h3>
                    <p style={{ margin: "0 0 10px 0", fontSize: "1rem", fontWeight: "500", color: "var(--color-text-main)" }}>
                      {application.job?.company}
                    </p>
                    
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <MapPin size={16} /> {application.job?.location || "Remote"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Briefcase size={16} /> {application.job?.employmentType || "Full-time"}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                        <Calendar size={16} /> Applied: {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Link to={`/job/${application.job?._id}`} className="btn btn-outline" style={{ fontSize: "0.875rem" }}>
                    View Job Details
                  </Link>
                </div>
              </div>

              <div style={{ background: "var(--color-background)", padding: "20px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
                <h4 style={{ margin: "0 0 15px 0", color: "var(--color-text-main)", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Application Status
                </h4>
                <ApplicationTimeline status={application.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;