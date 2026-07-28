import { uploadApi } from "@/lib/upload2-api";

type ResponseUpload = {
  message: string;
  file: {
    filename: string;
    originalname: string;
    path: string;
    size: number;
  };
};
export async function uploadSingleFile(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return uploadApi<ResponseUpload>("upload/single", {
    method: "POST",
    body: formData,
  }).json();
}
