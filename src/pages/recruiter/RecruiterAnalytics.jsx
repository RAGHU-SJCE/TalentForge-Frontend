import { useState, useEffect } from "react";
import { getRecruiterAnalytics } from "../../services/recruiterService";
import {
  PieChart, Pie, Cell, Tooltip as PieTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip,
  LineChart, Line
} from "recharts";

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
        <MetricCard title="Upcoming Interviews" value={data.upcomingInterviews} color="#6366f1" />
      </div>

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
