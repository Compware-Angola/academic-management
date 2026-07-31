import { uploadApi } from "@/lib/upload-api";

// ---------- Types ----------

export type UploadedFile = {
  filename: string;
  originalname: string;
  path: string;
  size: number;
};

export type ResponseUpload = {
  key: string;
  url: string;
};

export type ResponseUploadMultiple = {
  message: string;
  files: UploadedFile[];
};

export type ResponseView = {
  url: string;
  expiresIn: number;
};

export type ResponseDelete = {
  message: string;
  key: string;
};

// ---------- Upload ----------

export async function uploadSingleFile(
  file: File,
  options?: { folder?: string; fileName?: string },
) {
  const formData = new FormData();
  formData.append("file", file);
  if (options?.folder) formData.append("folder", options.folder);
  if (options?.fileName) formData.append("fileName", options.fileName);

  const { data } = await uploadApi.post<ResponseUpload>(
    "upload-s3/single",
    formData,
  );

  return data;
}

export async function uploadMultipleFiles(
  files: File[],
  options?: { folder?: string },
) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  if (options?.folder) formData.append("folder", options.folder);

  const { data } = await uploadApi.post<ResponseUploadMultiple>(
    "upload-s3/multiple",
    formData,
  );

  return data;
}

// ---------- Visualização ----------

// Gera uma URL assinada temporária para o arquivo (a url retornada
// no upload NÃO é acessível diretamente, pois o bucket não é público).
export async function getFileUrl(key: string, expiry?: number) {
  const { data } = await uploadApi.get<ResponseView>("upload-s3/view", {
    params: { key, ...(expiry ? { expiry } : {}) },
  });

  return data;
}

// ---------- Delete ----------

export async function deleteFile(key: string) {
  const { data } = await uploadApi.delete<ResponseDelete>("upload-s3", {
    data: { key },
  });

  return data;
}
