import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";
import "./auth.css";
import logo from "../../assets/github-mark-white.svg";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { setCurrentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://localhost:3002/login", {
        email: email.trim(),
        password: password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);
      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid email or password.";
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

      <h1 className="auth-title">Sign in to GitHub</h1>

      {error && <div className="auth-alert-error">{error}</div>}

      <div className="auth-card">
        <form onSubmit={handleLogin} className="auth-form">
          <div className="auth-form-group">
            <label className="auth-label" htmlFor="email">Username or email address</label>
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
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="password">Password</label>
              <span className="auth-forgot">Forgot password?</span>
            </div>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block auth-submit-btn"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>

      <div className="auth-switch-card">
        <p>
          New to GitHub? <Link to="/signup" className="auth-link">Create an account</Link>.
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

export default Login;