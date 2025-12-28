import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

console.log("API Base URL:", api.defaults.baseURL);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      toast.error("Network error. Please check your internet connection");
      return Promise.reject(new Error("Network error"));
    }

    const { status, data } = error.response;

    // Handle specific error codes
    switch (status) {
      case 400:
        toast.error(data.message || "Bad request");
        break;
      case 401:
        toast.error(data.message || "Unauthorized. Please log in again");
        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (typeof window !== "undefined") {
          window.location.href = "/auth";
        }
        break;
      case 403:
        toast.error(data.message || "Access forbidden");
        break;
      case 404:
        toast.error(data.message || "Resource not found");
        break;
      case 409:
        toast.error(data.message || "Conflict error");
        break;
      case 422:
        toast.error(data.message || "Validation error");
        break;
      case 429:
        toast.error("Too many requests. Please try again later");
        break;
      case 500:
        toast.error(data.message || "Server error. Please try again later");
        break;
      case 503:
        toast.error("Service unavailable. Please try again later");
        break;
      default:
        toast.error(data.message || "An error occurred");
    }

    return Promise.reject(error);
  }
);

export default api;
