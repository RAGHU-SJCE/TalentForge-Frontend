import {
  useEffect,
  useState,
} from "react";

import {
  createJob,
  getMyJobs,
  deleteJob,
  getApplicantsForJob,
  updateApplicationStatus,
} from "../../services/recruiterService";

const RecruiterDashboard = () => {
  const [jobs, setJobs] =
    useState([]);

  const [applicants,
    setApplicants] =
    useState([]);

  const [selectedJob,
    setSelectedJob] =
    useState(null);

  const [formData,
    setFormData] =
    useState({
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
      skillsRequired: "",
    });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const data =
        await getMyJobs();

      setJobs(data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleCreateJob =
    async (e) => {
      e.preventDefault();

      try {
        await createJob({
          ...formData,
          skillsRequired:
            formData.skillsRequired
              .split(",")
              .map((skill) =>
                skill.trim()
              ),
        });

        alert(
          "Job Created Successfully"
        );

        setFormData({
          title: "",
          company: "",
          location: "",
          salary: "",
          description: "",
          skillsRequired: "",
        });

        fetchJobs();
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  const handleDeleteJob =
    async (jobId) => {
      if (
        !window.confirm(
          "Delete this job?"
        )
      )
        return;

      try {
        const data =
          await deleteJob(jobId);

        alert(data.message);

        fetchJobs();
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  const handleViewApplicants =
    async (jobId) => {
      try {
        const data =
          await getApplicantsForJob(
            jobId
          );

        setApplicants(
          data.applications
        );

        setSelectedJob(jobId);
      } catch (error) {
        console.log(error);
      }
    };

  const handleStatusUpdate =
    async (
      applicationId,
      status
    ) => {
      try {
        const data =
          await updateApplicationStatus(
            applicationId,
            status
          );

        alert(data.message);

        handleViewApplicants(
          selectedJob
        );
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >

      <h1 style={{color:"red"}}>
NEW RECRUITER DASHBOARD TEST
</h1>

      <h1>
        Recruiter Dashboard
      </h1>

      <h2>Create Job</h2>

      <form
        onSubmit={
          handleCreateJob
        }
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={
            handleChange
          }
        />

        <br /><br />

        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={
            handleChange
          }
        />

        <br /><br />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={
            handleChange
          }
        />

        <br /><br />

        <input
          type="text"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={
            handleChange
          }
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={
            formData.description
          }
          onChange={
            handleChange
          }
        />

        <br /><br />

        <input
          type="text"
          name="skillsRequired"
          placeholder="React, Node, MongoDB"
          value={
            formData.skillsRequired
          }
          onChange={
            handleChange
          }
        />

        <br /><br />

        <button
          type="submit"
        >
          Create Job
        </button>
      </form>

      <hr />

      <h2>My Jobs</h2>

      {jobs.map((job) => (
        <div
          key={job._id}
          style={{
            border:
              "1px solid #ddd",
            padding: "15px",
            marginBottom:
              "15px",
          }}
        >
          <h3>
            {job.title}
          </h3>

          <p>
            {job.company}
          </p>

          <p>
            {job.location}
          </p>

          <button
            onClick={() =>
              handleViewApplicants(
                job._id
              )
            }
          >
            View Applicants
          </button>

          {" "}

          <button
            onClick={() =>
              handleDeleteJob(
                job._id
              )
            }
          >
            Delete
          </button>
        </div>
      ))}

      <hr />

      <h2>Applicants</h2>

      {applicants.map(
        (application) => (
          <div
            key={
              application._id
            }
            style={{
              border:
                "1px solid #ddd",
              padding: "15px",
              marginBottom:
                "15px",
            }}
          >
            <h3>
              {
                application
                  .student
                  .fullName
              }
            </h3>

            <p>
              {
                application
                  .student
                  .email
              }
            </p>

            <p>
              Status:
              {" "}
              {
                application.status
              }
            </p>

            <button
              onClick={() =>
                handleStatusUpdate(
                  application._id,
                  "Shortlisted"
                )
              }
            >
              Shortlist
            </button>

            {" "}

            <button
              onClick={() =>
                handleStatusUpdate(
                  application._id,
                  "Interview"
                )
              }
            >
              Interview
            </button>

            {" "}

            <button
              onClick={() =>
                handleStatusUpdate(
                  application._id,
                  "Selected"
                )
              }
            >
              Select
            </button>

            {" "}

            <button
              onClick={() =>
                handleStatusUpdate(
                  application._id,
                  "Rejected"
                )
              }
            >
              Reject
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default RecruiterDashboard;