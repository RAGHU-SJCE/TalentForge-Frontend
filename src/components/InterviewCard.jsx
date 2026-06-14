import React from "react";

const StatusBadge = ({ status }) => {
  let color = "#6b7280";
  if (status === "Scheduled") color = "#3b82f6";
  if (status === "Completed") color = "#10b981";
  if (status === "Cancelled") color = "#ef4444";

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: color,
      }}
    >
      {status}
    </span>
  );
};

const InterviewCard = ({ interview, isStudent = false, onCancel }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "15px",
        background: "white",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>
          {isStudent ? interview.job?.title : interview.candidate?.fullName}
        </h3>
        <StatusBadge status={interview.status} />
      </div>

      <p><strong>Date & Time:</strong> {new Date(interview.interviewDate).toLocaleString()}</p>
      
      {isStudent && <p><strong>Company:</strong> {interview.job?.company}</p>}
      {!isStudent && <p><strong>Email:</strong> {interview.candidate?.email}</p>}
      
      {interview.meetingLink && (
        <p>
          <strong>Meeting Link:</strong>{" "}
          <a href={interview.meetingLink} target="_blank" rel="noreferrer">
            {interview.meetingLink}
          </a>
        </p>
      )}
      {interview.location && <p><strong>Location:</strong> {interview.location}</p>}
      {interview.notes && <p><strong>Notes:</strong> {interview.notes}</p>}

      {!isStudent && interview.status === "Scheduled" && (
        <button
          onClick={() => onCancel(interview._id)}
          style={{
            marginTop: "10px",
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 12px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Cancel Interview
        </button>
      )}
    </div>
  );
};

export default InterviewCard;
