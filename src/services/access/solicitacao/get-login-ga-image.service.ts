import axios from "axios";

export type LoginGaImageResponse = {
  sigla: "LOGIN_GA";
  filename: string | null;
  updatedAt: string | null;
};

export async function getLoginGaImage(): Promise<LoginGaImageResponse> {
  const response = await axios.get<LoginGaImageResponse>(
    "/solicitacoa/aviso/imagem/LOGIN_GA",
    {
      baseURL: import.meta.env.VITE_NEST_GA_API_URL,
      headers: {
        "x-api-key": import.meta.env.VITE_NEST_GA_API_KEY,
      },
    },
  );

  return response.data;
}
