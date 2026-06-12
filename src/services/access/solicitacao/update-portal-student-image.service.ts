import { axiosNestGa } from "@/lib/axios-nest-ga";

type UpdatePortalStudentImageResponse = {
  message: string;
  sigla: "PORTAL_ESTUDANTE";
  filename: string;
  operacao: "criado" | "atualizado";
};

export async function updatePortalStudentImage(
  filename: string,
): Promise<UpdatePortalStudentImageResponse> {
  const response = await axiosNestGa.put<UpdatePortalStudentImageResponse>(
    "/solicitacoa/aviso/imagem/PORTAL_ESTUDANTE",
    { filename },
  );

  return response.data;
}
