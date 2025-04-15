import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Xano API base URLs
const API_BASE_URL = "https://xceb-j0mf-bxn3.n7d.xano.io/api";
const API_BASE_URL_WITH_KEY = "https://xceb-j0mf-bxn3.n7d.xano.io/api:pRlqrAzC";
const SIGNUP_URL = `${API_BASE_URL_WITH_KEY}/auth/signup`;
const LOGIN_URL = `${API_BASE_URL_WITH_KEY}/auth/login`;
const ME_URL = `${API_BASE_URL_WITH_KEY}/auth/me`;
const REFRESH_URL = `${API_BASE_URL_WITH_KEY}/auth/refresh`;

// Interface for user registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Interface for user login data
export interface LoginData {
  email: string;
  password: string;
}

// Interface for user data returned from API
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  token?: string;
  // Add other user fields as needed
}

// Interface for auth response
export interface AuthResponse {
  authToken: string;
  refreshToken: string;
  tokenExpirationDate: number;
  refreshTokenExpirationDate: number;
  payload: User;
  message?: string;
}

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue of requests to retry after token refresh
let refreshSubscribers: ((token: string) => void)[] = [];

// Function to subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Function to notify subscribers with new token
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Function to store auth data in sessionStorage
const storeAuthData = (data: AuthResponse): void => {
  sessionStorage.setItem("authToken", data.authToken);
  sessionStorage.setItem("refreshToken", data.refreshToken);
  sessionStorage.setItem(
    "tokenExpirationDate",
    data.tokenExpirationDate.toString(),
  );
  sessionStorage.setItem(
    "refreshTokenExpirationDate",
    data.refreshTokenExpirationDate.toString(),
  );
  sessionStorage.setItem("user", JSON.stringify(data.payload));
};

// Function to clear auth data from sessionStorage
const clearAuthData = (): void => {
  sessionStorage.removeItem("authToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("tokenExpirationDate");
  sessionStorage.removeItem("refreshTokenExpirationDate");
  sessionStorage.removeItem("user");
};

// Function to refresh the auth token
export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    const response = await axios.post<AuthResponse>(
      REFRESH_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    // Store the new auth data
    storeAuthData(response.data);

    return response.data.authToken;
  } catch (error) {
    console.error("Token refresh error:", error);
    clearAuthData();
    return null;
  }
};

// Add request interceptor to include auth token in requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add global request interceptor to include auth token in all axios requests
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("authToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If the error is not 401 or the request has already been retried, reject
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, add to queue
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }

    // Set refreshing flag
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh the token
      const newToken = await refreshToken();

      // If token refresh failed, reject
      if (!newToken) {
        return Promise.reject(error);
      }

      // Notify subscribers
      onTokenRefreshed(newToken);

      // Retry the original request
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      // If token refresh failed, redirect to login
      clearAuthData();
      window.location.href = "/signin";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// Add a global axios interceptor to handle 401 errors for all axios requests
axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // If the error is not 401 or the request has already been retried, reject
    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, add to queue
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }

    // Set refreshing flag
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Refresh the token
      const newToken = await refreshToken();

      // If token refresh failed, reject
      if (!newToken) {
        return Promise.reject(error);
      }

      // Notify subscribers
      onTokenRefreshed(newToken);

      // Retry the original request
      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axios(originalRequest);
    } catch (refreshError) {
      console.error("Token refresh failed:", refreshError);
      // If token refresh failed, redirect to login
      clearAuthData();
      window.location.href = "/signin";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    // Use the specific signup URL instead of the base URL + path
    const response = await axios.post<AuthResponse>(SIGNUP_URL, data);

    // Store auth data in sessionStorage
    storeAuthData(response.data);

    return response.data.payload;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Login a user
 */
export const login = async (data: LoginData): Promise<User> => {
  try {
    // Use the specific login URL instead of the base URL + path
    const response = await axios.post<AuthResponse>(LOGIN_URL, data);

    // Store auth data in sessionStorage
    storeAuthData(response.data);

    return response.data.payload;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Logout the current user and redirect to signin page
 */
export const logout = (): void => {
  try {
    // Clear all auth-related storage
    clearAuthData();

    // Redirect to signin page
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    // Force redirect even if there was an error clearing storage
    window.location.href = "/";
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const token = sessionStorage.getItem("authToken");
    if (!token) {
      // If no token but refresh token exists, try to refresh
      const refreshTokenValue = sessionStorage.getItem("refreshToken");
      if (refreshTokenValue) {
        const newToken = await refreshToken();
        if (newToken) {
          // If refresh successful, get user from sessionStorage
          const userStr = sessionStorage.getItem("user");
          if (userStr) {
            return JSON.parse(userStr);
          }
        }
      }
      return null;
    }

    // Use the specific ME URL instead of the base URL + path
    const response = await axios.get(ME_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.payload;
  } catch (error) {
    console.error("Get current user error:", error);
    // Try to refresh token if error
    try {
      const newToken = await refreshToken();
      if (newToken) {
        // If refresh successful, get user from sessionStorage
        const userStr = sessionStorage.getItem("user");
        if (userStr) {
          return JSON.parse(userStr);
        }
      }
    } catch (refreshError) {
      console.error("Token refresh error:", refreshError);
    }
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!sessionStorage.getItem("authToken");
};
