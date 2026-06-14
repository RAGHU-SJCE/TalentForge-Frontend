import { useState, useEffect } from "react";
import { getApplicantsForJob, updateApplicationStatus } from "../../services/recruiterService";

const RecruiterApplicants = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    if (jobId) {
      fetchApplicants(jobId);
    }
  }, [jobId]);

  const fetchApplicants = async (id) => {
    try {
      const data = await getApplicantsForJob(id);
      setApplicants(data.applications);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      const data = await updateApplicationStatus(applicationId, status);
      alert(data.message);
      fetchApplicants(jobId);
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  if (!jobId) {
    return <p>Please select a job to view applicants.</p>;
  }

  return (
    <div>
      <h2>Applicants</h2>
      {applicants.length === 0 ? (
        <p>No applicants for this job yet.</p>
      ) : (
        applicants.map(application => (
          <div key={application._id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px" }}>
            <h3>{application.student.fullName}</h3>
            <p>{application.student.email}</p>
            <p>Status: <strong>{application.status}</strong></p>
            
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => handleStatusUpdate(application._id, "Shortlisted")}>Shortlist</button>
              <button onClick={() => handleStatusUpdate(application._id, "Interview")}>Interview</button>
              <button onClick={() => handleStatusUpdate(application._id, "Selected")}>Select</button>
              <button onClick={() => handleStatusUpdate(application._id, "Rejected")}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RecruiterApplicants;
