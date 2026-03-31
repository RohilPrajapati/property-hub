import axios from 'axios';
import { getAuthHeader, logout } from '../helpers'
import { API_HOST } from '../configs'
import { notification } from "antd";
import { REFRESH_URL } from "../pages/auth/api/index"


// Create Axios instance
const httpClient = axios.create({
  baseURL: API_HOST,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to attach token
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function createClient() {
  const httpClient = axios.create({
    baseURL: API_HOST,
    headers: {
      common: getAuthHeader()
    }
  })
  httpClient.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      console.log("axios client working")
      return response

    },
    async (error) => {
      const originalRequest = error.config;


      if (error.response?.status === 401) {
        try {
          const refreshToken = localStorage.getItem("refresh_token");

          if (!refreshToken) {
            logout();
            return Promise.reject(error);
          }

          const res = await axios.post(`${API_HOST}/${REFRESH_URL}`, {
            refresh: refreshToken,
          });

          const newAccessToken = res.data.access;
          const newRefreshToken = res.data.refresh;
          const userData = JSON.stringify(res.data.user);

          localStorage.setItem("access_token", newAccessToken);
          localStorage.setItem("refresh_token", newRefreshToken);
          localStorage.setItem("user", userData);
          localStorage.setItem("auth", true);

          // Update original request headers and retry it
          httpClient.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return await httpClient(originalRequest); // <-- IMPORTANT: return the retried request promise
        } catch (refreshError) {
          console.log(refreshError)
          notification.error({
            message: "Session expired",
            description: "Your session has expired. Please log in again.",
            duration: 3,
          });
          logout();
          return Promise.reject(new Error("Session expired - user logged out"));
        }
      }

      // For other errors or if already retried, just reject
      return Promise.reject(error);
    }
  )
  return httpClient
}

export default httpClient;
