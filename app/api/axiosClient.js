import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";
let refreshRequest = null;

function getLocalStorageToken(key) {
  return typeof window !== "undefined" ? localStorage.getItem(key) : null;
}

export function setTokens({ access, refresh }) {
  if (access) {
    localStorage.setItem("accessToken", access);
  }
  if (refresh) {
    localStorage.setItem("refreshToken", refresh);
  }
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userRole");
}

async function requestRefreshToken() {
  const refreshToken = getLocalStorageToken("refreshToken");
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  if (!refreshRequest) {
    refreshRequest = axios
      .post(`${API_BASE_URL}/api/token/refresh/`, {
        refresh: refreshToken,
      })
      .then((response) => {
        const access = response.data.accessToken || response.data.access;
        const refresh = response.data.refreshToken || response.data.refresh;
        setTokens({ access, refresh });
        return response.data;
      })
      .catch((error) => {
        clearTokens();
        throw error;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = getLocalStorageToken("accessToken");
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    if (status === 401) {
      originalRequest._retry = true;
      try {
        await requestRefreshToken();
        const accessToken = getLocalStorageToken("accessToken");
        if (accessToken) {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
