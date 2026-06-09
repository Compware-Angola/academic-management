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

type FetchState = {
  loading: boolean;
  error: string | null;
  url: string | null;  // object URL para exibir/baixar
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
      const blob = await getTypedFile(filePath, fileName);
      const objectUrl = URL.createObjectURL(blob);
      setState({ loading: false, error: null, url: objectUrl });
      return objectUrl;
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erro ao buscar arquivo";
      setState({ loading: false, error: message, url: null });
      throw err;
    }
  }

  // limpa o object URL da memória quando não precisar mais
  function release() {
    if (state.url) URL.revokeObjectURL(state.url);
    setState({ loading: false, error: null, url: null });
  }

  return { ...state, fetchFile, release };
}