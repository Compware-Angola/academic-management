import axios from "axios";
import { ApiError, type ApiErrorResponse } from "@/error";

export const axiosNestAuth = axios.create({
  baseURL: import.meta.env.VITE_NEST_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// ⭐ Interceptor de resposta
// ==========================
axiosNestAuth.interceptors.response.use(
  (response) => {
    // Se está OK, devolve normalmente
    return response;
  },
  async (error) => {
    // Se não tem resposta (timeout, network error, CORS, etc)
    if (!error.response) {
      throw new ApiError(
        "Erro de conexão com o servidor.",
        0,
        undefined
      );
    }

    const { status, statusText, data } = error.response;

    let errorData: ApiErrorResponse | undefined;
    let message = `Erro ${status}: ${statusText}`;

    // Tenta extrair o JSON
    if (data) {
      try {
        const parsed = data as ApiErrorResponse;
        errorData = parsed;
        message = parsed.message || parsed.error || message;
      } catch {
        // Caso venha texto puro
        if (typeof data === "string") {
          message = data.trim() || message;
        }
      }
    }

    throw new ApiError(message, status, errorData);
  }
);
