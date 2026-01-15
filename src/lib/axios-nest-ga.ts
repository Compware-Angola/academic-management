import axios from "axios";
import { ApiError, type ApiErrorResponse } from "@/error";
import { AuthStorage } from "@/util/auth-storage";
import { toast } from "sonner";

export const axiosNestGa = axios.create({
  baseURL: import.meta.env.VITE_NEST_GA_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// ⭐ Interceptor de REQUISIÇÃO (envio do token)
// ==========================
axiosNestGa.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Erro antes de enviar a requisição
    return Promise.reject(error);
  }
);

// ==========================
// ⭐ Interceptor de RESPOSTA (tratamento de erros)
// ==========================
axiosNestGa.interceptors.response.use(
  (response) => {
    // Resposta OK
    return response;
  },
  async (error) => {
    // Removi o console.log de teste
    if (!error.response) {
      throw new ApiError("Erro de conexão com o servidor.", 0, undefined);
    }

    const { status, statusText, data } = error.response;

    let errorData: ApiErrorResponse | undefined;
    let message = `Erro ${status}: ${statusText}`;

    if (data) {
      try {
        const parsed = data as ApiErrorResponse;
        errorData = parsed;
        message = parsed.message || parsed.error || message;
        toast.error(message);
      } catch {
        if (typeof data === "string") {
          message = data.trim() || message;
        }
      }
    }

    throw new ApiError(message, status, errorData);
  }
);