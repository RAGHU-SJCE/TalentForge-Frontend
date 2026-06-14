import React from "react";

const ApplicationTimeline = ({ status }) => {
  const stages = ["Applied", "Shortlisted", "Interview", "Selected"];
  const isRejected = status === "Rejected";

  const getStageIndex = () => {
    if (isRejected) return stages.length; // highlight none if rejected, or up to current? We'll just show rejected.
    return stages.indexOf(status);
  };

  const currentIndex = getStageIndex();

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "15px", gap: "10px", width: "100%", overflowX: "auto", paddingBottom: "10px" }}>
      {isRejected ? (
        <div style={{ padding: "10px 20px", background: "#fee2e2", color: "#dc2626", borderRadius: "20px", fontWeight: "bold" }}>
          Application Rejected
        </div>
      ) : (
        stages.map((stage, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <React.Fragment key={stage}>
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "5px",
                minWidth: "80px"
              }}>
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: isCurrent ? "#3b82f6" : isCompleted ? "#10b981" : "#e5e7eb",
                  color: isCompleted || isCurrent ? "white" : "#9ca3af",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "bold",
                  fontSize: "14px"
                }}>
                  {index + 1}
                </div>
                <span style={{ 
                  fontSize: "12px", 
                  fontWeight: isCurrent ? "bold" : "normal",
                  color: isCurrent ? "#3b82f6" : isCompleted ? "#10b981" : "#9ca3af"
                }}>
                  {stage}
                </span>
              </div>
              
              {index < stages.length - 1 && (
                <div style={{
                  flex: 1,
                  height: "4px",
                  background: index < currentIndex ? "#10b981" : "#e5e7eb",
                  borderRadius: "2px",
                  minWidth: "30px"
                }} />
              )}
            </React.Fragment>
          );
        })
      )}
    </div>
  );
};

export default ApplicationTimeline;
