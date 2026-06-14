import { useState, useEffect } from "react";
import { getInterviewsForJob, scheduleInterview, cancelInterview } from "../../services/interviewService";
import InterviewCard from "../../components/InterviewCard";
import { getApplicantsForJob } from "../../services/recruiterService";

const InterviewManagement = ({ jobId }) => {
  const [interviews, setInterviews] = useState([]);
  const [applicants, setApplicants] = useState([]);
  
  const [formData, setFormData] = useState({
    candidateId: "",
    interviewDate: "",
    meetingLink: "",
    location: "",
    notes: ""
  });

  useEffect(() => {
    if (jobId) {
      fetchInterviews();
      fetchApplicants();
    }
  }, [jobId]);

  const fetchInterviews = async () => {
    try {
      const data = await getInterviewsForJob(jobId);
      setInterviews(data.interviews);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchApplicants = async () => {
    try {
      const data = await getApplicantsForJob(jobId);
      // Filter for shortlisted or interview status candidates
      const eligible = data.applications.filter(a => a.status === "Shortlisted" || a.status === "Interview");
      setApplicants(eligible);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    if (!formData.candidateId) return alert("Select a candidate");
    
    try {
      await scheduleInterview({
        ...formData,
        jobId
      });
      alert("Interview Scheduled Successfully");
      fetchInterviews();
      setFormData({ candidateId: "", interviewDate: "", meetingLink: "", location: "", notes: "" });
    } catch (error) {
      alert(error.response?.data?.message || "Error scheduling interview");
    }
  };

  const handleCancel = async (interviewId) => {
    if (!window.confirm("Cancel this interview?")) return;
    try {
      await cancelInterview(interviewId);
      alert("Interview Cancelled");
      fetchInterviews();
    } catch (error) {
      alert(error.response?.data?.message || "Error cancelling interview");
    }
  };

  if (!jobId) {
    return <p>Please select a job to manage interviews.</p>;
  }

  return (
    <div>
      <h3>Schedule New Interview</h3>
      <form onSubmit={handleSchedule} style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <select 
          value={formData.candidateId} 
          onChange={(e) => setFormData({...formData, candidateId: e.target.value})}
          required
        >
          <option value="">Select Candidate...</option>
          {applicants
            .filter(app => !interviews.some(i => i.candidate._id === app.student._id && i.status !== "Cancelled"))
            .map(app => (
            <option key={app._id} value={app.student._id}>
              {app.student.fullName} ({app.student.email})
            </option>
          ))}
        </select>

        <input 
          type="datetime-local" 
          value={formData.interviewDate} 
          onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
          required
        />

        <input 
          type="url" 
          placeholder="Meeting Link (e.g. Zoom/Meet)" 
          value={formData.meetingLink} 
          onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
        />

        <input 
          type="text" 
          placeholder="Physical Location (if applicable)" 
          value={formData.location} 
          onChange={(e) => setFormData({...formData, location: e.target.value})}
        />

        <textarea 
          placeholder="Notes for Candidate" 
          value={formData.notes} 
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
        />

        <button type="submit">Schedule Interview</button>
      </form>

      <hr />
      
      <h3>Scheduled Interviews</h3>
      {interviews.length === 0 ? (
        <p>No interviews for this job.</p>
      ) : (
        interviews.map(interview => (
          <InterviewCard 
            key={interview._id} 
            interview={interview} 
            isStudent={false} 
            onCancel={handleCancel} 
          />
        ))
      )}
    </div>
  );
};

export default InterviewManagement;
