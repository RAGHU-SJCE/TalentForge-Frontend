import { useState, useEffect } from "react";
import { getInterviewsForJob, scheduleInterview, cancelInterview } from "../../services/interviewService";
import InterviewCard from "../../components/InterviewCard";
import { getApplicantsForJob } from "../../services/recruiterService";
import { Calendar, Video, MapPin, AlignLeft, User, Plus } from "lucide-react";
import { toast } from "react-toastify";

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
    if (!formData.candidateId) return toast.error("Select a candidate");
    
    try {
      await scheduleInterview({
        ...formData,
        jobId
      });
      toast.success("Interview Scheduled Successfully");
      fetchInterviews();
      setFormData({ candidateId: "", interviewDate: "", meetingLink: "", location: "", notes: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error scheduling interview");
    }
  };

  const handleCancel = async (interviewId) => {
    if (!window.confirm("Cancel this interview?")) return;
    try {
      await cancelInterview(interviewId);
      toast.success("Interview Cancelled");
      fetchInterviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error cancelling interview");
    }
  };

  if (!jobId) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", color: "var(--color-text-muted)" }}>
        <Calendar size={48} style={{ opacity: 0.5, marginBottom: "15px" }} />
        <h3 style={{ margin: "0 0 10px 0", color: "var(--color-secondary)" }}>No Job Selected</h3>
        <p style={{ margin: 0 }}>Please select a job from the "My Jobs" tab to manage its interviews.</p>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div className="card" style={{ padding: "24px", marginBottom: "30px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "var(--color-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Calendar size={20} color="var(--color-primary)" /> Schedule New Interview
        </h3>
        
        <form onSubmit={handleSchedule} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          
          <div style={{ gridColumn: "1 / -1", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <div className="form-group">
              <label><User size={14} /> Select Candidate</label>
              <select 
                className="input-field"
                value={formData.candidateId} 
                onChange={(e) => setFormData({...formData, candidateId: e.target.value})}
                required
              >
                <option value="">Choose a shortlisted candidate...</option>
                {applicants
                  .filter(app => !interviews.some(i => i.candidate._id === app.student._id && i.status !== "Cancelled"))
                  .map(app => (
                  <option key={app._id} value={app.student._id}>
                    {app.student.fullName} ({app.student.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label><Calendar size={14} /> Date & Time</label>
              <input 
                className="input-field"
                type="datetime-local" 
                value={formData.interviewDate} 
                onChange={(e) => setFormData({...formData, interviewDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label><Video size={14} /> Meeting Link (Optional)</label>
            <input 
              className="input-field"
              type="url" 
              placeholder="e.g. https://zoom.us/j/..." 
              value={formData.meetingLink} 
              onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label><MapPin size={14} /> Physical Location (Optional)</label>
            <input 
              className="input-field"
              type="text" 
              placeholder="e.g. Office Suite 402" 
              value={formData.location} 
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div className="form-group" style={{ gridColumn: "1 / -1" }}>
            <label><AlignLeft size={14} /> Notes for Candidate</label>
            <textarea 
              className="input-field"
              placeholder="Any special instructions for the interview..." 
              value={formData.notes} 
              rows={3}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button type="submit" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={18} /> Schedule Interview
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, color: "var(--color-secondary)" }}>Scheduled Interviews</h3>
        <span style={{ background: "var(--color-primary-light)", color: "var(--color-primary)", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" }}>
          {interviews.length} Total
        </span>
      </div>

      {interviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", background: "var(--color-surface)", borderRadius: "8px", border: "1px dashed var(--color-border)" }}>
          <p style={{ color: "var(--color-text-muted)" }}>No interviews scheduled for this job yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {interviews.map(interview => (
            <InterviewCard 
              key={interview._id} 
              interview={interview} 
              isStudent={false} 
              onCancel={handleCancel} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewManagement;
