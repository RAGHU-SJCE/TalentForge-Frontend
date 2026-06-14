import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getAllJobs,
} from "../../services/jobService";

import {
  applyToJob,
} from "../../services/applicationService";

import {
  saveJob,
} from "../../services/savedJobService";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    skill: ""
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]); // Refetch when filters change

  const fetchJobs = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const data = await getAllJobs(queryParams);
      setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = async (jobId) => {
    try {
      const data = await applyToJob(jobId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Application Failed");
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      const data = await saveJob(jobId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Available Jobs</h1>

      {/* Filter Section */}
      <div style={{ 
        display: "flex", 
        gap: "15px", 
        marginBottom: "20px", 
        background: "#f9fafb", 
        padding: "15px", 
        borderRadius: "8px",
        flexWrap: "wrap"
      }}>
        <input 
          type="text" 
          name="title" 
          placeholder="Job Title" 
          value={filters.title} 
          onChange={handleFilterChange} 
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <input 
          type="text" 
          name="company" 
          placeholder="Company" 
          value={filters.company} 
          onChange={handleFilterChange} 
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <input 
          type="text" 
          name="location" 
          placeholder="Location" 
          value={filters.location} 
          onChange={handleFilterChange} 
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
        <input 
          type="text" 
          name="skill" 
          placeholder="Required Skill" 
          value={filters.skill} 
          onChange={handleFilterChange} 
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd" }}
        />
      </div>

      {jobs.length === 0 ? (
        <p>No Jobs Found</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            style={{
              border:
                "1px solid #ddd",
              padding: "15px",
              marginBottom:
                "15px",
              borderRadius: "8px",
            }}
          >
            <h3>{job.title}</h3>

            <p>
              <strong>
                Company:
              </strong>{" "}
              {job.company}
            </p>

            <p>
              <strong>
                Location:
              </strong>{" "}
              {job.location}
            </p>

            <p>
              <strong>
                Salary:
              </strong>{" "}
              ₹{job.salary}
            </p>

            <p>
              {job.description}
            </p>

            <button
              onClick={() =>
                handleApply(
                  job._id
                )
              }
            >
              Apply Now
            </button>

            {" "}

            <button
              onClick={() =>
                handleSaveJob(
                  job._id
                )
              }
            >
              Save Job
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Jobs;