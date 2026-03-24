import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import dummyProjects from "../data/dummyProjects";
import { getProjects, setProjects } from "../utils/storage";

const BrowseProjects = () => {
  const [projects, setProjectState] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [mode, setMode] = useState("");

  useEffect(() => {
    const storedProjects = getProjects();

    if (storedProjects.length === 0) {
      setProjects(dummyProjects);
      setProjectState(dummyProjects);
    } else {
      setProjectState(storedProjects);
    }
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.skills.join(" ").toLowerCase().includes(search.toLowerCase());

    const matchesType = type ? project.type === type : true;
    const matchesMode = mode ? project.mode === mode : true;

    return matchesSearch && matchesType && matchesMode;
  });

  return (
    <div className="container">
      <h1 className="page-title">Browse Projects</h1>

      <div className="filter-box">
        <input
          type="text"
          placeholder="Search by title or skill"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="Hackathon">Hackathon</option>
          <option value="Startup">Startup</option>
          <option value="Academic">Academic</option>
          <option value="Personal">Personal</option>
        </select>

        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="Offline">Offline</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {filteredProjects.length > 0 ? (
        <div className="grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No projects found.</p>
      )}
    </div>
  );
};

export default BrowseProjects;