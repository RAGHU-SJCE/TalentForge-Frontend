import { useEffect, useState } from "react";

import {
  getProfile,
  updateSkills,
  updateBio,
  uploadResume,
} from "../../services/userService";

const Profile = () => {
  const [user, setUser] = useState(null);

  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      setUser(data.user);

      setSkills(
        data.user.skills?.join(", ") || ""
      );

      setBio(data.user.bio || "");
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateSkills(
        skills
          .split(",")
          .map((skill) => skill.trim())
      );

      await updateBio(bio);

      alert("Profile Updated");

      fetchProfile();
    } catch (error) {
      alert("Update Failed");
    }
  };

  const handleResumeUpload = async () => {
    if (!resume) {
      return alert("Please select a file");
    }

    try {
      const data =
        await uploadResume(resume);

      alert(data.message);

      fetchProfile();
    } catch (error) {
      alert("Resume Upload Failed");
    }
  };

  if (!user) {
    return <h2>Loading...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Profile</h1>

      <p>
        <strong>Name:</strong>{" "}
        {user.fullName}
      </p>

      <p>
        <strong>Email:</strong>{" "}
        {user.email}
      </p>

      <br />

      <label>Skills</label>

      <input
        type="text"
        value={skills}
        onChange={(e) =>
          setSkills(e.target.value)
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px",
        }}
      />

      <label>Bio</label>

      <textarea
        value={bio}
        onChange={(e) =>
          setBio(e.target.value)
        }
        rows="5"
        style={{
          width: "100%",
          padding: "10px",
        }}
      />

      <br />
      <br />

      <button onClick={handleUpdate}>
        Update Profile
      </button>

      <hr
        style={{
          marginTop: "30px",
          marginBottom: "30px",
        }}
      />

      <h3>Upload Resume</h3>

      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) =>
          setResume(e.target.files[0])
        }
      />

      <br />
      <br />

      <button
        onClick={handleResumeUpload}
      >
        Upload Resume
      </button>

      <br />
      <br />

      {user.resume && (
        <div>
          <strong>Resume Uploaded ✅</strong>

          <br />
          <br />

          <a
            href={`http://localhost:5000${user.resume}`}
            target="_blank"
            rel="noreferrer"
          >
            View Resume
          </a>
        </div>
      )}
    </div>
  );
};

export default Profile;