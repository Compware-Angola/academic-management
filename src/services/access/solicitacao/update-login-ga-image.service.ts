import { axiosNestGa } from "@/lib/axios-nest-ga";

type UpdateLoginGaImageResponse = {
  message: string;
  sigla: "LOGIN_GA";
  filename: string;
  operacao: "criado" | "atualizado";
};

export async function updateLoginGaImage(
  filename: string,
): Promise<UpdateLoginGaImageResponse> {
  const response = await axiosNestGa.put<UpdateLoginGaImageResponse>(
    "/solicitacoa/aviso/imagem/LOGIN_GA",
    { filename },
  );

  return response.data;
}

export type GAImageResponse = {
  codigo: number;
  sigla: "LOGIN_GA ";
  filename: string;
};

export async function getGAImage(): Promise<GAImageResponse> {
  const response = await axiosNestGa.get<GAImageResponse>(
    "/solicitacoa/aviso/imagem/LOGIN_GA",
  );

  return response.data;
}
