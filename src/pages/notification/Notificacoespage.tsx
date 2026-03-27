import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, BellOff, Eye, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useQueryAvisosPorGrupos } from "@/hooks/acess/use-query-avisos-por-grupo";


function formatarExpiracao(data: string | null) {
  if (!data) return "Sem data de expiração";

  return new Date(data).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
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

export default function NotificacoesPage() {
  const { user } = useAuth();
  const [detalheModal, setDetalheModal] = useState<{
    open: boolean;
    aviso: any | null;
  }>({
    open: false,
    aviso: null,
  });

  const gruposAviso =
    user?.groups?.filter((group) => group.type_group === 1) ?? [];

  const grupoIds = gruposAviso.map((group) => group.codigo);

  const {
    data: avisosGrupo = [],
    isLoading,
    refetch,
  } = useQueryAvisosPorGrupos({
    grupoIds,
  });

  const avisosValidos = useMemo(() => {
    const agora = new Date();

    return avisosGrupo.filter((aviso) => {
      const ativo = aviso.STATUS === 1;

      const naoExpirado =
        !aviso.DATE_EXPIRACAO || new Date(aviso.DATE_EXPIRACAO) >= agora;

      return ativo && naoExpirado;
    });
  }, [avisosGrupo]);

  const abrirDetalhe = (aviso: any) => {
    setDetalheModal({
      open: true,
      aviso,
    });
  };

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium text-foreground">Notificações</span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notificações</h1>
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

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : avisosValidos.length === 0 ? (
        <div className="rounded-lg border bg-card py-16 text-center">
          <BellOff className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="mb-1 font-medium text-muted-foreground">
            Nenhum aviso encontrado
          </p>
          <p className="text-sm text-muted-foreground">
            Não existem avisos activos dentro do prazo para os grupos deste utilizador.
          </p>
        </div>
      ) : (
      <div className="overflow-hidden rounded-lg border bg-card">
  <div className="divide-y">
    {avisosValidos.map((aviso) => (
      <div
        key={aviso.CODIGO}
        className="cursor-pointer px-5 py-4 transition-colors hover:bg-muted/40"
        onClick={() => abrirDetalhe(aviso)}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          
          {/* Lado esquerdo */}
          <div className="flex items-start gap-2">
            <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />

            <div className="flex flex-col">
              {/* TÍTULO */}
              <span className="text-sm font-semibold text-foreground">
                {aviso.ASSUNTO}
              </span>

              {/* DESCRIÇÃO (resumida) */}
              <span className="line-clamp-1 text-xs leading-6 text-muted-foreground">
                {aviso.DESCRICAO}
              </span>
            </div>
          </div>

          {/* Lado direito */}
          <div className="flex shrink-0 items-center gap-2 md:flex-col md:items-end">
            <span className="text-xs text-muted-foreground">
              Expira em{" "}
              <span className="font-medium text-foreground">
                {formatarExpiracao(aviso.DATE_EXPIRACAO)}
              </span>
            </span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
    ))}
  </div>
</div>
      )}

      <Dialog
        open={detalheModal.open}
        onOpenChange={(open) =>
          setDetalheModal({
            open,
            aviso: open ? detalheModal.aviso : null,
          })
        }
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 pr-6">
              <Bell className="h-5 w-5 shrink-0 text-muted-foreground" />
              <span className="leading-snug">Detalhes do aviso</span>
            </DialogTitle>
          </DialogHeader>

          {detalheModal.aviso && (
            <div className="space-y-5 py-2">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Assunto
                </p>
                <h2 className="text-xl font-semibold leading-snug text-foreground">
                  {detalheModal.aviso.ASSUNTO}
                </h2>
              </div>

              <div className="border-t pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Descrição
                </p>
                <p className="whitespace-pre-line text-sm leading-7 text-foreground">
                  {detalheModal.aviso.DESCRICAO}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Expiração
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatarDataCompleta(detalheModal.aviso.DATE_EXPIRACAO)}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              size="sm"
              onClick={() =>
                setDetalheModal({
                  open: false,
                  aviso: null,
                })
              }
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}