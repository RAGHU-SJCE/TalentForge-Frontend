import { useState, useEffect } from "react";
import { createJob, getMyJobs, deleteJob } from "../../services/recruiterService";

const RecruiterJobs = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState([]);
  const [formData, setFormData] = useState({
    title: "", company: "", location: "", salary: "", description: "", skillsRequired: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await createJob({
        ...formData,
        skillsRequired: formData.skillsRequired.split(",").map(s => s.trim()),
      });
      alert("Job Created Successfully");
      setFormData({ title: "", company: "", location: "", salary: "", description: "", skillsRequired: "" });
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      const data = await deleteJob(jobId);
      alert(data.message);
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div>
      <h2>Create Job</h2>
      <form onSubmit={handleCreateJob} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required/>
        <input type="text" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required/>
        <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required/>
        <input type="text" placeholder="Salary" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} required/>
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required/>
        <input type="text" placeholder="Skills Required (comma separated)" value={formData.skillsRequired} onChange={e => setFormData({...formData, skillsRequired: e.target.value})} required/>
        <button type="submit">Create Job</button>
      </form>

      <hr style={{ margin: "20px 0" }} />

      <h2>My Jobs</h2>
      {jobs.map(job => (
        <div key={job._id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px" }}>
          <h3>{job.title}</h3>
          <p>{job.company} - {job.location}</p>
          <button onClick={() => onSelectJob(job._id, "applicants")} style={{ marginRight: "10px" }}>View Applicants</button>
          <button onClick={() => onSelectJob(job._id, "interviews")} style={{ marginRight: "10px" }}>Manage Interviews</button>
          <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default RecruiterJobs;
