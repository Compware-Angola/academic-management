import { axiosNestGa } from "@/lib/axios-nest-ga";

type UpdateComunicadoPortalImageResponse = {
  message: string;
  sigla: "COMUNICADO_PORTAL";
  filename: string;
  operacao: "criado" | "atualizado";
};

export async function updateComunicadoPortalImage(
  filename: string,
): Promise<UpdateComunicadoPortalImageResponse> {
  const response = await axiosNestGa.put<UpdateComunicadoPortalImageResponse>(
    "/solicitacoa/aviso/imagem/COMUNICADO_PORTAL",
    { filename },
  );

  return response.data;
}
