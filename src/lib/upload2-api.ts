import { ApiError, type ApiErrorResponse } from "@/error";
import { AuthStorage } from "@/util/auth-storage";
import ky from "ky";

const VITE_API_URL_UPLOAD = import.meta.env.VITE_API_URL_UPLOAD;
export const uploadApi = ky.create({
  retry: 0,
  prefixUrl: VITE_API_URL_UPLOAD,
  hooks: {
    beforeRequest: [
      (request) => {
        const token = AuthStorage.getToken();

        if (token) {
          request.headers.set("Authorization", `Bearer ${token}`);
        }
      },
    ],
    afterResponse: [
      async (_request, _options, response) => {
        if (!response.ok) {
          let errorData: ApiErrorResponse | undefined;
          let message = `Erro ${response.status}: ${response.statusText}`;

          // PRIMEIRO: tenta ler como text (sempre funciona)
          const text = await response.text();

          if (text) {
            try {
              // SEGUNDO: tenta parsear como JSON
              const json = JSON.parse(text) as ApiErrorResponse;
              errorData = json;
              message = json.message || json.error || message;
            } catch {
              // Se não for JSON válido, usa o texto puro
              message = text.trim() || message;
            }
          }

          throw new ApiError(message, response.status, errorData);
        }
      },
    ],
  },
});
