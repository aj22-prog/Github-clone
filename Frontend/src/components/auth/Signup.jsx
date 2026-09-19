import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";
import { Link, useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${API_BASE_URL}/signup`, {
        email: email.trim(),
        password: password,
        username: username.trim(),
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Signup Failed!";
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper animate-fade-in">
      <div className="auth-logo-container">
        <Link to="/">
          <img className="auth-logo" src={logo} alt="GitHub Logo" />
        </Link>
      </div>

      <h1 className="auth-title">Join GitHub</h1>

      {error && <div className="auth-alert-error">{error}</div>}

      <div className="auth-card">
        <form onSubmit={handleSignup} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="johndoe"
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <span className="auth-input-helper">Make sure it's at least 6 characters.</span>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>

      <div className="auth-switch-card">
        <p>
          Already have an account? <Link to="/auth" className="auth-link">Sign in</Link>.
        </p>
      </div>

      <footer className="auth-footer">
        <a href="#terms">Terms</a>
        <a href="#privacy">Privacy</a>
        <a href="#docs">Docs</a>
        <a href="#contact">Contact GitHub Support</a>
      </footer>
    </div>
  );
};

export default Signup;
