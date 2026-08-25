import { axiosNestFinance } from "@/lib/axios-nest-finance";
import { paramsGetInstitutionalContracts } from "./contract.service";

export type ExportContratoBolsaResponse = {
  blob: Blob;
  fileName: string;
};

export async function exportContratoBolsaPdfService(
  params: paramsGetInstitutionalContracts,
): Promise<ExportContratoBolsaResponse> {
  const response = await axiosNestFinance.get<Blob>(
    "institutional-contract/export/pdf",
    {
      params,
      responseType: "blob",
    },
  );
  return {
    blob: response.data,
    fileName: getFileNameFromContentDisposition(
      response.headers["content-disposition"] as string | undefined,
      `contratos-credito-educacional-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`,
    ),
  };
}

export async function exportContratoBolsaExcelService(
  params: paramsGetInstitutionalContracts,
): Promise<ExportContratoBolsaResponse> {
  const response = await axiosNestFinance.get<Blob>(
    "institutional-contract/export/excel",
    {
      params,
      responseType: "blob",
    },
  );
  return {
    blob: response.data,
    fileName: getFileNameFromContentDisposition(
      response.headers["content-disposition"] as string | undefined,
      `contratos-credito-educacional-${new Date()
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
