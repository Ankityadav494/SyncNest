import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

const ProjectDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchProjectAndStatus = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/projects/${id}`);
        setProject(res.data);
        
        // If user is logged in, check if they already applied
        if (user) {
          const appsRes = await API.get("/applications/me");
          const alreadyMatched = appsRes.data.some(app => app.project._id === id);
          setHasApplied(alreadyMatched);
        }
      } catch (err) {
        setError("Unable to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectAndStatus();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      alert("Please login first");
      return;
    }

    setStatus("submitting");
    try {
      await API.post(`/applications/${id}`);
      setHasApplied(true);
      setStatus("idle");
    } catch (err) {
      if (err.response?.data?.message === "Already applied") {
         setHasApplied(true);
      } else {
         alert(err.response?.data?.message || "Application failed");
      }
      setStatus("idle");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-slate-50">
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 max-w-md w-full text-center shadow-sm">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800">Project Not Found</h2>
          <p className="text-gray-500 mt-2">The project you're looking for might have been removed.</p>
        </div>
      </div>
    );
  }

  const isOwner = project.owner?._id === user?._id;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 sm:px-12 sm:py-14 text-white relative">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-semibold mb-4 border border-white/30 text-white shadow-sm">
                  {project.type}
                </div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 leading-tight">
                  {project.title}
                </h1>
                <p className="text-blue-100 font-medium">
                  Posted by <span className="text-white font-bold">{project.owner?.name}</span>
                </p>
              </div>
              
              {!isOwner && (
                <button 
                  onClick={handleApply} 
                  disabled={status !== "idle" || hasApplied}
                  className={`px-8 py-3.5 rounded-xl text-base font-bold shadow-lg transform transition-all hover:-translate-y-1 ${
                    hasApplied 
                      ? "bg-green-500 text-white cursor-not-allowed shadow-green-500/20 translate-y-0"
                      : status === "submitting" 
                      ? "bg-white/50 text-indigo-900 cursor-not-allowed" 
                      : "bg-white text-indigo-600 hover:bg-gray-50 hover:shadow-xl focus:ring-4 focus:ring-white/50"
                  }`}
                >
                  {hasApplied ? "Application Sent ✔" : status === "submitting" ? "Applying..." : "Apply to Join Team"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Main Content */}
            <div className="md:col-span-2 p-8 sm:p-12 border-r border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Project</h2>
              <div className="prose prose-indigo max-w-none text-gray-600 whitespace-pre-line text-lg leading-relaxed">
                {project.description}
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.skills.map((skill, index) => (
                    <span key={index} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg border border-indigo-100 shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="p-8 sm:p-12 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">Project Details</h3>
              <ul className="space-y-6">
                <li className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">Deadline</span>
                  <div className="flex items-center text-gray-900 font-medium">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' }) : "No deadline"}
                  </div>
                </li>
                
                <li className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">Collaboration Mode</span>
                  <div className="flex items-center text-gray-900 font-medium">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    {project.mode}
                  </div>
                </li>

                <li className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-500 tracking-wide uppercase mb-1">Difficulty</span>
                  <div className="flex items-center text-gray-900 font-medium">
                    <span className={`w-3 h-3 rounded-full mr-2 ${project.difficulty === 'Advanced' || project.difficulty === 'High' ? 'bg-red-500' : project.difficulty === 'Intermediate' || project.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    {project.difficulty}
                  </div>
                </li>
              </ul>
              
              {isOwner && (
                <div className="mt-10 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-sm text-blue-800 font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
                    You are the owner of this project post.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;