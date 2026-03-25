import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  CalendarClock,
  Eye,
  RefreshCw,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useQueryAvisosPorGrupos } from "@/hooks/acess/use-query-avisos-por-grupo";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarExpiracao(data: string | null) {
  if (!data) return "Sem expiração";
  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatarDataCompleta(data: string | null) {
  if (!data) return "Sem data de expiração";
  return new Date(data).toLocaleString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Devolve true se a data de expiração for dentro de 3 dias */
function expiraEmBreve(data: string | null): boolean {
  if (!data) return false;
  const diff = new Date(data).getTime() - Date.now();
  return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function NotificacoesPage() {
  const { user } = useAuth();
  const [detalheModal, setDetalheModal] = useState<{
    open: boolean;
    aviso: any | null;
  }>({ open: false, aviso: null });

  const gruposAviso =
    user?.groups?.filter((group) => group.type_group === 1) ?? [];
  const grupoIds = gruposAviso.map((group) => group.codigo);

  const {
    data: avisosGrupo = [],
    isLoading,
    refetch,
  } = useQueryAvisosPorGrupos({ grupoIds });

  const avisosValidos = useMemo(() => {
    const agora = new Date();
    return avisosGrupo.filter((aviso) => {
      const ativo = aviso.STATUS === 1;
      const naoExpirado =
        !aviso.DATE_EXPIRACAO || new Date(aviso.DATE_EXPIRACAO) >= agora;
      return ativo && naoExpirado;
    });
  }, [avisosGrupo]);

  const abrirDetalhe = (aviso: any) => setDetalheModal({ open: true, aviso });

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Notificações</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
            {!isLoading && avisosValidos.length > 0 && (
              <Badge variant="destructive" className="text-sm px-2 py-0.5">
                {avisosValidos.length}{" "}
                {avisosValidos.length === 1 ? "activo" : "activos"}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-muted-foreground">
            Todos os avisos activos e dentro do prazo
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Conteúdo */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : avisosValidos.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center">
          <BellOff className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-1 font-medium text-muted-foreground">
            Nenhum aviso encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Não existem avisos activos dentro do prazo para os grupos deste
            utilizador.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-card">
          {/* Cabeçalho da lista */}
          <div className="border-b bg-muted/40 px-5 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {avisosValidos.length}{" "}
              {avisosValidos.length === 1 ? "aviso" : "avisos"} activos
            </p>
          </div>

          <div className="divide-y">
            {avisosValidos.map((aviso) => {
              const emBreve = expiraEmBreve(aviso.DATE_EXPIRACAO);

              return (
                <div
                  key={aviso.CODIGO}
                  className="group cursor-pointer px-5 py-4 transition-colors hover:bg-muted/40"
                  onClick={() => abrirDetalhe(aviso)}
                >
                  <div className="flex items-start justify-between gap-4">

                    {/* Ícone + conteúdo */}
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Ícone */}
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Megaphone className="h-4 w-4 text-primary" />
                      </div>

                      {/* Texto */}
                      <div className="min-w-0 flex-1">
                        {aviso.ASSUNTO && (
                          <p className="mb-0.5 text-sm font-semibold text-foreground leading-snug">
                            {aviso.ASSUNTO}
                          </p>
                        )}
                        <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                          {aviso.DESCRICAO}
                        </p>
                      </div>
                    </div>

                    {/* Meta + acção */}
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5">
                        <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span
                          className={`text-xs font-medium ${
                            emBreve ? "text-orange-500" : "text-muted-foreground"
                          }`}
                        >
                          {formatarExpiracao(aviso.DATE_EXPIRACAO)}
                        </span>
                        {emBreve && (
                          <Badge
                            variant="outline"
                            className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-[10px] px-1.5 py-0"
                          >
                            Em breve
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Ver detalhes"
                        onClick={(e) => {
                          e.stopPropagation();
                          abrirDetalhe(aviso);
                        }}
                      >
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Modal de Detalhe ────────────────────────────────────────────────── */}
      <Dialog
        open={detalheModal.open}
        onOpenChange={(open) =>
          setDetalheModal({ open, aviso: open ? detalheModal.aviso : null })
        }
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <span className="leading-snug text-base">
                {detalheModal.aviso?.ASSUNTO || "Detalhes do aviso"}
              </span>
            </DialogTitle>
          </DialogHeader>

          {detalheModal.aviso && (
            <div className="space-y-4 py-1">

              {/* Descrição */}
              <div className="rounded-lg border bg-muted/30 px-4 py-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Descrição
                </p>
                <p className="whitespace-pre-line text-sm leading-7 text-foreground">
                  {detalheModal.aviso.DESCRICAO}
                </p>
              </div>

              {/* Expiração */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/20 px-4 py-3">
                <CalendarClock className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Data de expiração
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      expiraEmBreve(detalheModal.aviso.DATE_EXPIRACAO)
                        ? "text-orange-500"
                        : "text-foreground"
                    }`}
                  >
                    {formatarDataCompleta(detalheModal.aviso.DATE_EXPIRACAO)}
                  </p>
                </div>
                {expiraEmBreve(detalheModal.aviso.DATE_EXPIRACAO) && (
                  <Badge
                    variant="outline"
                    className="ml-auto bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs"
                  >
                    Expira em breve
                  </Badge>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setDetalheModal({ open: false, aviso: null })}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}