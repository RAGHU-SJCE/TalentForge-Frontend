import { useEffect, useState, useRef } from "react";
import { getProfile, uploadResume, updateAdvancedProfile } from "../../services/userService";
import { Printer, CheckCircle2, UploadCloud, FileText, UserCircle, Briefcase, Link as LinkIcon, Camera } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const fileInputRef = useRef(null);
  const picInputRef = useRef(null);


  // General fields
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [bio, setBio] = useState("");
  
  // Student / Professional specific
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  
  // Professional specific
  const [certifications, setCertifications] = useState("");
  
  // Recruiter / Professional specific
  const [designation, setDesignation] = useState("");

  // Recruiter specific
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [industry, setIndustry] = useState("");


  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
      
      setBio(data.user.bio || "");
      if (data.user.dateOfBirth) {
        setDateOfBirth(new Date(data.user.dateOfBirth).toISOString().split('T')[0]);
      }
      setLocation(data.user.location || "");
      setPhone(data.user.phone || "");
      setLinkedinUrl(data.user.linkedinUrl || "");
      setPortfolioUrl(data.user.portfolioUrl || "");
      
      setSkills(data.user.skills?.join(", ") || "");
      setExperience(data.user.experience || "");
      setEducation(data.user.education || "");
      setCertifications(data.user.certifications?.join(", ") || "");
      
      setDesignation(data.user.designation || "");
      setCompanyName(data.user.companyName || "");
      setCompanyWebsite(data.user.companyWebsite || "");
      setCompanyDescription(data.user.companyDescription || "");
      setIndustry(data.user.industry || "");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        bio, location, phone, linkedinUrl, portfolioUrl,
        ...(dateOfBirth && { dateOfBirth }),
      };

      if (user.role === "student" || user.role === "professional") {
        payload.skills = skills.split(",").map((s) => s.trim()).filter(Boolean);
        payload.experience = experience;
        payload.education = education;
      }
      
      if (user.role === "professional") {
        payload.designation = designation;
        payload.certifications = certifications.split(",").map((s) => s.trim()).filter(Boolean);
      }

      if (user.role === "recruiter") {
        payload.companyName = companyName;
        payload.designation = designation;
        payload.companyWebsite = companyWebsite;
        payload.companyDescription = companyDescription;
        payload.industry = industry;
      }

      await updateAdvancedProfile(payload);

      toast.success("Profile Updated Successfully");
      fetchProfile();
    } catch (error) {
      toast.error("Profile Update Failed");
    }
  };

  const [resume, setResume] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      return toast.warn("Please select a file to upload");
    }

    setUploading(true);
    try {
      const data = await uploadResume(resume);
      toast.success(data.message || "Resume Uploaded Successfully");
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchProfile();
    } catch (error) {
      toast.error("Resume Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPic(true);
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      const token = localStorage.getItem("token");
      const res = await axios.put("https://talentforge-backend-sbpr.onrender.com/api/users/upload-profile-picture", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      toast.success("Profile picture updated!");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to update profile picture");
    } finally {
      setUploadingPic(false);
    }
  };

  if (!user) {
    return (
      <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ height: "40px", background: "#e2e8f0", borderRadius: "8px", width: "40%", marginBottom: "20px", animation: "pulse 1.5s infinite" }}></div>
        <div style={{ height: "200px", background: "#e2e8f0", borderRadius: "8px", width: "100%", animation: "pulse 1.5s infinite" }}></div>
      </div>
    );
  }


  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }} className="printable-profile">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h1 style={{ margin: 0, color: "var(--color-secondary)" }}>My Profile</h1>
        <button onClick={handlePrint} className="btn btn-outline hide-on-print" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Printer size={16} /> Print / Save PDF
        </button>
      </div>

      <div className="card" style={{ padding: "30px", marginBottom: "30px" }}>
        <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px", color: "var(--color-secondary)" }}>
          <UserCircle size={24} /> Basic Information
        </h3>

        {/* Profile Picture Upload */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "28px", padding: "20px", background: "var(--color-background)", borderRadius: "12px", border: "1px solid var(--color-border)" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "700", color: "white", overflow: "hidden", border: "3px solid var(--color-surface)", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
              {user.profilePicture
                ? <img src={`https://talentforge-backend-sbpr.onrender.com${user.profilePicture}`} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : user.fullName?.charAt(0)?.toUpperCase()
              }
            </div>
            <button onClick={() => picInputRef.current?.click()} disabled={uploadingPic}
              style={{ position: "absolute", bottom: "0", right: "0", width: "26px", height: "26px", borderRadius: "50%", background: "#2563eb", color: "white", border: "2px solid var(--color-surface)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              title="Change profile picture">
              <Camera size={12} />
            </button>
            <input ref={picInputRef} type="file" accept="image/*" onChange={handleProfilePicUpload} style={{ display: "none" }} />
          </div>
          <div>
            <p style={{ margin: "0 0 4px 0", fontWeight: "600", fontSize: "1.1rem", color: "var(--color-secondary)" }}>{user.fullName}</p>
            <p style={{ margin: "0 0 8px 0", color: "var(--color-text-muted)", textTransform: "capitalize", fontSize: "14px" }}>{user.role} · {user.email}</p>
            <button onClick={() => picInputRef.current?.click()} disabled={uploadingPic}
              style={{ background: "transparent", border: "1px solid var(--color-border)", padding: "5px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "600", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Camera size={12} /> {uploadingPic ? "Uploading..." : "Change Photo"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "30px", background: "var(--color-background)", padding: "24px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
          <div>
            <label className="form-label" style={{ color: "var(--color-text-muted)" }}>Full Name</label>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "var(--color-secondary)" }}>{user.fullName}</p>
          </div>
          <div>
            <label className="form-label" style={{ color: "var(--color-text-muted)" }}>Email Address</label>
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "var(--color-secondary)" }}>{user.email}</p>
          </div>
          
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Date of Birth</label>
            <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="input-field" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Location (City, Country)</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="input-field" placeholder="e.g. San Francisco, CA" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="+1 (555) 000-0000" />
          </div>
        </div>

        <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "var(--color-secondary)", marginTop: "40px" }}>
          <LinkIcon size={24} /> Social Links
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "30px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">LinkedIn URL</label>
            <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} className="input-field" placeholder="https://linkedin.com/in/username" />
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Portfolio / GitHub URL</label>
            <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} className="input-field" placeholder="https://github.com/username" />
          </div>
        </div>

        <h3 style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px", color: "var(--color-secondary)", marginTop: "40px" }}>
          <Briefcase size={24} /> Professional Details
        </h3>

        {(user.role === "student" || user.role === "professional") ? (
          <>
            <div className="form-group">
              <label className="form-label">Education</label>
              <input type="text" value={education} onChange={(e) => setEducation(e.target.value)} className="input-field" placeholder="e.g. B.S. Computer Science, Stanford University (2024)" />
            </div>

            {user.role === "professional" && (
              <>
                <div className="form-group">
                  <label className="form-label">Current Designation / Job Title</label>
                  <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="input-field" placeholder="e.g. Senior Software Engineer" />
                </div>
                <div className="form-group">
                  <label className="form-label">Certifications (Comma separated)</label>
                  <input type="text" value={certifications} onChange={(e) => setCertifications(e.target.value)} className="input-field" placeholder="e.g. AWS Certified Developer, PMP" />
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Skills (Comma separated)</label>
              <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="input-field" placeholder="e.g. React, Node.js, Python" />
            </div>

            <div className="form-group" style={{ marginBottom: "30px" }}>
              <label className="form-label">Professional Experience / Internships</label>
              <textarea value={experience} onChange={(e) => setExperience(e.target.value)} className="input-field" rows="5" placeholder="Describe your past work experience, internships, or relevant projects..." style={{ resize: "vertical" }} />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="input-field" placeholder="e.g. Google" />
            </div>
            <div className="form-group">
              <label className="form-label">Your Designation</label>
              <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="input-field" placeholder="e.g. Senior Technical Recruiter" />
            </div>
            <div className="form-group">
              <label className="form-label">Company Website</label>
              <input type="text" value={companyWebsite} onChange={(e) => setCompanyWebsite(e.target.value)} className="input-field" placeholder="e.g. https://google.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} className="input-field" placeholder="e.g. Information Technology" />
            </div>
            <div className="form-group" style={{ marginBottom: "30px" }}>
              <label className="form-label">Company Description</label>
              <textarea value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} className="input-field" rows="4" placeholder="Brief description about the company..." style={{ resize: "vertical" }} />
            </div>
          </>
        )}

        <div className="form-group" style={{ marginBottom: "30px" }}>
          <label className="form-label">Professional Bio / Summary</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} className="input-field" rows="5" placeholder="Tell us about your career goals..." style={{ resize: "vertical" }} />
        </div>

        <button onClick={handleUpdate} className="btn btn-primary hide-on-print" style={{ width: "100%" }}>
          Save Profile Changes
        </button>
      </div>

      <div className="card hide-on-print" style={{ padding: "30px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "var(--color-secondary)", fontSize: "1.25rem" }}>Resume Document</h3>
        
        <div style={{ 
          border: "2px dashed var(--color-border)", 
          borderRadius: "12px", 
          padding: "40px 20px", 
          textAlign: "center",
          background: "var(--color-background)",
          cursor: "pointer",
          marginBottom: "20px",
          transition: "all 0.2s"
        }}
        onClick={() => fileInputRef.current.click()}
        onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
        onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--color-border)"}
        >
          <UploadCloud size={48} color="var(--color-primary)" style={{ marginBottom: "15px" }} />
          <h4 style={{ margin: "0 0 5px 0", color: "var(--color-text-main)", fontSize: "1.1rem" }}>
            {resume ? resume.name : "Click or drag file to this area to upload"}
          </h4>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "0.875rem" }}>
            Supports PDF, DOC, DOCX up to 5MB
          </p>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>

        {resume && (
          <button 
            onClick={handleResumeUpload} 
            className="btn btn-primary" 
            disabled={uploading}
            style={{ width: "100%", padding: "12px", fontSize: "1rem", marginBottom: "20px" }}
          >
            {uploading ? "Uploading..." : "Confirm Upload"}
          </button>
        )}

        {user.resume && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            background: "var(--color-success-bg)", 
            border: "1px solid var(--color-success)",
            padding: "15px 20px", 
            borderRadius: "8px" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--color-success)", fontWeight: "600" }}>
              <CheckCircle2 size={24} />
              <span>Resume Active</span>
            </div>
            
            <a
              href={`https://talentforge-backend-sbpr.onrender.com/${user.resume.replace(/\\/g, "/")}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.875rem", borderColor: "var(--color-success)", color: "var(--color-success)" }}
            >
              <FileText size={16} /> View Current
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;