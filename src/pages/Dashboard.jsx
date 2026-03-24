import { Link } from "react-router-dom";
import { getProjects, getApplications, getUser } from "../utils/storage";

const Dashboard = () => {
  const user = getUser();
  const allProjects = getProjects();
  const allApplications = getApplications();

  const myPosts = allProjects.filter((project) => project.owner === user?.name);
  const myApplications = allApplications.filter(
    (application) => application.applicantName === user?.name
  );

  return (
    <div className="container">
      <h1 className="page-title">Dashboard</h1>
      <p>Welcome back, <strong>{user?.name}</strong></p>

      <div className="dashboard-cards">
        <div className="stat-box">
          <h3>{myPosts.length}</h3>
          <p>My Posts</p>
        </div>

        <div className="stat-box">
          <h3>{myApplications.length}</h3>
          <p>My Applications</p>
        </div>

        <div className="stat-box">
          <h3>{user?.skills?.length || 0}</h3>
          <p>Skills Added</p>
        </div>
      </div>

      <div style={{ marginTop: "30px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <Link to="/create-post" className="action-btn">
          Create New Post
        </Link>

        <Link to="/my-posts" className="action-btn">
          View My Posts
        </Link>

        <Link to="/my-applications" className="action-btn">
          View My Applications
        </Link>

        <Link to="/profile" className="action-btn">
          Edit Profile
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;