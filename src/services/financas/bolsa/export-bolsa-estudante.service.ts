import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { FetchBolsaEstudanteParams } from "./fetch-bolsa-estudante.service";

export type ExportBolsaEstudanteResponse = {
  blob: Blob;
  fileName: string;
};

export async function exportBolsaEstudantePdfService(
  params: FetchBolsaEstudanteParams,
): Promise<ExportBolsaEstudanteResponse> {
  const response = await axiosNestFinance.get<Blob>(
    "credito-educacional/export/pdf",
    {
      params,
      responseType: "blob",
    },
  );

  return {
    blob: response.data,
    fileName: getFileNameFromContentDisposition(
      response.headers["content-disposition"] as string | undefined,
      `estudantes-credito-educacional-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`,
    ),
  };
}

export async function exportBolsaEstudanteExcelService(
  params: FetchBolsaEstudanteParams,
): Promise<ExportBolsaEstudanteResponse> {
  const response = await axiosNestFinance.get<Blob>(
    "credito-educacional/export/excel",
    {
      params,
      responseType: "blob",
    },
  );

  return {
    blob: response.data,
    fileName: getFileNameFromContentDisposition(
      response.headers["content-disposition"] as string | undefined,
      `estudantes-credito-educacional-${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`,
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
