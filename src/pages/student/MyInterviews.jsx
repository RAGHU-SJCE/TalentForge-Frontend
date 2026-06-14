import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { getStudentInterviews } from "../../services/interviewService";
import InterviewCard from "../../components/InterviewCard";

const MyInterviews = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const data = await getStudentInterviews();
      setInterviews(data.interviews);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <StudentSidebar />

      <div style={{ flex: 1, background: "#f3f4f6", minHeight: "100vh" }}>
        <StudentNavbar />

        <div style={{ padding: "20px" }}>
          <h2>My Interviews</h2>

          <div style={{ marginTop: "20px" }}>
            {interviews.length === 0 ? (
              <p>No interviews scheduled yet.</p>
            ) : (
              interviews.map((interview) => (
                <InterviewCard key={interview._id} interview={interview} isStudent={true} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyInterviews;
