// pages/suporte/solicitacoes.tsx
import {
  useSolicitacoesSuporte,
  useSolicitacaoDetail,
  useResponderSolicitacao,
} from "@/hooks/suporte/use-query-solicitacao-suporte";
import { useAllTiposSuporte } from "@/hooks/suporte/use-query-tipo-suporte";
import { Skeleton } from "@/components/ui/skeleton";
import { FiltrosSolicitacoes } from "./components/FiltrosSolicitacoes";
import { TabelaSolicitacoes } from "./components/TabelaSolicitacoes";
import { BadgeStatus } from "./components/BadgeStatus";
import { Paginacao } from "./components/Paginacao";
import { ModalDetalhesSolicitacao } from "./components/ModalDetalhesSolicitacao";
import { ModalAnexos } from "./components/ModalAnexos";
import { SolicitacoesSuporteHeader } from "./components/SolicitacoesSuporteHeader";
import { RotateCw } from "lucide-react";
import { useSolicitacoesSuporteLogic } from "./components/use-solicitacoes-suporte";
import { Button } from "@/components/ui/button";

export default function ListaSolicitacoes() {
  const {
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
    isUploading,
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
    responderMutationIsPending,
  } = useSolicitacoesSuporteLogic();

  const solicitacoes = paginatedResponse?.data ?? [];
  const totalPages = paginatedResponse?.totalPages ?? 1;
  const total = paginatedResponse?.total ?? 0;

  return (
    <div className="container mx-auto space-y-6 py-6">
      <SolicitacoesSuporteHeader />
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
      {isLoadingList ? (
        <div className="space-y-6 p-6">
          <Skeleton className="h-[500px] w-full rounded-md" />
        </div>
      ) : (
        <>
          {listError ? (
            <div className="p-10 text-center text-destructive">
              <p className="text-lg font-medium">
                Erro ao carregar as solicitações
              </p>
              <Button
                className="text-sm mt-2"
                onClick={() => refetchSolicitacoes()}
              >
                <RotateCw /> Tentar novamente
              </Button>
            </div>
          ) : (
            <>
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
                selectedFiles={selectedFiles}
                fileNames={fileNames}
                isUploading={isUploading}
                onUploadFiles={handleUploadFiles}
                onRemoveFile={handleRemoveFile}
                onEnviarResposta={handleEnviarResposta}
                isPending={responderMutationIsPending}
                onDownload={handleDownload}
                BadgeStatus={BadgeStatus}
              />
              <ModalAnexos
                open={showAnexos}
                onOpenChange={setShowAnexos}
                solicitacao={solicitacaoAnexos}
                onDownload={handleDownload}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
