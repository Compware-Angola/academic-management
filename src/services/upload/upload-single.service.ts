import { uploadApi } from "@/lib/upload-api";

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
