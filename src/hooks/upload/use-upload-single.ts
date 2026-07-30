import {
  deleteFile,
  getFileUrl,
  uploadMultipleFiles,
  uploadSingleFile,
} from "@/services/upload/upload-single.service";
import { useMutation } from "@tanstack/react-query";

export function useUploadSingle() {
  return useMutation({
    mutationFn: ({
      file,
      options,
    }: {
      file: File;
      options?: { folder?: string; fileName?: string };
    }) => uploadSingleFile(file, options),
  });
}

export function useUploadMultiple() {
  return useMutation({
    mutationFn: ({
      files,
      options,
    }: {
      files: File[];
      options?: { folder?: string };
    }) => uploadMultipleFiles(files, options),
  });
}

// GET sob demanda (ex: ao abrir um modal de preview) -> useMutation
// em vez de useQuery, já que precisa do "key" no momento do clique.
export function useGetFileUrl() {
  return useMutation({
    mutationFn: ({ key, expiry }: { key: string; expiry?: number }) =>
      getFileUrl(key, expiry),
  });
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: deleteFile,
  });
}
