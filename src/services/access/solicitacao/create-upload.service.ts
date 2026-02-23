import { axiosNestGa } from "@/lib/axios-nest-ga"

type ResponseUpload = {
  message: string;
  file: {
    filename: string;
    originalname: string;
    path: string;
    size: number;
  };
};

export async function uploadSingleImage(file: File): Promise<ResponseUpload> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosNestGa.post<ResponseUpload>(
    "/solicitacoa/aviso/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}