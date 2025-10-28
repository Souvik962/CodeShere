import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
  timeout: 30000, // 30 second timeout for email operations
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any auth headers or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login or clear auth state
      console.log("Unauthorized access - redirecting to login");
    }
    return Promise.reject(error);
  }
);
