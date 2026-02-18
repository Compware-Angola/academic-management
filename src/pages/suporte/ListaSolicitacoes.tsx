// pages/suporte/solicitacoes.tsx
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
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
  DialogFooter,
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

// Hooks corrigidos (ajusta o caminho conforme tua pasta real)
import {
  useSolicitacoesSuporte,
  useSolicitacaoDetail,
  useResponderSolicitacao,

} from "@/hooks/suporte/use-query-solicitacao-suporte";

import { useAllTiposSuporte } from "@/hooks/suporte/use-query-tipo-suporte";
import { FilterSolicitacoesParams, ResponderSolicitacaoPayload, SolicitacaoSuporte } from "@/services/suporte/solicitacao-suporte.service";

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

  // Filtros condicionais
  const filterParams: FilterSolicitacoesParams = {
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  };

  if (searchTerm.trim()) filterParams.search = searchTerm.trim();
  if (tipoSuporte !== undefined) filterParams.tipo_suporte = tipoSuporte;
  if (status !== undefined) filterParams.status = status;

  const {
    data: paginatedResponse,
    isLoading: isLoadingList,
    isError: listError,
  } = useSolicitacoesSuporte(filterParams);

  const { data: tiposSuporte = [] } = useAllTiposSuporte();

  const {
    data: solicitacaoDetail,
    isLoading: isLoadingDetail,
  } = useSolicitacaoDetail(selectedId ?? undefined);

  const responderMutation = useResponderSolicitacao();

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
    setShowDetails(true);
  };

  const handleVerAnexos = (id: number) => {
    setSelectedId(id);
    setShowAnexos(true);
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
    };

    responderMutation.mutate(payload, {
      onSuccess: () => {
        toast({
          title: "Sucesso",
          description: "Resposta enviada com sucesso.",
        });
        setRespostaTexto("");
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

  const getEstadoBadge = (status: number) => {
    const config: Record<number, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      0: { label: "Pendente", variant: "outline" },
      1: { label: "Respondido", variant: "default" },
      // acrescente outros estados que existam
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
        <p className="text-sm mt-2">{(listError as  any)?.message || "Tente recarregar a página"}</p>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisa</label>
              <div className="relative">
                <Input
                  placeholder="Estudante, assunto, mensagem..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pr-10"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Serviço</label>
              <Select
                value={tipoSuporte?.toString() ?? "all"}
                onValueChange={(v) => {
                  setTipoSuporte(v === "all" ? undefined : Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
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
    <SelectItem value="a responder">A Responder</SelectItem>
    <SelectItem value="aguarda resposta">Aguarda Resposta</SelectItem>
    <SelectItem value="respondido">Respondido</SelectItem>
  </SelectContent>
</Select>
            </div>

            <div className="flex items-end gap-2 md:col-span-2">
              <Button onClick={handleFiltrar} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
              <Button variant="outline" onClick={handleLimpar} className="flex-1">
                <X className="mr-2 h-4 w-4" />
                Limpar
              </Button>
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
                  <TableCell className="max-w-[180px] truncate">{sol.descricao_tipo_suporte}</TableCell>
                  <TableCell className="max-w-[220px] truncate">{sol.assunto}</TableCell>
                  <TableCell>{getEstadoBadge(sol.status_mensagem)}</TableCell>
                  <TableCell className="whitespace-nowrap">{sol.data_mensagem}</TableCell>
                  <TableCell>
                    {sol.file_name1 || sol.file_name2 || sol.file_name3 ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerAnexos(sol.contactos_id)}
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

      {/* Modal de Detalhes */}
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

              {solicitacaoDetail.mensagem_resposta && (
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
              )}

              {/* Área para nova resposta */}
              <div className="pt-6 border-t">
                <label className="block text-sm font-medium mb-2">Sua Resposta</label>
                <Textarea
                  value={respostaTexto}
                  onChange={(e) => setRespostaTexto(e.target.value)}
                  placeholder="Digite a resposta para o estudante..."
                  rows={5}
                  className="resize-none"
                />
                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowDetails(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleEnviarResposta}
                    disabled={responderMutation.isPending || !respostaTexto.trim()}
                  >
                    {responderMutation.isPending ? "Enviando..." : "Enviar Resposta"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Não foi possível carregar os detalhes da solicitação.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Anexos */}
      <Dialog open={showAnexos} onOpenChange={setShowAnexos}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Anexos da Solicitação #{selectedId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {solicitacaoDetail &&
              [1, 2, 3].map((n) => {
                const key = `file_name${n}` as keyof SolicitacaoSuporte;
                const nome = solicitacaoDetail[key];
                if (!nome) return null;
                return (
                  <div key={n} className="flex items-center gap-3 p-3 border rounded-md">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{nome as string}</p>
                    </div>
                    <Button variant="outline" size="sm">Descarregar</Button>
                  </div>
                );
              })}
            {![solicitacaoDetail?.file_name1, solicitacaoDetail?.file_name2, solicitacaoDetail?.file_name3].some(Boolean) && (
              <p className="text-center text-muted-foreground py-6">Nenhum anexo encontrado</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}