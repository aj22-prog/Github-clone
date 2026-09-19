// Centralized API configuration for local dev and production (Vercel)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3002";

export default API_BASE_URL;
