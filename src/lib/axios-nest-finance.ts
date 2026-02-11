import axios from "axios";
import { ApiError, type ApiErrorResponse } from "@/error";
import { AuthStorage } from "@/util/auth-storage";
import { toast } from "sonner";

export const axiosNestFinance = axios.create({
  baseURL: import.meta.env.VITE_NEST_FINANCE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


axiosNestFinance.interceptors.request.use(
  (config) => {
    const token = AuthStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


axiosNestFinance.interceptors.response.use(
  (response) => response,
  async (error) => {
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


    if (status === 401) {
      AuthStorage.logout();
      window.location.href = "/";
      return;
    }

    throw new ApiError(message, status, errorData);
  }
);
