import { axiosNestGa } from "@/lib/axios-nest-ga"

type ResponseUpload = {
  message: string;
  file: string;
};

export async function uploadSingleImage(file: string): Promise<ResponseUpload> {
  
  const response = await axiosNestGa.post<ResponseUpload>(
    "/solicitacoa/aviso/upload",
    {
        filename: file
    }
);

  return response.data;
}