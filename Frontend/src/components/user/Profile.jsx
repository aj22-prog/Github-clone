import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";
import Navbar from "../navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "Developer", email: "" });
  const [userRepos, setUserRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'repos'
  const { setCurrentUser } = useAuth();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        // Fetch User Info
        const userRes = await axios.get(`http://localhost:3002/userProfile/${userId}`);
        setUserDetails(userRes.data);

        // Fetch User Repositories
        const repoRes = await axios.get(`http://localhost:3002/repo/user/${userId}`);
        const reposData = repoRes.data.repositories || (Array.isArray(repoRes.data) ? repoRes.data : []);
        setUserRepos(reposData);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile details: ", err);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  return (
    <>
      <Navbar />
      <div className="profile-container animate-fade-in">
        <div className="profile-layout">
          {/* Left Column: User Profile Info Card */}
          <aside className="profile-sidebar">
            <div className="profile-avatar-large">
              {userDetails.username ? userDetails.username.charAt(0).toUpperCase() : "U"}
            </div>

            <h2 className="profile-fullname">{userDetails.username || "Developer"}</h2>
            <p className="profile-handle">@{userDetails.username?.toLowerCase() || "user"}</p>
            <p className="profile-email-meta">{userDetails.email}</p>

            <button className="btn btn-block profile-edit-btn">
              Edit profile
            </button>

            <div className="profile-follow-stats">
              <span className="follow-stat-item">
                <strong>14</strong> followers
              </span>
              <span>•</span>
              <span className="follow-stat-item">
                <strong>6</strong> following
              </span>
            </div>

            <div className="profile-sidebar-meta">
              <div className="meta-row">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="var(--text-secondary)">
                  <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.25c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-6.69l-6.22 3.89a.75.75 0 0 1-.78 0L1.5 5.56v6.69Zm13-8.5a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.39l6.5 4.06 6.5-4.06v-.39Z"></path>
                </svg>
                <span>{userDetails.email || "No public email"}</span>
              </div>
              <div className="meta-row">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="var(--text-secondary)">
                  <path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-.025 8.45a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25Z"></path>
                </svg>
                <a href="https://github.com" target="_blank" rel="noreferrer">github.com/{userDetails.username}</a>
              </div>
            </div>

            <button onClick={handleLogout} className="btn btn-danger btn-block logout-sidebar-btn">
              Sign out
            </button>
          </aside>

          {/* Right Column: Profile Navigation & Content */}
          <main className="profile-main-content">
            {/* Tabs */}
            <div className="profile-tabs-nav">
              <button
                className={`profile-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                  <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.244a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.244a2.25 2.25 0 0 0-1.756.843l-.25.3a.75.75 0 0 1-1.152 0l-.25-.3A2.25 2.25 0 0 0 5.003 13H.75a.75.75 0 0 1-.75-.75Zm1.5.5v8.75h3.503c.895 0 1.737.397 2.308 1.077l.189.224.189-.224A3.737 3.737 0 0 1 10.197 11h3.303V2.25h-3.494a2.25 2.25 0 0 0-1.756.843l-.25.3a.75.75 0 0 1-1.152 0l-.25-.3A2.25 2.25 0 0 0 5.003 2.25Z"></path>
                </svg>
                Overview
              </button>

              <button
                className={`profile-tab-btn ${activeTab === "repos" ? "active" : ""}`}
                onClick={() => setActiveTab("repos")}
              >
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                  <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
                </svg>
                Repositories
                <span className="badge-count">{userRepos.length}</span>
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="overview-tab-content">
                <div className="section-title-row">
                  <h3>Pinned Repositories</h3>
                  <Link to="/create" className="btn btn-sm btn-primary">New repo</Link>
                </div>

                <div className="pinned-grid">
                  {userRepos.length === 0 ? (
                    <div className="empty-pinned">
                      <p>You have no repositories yet.</p>
                      <Link to="/create" className="btn btn-primary btn-sm" style={{ marginTop: "8px" }}>
                        Create repository
                      </Link>
                    </div>
                  ) : (
                    userRepos.slice(0, 6).map((repo) => (
                      <div className="pinned-card" key={repo._id}>
                        <div className="pinned-card-header">
                          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="var(--text-secondary)">
                            <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
                          </svg>
                          <Link to={`/repo/${repo._id}`} className="pinned-title">
                            {repo.name}
                          </Link>
                          <span className={`badge ${repo.visibility ? "badge-public" : "badge-private"}`}>
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </div>
                        <p className="pinned-desc">{repo.description || "No description provided."}</p>
                        <div className="pinned-meta">
                          <span className="lang-dot"></span>
                          <span>JavaScript</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Heatmap Section */}
                <div className="heatmap-container-box">
                  <HeatMapProfile />
                </div>
              </div>
            )}

            {/* Tab: Repositories list */}
            {activeTab === "repos" && (
              <div className="repos-tab-content">
                <div className="repo-filter-row">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Find a repository..."
                    style={{ maxWidth: "320px" }}
                  />
                  <Link to="/create" className="btn btn-primary btn-sm">
                    New
                  </Link>
                </div>

                <div className="repo-full-list">
                  {userRepos.map((repo) => (
                    <div className="repo-list-item" key={repo._id}>
                      <div className="repo-item-main">
                        <div className="repo-item-title-row">
                          <Link to={`/repo/${repo._id}`} className="repo-item-name">
                            {repo.name}
                          </Link>
                          <span className={`badge ${repo.visibility ? "badge-public" : "badge-private"}`}>
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </div>
                        <p className="repo-item-desc">{repo.description || "No description"}</p>
                        <div className="repo-item-meta">
                          <span className="lang-dot"></span>
                          <span>JavaScript</span>
                          <span>•</span>
                          <span>Updated recently</span>
                        </div>
                      </div>

                      <div className="repo-item-action">
                        <Link to={`/repo/${repo._id}`} className="btn btn-sm">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Profile;