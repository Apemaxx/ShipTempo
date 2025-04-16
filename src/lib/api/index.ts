import axios from "axios";
import { API_BASE_URL, AUTH_CODE } from "@/config";

// Cliente API base para Xano con soporte para múltiples códigos de API
export const xanoApiClient = {
  // API base para todas las solicitudes a Xano
  baseURL: API_BASE_URL,

  // Crea una instancia de axios configurada con el código de API correspondiente
  getAxiosInstance(apiCode: string = AUTH_CODE) {
    const token = localStorage.getItem("authToken") || "";
    return axios.create({
      baseURL: this.baseURL + apiCode,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      timeout: 15000, // 15 segundos de timeout
    });
  },

  // Realiza una solicitud GET a Xano
  async get(endpoint: string, apiCode: string = AUTH_CODE) {
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
  async post(endpoint: string, data: any, apiCode: string = AUTH_CODE) {
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
  async put(endpoint: string, data: any, apiCode: string = AUTH_CODE) {
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
  async delete(endpoint: string, apiCode: string = AUTH_CODE) {
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
