import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  invalidateSolicitacoesQueries,
  useResponderSolicitacao,
  useSolicitacaoDetail,
  useSolicitacoesSuporte,
} from "@/hooks/suporte/use-query-solicitacao-suporte";
import { useAllTiposSuporte } from "@/hooks/suporte/use-query-tipo-suporte";
import {
  useGetFileUrl,
  useUploadMultiple,
} from "@/hooks/upload/use-upload-single";
import { ResponderSolicitacaoPayload } from "@/services/suporte/solicitacao-suporte.service";
import { toast } from "sonner";
import { FileFolder } from "@/enums/file-folder";

const ITEMS_PER_PAGE = 10;
const MAX_FILES = 3;

export function useSolicitacoesSuporteLogic(enrollmentNumber?: number) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [tipoSuporte, setTipoSuporte] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [respostaTexto, setRespostaTexto] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileNames, setFileNames] = useState<{
    fileName1: string | null;
    fileName2: string | null;
    fileName3: string | null;
  }>({ fileName1: null, fileName2: null, fileName3: null });

  const [showAnexos, setShowAnexos] = useState(false);
  const [solicitacaoAnexos, setSolicitacaoAnexos] = useState<any>(null);

  const {
    data: paginatedResponse,
    isLoading: isLoadingList,
    isError: listError,
    refetch: refetchSolicitacoes,
  } = useSolicitacoesSuporte({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: enrollmentNumber ? undefined : debouncedSearchTerm.trim(),
    tipo_suporte: tipoSuporte,
    codigo_matricula: enrollmentNumber ? enrollmentNumber : undefined,
    status,
  });
  const { mutateAsync: getFileUrl, isPending: isLoadingDocumento } =
    useGetFileUrl();
  const { data: tiposSuporte = [] } = useAllTiposSuporte();

  const { data: solicitacaoDetail, isLoading: isLoadingDetail } =
    useSolicitacaoDetail(selectedId ?? undefined);

  const responderMutation = useResponderSolicitacao();
  const uploadMultipleMutation = useUploadMultiple();

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
    setSelectedFiles([]);
    setFileNames({ fileName1: null, fileName2: null, fileName3: null });
    setShowDetails(true);
  };

  const handleVerAnexos = (solicitacao: any) => {
    setSolicitacaoAnexos(solicitacao);
    setShowAnexos(true);
  };

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);

    if (selectedFiles.length + incoming.length > MAX_FILES) {
      toast.error(`Máximo de ${MAX_FILES} ficheiros por solicitação.`);
      return;
    }

    try {
      const response = await uploadMultipleMutation.mutateAsync({
        files: incoming,
        options: { folder: FileFolder.REPORTS },
      });

      // A API devolve o array direto (ver doc /upload-s3/multiple),
      // apesar do service tipar como { message, files }. Fazemos o cast
      // aqui em vez de mudar o service, como combinado.
      const uploadedFiles = response as unknown as {
        key: string;
        url: string;
      }[];

      setSelectedFiles((prev) => [...prev, ...incoming]);
      setFileNames((prev) => {
        const next = { ...prev };
        const slots: (keyof typeof next)[] = [
          "fileName1",
          "fileName2",
          "fileName3",
        ];
        let cursor = selectedFiles.length;
        for (const item of uploadedFiles) {
          if (cursor >= MAX_FILES) break;
          next[slots[cursor]] = item.key;
          cursor++;
        }
        return next;
      });
    } catch (err) {
      toast.error("Falha ao enviar os ficheiros.");
    }
  };

  const handleRemoveFile = (index: number) => {
    const slots: (keyof typeof fileNames)[] = [
      "fileName1",
      "fileName2",
      "fileName3",
    ];
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFileNames((prev) => {
      const next = { ...prev };
      const values = slots.map((s) => next[s]).filter((_, i) => i !== index);
      slots.forEach((s, i) => {
        next[s] = values[i] ?? null;
      });
      return next;
    });
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
        setSelectedFiles([]);
        setFileNames({ fileName1: null, fileName2: null, fileName3: null });
        setShowDetails(false);
        invalidateSolicitacoesQueries;
      },
      onError: () => {
        toast.error("Falha ao enviar resposta.");
      },
    });
  };

  const handleDownload = async (ficheiroName: string) => {
    const key = ficheiroName;

    if (!key) {
      toast.error("Nenhum documento encontrado.");
      return;
    }

    try {
      const { url } = await getFileUrl({ key, expiry: 3600 });
      window.open(url, "_blank");
    } catch (error) {
      console.error("Erro ao buscar documento:", error);
      toast("Erro ao buscar documento");
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
    selectedFiles,
    isUploading: uploadMultipleMutation.isPending,
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
    handleUploadFiles,
    handleRemoveFile,
    handleEnviarResposta,
    handleDownload,
    setShowAnexos,
    listError,
    fileNames,
    responderMutationIsPending: responderMutation.isPending,
  };
}
