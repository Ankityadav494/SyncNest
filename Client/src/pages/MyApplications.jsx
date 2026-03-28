import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import API from "../api/api";

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get("/applications/me");
        setApplications(res.data);
      } catch (err) {
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetch();
  }, [user]);

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
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">My Applications</h1>
          <p className="text-lg text-gray-600">Track the status of projects you've applied to join.</p>
        </div>

        {applications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${
                  app.status === 'Pending' ? 'bg-amber-400' :
                  app.status === 'Accepted' ? 'bg-green-500' :
                  'bg-red-500'
                }`}></div>
                
                <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 pr-12 line-clamp-2">
                  {app.project.title}
                </h3>
                
                <div className="space-y-4 mb-6 flex-grow">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="truncate"><strong>Owner:</strong> {app.project.owner.name}</span>
                  </div>
                  
                  <div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                      app.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                      app.status === 'Accepted' ? 'bg-green-50 text-green-600 border-green-200' :
                      'bg-red-50 text-red-600 border-red-200'
                    }`}>
                      {app.status === 'Pending' && <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {app.status === 'Accepted' && <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                      {app.status === 'Rejected' && <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                      Status: {app.status}
                    </span>
                  </div>
                </div>

                <div className="mt-auto">
                  {app.status === "Accepted" ? (
                    <Link 
                      to={`/team-chat/${app.project._id}`} 
                      className="block w-full text-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md transform hover:-translate-y-0.5"
                    >
                      Open Team Chat
                    </Link>
                  ) : (
                    <Link 
                      to={`/project/${app.project._id}`} 
                      className="block w-full text-center py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-sm font-bold rounded-xl transition-all shadow-sm"
                    >
                      View Project Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Applications Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">You haven't applied to any projects just yet. Start exploring to find teams looking for your skills!</p>
            <Link 
              to="/browse-projects" 
              className="inline-flex items-center px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              Browse Projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;