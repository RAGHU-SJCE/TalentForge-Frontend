import axios from "axios";

const JOB_API =
  "https://talentforge-backend-sbpr.onrender.com/api/jobs";

const APPLICATION_API =
  "https://talentforge-backend-sbpr.onrender.com/api/applications";

const getToken = () => {
  return localStorage.getItem("token");
};

// Create Job
export const createJob = async (
  jobData
) => {
  const { data } = await axios.post(
    JOB_API,
    jobData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};

// Get Recruiter's Jobs
export const getMyJobs = async () => {
  const { data } = await axios.get(
    `${JOB_API}/my-jobs`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};

// Delete Job
export const deleteJob = async (
  jobId
) => {
  const { data } = await axios.delete(
    `${JOB_API}/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return data;
};

// Update Job
export const updateJob = async (jobId, jobData) => {
  const { data } = await axios.put(`${JOB_API}/${jobId}`, jobData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
};



// Get Applicants
export const getApplicantsForJob =
  async (jobId) => {
    const { data } =
      await axios.get(
        `${APPLICATION_API}/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };

// Update Status
export const updateApplicationStatus =
  async (
    applicationId,
    status
  ) => {
    const { data } =
      await axios.put(
        `${APPLICATION_API}/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

    return data;
  };

// Get Dashboard Analytics
export const getRecruiterAnalytics = async () => {
  const { data } = await axios.get("https://talentforge-backend-sbpr.onrender.com/api/dashboard/recruiter", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return data;
};