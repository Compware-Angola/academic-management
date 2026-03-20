// pages/notificacoes.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type TipoNotificacao =
  | "mensagem"
  | "matricula"
  | "documento"
  | "relatorio"
  | "sistema";

interface Notificacao {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: TipoNotificacao;
  lida: boolean;
  data: string; // ISO string
  entidade?: string; // ex: nome do aluno, nome do doc
}

// ─── Mock — substituir pelo teu hook/query real ───────────────────────────────
const mockNotificacoes: Notificacao[] = [
  {
    id: 1,
    titulo: "Nova mensagem recebida",
    mensagem: "O aluno João Manuel Silva enviou uma mensagem sobre a sua matrícula pendente.",
    tipo: "mensagem",
    lida: false,
    data: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    entidade: "João Manuel Silva",
  },
  {
    id: 2,
    titulo: "Matrícula aprovada",
    mensagem: "A matrícula da estudante Ana Costa foi aprovada com sucesso para o curso de Engenharia Informática.",
    tipo: "matricula",
    lida: false,
    data: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    entidade: "Ana Costa",
  },
  {
    id: 3,
    titulo: "Documento pendente de revisão",
    mensagem: "Existe 1 documento à espera de revisão por parte do secretariado académico.",
    tipo: "documento",
    lida: false,
    data: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    titulo: "Relatório mensal gerado",
    mensagem: "O relatório de matrículas do mês de Março foi gerado e está disponível para download.",
    tipo: "relatorio",
    lida: true,
    data: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    titulo: "Atualização do sistema",
    mensagem: "O sistema foi atualizado para a versão 2.4.1. Consulte as notas de versão para detalhes.",
    tipo: "sistema",
    lida: true,
    data: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 6,
    titulo: "Nova mensagem recebida",
    mensagem: "O candidato Pedro Lopes enviou documentação adicional para análise.",
    tipo: "mensagem",
    lida: false,
    data: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    entidade: "Pedro Lopes",
  },
  {
    id: 7,
    titulo: "Matrícula rejeitada",
    mensagem: "A matrícula do estudante Carlos Ferreira foi rejeitada por falta de documentação.",
    tipo: "matricula",
    lida: true,
    data: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    entidade: "Carlos Ferreira",
  },
  {
    id: 8,
    titulo: "Documento aprovado",
    mensagem: "O certificado de habilitações do candidato Mário Santos foi validado com sucesso.",
    tipo: "documento",
    lida: true,
    data: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    entidade: "Mário Santos",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const TIPO_CONFIG: Record<
  TipoNotificacao,
  { label: string; badgeClass: string; dotClass: string }
> = {
  mensagem: {
    label: "Mensagem",
    badgeClass: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  matricula: {
    label: "Matrícula",
    badgeClass: "bg-green-500/10 text-green-600 border-green-500/20",
    dotClass: "bg-green-500",
  },
  documento: {
    label: "Documento",
    badgeClass: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    dotClass: "bg-yellow-500",
  },
  relatorio: {
    label: "Relatório",
    badgeClass: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  sistema: {
    label: "Sistema",
    badgeClass: "bg-muted text-muted-foreground border-border",
    dotClass: "bg-muted-foreground",
  },
};

function formatarData(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora mesmo";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "ontem";
  if (d < 7) return `há ${d} dias`;
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50];

export default function NotificacoesPage() {
  const [notificacoes, setNotificacoes] =
    useState<Notificacao[]>(mockNotificacoes);
  const [isLoading] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroLida, setFiltroLida] = useState<string>("todas");

  // Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ─── Lógica de filtros ──────────────────────────────────────────────────
  const filtradas = notificacoes.filter((n) => {
    const matchSearch =
      !search ||
      n.titulo.toLowerCase().includes(search.toLowerCase()) ||
      n.mensagem.toLowerCase().includes(search.toLowerCase()) ||
      (n.entidade?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchTipo = filtroTipo === "todos" || n.tipo === filtroTipo;
    const matchLida =
      filtroLida === "todas" ||
      (filtroLida === "nao_lidas" && !n.lida) ||
      (filtroLida === "lidas" && n.lida);
    return matchSearch && matchTipo && matchLida;
  });

  const total = filtradas.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const offset = (page - 1) * limit;
  const paginadas = filtradas.slice(offset, offset + limit);

  const naoLidasCount = notificacoes.filter((n) => !n.lida).length;

  // ─── Modal de detalhe ───────────────────────────────────────────────────
  const [detalheModal, setDetalheModal] = useState<{
    open: boolean;
    notif: Notificacao | null;
  }>({ open: false, notif: null });

  const abrirDetalhe = (notif: Notificacao) => {
    if (!notif.lida) {
      setNotificacoes((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, lida: true } : n))
      );
    }
    setDetalheModal({ open: true, notif: { ...notif, lida: true } });
  };

  // ─── Acções ─────────────────────────────────────────────────────────────
  const marcarComoLida = (id: number) =>
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    );

  const marcarTodasComoLidas = () =>
    setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));

  const eliminar = (id: number) =>
    setNotificacoes((prev) => prev.filter((n) => n.id !== id));

  const limparFiltros = () => {
    setSearch("");
    setFiltroTipo("todos");
    setFiltroLida("todas");
    setPage(1);
  };

  const handleLimitChange = (value: string) => {
    setLimit(Number(value));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Notificações</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
           
          </div>
          <p className="text-muted-foreground mt-1">
            Todas as notificações e alertas do sistema
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {}} // refetch real aqui
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
          {naoLidasCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={marcarTodasComoLidas}
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pesquisa */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Pesquisar</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Título, mensagem ou entidade..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={filtroTipo}
              onValueChange={(v) => {
                setFiltroTipo(v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="mensagem">Mensagem</SelectItem>
                <SelectItem value="matricula">Matrícula</SelectItem>
                <SelectItem value="documento">Documento</SelectItem>
                <SelectItem value="relatorio">Relatório</SelectItem>
                <SelectItem value="sistema">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Estado</label>
            <Select
              value={filtroLida}
              onValueChange={(v) => {
                setFiltroLida(v);
                setPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="nao_lidas">Não lidas</SelectItem>
                <SelectItem value="lidas">Lidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Lista */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : paginadas.length === 0 ? (
        <div className="text-center py-16 bg-card border rounded-lg">
          <BellOff className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium mb-1">
            Nenhuma notificação encontrada
          </p>
          <p className="text-sm text-muted-foreground">
            Tente ajustar os filtros ou aguarde por novas notificações
          </p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden divide-y">
            {paginadas.map((notif) => {
              const cfg = TIPO_CONFIG[notif.tipo];
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40 cursor-pointer ${
                    !notif.lida ? "bg-primary/[0.03]" : ""
                  }`}
                  onClick={() => abrirDetalhe(notif)}
                >
                  {/* Indicador de não lido */}
                  <div className="mt-1.5 shrink-0">
                    {!notif.lida ? (
                      <span
                        className={`block h-2.5 w-2.5 rounded-full ${cfg.dotClass}`}
                      />
                    ) : (
                      <span className="block h-2.5 w-2.5 rounded-full bg-transparent border border-muted-foreground/30" />
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span
                        className={`font-semibold text-sm ${
                          !notif.lida
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {notif.titulo}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 ${cfg.badgeClass}`}
                      >
                        {cfg.label}
                      </Badge>
                      {notif.entidade && (
                        <span className="text-xs text-muted-foreground">
                          · {notif.entidade}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                      {notif.mensagem}
                    </p>
                    <span className="text-xs text-muted-foreground/70 mt-1 block">
                      {formatarData(notif.data)}
                    </span>
                  </div>

                  {/* Acções */}
                  <div className="flex items-center gap-1 shrink-0 mt-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Ver detalhes"
                      onClick={(e) => { e.stopPropagation(); abrirDetalhe(notif); }}
                    >
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    {!notif.lida && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Marcar como lida"
                        onClick={(e) => { e.stopPropagation(); marcarComoLida(notif.id); }}
                      >
                        <Check className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      title="Eliminar notificação"
                      onClick={(e) => { e.stopPropagation(); eliminar(notif.id); }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm">Itens por página:</label>
              <Select
                value={limit.toString()}
                onValueChange={handleLimitChange}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_PER_PAGE_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o.toString()}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Mostrando {offset + 1} a {Math.min(offset + limit, total)} de{" "}
                {total} registos
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ── Modal de Detalhe da Notificação ─────────────────────────────── */}
      <Dialog
        open={detalheModal.open}
        onOpenChange={(open) => setDetalheModal({ open, notif: null })}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-6">
              <Bell className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="leading-snug">{detalheModal.notif?.titulo}</span>
            </DialogTitle>
          </DialogHeader>

          {detalheModal.notif && (() => {
            const cfg = TIPO_CONFIG[detalheModal.notif.tipo];
            const n = detalheModal.notif;
            return (
              <div className="space-y-5 py-1">
                {/* Badges de meta */}
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs ${cfg.badgeClass}`}
                  >
                    <Tag className="h-3 w-3" />
                    {cfg.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs"
                  >
                    <Clock className="h-3 w-3" />
                    {formatarData(n.data)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs ${
                      n.lida
                        ? "bg-muted text-muted-foreground"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                    {n.lida ? "Lida" : "Não lida"}
                  </Badge>
                </div>

                {/* Entidade relacionada */}
                {n.entidade && (
                  <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Entidade relacionada</p>
                      <p className="text-sm font-medium">{n.entidade}</p>
                    </div>
                  </div>
                )}

                {/* Mensagem completa */}
                <div className="rounded-lg border bg-muted/30 px-4 py-4">
                  <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">
                    Mensagem
                  </p>
                  <p className="text-sm leading-relaxed text-foreground">
                    {n.mensagem}
                  </p>
                </div>

                {/* Data completa */}
                <p className="text-xs text-muted-foreground text-right">
                  {new Date(n.data).toLocaleString("pt-PT", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })()}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => {
                if (detalheModal.notif) eliminar(detalheModal.notif.id);
                setDetalheModal({ open: false, notif: null });
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </Button>
            <Button
              size="sm"
              onClick={() => setDetalheModal({ open: false, notif: null })}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}