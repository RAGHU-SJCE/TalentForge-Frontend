import React from "react";
import StatusBadge from "./StatusBadge";
import { Calendar, Building2, MapPin, Video, AlignLeft, UserCircle2 } from "lucide-react";

const InterviewCard = ({ interview, isStudent = false, onCancel }) => {
  return (
    <div className="card" style={{ padding: "20px", marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <h3 style={{ margin: "0 0 5px 0", color: "var(--color-secondary)", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            {isStudent ? (
              <>
                <Building2 size={20} color="var(--color-primary)" />
                {interview.job?.title}
              </>
            ) : (
              <>
                <UserCircle2 size={20} color="var(--color-primary)" />
                {interview.candidate?.fullName}
              </>
            )}
          </h3>
          <p style={{ margin: "0", color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            {isStudent ? interview.job?.company : interview.candidate?.email}
          </p>
        </div>
        <StatusBadge status={interview.status} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", background: "var(--color-background)", padding: "15px", borderRadius: "8px", border: "1px solid var(--color-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ background: "var(--color-primary-light)", padding: "8px", borderRadius: "6px", color: "var(--color-primary)", display: "flex" }}>
            <Calendar size={18} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Date & Time</p>
            <p style={{ margin: 0, color: "var(--color-text-main)", fontWeight: "500" }}>{new Date(interview.interviewDate).toLocaleString()}</p>
          </div>
        </div>

        {interview.meetingLink && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "var(--color-info-bg)", padding: "8px", borderRadius: "6px", color: "var(--color-info)", display: "flex" }}>
              <Video size={18} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Meeting Link</p>
              <a href={interview.meetingLink} target="_blank" rel="noreferrer" style={{ color: "var(--color-info)", fontWeight: "500", textDecoration: "none" }}>
                Join Virtual Meeting
              </a>
            </div>
          </div>
        )}

        {interview.location && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "var(--color-warning-bg)", padding: "8px", borderRadius: "6px", color: "var(--color-warning)", display: "flex" }}>
              <MapPin size={18} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Location</p>
              <p style={{ margin: 0, color: "var(--color-text-main)", fontWeight: "500" }}>{interview.location}</p>
            </div>
          </div>
        )}
      </div>

      {interview.notes && (
        <div style={{ marginTop: "15px", display: "flex", gap: "10px", alignItems: "flex-start", background: "#f8fafc", padding: "12px", borderRadius: "6px", borderLeft: "3px solid var(--color-primary)" }}>
          <AlignLeft size={18} color="var(--color-text-muted)" style={{ marginTop: "2px" }} />
          <div>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: "600", textTransform: "uppercase", marginBottom: "4px" }}>Notes</p>
            <p style={{ margin: 0, color: "var(--color-text-main)", fontSize: "0.875rem" }}>{interview.notes}</p>
          </div>
        </div>
      )}

      {!isStudent && interview.status === "Scheduled" && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => onCancel(interview._id)}
            className="btn btn-outline"
            style={{ color: "var(--color-danger)", borderColor: "var(--color-danger)", display: "flex", alignItems: "center", gap: "6px" }}
          >
            Cancel Interview
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewCard;
