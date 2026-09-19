import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Dashboard.css";
import Navbar from "../navbar";
import API_BASE_URL from "../../config/api";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [repoSearch, setRepoSearch] = useState("");
  const [searchParams] = useSearchParams();

  const queryParam = searchParams.get("q") || "";

  useEffect(() => {
    if (queryParam) {
      setRepoSearch(queryParam);
    }
  }, [queryParam]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current user repos
        if (userId) {
          const res = await fetch(`${API_BASE_URL}/repo/user/${userId}`);
          const data = await res.json();
          if (data && Array.isArray(data.repositories)) {
            setRepositories(data.repositories);
          } else if (Array.isArray(data)) {
            setRepositories(data);
          } else {
            setRepositories([]);
          }
        }

        // Fetch suggested / all repos
        const allRes = await fetch(`${API_BASE_URL}/repo/all`);
        const allData = await allRes.json();
        if (Array.isArray(allData)) {
          setSuggestedRepositories(allData);
        } else {
          setSuggestedRepositories([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUserRepos = repositories.filter((repo) =>
    repo?.name?.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const filteredFeedRepos = suggestedRepositories.filter((repo) =>
    repo?.name?.toLowerCase().includes(repoSearch.toLowerCase()) ||
    repo?.description?.toLowerCase().includes(repoSearch.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="dashboard-container animate-fade-in">
        <div className="dashboard-layout">
          {/* Left Sidebar: User Repositories */}
          <aside className="dashboard-sidebar-left">
            <div className="sidebar-header">
              <h3>Top Repositories</h3>
              <Link to="/create" className="btn btn-primary btn-sm">
                <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
                  <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                </svg>
                New
              </Link>
            </div>

            <div className="sidebar-search">
              <input
                type="text"
                className="form-input"
                placeholder="Find a repository..."
                value={repoSearch}
                onChange={(e) => setRepoSearch(e.target.value)}
              />
            </div>

            <div className="user-repo-list">
              {loading ? (
                <div className="loading-state">Loading repositories...</div>
              ) : filteredUserRepos.length === 0 ? (
                <div className="empty-sidebar">
                  <p>No repositories found.</p>
                  <Link to="/create" className="create-prompt-link">
                    Create your first repository
                  </Link>
                </div>
              ) : (
                filteredUserRepos.map((repo) => (
                  <Link to={`/repo/${repo._id}`} key={repo._id} className="sidebar-repo-item">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="var(--text-secondary)">
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
                    </svg>
                    <span className="sidebar-repo-name">{repo.name}</span>
                  </Link>
                ))
              )}
            </div>

            <div className="sidebar-footer">
              <Link to="/profile" className="view-all-link">
                View all in your profile →
              </Link>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="dashboard-main-feed">
            <div className="feed-banner">
              <h2>Welcome to the Home Feed</h2>
              <p>Explore activity from open-source repositories and developers across the platform.</p>
            </div>

            <div className="feed-section-header">
              <h3>Explore Repositories</h3>
              <span className="feed-badge">{filteredFeedRepos.length} Repositories</span>
            </div>

            {loading ? (
              <div className="feed-loading">
                <div className="feed-skeleton"></div>
                <div className="feed-skeleton"></div>
              </div>
            ) : filteredFeedRepos.length === 0 ? (
              <div className="empty-feed">
                <p>No repositories available to show.</p>
              </div>
            ) : (
              <div className="feed-repo-cards">
                {filteredFeedRepos.map((repo) => {
                  const ownerName = repo.owner?.username || "developer";
                  return (
                    <div className="feed-repo-card" key={repo._id}>
                      <div className="feed-card-top">
                        <div className="feed-card-title-group">
                          <Link to={`/repo/${repo._id}`} className="feed-card-name">
                            {ownerName} / <strong>{repo.name}</strong>
                          </Link>
                          <span className={`badge ${repo.visibility ? "badge-public" : "badge-private"}`}>
                            {repo.visibility ? "Public" : "Private"}
                          </span>
                        </div>
                        <Link to={`/repo/${repo._id}`} className="btn btn-sm">
                          <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                          </svg>
                          Star
                        </Link>
                      </div>

                      <p className="feed-card-desc">
                        {repo.description || "No description provided for this repository."}
                      </p>

                      <div className="feed-card-meta">
                        <div className="meta-item">
                          <span className="lang-dot"></span>
                          <span>JavaScript</span>
                        </div>
                        <div className="meta-item">
                          <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="var(--text-muted)">
                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                          </svg>
                          <span>{repo.issues ? repo.issues.length : 0} Issues</span>
                        </div>
                        <div className="meta-item">
                          <span>Updated recently</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

          {/* Right Sidebar: Events & Announcements */}
          <aside className="dashboard-sidebar-right">
            <div className="widget-card">
              <h4>Upcoming Events & Updates</h4>
              <ul className="events-list">
                <li className="event-item">
                  <div className="event-date">DEC 15</div>
                  <div>
                    <p className="event-title">Global Open Source Summit</p>
                    <p className="event-desc">Join developers worldwide for keynotes.</p>
                  </div>
                </li>
                <li className="event-item">
                  <div className="event-date">DEC 25</div>
                  <div>
                    <p className="event-title">Developer Hackathon</p>
                    <p className="event-desc">Build cool features and showcase prototypes.</p>
                  </div>
                </li>
                <li className="event-item">
                  <div className="event-date">JAN 05</div>
                  <div>
                    <p className="event-title">React & Web Standards</p>
                    <p className="event-desc">Modern web framework developments.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="widget-card">
              <h4>Explore Topics</h4>
              <div className="topics-cloud">
                <span className="topic-pill">#react</span>
                <span className="topic-pill">#nodejs</span>
                <span className="topic-pill">#mongodb</span>
                <span className="topic-pill">#express</span>
                <span className="topic-pill">#github</span>
                <span className="topic-pill">#webdev</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default Dashboard;