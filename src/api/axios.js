import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ziggycom-backend.onrender.com",
  withCredentials: true,
});

// Attach JWT automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
