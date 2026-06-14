import { useEffect, useState } from "react";

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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data =
        await getAllJobs();

      setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApply = async (
    jobId
  ) => {
    try {
      const data =
        await applyToJob(jobId);

      alert(data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Application Failed"
      );
    }
  };

  const handleSaveJob = async (
    jobId
  ) => {
    try {
      const data =
        await saveJob(jobId);

      alert(data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to save job"
      );
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Available Jobs</h1>

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