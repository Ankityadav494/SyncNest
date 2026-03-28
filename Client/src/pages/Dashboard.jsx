import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [skillsCount, setSkillsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const [projectRes, applicationRes, profileRes] = await Promise.all([
          API.get("/projects"),
          API.get("/applications/me"),
          API.get("/auth/profile"),
        ]);

        setProjects(projectRes.data);
        setApplications(applicationRes.data);
        setSkillsCount((profileRes.data.skills || []).length);
      } catch (err) {
        setError("Could not load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const myPosts = projects.filter((project) => project.owner?._id === user?._id);
  const myApplications = applications;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-lg text-gray-600">
                Welcome back, <span className="font-semibold text-indigo-600">{user?.name}</span>! Here's your overview.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/create-post" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New Post
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-8 border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-5xl font-black text-indigo-600 mb-2 relative z-10">{myPosts.length}</h3>
            <p className="text-gray-500 font-medium relative z-10">My Posts created</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-5xl font-black text-blue-600 mb-2 relative z-10">{myApplications.length}</h3>
            <p className="text-gray-500 font-medium relative z-10">Applications sent</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
            <h3 className="text-5xl font-black text-purple-600 mb-2 relative z-10">{skillsCount}</h3>
            <p className="text-gray-500 font-medium relative z-10">Skills on Profile</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/my-posts" className="px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 outline-none">
              View My Posts
            </Link>

            <Link to="/my-applications" className="px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 outline-none">
              View My Applications
            </Link>

            <Link to="/profile" className="px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-500 outline-none">
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;