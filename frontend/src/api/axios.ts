import axios from "axios";

// Ensure the API URL is set from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});
const token = localStorage.getItem("token");
console.log("🔐 Attaching token to request:", token);
// 🔐 Automatically attach Authorization header if token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
