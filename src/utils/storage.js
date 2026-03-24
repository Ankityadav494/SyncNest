export const getUser = () => {
  return JSON.parse(localStorage.getItem("devconnect_user")) || null;
};

export const setUser = (user) => {
  localStorage.setItem("devconnect_user", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("devconnect_user");
};

export const getProjects = () => {
  return JSON.parse(localStorage.getItem("devconnect_projects")) || [];
};

export const setProjects = (projects) => {
  localStorage.setItem("devconnect_projects", JSON.stringify(projects));
};

export const getApplications = () => {
  return JSON.parse(localStorage.getItem("devconnect_applications")) || [];
};

export const setApplications = (applications) => {
  localStorage.setItem(
    "devconnect_applications",
    JSON.stringify(applications)
  );
};