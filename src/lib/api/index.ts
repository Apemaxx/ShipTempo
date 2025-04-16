import { API_BASE_URL, AUTH_CODE } from "@/config";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Helper to get token from either storage
const getAuthToken = (): string => {
  // First check sessionStorage, then localStorage
  return (
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("authToken") ||
    ""
  );
};

// Token refresh integration
let isRefreshingToken = false;
let refreshPromise: Promise<string | null> | null = null;

// Cliente API base para Xano con soporte para múltiples códigos de API
export const xanoApiClient = {
  // API base para todas las solicitudes a Xano
  baseURL: API_BASE_URL,

  // Crea una instancia de axios configurada con el código de API correspondiente
  getAxiosInstance(apiCode: string = AUTH_CODE): AxiosInstance {
    const token = getAuthToken();

    const instance = axios.create({
      baseURL: this.baseURL + apiCode,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      timeout: 15000, // 15 segundos de timeout
    });

    // Add response interceptor for token handling
    instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        // Handle 401 Unauthorized errors (expired token)
        if (error.response?.status === 401) {
          const originalRequest = error.config;

          // Don't retry if we already tried to refresh
          if (originalRequest && (originalRequest as any)._isRetry) {
            // Token refresh failed, redirect to login
            window.dispatchEvent(
              new CustomEvent("auth:logout", {
                detail: { reason: "token_expired" },
              })
            );
            return Promise.reject(error);
          }

          try {
            // Try to refresh the token
            await this.refreshToken();

            // Update token in original request
            if (originalRequest) {
              (originalRequest as any)._isRetry = true;
              originalRequest.headers.Authorization = `Bearer ${getAuthToken()}`;

              // Retry the original request
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // Token refresh failed, redirect to login
            window.dispatchEvent(
              new CustomEvent("auth:logout", {
                detail: { reason: "token_refresh_failed" },
              })
            );
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );

    return instance;
  },

  // Method to refresh token
  async refreshToken(): Promise<string | null> {
    // If already refreshing, return the existing promise
    if (refreshPromise) {
      return refreshPromise;
    }

    isRefreshingToken = true;

    try {
      // Get refresh token from storage
      const refreshToken =
        sessionStorage.getItem("refreshToken") ||
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Create the refresh promise
      refreshPromise = axios
        .post<{
          authToken: string;
          refreshToken: string;
          tokenExpirationDate: number;
          refreshTokenExpirationDate: number;
          payload: any;
        }>(
          `${this.baseURL}${AUTH_CODE}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        )
        .then((response) => {
          const { data } = response;

          // Determine which storage to use
          const storage =
            localStorage.getItem("rememberMe") === "true"
              ? localStorage
              : sessionStorage;

          // Store the new tokens
          storage.setItem("authToken", data.authToken);
          storage.setItem("refreshToken", data.refreshToken);
          storage.setItem(
            "tokenExpirationDate",
            data.tokenExpirationDate.toString()
          );
          storage.setItem(
            "refreshTokenExpirationDate",
            data.refreshTokenExpirationDate.toString()
          );
          storage.setItem("user", JSON.stringify(data.payload));

          return data.authToken;
        })
        .catch((error) => {
          console.error("Error refreshing token:", error);
          throw error;
        })
        .finally(() => {
          isRefreshingToken = false;
          refreshPromise = null;
        });

      return refreshPromise;
    } catch (error) {
      isRefreshingToken = false;
      refreshPromise = null;
      throw error;
    }
  },

  // Realiza una solicitud GET a Xano
  async get<T = any>(
    endpoint: string,
    apiCode: string = AUTH_CODE
  ): Promise<T> {
    try {
      const api = this.getAxiosInstance(apiCode);
      const response = await api.get(endpoint);
      return response.data;
    } catch (error) {
      console.error(`Error en GET a ${endpoint} (código: ${apiCode}):`, error);
      throw error;
    }
  },

  // Realiza una solicitud POST a Xano
  async post<T = any>(
    endpoint: string,
    data: any,
    apiCode: string = AUTH_CODE
  ): Promise<T> {
    try {
      const api = this.getAxiosInstance(apiCode);
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error en POST a ${endpoint} (código: ${apiCode}):`, error);
      throw error;
    }
  },

  // Realiza una solicitud PUT a Xano
  async put<T = any>(
    endpoint: string,
    data: any,
    apiCode: string = AUTH_CODE
  ): Promise<T> {
    try {
      const api = this.getAxiosInstance(apiCode);
      const response = await api.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error(`Error en PUT a ${endpoint} (código: ${apiCode}):`, error);
      throw error;
    }
  },

  // Realiza una solicitud DELETE a Xano
  async delete<T = any>(
    endpoint: string,
    apiCode: string = AUTH_CODE
  ): Promise<T> {
    try {
      const api = this.getAxiosInstance(apiCode);
      const response = await api.delete(endpoint);
      return response.data;
    } catch (error) {
      console.error(
        `Error en DELETE a ${endpoint} (código: ${apiCode}):`,
        error
      );
      throw error;
    }
  },
};

// Exportar todas las APIs específicas
export * from "./billing";
export * from "./containers";
export * from "./shipments";
export * from "./zipcode";
