import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { ApiError, type ApiErrorResponse } from "@/error";

const VITE_API_URL_UPLOAD = import.meta.env.VITE_API_URL_UPLOAD;

// ==========================
// 🚀 Instância Axios
// ==========================
export const uploadApi: AxiosInstance = axios.create({
  baseURL: VITE_API_URL_UPLOAD,
  timeout: 0, // sem retry / sem timeout forçado
});

// ==========================
// ⭐ Interceptor de resposta
// (equivalente ao afterResponse do ky)
// ==========================
uploadApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // Resposta OK → devolve normalmente
    return response;
  },
  async (error: AxiosError) => {
    // Erro sem resposta (network, CORS, DNS, timeout, etc)
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

    // ==========================
    // 🔍 Tratamento do corpo do erro
    // ==========================
    if (data) {
      // Axios já parseia JSON automaticamente
      if (typeof data === "object") {
        const parsed = data as ApiErrorResponse;
        errorData = parsed;
        message = parsed.message || parsed.error || message;
      }

      // Caso venha como texto simples
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data) as ApiErrorResponse;
          errorData = parsed;
          message = parsed.message || parsed.error || message;
        } catch {
          message = data.trim() || message;
        }
      }
    }

    // ==========================
    // ❌ Lança erro padronizado
    // ==========================
    throw new ApiError(message, status ?? 0, errorData);
  }
);
