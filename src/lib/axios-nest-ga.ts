import axios from "axios";
import { ApiError, type ApiErrorResponse } from "@/error";
import { AuthStorage } from "@/util/auth-storage";
import { toast } from "sonner";

// Extend config para permitir controlar toast
declare module "axios" {
  export interface AxiosRequestConfig {
    showSuccess?: boolean;
  }
}

// ==========================
// ⭐ Instância Axios
// ==========================
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
  (error) => Promise.reject(error)
);

// ==========================
// ⭐ Interceptor de RESPOSTA
// ==========================
axiosNestGa.interceptors.response.use(
  (response) => {
    // ✅ Mostrar sucesso só quando explicitamente pedido
    if (response.config.showSuccess) {
      const message =
        response?.data?.message || "Operação realizada com sucesso";

      toast.success(message, { position: "top-right" });
    }

    return response;
  },
  async (error) => {
    if (!error.response) {
      toast.error("Erro de conexão com o servidor.", {
        position: "top-right",
      });

      throw new ApiError("Erro de conexão com o servidor.", 0, undefined);
    }

    const { status, statusText, data } = error.response;

    let errorData: ApiErrorResponse | undefined;
    let message = `Erro ${status}: ${statusText}`;

    // ==========================
    // 🔥 Tratamento de erro do backend
    // ==========================
    if (data) {
      try {
        const parsed = data as ApiErrorResponse;

        errorData = parsed;
        message = parsed.message || parsed.error || message;

        toast.error(message, { position: "top-right" });
      } catch {
        if (typeof data === "string") {
          message = data.trim() || message;

          toast.error(message, { position: "top-right" });
        }
      }
    }

    // ==========================
    // 🔒 Token expirado
    // ==========================
    if (status === 401) {
      AuthStorage.logout();
      window.location.href = "/";
      return;
    }

    throw new ApiError(message, status, errorData);
  }
);