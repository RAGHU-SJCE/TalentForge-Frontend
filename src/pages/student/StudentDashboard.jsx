import { useEffect, useState } from "react";

import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

import {
  getStudentDashboard,
} from "../../services/dashboardService";

const StudentDashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const data =
        await getStudentDashboard();

      setDashboard(
        data.dashboard
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (!dashboard) {
    return (
      <h2
        style={{
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        Loading Dashboard...
      </h2>
    );
  }

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <StudentSidebar />

      <div
        style={{
          flex: 1,
          background: "#f3f4f6",
          minHeight: "100vh",
        }}
      >
        <StudentNavbar />

        <div
          style={{
            padding: "20px",
          }}
        >
          <h2>
            Dashboard Overview
          </h2>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* Applications */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "220px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                Jobs Applied
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {
                  dashboard.totalApplications
                }
              </p>
            </div>

            {/* Projects */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "220px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                Projects
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {
                  dashboard.totalProjects
                }
              </p>
            </div>

            {/* Skills */}
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "10px",
                width: "220px",
                boxShadow:
                  "0 2px 5px rgba(0,0,0,0.1)",
              }}
            >
              <h3>
                Skills Added
              </h3>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {
                  dashboard.skillsCount
                }
              </p>
            </div>
          </div>

          {/* Recent Applications */}

          <div
            style={{
              marginTop: "40px",
            }}
          >
            <h2>
              Recent Applications
            </h2>

            {dashboard
              .recentApplications
              ?.length === 0 ? (
              <p>
                No Applications Yet
              </p>
            ) : (
              dashboard.recentApplications?.map(
                (application) => (
                  <div
                    key={
                      application._id
                    }
                    style={{
                      background:
                        "white",
                      padding:
                        "15px",
                      marginTop:
                        "10px",
                      borderRadius:
                        "8px",
                    }}
                  >
                    <h4>
                      {
                        application
                          .job
                          ?.title
                      }
                    </h4>

                    <p>
                      Company:
                      {" "}
                      {
                        application
                          .job
                          ?.company
                      }
                    </p>

                    <p>
                      Status:
                      {" "}
                      {
                        application.status
                      }
                    </p>
                  </div>
                )
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;