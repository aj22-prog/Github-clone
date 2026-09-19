import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../authContext";
import axios from "axios";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";

const Navbar = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const res = await axios.get(`http://localhost:3002/userProfile/${userId}`);
          setUserProfile(res.data);
        } catch (err) {
          console.error("Error fetching navbar user profile:", err);
        }
      }
    };
    fetchUser();
  }, [currentUser]);

  // Click outside listener for dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/?q=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  return (
    <header className="gh-header">
      <div className="gh-header-left">
        <Link to="/" className="gh-logo-link" title="GitHub Dashboard">
          <img src={logo} alt="GitHub Logo" className="gh-logo" />
        </Link>
        <span className="gh-site-title">Dashboard</span>

        {/* Global Search Bar */}
        <form className={`gh-search-form ${searchFocused ? "focused" : ""}`} onSubmit={handleSearchSubmit}>
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" className="gh-search-icon">
            <path fill="currentColor" d="M10.68 11.74a6 6 0 0 1-7.922-8.982 6 6 0 0 1 8.982 7.922l3.04 3.04a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215ZM11.5 7a4.499 4.499 0 1 0-8.997 0A4.499 4.499 0 0 0 11.5 7Z"></path>
          </svg>
          <input
            type="text"
            placeholder="Type '/' to search repositories..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="gh-search-input"
          />
          <span className="gh-search-shortcut">/</span>
        </form>

        {/* Navigation links */}
        <nav className="gh-nav-links">
          <Link to="/" className={`gh-nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Overview
          </Link>
          <Link to="/issues" className={`gh-nav-link ${location.pathname.startsWith("/issues") ? "active" : ""}`}>
            Issues
          </Link>
          <Link to="/explore" className={`gh-nav-link ${location.pathname === "/explore" ? "active" : ""}`}>
            Explore
          </Link>
        </nav>
      </div>

      <div className="gh-header-right">
        {/* Create new repo quick button */}
        <Link to="/create" className="gh-new-repo-btn" title="Create a new repository">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor">
            <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
          </svg>
          <span className="gh-new-label">New</span>
        </Link>

        {/* User profile & Dropdown */}
        <div className="gh-user-menu" ref={dropdownRef}>
          <button
            className="gh-avatar-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User navigation menu"
          >
            <div className="gh-avatar-circle">
              {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : "U"}
            </div>
            <svg aria-hidden="true" height="14" viewBox="0 0 16 16" version="1.1" width="14" fill="currentColor" className="gh-dropdown-arrow">
              <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
            </svg>
          </button>

          {dropdownOpen && (
            <div className="gh-dropdown-panel animate-fade-in">
              <div className="gh-dropdown-header">
                <p className="gh-dropdown-sub">Signed in as</p>
                <p className="gh-dropdown-username">{userProfile?.username || "Developer"}</p>
                <p className="gh-dropdown-email">{userProfile?.email || ""}</p>
              </div>

              <div className="gh-dropdown-divider"></div>

              <div className="gh-dropdown-items">
                <Link to="/profile" className="gh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                    <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path>
                  </svg>
                  Your profile
                </Link>

                <Link to="/create" className="gh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.6-1.2-1.6 1.2a.25.25 0 0 1-.4-.2Z"></path>
                  </svg>
                  New repository
                </Link>

                <Link to="/issues" className="gh-dropdown-item" onClick={() => setDropdownOpen(false)}>
                  <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
                    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"></path>
                  </svg>
                  Your issues
                </Link>
              </div>

              <div className="gh-dropdown-divider"></div>

              <button className="gh-dropdown-item gh-logout-btn" onClick={handleLogout}>
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16" fill="currentColor">
                  <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5H6.75a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215l3-3a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 0 0-1.06 1.06Z"></path>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;