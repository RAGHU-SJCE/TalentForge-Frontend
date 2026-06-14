import {
  useEffect,
  useState,
} from "react";

import {
  getSavedJobs,
  unsaveJob,
} from "../../services/savedJobService";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] =
    useState([]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs =
    async () => {
      try {
        const data =
          await getSavedJobs();

        setSavedJobs(
          data.savedJobs
        );
      } catch (error) {
        console.log(error);
      }
    };

  const handleRemove =
    async (jobId) => {
      try {
        const data =
          await unsaveJob(jobId);

        alert(data.message);

        fetchSavedJobs();
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Saved Jobs</h1>

      {savedJobs.length === 0 ? (
        <p>No Saved Jobs</p>
      ) : (
        savedJobs.map((saved) => (
          <div
            key={saved._id}
            style={{
              border:
                "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
            }}
          >
            <h3>
              {saved.job.title}
            </h3>

            <p>
              Company:
              {" "}
              {saved.job.company}
            </p>

            <p>
              Location:
              {" "}
              {saved.job.location}
            </p>

            <button
              onClick={() =>
                handleRemove(
                  saved.job._id
                )
              }
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;