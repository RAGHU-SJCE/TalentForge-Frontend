import React from "react";

const StatusBadge = ({ status }) => {
  let bgColor = "#f3f4f6"; // default gray bg
  let textColor = "#4b5563"; // default gray text

  const lowerStatus = status?.toLowerCase() || "";

  if (lowerStatus === "scheduled" || lowerStatus === "interview") {
    bgColor = "#dbeafe";
    textColor = "#2563eb"; // blue
  } else if (lowerStatus === "completed" || lowerStatus === "selected" || lowerStatus === "active") {
    bgColor = "#dcfce7";
    textColor = "#16a34a"; // green
  } else if (lowerStatus === "cancelled" || lowerStatus === "rejected") {
    bgColor = "#fee2e2";
    textColor = "#dc2626"; // red
  } else if (lowerStatus === "shortlisted" || lowerStatus === "pending") {
    bgColor = "#fef3c7";
    textColor = "#d97706"; // amber
  } else if (lowerStatus === "applied") {
    bgColor = "#e0e7ff";
    textColor = "#4f46e5"; // indigo
  }

  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 10px",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        color: textColor,
        backgroundColor: bgColor,
        border: `1px solid ${bgColor === "#f3f4f6" ? "#e5e7eb" : "transparent"}`
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
