import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

const MyPosts = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const projectRes = await API.get("/projects");
        setProjects(projectRes.data);

        const ownerProjects = projectRes.data
          .filter((project) => project.owner?._id === user?._id)
          .map((project) => project._id);

        const applicationsByProject = await Promise.all(
          ownerProjects.map((projectId) => API.get(`/applications/project/${projectId}`))
        );

        setApplications(
          applicationsByProject.flatMap((res) => res.data)
        );
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
  }, [user]);

  const myPosts = projects.filter((project) => project.owner?._id === user?._id);

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await API.put(`/applications/${applicationId}`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      setError("Could not update application status.");
    }
  };

  const handleDeletePost = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    try {
      await API.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
    } catch (err) {
      setError("Could not delete project.");
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
          <p className="text-lg font-bold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">My Created Posts</h1>
          <p className="text-lg text-gray-600">Manage your project ideas and review the applications you have received.</p>
        </div>

        {myPosts.length > 0 ? (
          <div className="space-y-8">
            {myPosts.map((project) => {
              const projectApplications = applications.filter(
                (app) => app.project === project._id || app.project?._id === project._id
              );
              
              const pendingCount = projectApplications.filter(a => a.status === 'Pending').length;

              return (
                <div key={project._id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h2>
                        <p className="text-gray-600 text-base leading-relaxed mb-4 max-w-3xl">{project.description}</p>
                        <div className="flex items-center text-sm font-medium text-gray-500 bg-gray-50 inline-flex px-3 py-1.5 rounded-lg border border-gray-200">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          Deadline: {new Date(project.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-3">
                        <Link
                          to={`/team-chat/${project._id}`}
                          className="inline-flex items-center px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-sm whitespace-nowrap"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
                          Open Team Chat
                        </Link>
                        <button
                          onClick={() => handleDeletePost(project._id)}
                          className="inline-flex items-center px-5 py-2 bg-white text-red-600 font-semibold rounded-xl hover:bg-red-50 border border-red-200 transition-colors shadow-sm whitespace-nowrap text-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          Delete Post
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        Applicants
                        {pendingCount > 0 && <span className="ml-3 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{pendingCount} New</span>}
                      </h3>
                      <span className="text-sm font-medium text-gray-500">{projectApplications.length} total</span>
                    </div>

                    {projectApplications.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projectApplications.map((app) => (
                          <div
                            key={app._id}
                            className={`p-5 rounded-2xl border ${
                              app.status === 'Pending' ? 'bg-white border-amber-200 shadow-sm' :
                              app.status === 'Accepted' ? 'bg-green-50 border-green-200' :
                              'bg-gray-100 border-gray-200 opacity-80'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-bold text-gray-900 text-lg">{app.applicant.name}</p>
                                <p className="text-sm text-gray-500 mb-1">{app.applicant.email}</p>
                              </div>
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                                app.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                app.status === 'Accepted' ? 'bg-green-100 text-green-800 border-green-200' :
                                'bg-gray-200 text-gray-700 border-gray-300'
                              }`}>
                                {app.status}
                              </span>
                            </div>

                            {app.status === "Pending" && (
                              <div className="mt-5 flex gap-3 pt-3 border-t border-gray-100">
                                <button
                                  className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 shadow-sm transition-colors"
                                  onClick={() => handleStatusChange(app._id, "Accepted")}
                                >
                                  Accept
                                </button>
                                <button
                                  className="flex-1 px-4 py-2 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-xl hover:bg-red-50 shadow-sm transition-colors"
                                  onClick={() => handleStatusChange(app._id, "Rejected")}
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-gray-300">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        <p className="text-gray-500 font-medium">No one has applied to this project yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You haven't created any posts</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">Ready to bring your idea to life? Create a project post to start building your dream team.</p>
            <Link to="/create-post" className="inline-flex items-center px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transform hover:-translate-y-0.5 transition-all">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create New Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPosts;