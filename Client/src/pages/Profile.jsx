import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    college: "",
    bio: "",
    skills: "",
    github: "",
    linkedin: "",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await API.get("/auth/profile");
        const fullUser = res.data;
        setFormData({
          name: fullUser.name || "",
          email: fullUser.email || "",
          college: fullUser.college || "",
          bio: fullUser.bio || "",
          skills: (fullUser.skills || []).join(", "),
          github: fullUser.github || "",
          linkedin: fullUser.linkedin || "",
        });

      } catch (err) {
        console.error("Failed to fetch profile", err);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user?._id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus("submitting");
    setError(null);

    try {
      const update = {
        name: formData.name,
        email: formData.email,
        college: formData.college,
        bio: formData.bio,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        github: formData.github,
        linkedin: formData.linkedin,
      };

      const res = await API.put(`/auth/profile`, update);
      // Backend returns updated user info, we can patch global user state
      setUser((prev) => ({ ...prev, ...update }));
      alert("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setStatus("idle");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const inputClass = "appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm sm:text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-32 relative">
            <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-1.5 shadow-lg">
              <div className="w-full h-full bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 uppercase">
                {formData.name.charAt(0)}
              </div>
            </div>
          </div>
          
          <div className="pt-16 pb-8 px-8 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900">Edit Profile</h2>
            <p className="text-gray-500 mt-1">Update your personal information and how others see you on the platform.</p>
          </div>
          
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label className={labelClass}>College / University</label>
                <input name="college" value={formData.college} onChange={handleChange} className={inputClass} placeholder="State University" />
              </div>

              <div>
                <label className={labelClass}>Bio</label>
                <textarea 
                  name="bio" 
                  rows="4" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="Tell us a little bit about yourself, your interests, and what kind of projects you are looking for..." 
                />
              </div>

              <div>
                <label className={labelClass}>Skills (comma separated)</label>
                <input
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="React, Node.js, Python, UI/UX"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <label className={labelClass}>GitHub Profile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
                    </div>
                    <input name="github" value={formData.github} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="https://github.com/johndoe" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>LinkedIn Profile</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </div>
                    <input name="linkedin" value={formData.linkedin} onChange={handleChange} className={`${inputClass} pl-10`} placeholder="https://linkedin.com/in/johndoe" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className={`px-8 py-3.5 text-sm font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${status === 'submitting' ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'}`}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Saving Changes...
                    </span>
                  ) : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;