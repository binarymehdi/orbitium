import axios, { type AxiosInstance, type AxiosError } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 404) {
      console.error("Resource not found");
    }

    if (error.response?.status && error.response.status >= 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export { apiClient };

export interface APIError {
  message: string;
  status?: number;
  detail?: any;
}

export function handleAPIError(error: unknown): APIError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.detail || error.message,
      status: error.response?.status,
      detail: error.response?.data,
    };
  }
  return {
    message: error instanceof Error ? error.message : "Unknown error",
  };
}
