// pages/suporte/solicitacoes.tsx
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Paperclip,
  X,
  Image as ImageIcon,
  Download,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Hooks
import {
  useSolicitacoesSuporte,
  useSolicitacaoDetail,
  useResponderSolicitacao,
} from "@/hooks/suporte/use-query-solicitacao-suporte";
import { useAllTiposSuporte } from "@/hooks/suporte/use-query-tipo-suporte";
import { useUploadSingle } from "@/hooks/upload/use-upload-single";

import { ResponderSolicitacaoPayload, SolicitacaoSuporte } from "@/services/suporte/solicitacao-suporte.service";
import { ApiError } from "@/error";
import { viewFile } from "@/services/upload/upload-single.service";

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
  const [showAnexos, setShowAnexos] = useState(false);
  const [solicitacaoAnexos, setSolicitacaoAnexos] = useState<SolicitacaoSuporte | null>(null);

  // Estados para upload separado
  const [files, setFiles] = useState<{
    file1: File | null;
    file2: File | null;
    file3: File | null;
  }>({
    file1: null,
    file2: null,
    file3: null,
  });

  const [fileNames, setFileNames] = useState<{
    fileName1: string | null;
    fileName2: string | null;
    fileName3: string | null;
  }>({
    fileName1: null,
    fileName2: null,
    fileName3: null,
  });

  const [uploading, setUploading] = useState<number[]>([]); // slots em upload: 1,2,3

  // Hooks
  const {
    data: paginatedResponse,
    isLoading: isLoadingList,
    isError: listError,
  } = useSolicitacoesSuporte({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    search: searchTerm.trim() || undefined,
    tipo_suporte: tipoSuporte,
    status,
  });

  const { data: tiposSuporte = [] } = useAllTiposSuporte();

  const {
    data: solicitacaoDetail,
    isLoading: isLoadingDetail,
  } = useSolicitacaoDetail(selectedId ?? undefined);

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

  const handleVerAnexos = (solicitacao: SolicitacaoSuporte) => {
    setSolicitacaoAnexos(solicitacao);
    setShowAnexos(true);
  };

  const handleUploadFile = async (slot: 1 | 2 | 3, selectedFile: File) => {
    setUploading((prev) => [...prev, slot]);

    try {
      const result = await uploadMutation.mutateAsync(selectedFile);
      const uploadedName = result.file?.filename

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
    if (!respostaTexto.trim() || !selectedId) {
      toast({
        title: "Erro",
        description: "Escreva uma resposta antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    const payload: ResponderSolicitacaoPayload = {
      descricao: respostaTexto.trim(),
      contactos_id: selectedId,
      file_name1: fileNames.fileName1,
      file_name2: fileNames.fileName2,
      file_name3: fileNames.fileName3,
    };

    responderMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Sucesso",
          description: "Resposta enviada com sucesso.",
        });
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
          error instanceof ApiError
            ? error.message
            : "Erro ao abrir o ficheiro.",
        variant: "destructive",
      });
    }
  };

  const getEstadoBadge = (status: any) => {
    const config: Record<number, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      0: { label: "Pendente", variant: "outline" },
      1: { label: "Respondido", variant: "default" },
    };
    const cfg = config[status] || { label: `Status ${status}`, variant: "secondary" };
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
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

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">

            {/* Linha 1: Pesquisa ocupa mais espaço */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-sm font-medium text-muted-foreground">Pesquisa</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Estudante, BI, assunto, mensagem..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-9"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        setCurrentPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Tipo de Serviço</label>
                <Select
                  value={tipoSuporte?.toString() ?? "all"}
                  onValueChange={(v) => {
                    setTipoSuporte(v === "all" ? undefined : Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {tiposSuporte.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.descricao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Select
                  value={status ?? "all"}
                  onValueChange={(v) => {
                    setStatus(v === "all" ? undefined : v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os estados" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="a responder">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-yellow-500 inline-block" />
                        A Responder
                      </div>
                    </SelectItem>
                    <SelectItem value="aguarda resposta">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                        Aguarda Resposta
                      </div>
                    </SelectItem>
                    <SelectItem value="respondido">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                        Respondido
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Linha 2: Acções + resumo de filtros activos */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Badges dos filtros activos */}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    Pesquisa: "{searchTerm}"
                    <button onClick={() => { setSearchTerm(""); setCurrentPage(1); }}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                )}
                {tipoSuporte !== undefined && (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    Tipo: {tiposSuporte.find(t => t.id === tipoSuporte)?.descricao}
                    <button onClick={() => { setTipoSuporte(undefined); setCurrentPage(1); }}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                )}
                {status && (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    Estado: {status}
                    <button onClick={() => { setStatus(undefined); setCurrentPage(1); }}>
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" onClick={handleLimpar} size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Limpar
                </Button>
                <Button onClick={handleFiltrar} size="sm">
                  <Search className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Estudante</TableHead>
              <TableHead>Bilhete de Identidade</TableHead>
              <TableHead>Matricula</TableHead>
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
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhuma solicitação encontrada
                </TableCell>
              </TableRow>
            ) : (
              solicitacoes.map((sol) => (
                <TableRow key={sol.contactos_id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{sol.contactos_id}</TableCell>
                  <TableCell>{sol.estudante}</TableCell>
                  <TableCell>{sol.bilhete_identidade}</TableCell>
                  <TableCell>{sol.codigo_matricula}</TableCell>
                  <TableCell className="max-w-[180px] truncate">{sol.descricao_tipo_suporte}</TableCell>
                  <TableCell className="max-w-[220px] truncate">{sol.assunto}</TableCell>
                  <TableCell>{getEstadoBadge(sol.status_mensagem)}</TableCell>
                  <TableCell className="whitespace-nowrap">{sol.data_mensagem}</TableCell>
                  <TableCell>
                    {sol.file_name1 || sol.file_name2 || sol.file_name3 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerAnexos(sol)}
                      >
                        <Paperclip className="mr-1 h-4 w-4" />
                        {[sol.file_name1, sol.file_name2, sol.file_name3].filter(Boolean).length}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerDetalhes(sol.contactos_id)}
                    >
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

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Mostrando {solicitacoes.length} de {total} • Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Próxima <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Detalhes - restaurado completamente como estava */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl! max-h-[90vh]! overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solicitação #{selectedId}</DialogTitle>
          </DialogHeader>

          {isLoadingDetail ? (
            <div className="py-10 text-center">Carregando detalhes...</div>
          ) : solicitacaoDetail ? (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Estudante</p>
                  <p className="font-medium">{solicitacaoDetail.estudante}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Utilizador</p>
                  <p className="font-medium">{solicitacaoDetail.utilizador}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tipo</p>
                  <p className="font-medium">{solicitacaoDetail.descricao_tipo_suporte}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  {getEstadoBadge(solicitacaoDetail.status_mensagem)}
                </div>
                <div>
                  <p className="text-muted-foreground">Data Mensagem</p>
                  <p className="font-medium">{solicitacaoDetail.data_mensagem}</p>
                </div>
                {solicitacaoDetail.data_resposta && (
                  <div>
                    <p className="text-muted-foreground">Data Resposta</p>
                    <p className="font-medium">{solicitacaoDetail.data_resposta}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Assunto</p>
                <p className="mt-1 font-medium">{solicitacaoDetail.assunto}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap text-sm">{solicitacaoDetail.mensagem}</p>
                </div>
              </div>

              {solicitacaoDetail.respostas && solicitacaoDetail.respostas.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">
                    Respostas ({solicitacaoDetail.respostas.length})
                  </p>

                  <div
                    className={`
                      space-y-3 
                      ${solicitacaoDetail.respostas.length > 4
                        ? 'max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/50'
                        : ''}
                    `}
                  >
                    {solicitacaoDetail.respostas.map((resposta) => (
                      <div
                        key={resposta.resposta_id}
                        className="p-3 bg-muted rounded-md border border-border/50"
                      >
                        <p className="whitespace-pre-wrap text-sm">
                          {resposta.mensagem_resposta}
                        </p>

                        <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground italic">
                          <span>
                            Respondido por: {resposta.nome_usuario_resposta}
                          </span>
                          {resposta.data_resposta && (
                            <span>
                              Em: {resposta.data_resposta}
                            </span>
                          )}
                        </div>

                        {(resposta.file_name1 || resposta.file_name2 || resposta.file_name3) && (
                          <div className="mt-3 text-xs">
                            <p className="font-medium text-muted-foreground mb-1">Anexos:</p>
                            <div className="flex flex-col gap-2">
                              {resposta.file_name1 && (
                                <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                                  <span className="text-blue-600 truncate max-w-[220px]">
                                    {resposta.file_name1}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(resposta.file_name1!)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}

                              {resposta.file_name2 && (
                                <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                                  <span className="text-blue-600 truncate max-w-[220px]">
                                    {resposta.file_name2}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(resposta.file_name2!)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}

                              {resposta.file_name3 && (
                                <div className="flex items-center justify-between bg-muted/50 p-2 rounded border">
                                  <span className="text-blue-600 truncate max-w-[220px]">
                                    {resposta.file_name3}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownload(resposta.file_name3!)}
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                solicitacaoDetail.mensagem_resposta && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resposta</p>
                    <div className="mt-1 p-3 bg-muted rounded-md">
                      <p className="whitespace-pre-wrap text-sm">{solicitacaoDetail.mensagem_resposta}</p>
                      {solicitacaoDetail.nome_usuario_resposta && (
                        <p className="mt-2 text-xs text-muted-foreground italic">
                          Respondido por: {solicitacaoDetail.nome_usuario_resposta}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* Área para nova resposta - com upload separado */}
              <div className="pt-6 border-t">
                <label className="block text-sm font-medium mb-2">Sua Resposta</label>

                {solicitacaoDetail?.status_mensagem === "respondido" ? (
                  <div className="space-y-3">
                    <Textarea
                      value={respostaTexto}
                      onChange={(e) => setRespostaTexto(e.target.value)}
                      placeholder="Esta solicitação já foi respondida."
                      rows={5}
                      className="resize-none bg-muted/50 cursor-not-allowed"
                      disabled
                    />
                    <p className="text-sm text-muted-foreground italic">
                      Esta solicitação já está marcada como respondida. Não é possível adicionar novas respostas.
                    </p>
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={respostaTexto}
                      onChange={(e) => setRespostaTexto(e.target.value)}
                      placeholder="Digite a resposta para o estudante..."
                      rows={5}
                      className="resize-none mb-4"
                    />

                    {/* Upload separado */}
                    <div className="space-y-3 mb-6">
                      <label className="block text-sm font-medium text-muted-foreground">
                        Anexos (máx. 3 arquivos)
                      </label>

                      {[1, 2, 3].map((n) => {
                        const slot = n as 1 | 2 | 3;
                        const fileKey = `file${slot}` as keyof typeof files;
                        const nameKey = `fileName${slot}` as keyof typeof fileNames;
                        const isUploading = uploading.includes(slot);

                        return (
                          <div key={n} className="flex items-center gap-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex-1 justify-start truncate max-w-[280px]"
                              disabled={isUploading || !!fileNames[nameKey]}
                              asChild
                            >
                              <label className="cursor-pointer flex items-center gap-2">
                                <Upload className="h-4 w-4" />
                                <span className="truncate">
                                  {fileNames[nameKey]
                                    ? fileNames[nameKey]
                                    : files[fileKey]
                                      ? files[fileKey]!.name
                                      : `Escolher arquivo ${n}`}
                                </span>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.zip"
                                  onChange={(e) => {
                                    const selectedFile = e.target.files?.[0];
                                    if (selectedFile) {
                                      handleUploadFile(slot, selectedFile);
                                    }
                                  }}
                                />
                              </label>
                            </Button>

                            {isUploading && (
                              <span className="text-xs text-muted-foreground animate-pulse">
                                Enviando...
                              </span>
                            )}

                            {fileNames[nameKey] && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                onClick={() => {
                                  setFiles((prev) => ({ ...prev, [fileKey]: null }));
                                  setFileNames((prev) => ({ ...prev, [nameKey]: null }));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex justify-end gap-3">
                      <Button variant="outline" onClick={() => {
                        setShowDetails(false);
                        setRespostaTexto('');
                        setFiles({ file1: null, file2: null, file3: null });
                        setFileNames({ fileName1: null, fileName2: null, fileName3: null });
                        setUploading([]);
                      }}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleEnviarResposta}
                        disabled={
                          responderMutation.isPending ||
                          (!respostaTexto.trim() &&
                            !fileNames.fileName1 && !fileNames.fileName2 && !fileNames.fileName3)
                        }
                      >
                        {responderMutation.isPending ? "Enviando..." : "Enviar Resposta"}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Não foi possível carregar os detalhes da solicitação.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Anexos */}
      <Dialog open={showAnexos} onOpenChange={setShowAnexos}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Anexos da Solicitação #{solicitacaoAnexos?.contactos_id || '—'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {solicitacaoAnexos &&
              [1, 2, 3].map((n) => {
                const key = `file_name${n}` as keyof typeof solicitacaoAnexos;
                const nomeArquivo = solicitacaoAnexos[key];

                if (!nomeArquivo) return null;

                return (
                  <div
                    key={n}
                    className="flex items-center justify-between gap-3 p-3 border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <ImageIcon className="h-5 w-5 text-primary shrink-0" />
                      <p className="text-sm font-medium truncate">
                        {nomeArquivo as string}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(nomeArquivo as string)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}

            {solicitacaoAnexos &&
              ![solicitacaoAnexos.file_name1, solicitacaoAnexos.file_name2, solicitacaoAnexos.file_name3].some(Boolean) && (
                <p className="text-center text-muted-foreground py-6">
                  Nenhum anexo encontrado
                </p>
              )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}