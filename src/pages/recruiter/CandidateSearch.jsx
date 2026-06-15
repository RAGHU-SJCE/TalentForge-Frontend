import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, Code2, FolderGit2 } from "lucide-react";
import { toast } from "react-toastify";

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search Filters
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [project, setProject] = useState("");

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      let url = "http://localhost:5000/api/users/students?";
      if (name) url += `name=${name}&`;
      if (skill) url += `skill=${skill}&`;
      if (project) url += `project=${project}&`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data.students);
    } catch (error) {
      toast.error("Failed to fetch candidates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "24px" }}>Candidate Search</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "30px" }}>
        
        {/* Filters Sidebar */}
        <div className="card" style={{ alignSelf: "start" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={20} /> Filters
          </h2>
          
          <form onSubmit={handleSearch}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Skill / Technology</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. React"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
              />
            </div>

            <div className="form-group" style={{ marginBottom: "24px" }}>
              <label className="form-label">Project Name / Tech</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. E-Commerce"
                value={project}
                onChange={(e) => setProject(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? "Searching..." : "Apply Filters"}
            </button>
            <button 
              type="button" 
              className="btn btn-outline btn-block" 
              style={{ marginTop: "10px" }}
              onClick={() => {
                setName("");
                setSkill("");
                setProject("");
                setTimeout(fetchCandidates, 100);
              }}
            >
              Clear Filters
            </button>
          </form>
        </div>

        {/* Results Grid */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "20px" }}>
            Found {candidates.length} Candidates
          </h2>

          {loading ? (
            <div style={{ height: "200px", background: "#e2e8f0", borderRadius: "8px", animation: "pulse 1.5s infinite" }}></div>
          ) : candidates.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
              {candidates.map((cand) => (
                <div key={cand._id} className="card" style={{ padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: "0 0 5px 0", fontSize: "1.2rem" }}>
                      <Link to={`/user/${cand._id}`} style={{ color: "var(--color-primary)" }}>{cand.fullName}</Link>
                    </h3>
                    <p className="text-muted" style={{ margin: "0 0 10px 0", fontSize: "0.95rem" }}>
                      {cand.email}
                    </p>
                    
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {cand.skills && cand.skills.slice(0, 5).map((s, i) => (
                        <span key={i} style={{ background: "var(--color-info-bg)", color: "var(--color-info)", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "500" }}>
                          {s}
                        </span>
                      ))}
                      {cand.skills && cand.skills.length > 5 && (
                        <span style={{ color: "var(--color-text-muted)", fontSize: "0.75rem", padding: "2px 0" }}>+{cand.skills.length - 5} more</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Link to={`/user/${cand._id}`} className="btn btn-outline">View Profile</Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
              <Search size={48} color="var(--color-text-light)" style={{ margin: "0 auto 15px" }} />
              <h3 style={{ color: "var(--color-secondary)", margin: "0 0 10px 0" }}>No candidates found</h3>
              <p className="text-muted" style={{ margin: 0 }}>Try adjusting your search filters to find more profiles.</p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CandidateSearch;
