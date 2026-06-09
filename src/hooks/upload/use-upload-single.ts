import { uploadSingleFile } from '@/services/upload/upload-single.service'
import { useMutation } from '@tanstack/react-query'
import { useState } from "react";
import {
  uploadTypedFile,
  buildTypedFileName,
  FileDocType,
} from "@/services/upload/upload-single.service";

export function useUploadSingle() {
  return useMutation({
    mutationFn: uploadSingleFile,
  })
}


type UploadState = {
  loading: boolean;
  error: string | null;
  result: { filename: string; path: string; size: number } | null;
  previewName: string | null;
};

export function useTypedUpload() {
  const [state, setState] = useState<UploadState>({
    loading: false,
    error: null,
    result: null,
    previewName: null,
  });

  function previewFileName(file: File, docType: FileDocType) {
    const name = buildTypedFileName(docType, file);
    setState((s) => ({ ...s, previewName: name }));
  }

  async function upload(file: File, docType: FileDocType, filePath?: string) {
    setState({ loading: true, error: null, result: null, previewName: null });
    try {
      const data = await uploadTypedFile(file, docType, filePath);
      setState({
        loading: false,
        error: null,
        result: data.file,
        previewName: data.file.filename,
      });
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erro ao fazer upload";
      setState({ loading: false, error: message, result: null, previewName: null });
      throw err;
    }
  }

  function reset() {
    setState({ loading: false, error: null, result: null, previewName: null });
  }

  return { ...state, upload, previewFileName, reset };
}