import { axiosNestGa } from "@/lib/axios-nest-ga";
import { ListEstudantesMatriculadosPayload } from "./fetch-estudantes-matriculados.service";

export type ExportEstudantesMatriculadosResponse = {
  blob: Blob;
  fileName: string;
};

export async function exportEstudantesMatriculadosPdfService(
  params: Omit<ListEstudantesMatriculadosPayload, "page" | "limit">,
): Promise<ExportEstudantesMatriculadosResponse> {
  const response = await axiosNestGa.get<Blob>(
    "/registration/estudantes-matriculados/export/pdf",
    {
      params,
      responseType: "blob",
    },
  );

  return {
    blob: response.data,
    fileName: getFileNameFromContentDisposition(
      response.headers["content-disposition"] as string | undefined,
      `estudantes-matriculados-${new Date().toISOString().slice(0, 10)}.pdf`,
    ),
  };
}

export async function exportEstudantesMatriculadosExcelService(
  params: Omit<ListEstudantesMatriculadosPayload, "page" | "limit">,
): Promise<ExportEstudantesMatriculadosResponse> {
  const response = await axiosNestGa.get<Blob>(
    "/registration/estudantes-matriculados/export/excel",
    {
      params,
      responseType: "blob",
    },
  );

  return {
    blob: response.data,
    fileName: getFileNameFromContentDisposition(
      response.headers["content-disposition"] as string | undefined,
      `estudantes-matriculados-${new Date().toISOString().slice(0, 10)}.xlsx`,
    ),
  };
}

function getFileNameFromContentDisposition(
  contentDisposition: string | undefined,
  fallbackFileName: string,
): string {
  const fileNameMatch = contentDisposition?.match(
    /filename\*?=(?:UTF-8'')?["']?([^"';]+)["']?/i,
  );

  return fileNameMatch
    ? decodeURIComponent(fileNameMatch[1])
    : fallbackFileName;
}
