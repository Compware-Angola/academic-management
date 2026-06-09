import { uploadApi } from "@/lib/upload-api";
import { axiosApexGa } from "@/lib/axios-apex-ga";

type ResponseUpload = {
  message: string;
  file: {
    filename: string;
    originalname: string;
    path: string;
    size: number;
  };
};

export async function uploadSingleFile(file: File): Promise<ResponseUpload> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await uploadApi.post<ResponseUpload>(
    "/upload/single",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}

export async function viewFile(fileName: string): Promise<Blob> {
  const response = await uploadApi.get<Blob>(`/upload/${fileName}`, {
    responseType: "blob",
  });

  return response.data;
}


export type FileDocType = "FAT" | "REC" | "NF" | "CTR" | "IM" | "DC" | string;
export type FileDocTypeS3 = "recibos" | "faturas" | "notafiscal" | "contratos" | "imagens" | "documentos" | "outros" | string;

type ResponseUploadTyped = {
  message: string;
  file: {
    filename: string;
    originalname: string;
    path: string;
    size: number;
  };
};

function generateRandomSuffix(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

export function buildTypedFileName(docType: FileDocType, originalFile: File): string {
  const ext = originalFile.name.includes(".")
    ? "." + originalFile.name.split(".").pop()
    : "";
  const random = generateRandomSuffix();
  return `${docType}_${random}${ext}`;
}

export async function uploadTypedFile(
  file: File,
  docType: FileDocType,
  filePath?: string,
): Promise<ResponseUploadTyped> {
  const generatedName = buildTypedFileName(docType, file);

  const response = await axiosApexGa.post<ResponseUploadTyped>(
    "/s3/files",
    file,
    {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-FILE-NAME": generatedName,
        ...(filePath && { "X-FILE-PATH": filePath }),
      },
    },
  );

  return response.data;
}
export async function getTypedFile(filePath: string, fileName: string): Promise<Blob> {
  const response = await axiosApexGa.get<Blob>("/s3/files", {
    responseType: "blob",
    headers: {
      "X-FILE-NAME": fileName,
      "X-FILE-PATH": filePath,
    },
  });

  return response.data;
}