import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";

import { BadgeStatus } from "@/pages/suporte/components/BadgeStatus";
import { FiltrosSolicitacoes } from "@/pages/suporte/components/FiltrosSolicitacoes";
import { ModalAnexos } from "@/pages/suporte/components/ModalAnexos";
import { ModalDetalhesSolicitacao } from "@/pages/suporte/components/ModalDetalhesSolicitacao";
import { Paginacao } from "@/pages/suporte/components/Paginacao";

import { useSolicitacoesSuporteLogic } from "@/pages/suporte/components/use-solicitacoes-suporte";
import { Eye, Paperclip, RotateCw } from "lucide-react";
type Props = {
    codigoMatricula: number;
    value?: string;
};
export function StudentMessages({ codigoMatricula, value = "student-messages" }: Props) {
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
        responderMutationIsPending,
    } = useSolicitacoesSuporteLogic(codigoMatricula);

    const solicitacoes = paginatedResponse?.data ?? [];
    const totalPages = paginatedResponse?.totalPages ?? 1;
    const total = paginatedResponse?.total ?? 0;

    return (
        <TabsContent value={value} className="space-y-6 min-w-0">
            <FiltrosSolicitacoes
                searchTerm={searchTerm}
                enableSearch={false}
                setSearchTerm={setSearchTerm}
                tipoSuporte={tipoSuporte}
                setTipoSuporte={setTipoSuporte}
                status={status}
                setStatus={setStatus}
                tiposSuporte={tiposSuporte}
                onFiltrar={handleFiltrar}
                onLimpar={handleLimpar}
            />
            {
                isLoadingList ? (
                    <div className="space-y-6 p-6">
                        <Skeleton className="h-[500px] w-full rounded-md" />
                    </div>
                ) : (
                    <>
                        {listError ? <div className="p-10 text-center text-destructive">
                            <p className="text-lg font-medium">Erro ao carregar as solicitações</p>
                            <Button className="text-sm mt-2" onClick={() => refetchSolicitacoes()}><RotateCw /> Tentar novamente</Button>
                        </div> : <>
                            <div className="w-full min-w-0 rounded-md">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tipo</TableHead>
                                                <TableHead>Assunto</TableHead>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Data</TableHead>
                                                <TableHead>Anexos</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {solicitacoes.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={10} className="h-32 text-center text-muted-foreground">
                                                        Nenhuma solicitação encontrada
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                solicitacoes.map((sol) => (
                                                    <TableRow key={sol.contactos_id} className="hover:bg-muted/50">
                                                        <TableCell className="max-w-[180px] truncate">{sol.descricao_tipo_suporte}</TableCell>
                                                        <TableCell className="max-w-[220px] truncate">{sol.assunto}</TableCell>
                                                        <TableCell>
                                                            <BadgeStatus status={sol.status_mensagem} />
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">{sol.data_mensagem}</TableCell>
                                                        <TableCell>
                                                            {sol.file_name1 || sol.file_name2 || sol.file_name3 ? (
                                                                <Button variant="ghost" size="sm" onClick={() => handleVerAnexos(sol)}>
                                                                    <Paperclip className="mr-1 h-4 w-4" />
                                                                    {[sol.file_name1, sol.file_name2, sol.file_name3].filter(Boolean).length}
                                                                </Button>
                                                            ) : (
                                                                <span className="text-muted-foreground">—</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button variant="ghost" size="sm" onClick={() => handleVerDetalhes(sol.contactos_id)}>
                                                                <Eye className="mr-1 h-4 w-4" />
                                                                Ver / Responder
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
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
                        </>}

                    </>
                )
            }
        </TabsContent>
    );
}