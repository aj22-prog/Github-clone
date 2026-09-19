import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../navbar";
import "./repo.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("code"); // 'code', 'issues', 'settings'
  const [starred, setStarred] = useState(false);
  const [copied, setCopied] = useState(false);

  // Issues sub-state
  const [issues, setIssues] = useState([]);
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [creatingIssue, setCreatingIssue] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // New file content sub-state
  const [newFileText, setNewFileText] = useState("");
  const [addingContent, setAddingContent] = useState(false);
  const [showAddContent, setShowAddContent] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const fetchRepo = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3002/repo/${id}`);
      setRepo(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching repository:", err);
      setError("Repository not found or error loading.");
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get(`http://localhost:3002/issue/all?repository=${id}`);
      setIssues(res.data);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRepo();
      fetchIssues();
    }
  }, [id]);

  const handleToggleVisibility = async () => {
    try {
      const res = await axios.patch(`http://localhost:3002/repo/toggle/${id}`);
      setRepo(res.data.repository);
    } catch (err) {
      alert("Failed to toggle repository visibility");
    }
  };

  const handleDeleteRepo = async () => {
    if (window.confirm("Are you absolutely sure you want to delete this repository? This action cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:3002/repo/delete/${id}`);
        navigate("/");
      } catch (err) {
        alert("Failed to delete repository");
      }
    }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    if (!issueTitle.trim()) return;

    try {
      setCreatingIssue(true);
      await axios.post("http://localhost:3002/issue/create", {
        title: issueTitle.trim(),
        description: issueDesc.trim(),
        repository: id,
      });
      setIssueTitle("");
      setIssueDesc("");
      setShowIssueModal(false);
      setCreatingIssue(false);
      fetchIssues();
    } catch (err) {
      console.error("Error creating issue:", err);
      alert("Failed to create issue.");
      setCreatingIssue(false);
    }
  };

  const handleToggleIssueStatus = async (issueId, currentStatus) => {
    const nextStatus = currentStatus === "open" ? "closed" : "open";
    try {
      await axios.put(`http://localhost:3002/issue/update/${issueId}`, {
        status: nextStatus,
      });
      fetchIssues();
    } catch (err) {
      console.error("Error updating issue status:", err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      await axios.delete(`http://localhost:3002/issue/delete/${issueId}`);
      fetchIssues();
    } catch (err) {
      console.error("Error deleting issue:", err);
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!newFileText.trim()) return;

    try {
      setAddingContent(true);
      const res = await axios.put(`http://localhost:3002/repo/update/${id}`, {
        content: [newFileText.trim()],
      });
      setRepo(res.data.repository);
      setNewFileText("");
      setShowAddContent(false);
      setAddingContent(false);
    } catch (err) {
      console.error("Error updating repo content:", err);
      setAddingContent(false);
    }
  };

  const handleCopyCloneUrl = () => {
    const cloneUrl = `https://github.com/clone/${repo?.name || "repo"}.git`;
    navigator.clipboard.writeText(cloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-container">
          <div className="repo-skeleton-header">
            <div className="skeleton-bar" style={{ width: "40%", height: "24px" }}></div>
            <div className="skeleton-bar" style={{ width: "100%", height: "300px", marginTop: "24px" }}></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !repo) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-container">
          <div className="repo-alert-error" style={{ margin: "40px 0" }}>
            {error || "Repository not found."}
          </div>
          <Link to="/" className="btn">Back to Dashboard</Link>
        </div>
      </>
    );
  }

  const isOwner = repo.owner?._id === currentUserId || repo.owner === currentUserId;
  const ownerName = repo.owner?.username || "developer";

  return (
    <>
      <Navbar />
      <div className="repo-detail-container animate-fade-in">
        {/* Repo Header */}
        <div className="repo-top-header">
          <div className="repo-title-wrapper">
            <svg aria-hidden="true" height="18" viewBox="0 0 16 16" width="18" fill="currentColor" className="repo-type-icon">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
            </svg>
            <Link to="/profile" className="repo-owner-name">{ownerName}</Link>
            <span className="repo-slash">/</span>
            <span className="repo-main-name">{repo.name}</span>
            <span className={`badge ${repo.visibility ? "badge-public" : "badge-private"}`}>
              {repo.visibility ? "Public" : "Private"}
            </span>
          </div>

          <div className="repo-header-actions">
            <button className={`btn btn-sm ${starred ? "btn-starred" : ""}`} onClick={() => setStarred(!starred)}>
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill={starred ? "#e3b341" : "currentColor"}>
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
              </svg>
              <span>{starred ? "Starred" : "Star"}</span>
              <span className="star-count">{starred ? 1 : 0}</span>
            </button>

            <button className="btn btn-sm" onClick={handleCopyCloneUrl}>
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
              </svg>
              {copied ? "Copied URL!" : "Clone Code"}
            </button>
          </div>
        </div>

        {/* Repo Sub Nav Tabs */}
        <div className="repo-subnav-tabs">
          <button
            className={`repo-tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
              <path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path>
            </svg>
            Code
          </button>

          <button
            className={`repo-tab ${activeTab === "issues" ? "active" : ""}`}
            onClick={() => setActiveTab("issues")}
          >
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
              <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
            </svg>
            Issues
            <span className="tab-count">{issues.length}</span>
          </button>

          {isOwner && (
            <button
              className={`repo-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                <path d="M8 0a8.2 8.2 0 0 1 .701.031C9.444.095 9.99.645 10.16 1.29l.288 1.107c.377.098.733.25 1.066.452l.983-.565c.618-.354 1.393-.166 1.792.427l1 1.464c.399.593.284 1.385-.257 1.838l-.865.723c.092.383.136.78.136 1.182 0 .403-.044.8-.136 1.183l.865.723c.54.453.656 1.245.257 1.838l-1 1.464c-.399.593-1.174.781-1.792.427l-.983-.565a5.21 5.21 0 0 1-1.066.452l-.288 1.107c-.17.645-.716 1.195-1.459 1.259A8.2 8.2 0 0 1 8 16a8.2 8.2 0 0 1-.701-.031c-.744-.064-1.29-.614-1.459-1.259l-.288-1.107a5.21 5.21 0 0 1-1.066-.452l-.983.565c-.618.354-1.393.166-1.792-.427l-1-1.464c-.399-.593-.284-1.385.257-1.838l.865-.723A5.4 5.4 0 0 1 2.7 8c0-.403.044-.8.136-1.183l-.865-.723c-.54-.453-.656-1.245-.257-1.838l1-1.464c.399-.593 1.174-.781 1.792-.427l.983.565c.333-.202.689-.354 1.066-.452l.288-1.107c.17-.645.716-1.195 1.459-1.259A8.2 8.2 0 0 1 8 0Zm0 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"></path>
              </svg>
              Settings
            </button>
          )}
        </div>

        {/* Tab 1: Code View */}
        {activeTab === "code" && (
          <div className="repo-code-view">
            {repo.description && (
              <p className="repo-view-desc">{repo.description}</p>
            )}

            <div className="repo-actions-bar">
              <div className="repo-branch-pill">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                  <path d="M9.5 3.25a2.25 2.25 0 1 1 3 2.122V6A2.5 2.5 0 0 1 10 8.5H6a1 1 0 0 0-1 1v1.128a2.251 2.251 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.5 0v1.836A2.493 2.493 0 0 1 6 7h4a1 1 0 0 0 1-1v-.628A2.25 2.25 0 0 1 9.5 3.25Z"></path>
                </svg>
                <span>main</span>
              </div>

              {isOwner && (
                <button
                  className="btn btn-sm"
                  onClick={() => setShowAddContent(!showAddContent)}
                >
                  <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="currentColor">
                    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                  </svg>
                  Add file entry
                </button>
              )}
            </div>

            {showAddContent && (
              <form onSubmit={handleAddContent} className="add-file-box animate-fade-in">
                <h4>Commit new file content</h4>
                <textarea
                  className="form-textarea"
                  rows="3"
                  placeholder="Enter file text or commit note..."
                  value={newFileText}
                  onChange={(e) => setNewFileText(e.target.value)}
                  required
                />
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={addingContent}>
                    {addingContent ? "Saving..." : "Commit changes"}
                  </button>
                  <button type="button" className="btn btn-sm" onClick={() => setShowAddContent(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* File List Table */}
            <div className="file-list-card">
              <div className="file-list-header">
                <span className="committer-name">{ownerName}</span>
                <span className="commit-msg">Initial commit / repository update</span>
              </div>
              <div className="file-list-rows">
                <div className="file-row">
                  <div className="file-name">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="var(--text-secondary)">
                      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"></path>
                    </svg>
                    <span>README.md</span>
                  </div>
                  <span className="file-commit-note">Initial file setup</span>
                </div>
                {repo.content && repo.content.map((item, idx) => (
                  <div className="file-row" key={idx}>
                    <div className="file-name">
                      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="var(--text-secondary)">
                        <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688Z"></path>
                      </svg>
                      <span>file_{idx + 1}.txt</span>
                    </div>
                    <span className="file-commit-note">{item.slice(0, 50)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Readme Card View */}
            <div className="readme-card">
              <div className="readme-header">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                  <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.244a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.244a2.25 2.25 0 0 0-1.756.843l-.25.3a.75.75 0 0 1-1.152 0l-.25-.3A2.25 2.25 0 0 0 5.003 13H.75a.75.75 0 0 1-.75-.75Zm1.5.5v8.75h3.503c.895 0 1.737.397 2.308 1.077l.189.224.189-.224A3.737 3.737 0 0 1 10.197 11h3.303V2.25h-3.494a2.25 2.25 0 0 0-1.756.843l-.25.3a.75.75 0 0 1-1.152 0l-.25-.3A2.25 2.25 0 0 0 5.003 2.25Z"></path>
                </svg>
                <span>README.md</span>
              </div>
              <div className="readme-body">
                <h2>{repo.name}</h2>
                <p>{repo.description || "No description provided for this repository."}</p>
                {repo.content && repo.content.length > 0 && (
                  <div className="readme-extra">
                    <h3>Repository Content</h3>
                    {repo.content.map((c, i) => (
                      <pre key={i} className="code-block">{c}</pre>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Issues View */}
        {activeTab === "issues" && (
          <div className="repo-issues-view">
            <div className="issues-toolbar">
              <div className="issues-stats">
                <span className="stat-open">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="#3fb950">
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                  </svg>
                  {issues.filter((i) => i.status !== "closed").length} Open
                </span>
                <span className="stat-closed">
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="#bc8cff">
                    <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                  </svg>
                  {issues.filter((i) => i.status === "closed").length} Closed
                </span>
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => setShowIssueModal(true)}>
                New issue
              </button>
            </div>

            {/* New Issue Modal / Form */}
            {showIssueModal && (
              <form onSubmit={handleCreateIssue} className="create-issue-card animate-fade-in">
                <h3>Create New Issue</h3>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Title"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Leave a comment / description"
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" disabled={creatingIssue}>
                    {creatingIssue ? "Submitting..." : "Submit new issue"}
                  </button>
                  <button type="button" className="btn" onClick={() => setShowIssueModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Issue Items List */}
            <div className="issues-list-wrapper">
              {issues.length === 0 ? (
                <div className="empty-issues-box">
                  <svg aria-hidden="true" height="32" viewBox="0 0 16 16" width="32" fill="var(--text-muted)">
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                  </svg>
                  <h4>There aren’t any open issues.</h4>
                  <p>Open issues will show up here to help track tasks and bugs.</p>
                </div>
              ) : (
                issues.map((issue) => (
                  <div className="issue-row-item" key={issue._id}>
                    <div className="issue-left-col">
                      <svg
                        aria-hidden="true"
                        height="16"
                        viewBox="0 0 16 16"
                        width="16"
                        fill={issue.status === "closed" ? "#bc8cff" : "#3fb950"}
                        className="issue-icon"
                      >
                        {issue.status === "closed" ? (
                          <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
                        ) : (
                          <>
                            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                          </>
                        )}
                      </svg>
                      <div>
                        <div className="issue-item-title">{issue.title}</div>
                        <div className="issue-item-meta">
                          #{issue._id.slice(-4)} • {issue.description || "No description"}
                        </div>
                      </div>
                    </div>

                    <div className="issue-right-actions">
                      <button
                        className="btn btn-sm"
                        onClick={() => handleToggleIssueStatus(issue._id, issue.status)}
                      >
                        {issue.status === "closed" ? "Reopen" : "Close issue"}
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteIssue(issue._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Settings View */}
        {activeTab === "settings" && isOwner && (
          <div className="repo-settings-view">
            <div className="settings-section">
              <h3>General Settings</h3>
              <div className="settings-row">
                <div>
                  <h4>Change Visibility</h4>
                  <p>Currently set to <strong>{repo.visibility ? "Public" : "Private"}</strong>.</p>
                </div>
                <button className="btn" onClick={handleToggleVisibility}>
                  Make {repo.visibility ? "Private" : "Public"}
                </button>
              </div>
            </div>

            <div className="settings-section danger-zone">
              <h3>Danger Zone</h3>
              <div className="settings-row">
                <div>
                  <h4>Delete this repository</h4>
                  <p>Once you delete a repository, there is no going back. Please be certain.</p>
                </div>
                <button className="btn btn-danger" onClick={handleDeleteRepo}>
                  Delete this repository
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RepoDetail;
