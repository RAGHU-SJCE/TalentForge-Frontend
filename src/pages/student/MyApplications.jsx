import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";

import ApplicationTimeline from "../../components/ApplicationTimeline";

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
    <div style={{ padding: "20px" }}>
      <h1>My Applications</h1>

      {applications.length === 0 ? (
        <p>No Applications Found</p>
      ) : (
        applications.map((application) => (
          <div
            key={application._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            <h3 style={{ margin: "0 0 10px 0" }}>{application.job?.title}</h3>
            <p style={{ margin: "0 0 5px 0", color: "#4b5563" }}>
              Company: {application.job?.company}
            </p>
            
            <ApplicationTimeline status={application.status} />
            
          </div>
        ))
      )}
    </div>
  );
};

export default MyApplications;