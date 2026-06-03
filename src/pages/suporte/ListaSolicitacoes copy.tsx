// pages/suporte/solicitacoes.tsx
import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useSolicitacoesSuporte,
  useSolicitacaoDetail,
  useResponderSolicitacao,
} from "@/hooks/suporte/use-query-solicitacao-suporte";
import { useAllTiposSuporte } from "@/hooks/suporte/use-query-tipo-suporte";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";
import { ResponderSolicitacaoPayload } from "@/services/suporte/solicitacao-suporte.service";
import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";
import { useToast } from "@/hooks/use-toast";
import { FiltrosSolicitacoes } from "./components/FiltrosSolicitacoes";
import { TabelaSolicitacoes } from "./components/TabelaSolicitacoes";
import { BadgeStatus } from "./components/BadgeStatus";
import { Paginacao } from "./components/Paginacao";
import { ModalDetalhesSolicitacao } from "./components/ModalDetalhesSolicitacao";
import { ModalAnexos } from "./components/ModalAnexos";

const ITEMS_PER_PAGE = 10;

export default function ListaSolicitacoes() {
  const { toast } = useToast();


  const [searchTerm, setSearchTerm] = useState("");
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


  const { data: paginatedResponse, isLoading: isLoadingList, isError: listError } =
    useSolicitacoesSuporte({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      search: searchTerm.trim() || undefined,
      tipo_suporte: tipoSuporte,
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
      toast({
        title: "Erro",
        description: "Falha ao enviar o arquivo.",
        variant: "destructive",
      });
    } finally {
      setUploading((prev) => prev.filter((s) => s !== slot));
    }
  };

  const handleEnviarResposta = () => {
    if (!respostaTexto.trim() && !selectedId) {
      toast({
        title: "Erro",
        description: "Escreva uma resposta antes de enviar.",
        variant: "destructive",
      });
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
        toast({ title: "Sucesso", description: "Resposta enviada com sucesso." });
        setRespostaTexto("");
        setFiles({ file1: null, file2: null, file3: null });
        setFileNames({ fileName1: null, fileName2: null, fileName3: null });
        setUploading([]);
        setShowDetails(false);
      },
      onError: (err: any) => {
        toast({
          title: "Erro",
          description: err?.message || "Falha ao enviar resposta.",
          variant: "destructive",
        });
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
      toast({
        title: "Erro",
        description:
          error instanceof ApiError ? error.message : "Erro ao abrir o ficheiro.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingList) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[500px] w-full rounded-md" />
      </div>
    );
  }

  if (listError) {
    return (
      <div className="p-10 text-center text-destructive">
        <p className="text-lg font-medium">Erro ao carregar as solicitações</p>
        <p className="text-sm mt-2">{(listError as any)?.message || "Tente recarregar a página"}</p>
      </div>
    );
  }

  const solicitacoes = paginatedResponse?.data ?? [];
  const totalPages = paginatedResponse?.totalPages ?? 1;
  const total = paginatedResponse?.total ?? 0;

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Solicitações de Suporte</h1>
          <p className="text-muted-foreground">Gerencie e responda às solicitações dos estudantes</p>
        </div>
      </div>

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Solicitações</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <FiltrosSolicitacoes
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        tipoSuporte={tipoSuporte}
        setTipoSuporte={setTipoSuporte}
        status={status}
        setStatus={setStatus}
        tiposSuporte={tiposSuporte}
        onFiltrar={handleFiltrar}
        onLimpar={handleLimpar}
      />


      <TabelaSolicitacoes
        solicitacoes={solicitacoes}
        onVerDetalhes={handleVerDetalhes}
        onVerAnexos={handleVerAnexos}
        BadgeStatus={BadgeStatus}
      />


      <Paginacao
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        itemsCount={solicitacoes.length}
        onPageChange={setCurrentPage}
      />


      <ModalDetalhesSolicitacao
        open={showDetails}
        onOpenChange={setShowDetails}
        selectedId={selectedId}
        isLoadingDetail={isLoadingDetail}
        solicitacaoDetail={solicitacaoDetail}
        respostaTexto={respostaTexto}
        setRespostaTexto={setRespostaTexto}
        files={files}
        fileNames={fileNames}
        uploading={uploading}
        onUploadFile={handleUploadFile}
        onRemoveFile={(slot) => {
          const fileKey = `file${slot}` as keyof typeof files;
          const nameKey = `fileName${slot}` as keyof typeof fileNames;
          setFiles((prev) => ({ ...prev, [fileKey]: null }));
          setFileNames((prev) => ({ ...prev, [nameKey]: null }));
        }}
        onEnviarResposta={handleEnviarResposta}
        isPending={responderMutation.isPending}
        onDownload={handleDownload}
        BadgeStatus={BadgeStatus}
      />


      <ModalAnexos
        open={showAnexos}
        onOpenChange={setShowAnexos}
        solicitacao={solicitacaoAnexos}
        onDownload={handleDownload}
      />
    </div>
  );
}