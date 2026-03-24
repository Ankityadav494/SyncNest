import { useState } from "react";
import { getUser, setUser } from "../utils/storage";

const Profile = () => {
  const currentUser = getUser();

  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: currentUser?.password || "",
    college: currentUser?.college || "",
    bio: currentUser?.bio || "",
    skills: currentUser?.skills?.join(", ") || "",
    github: currentUser?.github || "",
    linkedin: currentUser?.linkedin || "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...formData,
      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
    };

    setUser(updatedUser);
    alert("Profile updated successfully");
  };

  return (
    <div className="form-box">
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="college" placeholder="College" value={formData.college} onChange={handleChange} />
        <textarea name="bio" placeholder="Bio" rows="4" value={formData.bio} onChange={handleChange}></textarea>
        <input
          name="skills"
          placeholder="Skills separated by comma"
          value={formData.skills}
          onChange={handleChange}
        />
        <input name="github" placeholder="GitHub link" value={formData.github} onChange={handleChange} />
        <input name="linkedin" placeholder="LinkedIn link" value={formData.linkedin} onChange={handleChange} />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default Profile;