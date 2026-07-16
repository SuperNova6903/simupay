import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001",
  withCredentials: true,
});

let refreshPromise;
let isRedirectingToLogin = false;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = api.post("/api/auth/refresh").finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

const redirectToLogin = () => {
  if (!isRedirectingToLogin && typeof window !== "undefined") {
    isRedirectingToLogin = true;
    window.location.replace("/");
  }
};

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     const isRefreshRequest = originalRequest?.url?.includes("/api/auth/refresh");
//     const isPublicAuthRequest = originalRequest?.url?.includes("/api/auth/login") ||
//       originalRequest?.url?.includes("/api/auth/signup") ||
//       originalRequest?.url?.includes("/api/auth/logout");

//     if (
//       error.response?.status === 401 &&
//       !originalRequest?._retry &&
//       !isRefreshRequest &&
//       !isPublicAuthRequest
//     ) {
//       originalRequest._retry = true;
//       try {
//         await refreshAccessToken();
//         return api(originalRequest);
//       } catch (refreshError) {
//         redirectToLogin();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default api;
