import axios from "axios";
import { ApiError, type ApiErrorResponse } from "@/error";
import { parse } from "path";

export const axiosNestGa = axios.create({
  baseURL: import.meta.env.VITE_NEST_GA_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// ⭐ Interceptor de resposta
// ==========================
axiosNestGa.interceptors.response.use(
  (response) => {
    // Se está OK, devolve normalmente
    return response;
  },
  async (error) => {
    // Erro sem resposta (network, timeout, CORS, etc)
    if (!error.response) {
      throw new ApiError("Erro de conexão com o servidor.", 0, undefined);
    }

    const { status, statusText, data } = error.response;

    let errorData: ApiErrorResponse | undefined;
    let message = `Erro ${status}: ${statusText}`;

    // Tentativa de extrair erro vindo da API

    if (data) {
      try {
        const parsed = data as ApiErrorResponse;

        errorData = parsed;
        message = parsed.message || parsed.error || message;
      } catch {
        // Caso seja texto simples
        if (typeof data === "string") {
          message = data.trim() || message;
        }
      }
    }

    throw new ApiError(message, status, errorData);
  }
);
