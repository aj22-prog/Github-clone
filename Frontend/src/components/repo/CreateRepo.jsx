import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../navbar";
import "./repo.css";

const CreateRepo = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true); // true = Public, false = Private
  const [addReadme, setAddReadme] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      navigate("/auth");
      return;
    }

    if (!name.trim()) {
      setError("Please enter a repository name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const initialContent = addReadme
        ? [
            `# ${name.trim()}`,
            description ? `${description.trim()}` : "Welcome to this repository!",
            "Created with GitHub Clone.",
          ]
        : [];

      const payload = {
        name: name.trim(),
        description: description.trim(),
        visibility: Boolean(visibility),
        owner: userId,
        content: initialContent,
        issues: [],
      };

      const res = await axios.post("http://localhost:3002/repo/create", payload);
      setLoading(false);

      if (res.data && res.data.repositoryID) {
        navigate(`/repo/${res.data.repositoryID}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error creating repo:", err);
      setError(err.response?.data?.error || err.response?.data?.message || "Failed to create repository.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="repo-page-container animate-fade-in">
        <div className="repo-create-card">
          <div className="repo-create-header">
            <div className="repo-header-icon">
              <svg aria-hidden="true" height="24" viewBox="0 0 16 16" width="24" fill="currentColor">
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
              </svg>
            </div>
            <div>
              <h1 className="repo-create-title">Create a new repository</h1>
              <p className="repo-create-subtitle">
                A repository contains all project files, including the revision history.
              </p>
            </div>
          </div>

          <div className="repo-divider"></div>

          {error && <div className="repo-alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="repo-form">
            <div className="form-group">
              <label className="form-label" htmlFor="repo-name">
                Repository name <span className="req-star">*</span>
              </label>
              <div className="input-with-prefix">
                <input
                  id="repo-name"
                  type="text"
                  placeholder="e.g. awesome-web-app"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>
              <p className="form-helper">
                Great repository names are short and memorable.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="repo-desc">
                Description <span className="opt-tag">(optional)</span>
              </label>
              <textarea
                id="repo-desc"
                placeholder="What is this repository about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows="3"
              />
            </div>

            <div className="repo-divider"></div>

            <div className="form-group">
              <label className="form-label">Visibility</label>
              <div className="visibility-options">
                <label className={`visibility-option ${visibility ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === true}
                    onChange={() => setVisibility(true)}
                  />
                  <div className="visibility-icon">
                    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                      <path d="M3 3.5A2.5 2.5 0 0 1 5.5 1h13A2.5 2.5 0 0 1 21 3.5v17a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 20.5v-17Zm16.5 0a1 1 0 0 0-1-1h-13a1 1 0 0 0-1 1v17a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-17Z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="visibility-title">Public</div>
                    <div className="visibility-desc">Anyone on the internet can see this repository.</div>
                  </div>
                </label>

                <label className={`visibility-option ${!visibility ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === false}
                    onChange={() => setVisibility(false)}
                  />
                  <div className="visibility-icon">
                    <svg aria-hidden="true" height="24" viewBox="0 0 24 24" width="24" fill="currentColor">
                      <path d="M6 9V7.25C6 3.845 8.503 1 12 1s6 2.845 6 6.25V9h1.5A2.5 2.5 0 0 1 22 11.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 20.5v-9A2.5 2.5 0 0 1 4.5 9H6Zm1.5-1.75C7.5 4.707 9.407 2.5 12 2.5s4.5 2.207 4.5 4.75V9h-9V7.25Z"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="visibility-title">Private</div>
                    <div className="visibility-desc">You choose who can see and commit to this repository.</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="repo-divider"></div>

            <div className="form-group">
              <label className="checkbox-option">
                <input
                  type="checkbox"
                  checked={addReadme}
                  onChange={(e) => setAddReadme(e.target.checked)}
                />
                <div>
                  <div className="checkbox-title">Add a README file</div>
                  <div className="checkbox-desc">This is where you can write a long description for your project.</div>
                </div>
              </label>
            </div>

            <div className="repo-divider"></div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating repository..." : "Create repository"}
              </button>
              <Link to="/" className="btn">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
