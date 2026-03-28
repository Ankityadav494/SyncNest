import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-4 gap-4">
        <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
          {project.title}
        </h3>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wide whitespace-nowrap border border-indigo-100">
          {project.type}
        </span>
      </div>

      <p className="text-gray-600 mb-6 flex-grow line-clamp-3 leading-relaxed text-sm">
        {project.description}
      </p>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-medium rounded-md border border-gray-200">
              {skill}
            </span>
          ))}
          {project.skills.length > 4 && (
            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">
              +{project.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto space-y-2 mb-6 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="truncate max-w-[120px]" title={project.owner?.name || project.owner}>{project.owner?.name || project.owner}</span>
          </div>
          <div className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded-md">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : "-"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200/60">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
            <span className="text-gray-700">{project.mode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${project.difficulty === 'High' ? 'bg-red-500' : project.difficulty === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
            <span className="text-gray-700">{project.difficulty || 'Normal'}</span>
          </div>
        </div>
      </div>

      <Link 
        to={`/project/${project._id || project.id}`} 
        className="block w-full text-center py-2.5 px-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all shadow-sm transform hover:-translate-y-0.5"
      >
        View Project Details
      </Link>
    </div>
  );
};

export default ProjectCard;