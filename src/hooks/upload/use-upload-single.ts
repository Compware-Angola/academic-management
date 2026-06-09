import { getTypedFile, uploadSingleFile } from '@/services/upload/upload-single.service'
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
      console.log(data);

      setState({
        loading: false,
        error: null,
        result: {
          filename: data?.filename,
          path: data?.path,
          size: data?.size,
        },
        previewName: data?.filename,
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
type FetchState = {
  loading: boolean;
  error: string | null;
  url: string | null;
};

export function useTypedFile() {
  const [state, setState] = useState<FetchState>({
    loading: false,
    error: null,
    url: null,
  });

  async function fetchFile(filePath: string, fileName: string) {
    setState({ loading: true, error: null, url: null });
    try {
      const link = await getTypedFile(filePath, fileName); // ← já é string
      setState({ loading: false, error: null, url: link });
      return link;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erro ao buscar arquivo";
      setState({ loading: false, error: message, url: null });
      throw err;
    }
  }

  // release não precisa mais de revokeObjectURL — é um link S3, não blob
  function release() {
    setState({ loading: false, error: null, url: null });
  }

  return { ...state, fetchFile, release };
}