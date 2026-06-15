import { useEffect, useState } from "react";
import { getStudentInterviews } from "../../services/interviewService";
import InterviewCard from "../../components/InterviewCard";
import EmptyState from "../../components/EmptyState";
import { Calendar } from "lucide-react";

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
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "var(--color-secondary)" }}>My Interviews</h2>
      </div>

      <div style={{ marginTop: "20px" }}>
        {interviews.length === 0 ? (
          <EmptyState 
            icon={<Calendar size={48} />}
            title="No Interviews Scheduled"
            message="You don't have any upcoming interviews. Keep applying to jobs and checking your application statuses!"
          />
        ) : (
          interviews.map((interview) => (
            <InterviewCard key={interview._id} interview={interview} isStudent={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyInterviews;
