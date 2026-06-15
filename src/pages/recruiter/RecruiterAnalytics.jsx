import { useState, useEffect } from "react";
import { getRecruiterAnalytics } from "../../services/recruiterService";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
  LineChart, Line
} from "recharts";
import { Trophy } from "lucide-react";

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

const RecruiterAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await getRecruiterAnalytics();
      setData(response.dashboard);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading analytics...</p>;
  if (!data) return <p>Error loading analytics.</p>;

  return (
    <div>
      <h2>Analytics Dashboard</h2>

      {/* Metric Cards */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "40px" }}>
        <MetricCard title="Total Jobs" value={data.totalJobsPosted} color="#3b82f6" />
        <MetricCard title="Total Applications" value={data.totalApplicationsReceived} color="#8b5cf6" />
        <MetricCard title="Shortlisted" value={data.totalShortlistedCandidates} color="#f59e0b" />
        <MetricCard title="Interviewed" value={data.totalInterviewedCandidates} color="#14b8a6" />
        <MetricCard title="Selected" value={data.totalSelectedCandidates} color="#10b981" />
        <MetricCard title="Rejected" value={data.totalRejectedCandidates} color="#ef4444" />
        <MetricCard title="Upcoming Interviews" value={data.upcomingInterviews?.length || 0} color="#6366f1" />
        <MetricCard title="Avg Match Score" value={`${data.averageMatchScore || 0}%`} color="#ec4899" />
      </div>

      {/* Best Candidate Highlight */}
      {data.bestCandidate && (
        <div style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Trophy size={28} />
              <h3 style={{ margin: 0, fontSize: "20px" }}>Best Candidate Match</h3>
            </div>
            <p style={{ margin: "0 0 5px 0", fontSize: "18px", fontWeight: "bold" }}>{data.bestCandidate.student.fullName}</p>
            <p style={{ margin: "0 0 10px 0", opacity: 0.9 }}>For: {data.bestCandidate.job.title}</p>
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              {data.bestCandidate.student.skills?.slice(0, 5).map((skill, idx) => (
                <span key={idx} style={{ background: "rgba(255,255,255,0.2)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>{skill}</span>
              ))}
            </div>
          </div>
          <div style={{ background: "white", color: "#4f46e5", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            {data.bestCandidate.matchPercentage}%
          </div>
        </div>
      )}

      {/* Upcoming Interviews Widget */}
      {data.upcomingInterviews?.length > 0 && (
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginBottom: "40px" }}>
          <h3 style={{ margin: "0 0 15px 0" }}>Upcoming Interviews</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {data.upcomingInterviews.map((interview) => (
              <div key={interview._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px", border: "1px solid #e5e7eb", borderRadius: "6px" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "#111827" }}>{interview.candidate?.fullName} - {interview.job?.title}</h4>
                  <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>{new Date(interview.interviewDate).toLocaleString()}</p>
                </div>
                {interview.meetingLink && (
                  <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" style={{ background: "#4f46e5", color: "white", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "14px", fontWeight: "500" }}>
                    Join
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
        {/* Pie Chart: Application Status */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3>Application Status Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={data.statusDistribution}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {data.statusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <PieTooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Bar Chart: Applications Per Job */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
          <h3>Applications Per Job</h3>
          <BarChart
            width={500}
            height={300}
            data={data.applicationsPerJob}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="jobTitle" />
            <YAxis />
            <BarTooltip />
            <Bar dataKey="count" fill="#8b5cf6" />
          </BarChart>
        </div>

        {/* Line Chart: Monthly Applications */}
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", width: "100%" }}>
          <h3>Monthly Application Trends</h3>
          <LineChart
            width={800}
            height={300}
            data={data.monthlyApplications}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <BarTooltip />
            <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={3} />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, color }) => (
  <div style={{ 
    background: "white", 
    padding: "20px", 
    borderRadius: "8px", 
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", 
    minWidth: "150px",
    borderLeft: `5px solid ${color}`
  }}>
    <h4 style={{ margin: "0 0 10px 0", color: "#6b7280" }}>{title}</h4>
    <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold", color: "#111827" }}>{value}</p>
  </div>
);

export default RecruiterAnalytics;
