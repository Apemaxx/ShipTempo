import { API_BASE_URL, AUTH_CODE } from "@/config";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// Interfaces
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  // Add other user fields as needed
}

export interface AuthResponse {
  authToken: string;
  refreshToken: string;
  tokenExpirationDate: number;
  refreshTokenExpirationDate: number;
  payload: User;
  message?: string;
}

// Custom error types
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class TokenRefreshError extends AuthError {
  constructor(message: string) {
    super(message);
    this.name = "TokenRefreshError";
  }
}

// Configuration - Use environment variables when possible
const API_CONFIG = {
  // Use import.meta.env for Vite projects, or process.env for regular React projects
  // Fallback to a sensible default in case the variable is not defined
  BASE_URL: API_BASE_URL + AUTH_CODE,
  ENDPOINTS: {
    SIGNUP: "/auth/signup",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    REFRESH: "/auth/refresh",
  },
  TOKEN_BUFFER_TIME: 0.5 * 60 * 1000, // 1 minute before expiration
};

// Router navigation (initialized by the service user)
let navigate: ((path: string) => void) | null = null;

// Storage preference (determined by rememberMe option)
let useLocalStorage = true;

// Utilities for token management
const TokenService = {
  // Helper to determine which storage to use based on rememberMe preference
  getStorage: (): Storage => {
    return useLocalStorage ? localStorage : sessionStorage;
  },

  getAuthToken: (): string | null => {
    return (
      TokenService.getStorage().getItem("authToken") ||
      localStorage.getItem("authToken")
    );
  },

  getRefreshToken: (): string | null => {
    return (
      TokenService.getStorage().getItem("refreshToken") ||
      localStorage.getItem("refreshToken")
    );
  },

  getTokenExpiration: (): number => {
    const expStr =
      TokenService.getStorage().getItem("tokenExpirationDate") ||
      localStorage.getItem("tokenExpirationDate");
    return expStr ? parseInt(expStr, 10) : 0;
  },

  getRefreshTokenExpiration: (): number => {
    const expStr =
      TokenService.getStorage().getItem("refreshTokenExpirationDate") ||
      localStorage.getItem("refreshTokenExpirationDate");
    return expStr ? parseInt(expStr, 10) : 0;
  },

  setAuthData: (
    data: AuthResponse,
    remember: boolean = useLocalStorage
  ): void => {
    // Update the storage preference
    useLocalStorage = remember;

    const storage = TokenService.getStorage();

    storage.setItem("authToken", data.authToken);
    storage.setItem("refreshToken", data.refreshToken);
    storage.setItem("tokenExpirationDate", data.tokenExpirationDate.toString());
    storage.setItem(
      "refreshTokenExpirationDate",
      data.refreshTokenExpirationDate.toString()
    );
    storage.setItem("user", JSON.stringify(data.payload));
  },

  clearAuthData: (): void => {
    // Clear from both storages to ensure complete logout
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpirationDate");
    localStorage.removeItem("refreshTokenExpirationDate");
    localStorage.removeItem("user");
    localStorage.removeItem("rememberMe");

    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("tokenExpirationDate");
    sessionStorage.removeItem("refreshTokenExpirationDate");
    sessionStorage.removeItem("user");
  },

  isTokenExpired: (): boolean => {
    const expiration = TokenService.getTokenExpiration();
    // Check if the token expires soon (within buffer time)
    return Date.now() + API_CONFIG.TOKEN_BUFFER_TIME >= expiration;
  },

  isRefreshTokenExpired: (): boolean => {
    const expiration = TokenService.getRefreshTokenExpiration();

    console.log("Refresh token expiration:", new Date(expiration));
    console.log("Current time:", new Date(Date.now()));
    console.log("Is refresh token expired?", Date.now() >= expiration);

    return Date.now() >= expiration;
  },

  getUser: (): User | null => {
    const userStr =
      TokenService.getStorage().getItem("user") || localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },
};

