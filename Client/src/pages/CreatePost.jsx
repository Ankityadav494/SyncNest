import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

const CreatePost = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skills: "",
    deadline: "",
    type: "Hackathon",
    difficulty: "Beginner",
    mode: "Remote",
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setError(null);
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login first");
      return;
    }

    if (!formData.title || !formData.description) {
      setError("Please provide title and description");
      return;
    }

    setStatus("submitting");
    try {
      await API.post("/projects", {
        title: formData.title,
        description: formData.description,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        deadline: formData.deadline,
        type: formData.type,
        difficulty: formData.difficulty,
        mode: formData.mode,
      });

      setSuccess(true);
      setError(null);
      setTimeout(() => navigate("/my-posts"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating project");
    } finally {
      setStatus("idle");
    }
  };

  const inputClass = "appearance-none block w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all shadow-sm sm:text-sm";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <h2 className="text-3xl font-extrabold relative z-10">Create Collaboration Post</h2>
            <p className="mt-2 text-indigo-100 relative z-10 text-lg">Share your idea and find the perfect team members to build it together.</p>
          </div>

          <div className="p-8">
            {success && (
              <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <p className="text-sm font-medium text-green-700">Project created successfully! Redirecting to My Posts...</p>
              </div>
            )}
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>Project Title</label>
                <input
                  name="title"
                  placeholder="E.g., Next-Gen AI Trading Bot"
                  value={formData.title}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Project Description</label>
                <textarea
                  name="description"
                  placeholder="Describe what you want to build, the goals, and who you are looking for..."
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Required Skills (comma separated)</label>
                <input
                  name="skills"
                  placeholder="React, Node.js, Python, UI/UX"
                  value={formData.skills}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Application Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Project Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className={inputClass}>
                    <option>Hackathon</option>
                    <option>Startup</option>
                    <option>Academic</option>
                    <option>Personal</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Difficulty Level</label>
                  <select name="difficulty" value={formData.difficulty} onChange={handleChange} className={inputClass}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Collaboration Mode</label>
                  <select name="mode" value={formData.mode} onChange={handleChange} className={inputClass}>
                    <option>Remote</option>
                    <option>Offline</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={`px-8 py-3.5 text-base font-bold rounded-xl text-white shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${
                    status === "submitting" ? "bg-indigo-400 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
                  }`}
                >
                  {status === "submitting" ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Creating Post...
                    </span>
                  ) : "Create Project Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
