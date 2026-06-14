import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";

const MyApplications = () => {
  const [applications, setApplications] =
    useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data =
        await getMyApplications();

      setApplications(
        data.applications
      );
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
        applications.map(
          (application) => (
            <div
              key={application._id}
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
                  application.job
                    ?.title
                }
              </h3>

              <p>
                Company:
                {" "}
                {
                  application.job
                    ?.company
                }
              </p>

              <p>
                Status:
                {" "}
                <strong>
                  {
                    application.status
                  }
                </strong>
              </p>
            </div>
          )
        )
      )}
    </div>
  );
};

export default MyApplications;