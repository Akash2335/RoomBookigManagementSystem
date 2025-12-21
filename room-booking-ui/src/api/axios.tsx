// Import axios library for making HTTP requests
import axios from "axios";

// Create a configured axios instance with a base URL for the API
const api = axios.create({
  baseURL: "https://localhost:7018/api", // Base URL for all API requests
});

// Add a request interceptor to automatically include the authentication token in headers
api.interceptors.request.use(config => {
  // Retrieve the authentication token from local storage
  const token = localStorage.getItem("token");
  // If a token exists, add it to the Authorization header as a Bearer token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Return the modified config to proceed with the request
  return config;
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  res => res, // Pass through successful responses unchanged
  err => {
    // If the response status is 401 (Unauthorized), clear local storage and redirect to login
    if (err.response?.status === 401) {
      localStorage.clear(); // Remove all stored data
      window.location.href = "/login"; // Redirect user to login page
    }
    // Reject the promise with the error to propagate it to the calling code
    return Promise.reject(err);
  }
);

// Export the configured axios instance for use in other parts of the application
export default api;
