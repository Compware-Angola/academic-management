import { ApiError, type ApiErrorResponse } from "@/error";
import { AuthStorage } from "@/util/auth-storage";
import axios from "axios";

const VITE_API_URL_UPLOAD = import.meta.env.VITE_API_URL_UPLOAD;

export const uploadApi = axios.create({
  baseURL: VITE_API_URL_UPLOAD,
});

uploadApi.interceptors.request.use((config) => {
  const token = AuthStorage.getToken();

  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

uploadApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const response = error.response;

    if (!response) {
      // erro de rede / sem resposta do servidor
      throw new ApiError(error.message || "Erro de rede", 0);
    }

    let errorData: ApiErrorResponse | undefined;
    let message = `Erro ${response.status}: ${response.statusText}`;

    const data = response.data;

    if (typeof data === "string") {
      // texto puro (não JSON)
      message = data.trim() || message;
    } else if (data && typeof data === "object") {
      errorData = data as ApiErrorResponse;
      message = errorData.message || errorData.error || message;
    }

    throw new ApiError(message, response.status, errorData);
  },
);
