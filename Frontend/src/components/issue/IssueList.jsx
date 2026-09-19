import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar";
import { Link } from "react-router-dom";
import "./issue.css";

const IssueList = () => {
  const [issues, setIssues] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all', 'open', 'closed'
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAllIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3002/issue/all");
      setIssues(Array.isArray(res.data) ? res.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching issues:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllIssues();
  }, []);

  const handleToggleStatus = async (issueId, currentStatus) => {
    const nextStatus = currentStatus === "closed" ? "open" : "closed";
    try {
      await axios.put(`http://localhost:3002/issue/update/${issueId}`, {
        status: nextStatus,
      });
      fetchAllIssues();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (window.confirm("Delete this issue?")) {
      try {
        await axios.delete(`http://localhost:3002/issue/delete/${issueId}`);
        fetchAllIssues();
      } catch (err) {
        console.error("Error deleting issue:", err);
      }
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "open"
        ? issue.status !== "closed"
        : issue.status === "closed";

    const matchesSearch =
      issue.title?.toLowerCase().includes(search.toLowerCase()) ||
      issue.description?.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const openCount = issues.filter((i) => i.status !== "closed").length;
  const closedCount = issues.filter((i) => i.status === "closed").length;

  return (
    <>
      <Navbar />
      <div className="issues-page-container animate-fade-in">
        <div className="issues-header-section">
          <div>
            <h1 className="issues-main-title">Global Issues Tracker</h1>
            <p className="issues-sub-title">View and manage issues across all your repositories.</p>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="issues-filter-bar">
          <div className="issues-state-filters">
            <button
              className={`filter-btn ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All ({issues.length})
            </button>
            <button
              className={`filter-btn ${filter === "open" ? "active" : ""}`}
              onClick={() => setFilter("open")}
            >
              <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="#3fb950">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
              </svg>
              {openCount} Open
            </button>
            <button
              className={`filter-btn ${filter === "closed" ? "active" : ""}`}
              onClick={() => setFilter("closed")}
            >
              <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14" fill="#bc8cff">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
              </svg>
              {closedCount} Closed
            </button>
          </div>

          <div className="issues-search-box">
            <input
              type="text"
              className="form-input"
              placeholder="Filter issues by name or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Issue Items */}
        <div className="issues-box-card">
          {loading ? (
            <div className="issues-loading">Loading issues...</div>
          ) : filteredIssues.length === 0 ? (
            <div className="empty-issues-box">
              <svg aria-hidden="true" height="36" viewBox="0 0 16 16" width="36" fill="var(--text-muted)">
                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
              </svg>
              <h4>No issues match your current filters.</h4>
              <p>Try clearing filters or search queries.</p>
            </div>
          ) : (
            filteredIssues.map((issue) => {
              const repoObj = issue.repository;
              const repoId = repoObj?._id || repoObj;
              const repoName = repoObj?.name || "repository";

              return (
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
                      <div className="issue-item-title">
                        {issue.title}
                        {repoId && (
                          <Link to={`/repo/${repoId}`} className="issue-repo-badge">
                            {repoName}
                          </Link>
                        )}
                      </div>
                      <div className="issue-item-meta">
                        #{issue._id.slice(-4)} • {issue.description || "No description provided"}
                      </div>
                    </div>
                  </div>

                  <div className="issue-right-actions">
                    <button
                      className="btn btn-sm"
                      onClick={() => handleToggleStatus(issue._id, issue.status)}
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
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default IssueList;
