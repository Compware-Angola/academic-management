import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
    useResponderSolicitacao,
    useSolicitacaoDetail,
  useSolicitacoesSuporte,
} from "@/hooks/suporte/use-query-solicitacao-suporte";
import { useAllTiposSuporte } from "@/hooks/suporte/use-query-tipo-suporte";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { ResponderSolicitacaoPayload } from "@/services/suporte/solicitacao-suporte.service";
import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 10;

export function useSolicitacoesSuporteLogic(enrollmentNumber?: number) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const [tipoSuporte, setTipoSuporte] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [respostaTexto, setRespostaTexto] = useState("");
  const [files, setFiles] = useState<{
    file1: File | null;
    file2: File | null;
    file3: File | null;
  }>({ file1: null, file2: null, file3: null });
  const [fileNames, setFileNames] = useState<{
    fileName1: string | null;
    fileName2: string | null;
    fileName3: string | null;
  }>({ fileName1: null, fileName2: null, fileName3: null });
  const [uploading, setUploading] = useState<number[]>([]);

  const [showAnexos, setShowAnexos] = useState(false);
  const [solicitacaoAnexos, setSolicitacaoAnexos] = useState<any>(null);


  const { data: paginatedResponse, isLoading: isLoadingList, isError: listError, refetch: refetchSolicitacoes } =
    useSolicitacoesSuporte({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search:enrollmentNumber? undefined: debouncedSearchTerm.trim() ,
      tipo_suporte: tipoSuporte,
      codigo_matricula: enrollmentNumber? enrollmentNumber: undefined ,
      status,
    });

  const { data: tiposSuporte = [] } = useAllTiposSuporte();

  const { data: solicitacaoDetail, isLoading: isLoadingDetail } =
    useSolicitacaoDetail(selectedId ?? undefined);

  const responderMutation = useResponderSolicitacao();
  const uploadMutation = useUploadSingle();


  const handleFiltrar = () => setCurrentPage(1);
  const handleLimpar = () => {
    setSearchTerm("");
    setTipoSuporte(undefined);
    setStatus(undefined);
    setCurrentPage(1);
  };

  const handleVerDetalhes = (id: number) => {
    setSelectedId(id);
    setRespostaTexto("");
    setFiles({ file1: null, file2: null, file3: null });
    setFileNames({ fileName1: null, fileName2: null, fileName3: null });
    setUploading([]);
    setShowDetails(true);
  };

  const handleVerAnexos = (solicitacao: any) => {
    setSolicitacaoAnexos(solicitacao);
    setShowAnexos(true);
  };

  const handleUploadFile = async (slot: 1 | 2 | 3, selectedFile: File) => {
    setUploading((prev) => [...prev, slot]);
    try {
      const result = await uploadMutation.mutateAsync(selectedFile);
      const uploadedName = result.file?.filename;
      const nameKey = `fileName${slot}` as keyof typeof fileNames;
      setFileNames((prev) => ({ ...prev, [nameKey]: uploadedName }));
      const fileKey = `file${slot}` as keyof typeof files;
      setFiles((prev) => ({ ...prev, [fileKey]: selectedFile }));
    } catch (err) {
      toast.error("Falha ao enviar o arquivo.");
    } finally {
      setUploading((prev) => prev.filter((s) => s !== slot));
    }
  };

  const handleEnviarResposta = () => {
    if (!respostaTexto.trim() && !selectedId) {
      toast.error("Escreva uma resposta antes de enviar.");
      return;
    }

    const payload: ResponderSolicitacaoPayload = {
      descricao: respostaTexto.trim(),
      contactos_id: selectedId!,
      file_name1: fileNames.fileName1,
      file_name2: fileNames.fileName2,
      file_name3: fileNames.fileName3,
    };

    responderMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Resposta enviada com sucesso.");
        setRespostaTexto("");
        setFiles({ file1: null, file2: null, file3: null });
        setFileNames({ fileName1: null, fileName2: null, fileName3: null });
        setUploading([]);
        setShowDetails(false);
      },
      onError: (err: any) => {
        toast.error("Falha ao enviar resposta.");
      },
    });
  };

  const handleDownload = async (ficheiroName: string) => {
    if (!ficheiroName) return;
    try {
      const blob = await viewFile(ficheiroName);
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
      setTimeout(() => URL.revokeObjectURL(fileUrl), 10000);
    } catch (error) {
      toast.error(
          error instanceof ApiError ? error.message : "Erro ao abrir o ficheiro.",
      );
    }
  };

return {
 searchTerm,
    setSearchTerm,
    tipoSuporte,
    setTipoSuporte,
    status,
    setStatus,
    currentPage,
    setCurrentPage,
    paginatedResponse,
    tiposSuporte,
    selectedId,
    solicitacaoDetail,
    respostaTexto,
    setRespostaTexto,
    files,
    uploading,
    showAnexos,
    solicitacaoAnexos,
    isLoadingList,
    refetchSolicitacoes,
    isLoadingDetail,
    showDetails,
    setShowDetails,
    handleFiltrar,
    handleLimpar,
    handleVerDetalhes,
    handleVerAnexos,
    handleUploadFile,
    handleEnviarResposta,
    handleDownload,
    setFiles,
    setFileNames,
    setShowAnexos,
    listError,
    fileNames,
    responderMutationIsPending:responderMutation.isPending,
     }
}