// Create axios instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Token refresh state management
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Function to refresh the token with improved error handling
const refreshToken = async (): Promise<string | null> => {
  try {
    // If there's already a refresh in progress, return that promise
    if (refreshPromise) {
      return refreshPromise;
    }

    const refreshToken = TokenService.getRefreshToken();

    if (!refreshToken || TokenService.isRefreshTokenExpired()) {
      TokenService.clearAuthData();
      throw new TokenRefreshError("Refresh token expired or not available");
    }

    // Create and store the promise
    refreshPromise = axios
      .post<AuthResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )
      .then((response) => {
        // When refreshing token, maintain the current storage preference
        TokenService.setAuthData(response.data, useLocalStorage);
        return response.data.authToken;
      })
      .catch((error) => {
        console.error("Token refresh error:", error);
        TokenService.clearAuthData();

        // Emit a custom event that other components can listen for
        const event = new CustomEvent("auth:logout", {
          detail: { reason: "token_refresh_failed" },
        });
        window.dispatchEvent(event);

        // Redirect to login if navigation is available
        if (navigate) {
          navigate("/signin");
        }

        throw new TokenRefreshError("Failed to refresh token");
      })
      .finally(() => {
        // Clean up the promise when done
        refreshPromise = null;
        isRefreshing = false;
      });

    return refreshPromise;
  } catch (error) {
    // Make sure to clean up the state
    refreshPromise = null;
    isRefreshing = false;

    if (error instanceof Error) {
      throw new TokenRefreshError(`Token refresh error: ${error.message}`);
    }
    throw new TokenRefreshError("Unknown token refresh error");
  }
};

// Authentication service
const AuthService = {
  /**
   * Initialize the auth service with navigation function
   */
  setNavigate: (navigateFunction: (path: string) => void): void => {
    navigate = navigateFunction;
  },

  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.SIGNUP,
        data
      );

      // For registration, always use localStorage (equivalent to rememberMe = true)
      TokenService.setAuthData(response.data, true);
      localStorage.setItem("rememberMe", "true");

      // Emit login event
      const event = new CustomEvent("auth:login", {
        detail: { user: response.data.payload },
      });
      window.dispatchEvent(event);

      return response.data.payload;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new AuthError(
            error.response.data.message || "Registration error"
          );
        }
      }
      throw new AuthError("Unexpected error during registration");
    }
  },

  /**
   * Login a user
   */
  login: async (data: LoginData): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>(
        API_CONFIG.ENDPOINTS.LOGIN,
        data
      );

      // Use the rememberMe flag to determine storage type
      TokenService.setAuthData(response.data, data.rememberMe);

      // Store the rememberMe preference for API client to use
      localStorage.setItem("rememberMe", data.rememberMe.toString());

      // Emit login event
      const event = new CustomEvent("auth:login", {
        detail: { user: response.data.payload },
      });
      window.dispatchEvent(event);

      return response.data.payload;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new AuthError(error.response.data.message || "Login error");
        }
      }
      throw new AuthError("Unexpected error during login");
    }
  },

  /**
   * Logout the current user and redirect to signin page
   */
  logout: (): void => {
    TokenService.clearAuthData();

    // Emit logout event
    const event = new CustomEvent("auth:logout", {
      detail: { reason: "user_initiated" },
    });
    window.dispatchEvent(event);

    // Redirect to login page if navigation is available
    if (navigate) {
      window.location.reload(); // Reload the page to clear any cached data
    } else {
      console.warn(
        "Navigation function not set in AuthService. Call setNavigate() to enable automatic redirects."
      );

      // Fallback to window.location if navigate is not available
      window.location.href = "/signin";
    }
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // If no token, try to refresh
      if (!TokenService.getAuthToken()) {
        if (
          TokenService.getRefreshToken() &&
          !TokenService.isRefreshTokenExpired()
        ) {
          const newToken = await refreshToken();
          if (!newToken) {
            return null;
          }
        } else {
          return null;
        }
      }

      // If token is about to expire, refresh it
      if (TokenService.isTokenExpired()) {
        await refreshToken();
      }

      // First try to get from storage for performance
      const cachedUser = TokenService.getUser();
      if (cachedUser) {
        return cachedUser;
      }

      // If no cached data, query the server
      const response = await api.get(API_CONFIG.ENDPOINTS.ME);

      // Update user in storage
      if (response.data.payload) {
        TokenService.getStorage().setItem(
          "user",
          JSON.stringify(response.data.payload)
        );
      }

      return response.data.payload;
    } catch (error) {
      console.error("Error getting current user:", error);

      // Try to refresh token if there's an error
      try {
        if (
          TokenService.getRefreshToken() &&
          !TokenService.isRefreshTokenExpired()
        ) {
          await refreshToken();
          return TokenService.getUser();
        }
      } catch (refreshError) {
        console.error(
          "Failed to refresh token during getCurrentUser:",
          refreshError
        );
      }

      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!TokenService.getAuthToken() && !TokenService.isTokenExpired();
  },

  /**
   * Add listener for authentication events
   */
  onAuthEvent: (
    event: "login" | "logout",
    callback: (event: CustomEvent) => void
  ): void => {
    window.addEventListener(`auth:${event}`, callback as EventListener);
  },

  /**
   * Remove listener for authentication events
   */
  offAuthEvent: (
    event: "login" | "logout",
    callback: (event: CustomEvent) => void
  ): void => {
    window.removeEventListener(`auth:${event}`, callback as EventListener);
  },
};

export default AuthService;
