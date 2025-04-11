import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // change if deployed
  withCredentials: true, // very important for cookies
});

export default api;
