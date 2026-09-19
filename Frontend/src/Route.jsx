import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepo from "./components/repo/CreateRepo";
import RepoDetail from "./components/repo/RepoDetail";
import IssueList from "./components/issue/IssueList";

import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    // Redirect unauthenticated users away from protected routes
    const isPublicPage = ["/auth", "/signup"].includes(window.location.pathname);
    if (!userIdFromStorage && !isPublicPage) {
      navigate("/auth");
    }

    // Redirect authenticated users from login to home
    if (userIdFromStorage && window.location.pathname === "/auth") {
      navigate("/");
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    { path: "/", element: <Dashboard /> },
    { path: "/auth", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "/profile", element: <Profile /> },
    { path: "/create", element: <CreateRepo /> },
    { path: "/repo/:id", element: <RepoDetail /> },
    { path: "/issues", element: <IssueList /> },
    { path: "/explore", element: <Dashboard /> },
  ]);

  return element;
};

export default ProjectRoutes;