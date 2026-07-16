import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  withCredentials: true,
});

let refreshPromise = null;

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/api/auth/refresh")
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

const shouldSkipRefresh = (request) => {
  const url = request?.url ?? "";

  return (
    url.includes("/api/auth/login") ||
    url.includes("/api/auth/signup") ||
    url.includes("/api/auth/logout") ||
    url.includes("/api/auth/refresh") ||
    url.includes("/api/auth/user")
  );
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry ||
      shouldSkipRefresh(originalRequest)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshAccessToken();
      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;