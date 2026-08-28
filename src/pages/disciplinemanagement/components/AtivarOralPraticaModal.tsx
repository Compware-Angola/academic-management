import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link2Off, Info, X } from "lucide-react";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { parseFilter } from "@/util/parse-filter";
import { useQueryPlanoCurricularGrade } from "@/hooks/depatamento/use-query-plano-curricular-grade";
import { useUpdateTemOralTemPratica } from "@/hooks/use-grade-curricular";
import { toast } from "sonner";

interface Filtro {
  anoLectivo: string;
  tipoCandidatura: string;
}

const FILTROS_VAZIOS: Filtro = {
  anoLectivo: "",
  tipoCandidatura: "",
};

interface AtivarOralPraticaModalProps {
  open: boolean;
  onClose: () => void;
  codigoGrade: number;
}

export function AtivarOralPraticaModal({
  open,
  onClose,
  codigoGrade,
}: AtivarOralPraticaModalProps) {
  const [filters, setFilters] = useState<Filtro>(FILTROS_VAZIOS);

  const temFiltroAtivo = !!filters.anoLectivo || !!filters.tipoCandidatura;

  const {
    data: planoResponse,
    isLoading,
    isFetching,
    refetch: refetchPlano,
  } = useQueryPlanoCurricularGrade({
    codigoGrade,
    anoLetivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    enabled: open && !!filters.anoLectivo,
  });

  const plano = planoResponse?.[0] ?? null;

  const { mutate: updateTemOralTemPratica, isPending: updatingPlanoExtras } =
    useUpdateTemOralTemPratica();

  const handleClose = () => {
    setFilters(FILTROS_VAZIOS);
    onClose();
  };

  const handleClearFilters = () => {
    setFilters(FILTROS_VAZIOS);
  };

  const handleToggleOral = (checked: boolean) => {
    if (!plano) return;
    // Oral e Prática são mutuamente exclusivas: activar uma desactiva a outra.
    if (checked && plano.temPratica) {
      toast.info("Prática desativada automaticamente", {
        description:
          "Um vínculo não pode ter Oral e Prática activas ao mesmo tempo.",
      });
    }
    updateTemOralTemPratica(
      {
        codigo: plano.codigoPlanoGrade,
        temOral: checked,
      },
      { onSuccess: () => refetchPlano() },
    );
  };

  const handleTogglePratica = (checked: boolean) => {
    if (!plano) return;
    // Oral e Prática são mutuamente exclusivas: activar uma desactiva a outra.
    if (checked && plano.temOral) {
      toast.info("Oral desativada automaticamente", {
        description:
          "Um vínculo não pode ter Oral e Prática activas ao mesmo tempo.",
      });
    }
    updateTemOralTemPratica(
      {
        codigo: plano.codigoPlanoGrade,
        temPratica: checked,
      },
      { onSuccess: () => refetchPlano() },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-3xl!">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>Detalhes da Unidade Curricular</DialogTitle>
              <DialogDescription className="mt-0.5">
                Ative Oral ou Prática para o vínculo desta UC no ano lectivo
                seleccionado.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-end gap-3">
          <div className="grid flex-1 grid-cols-2 gap-3">
            <TipoCandidaturaSelect
              value={filters.tipoCandidatura?.toString()}
              onChangeValue={(v) =>
                setFilters({
                  ...filters,
                  tipoCandidatura: v,
                })
              }
            />
            <AcademicYearsAvailableForOperationSelect
              label="Ano Letivo"
              value={filters.anoLectivo}
              onChangeValue={(v) =>
                setFilters({
                  ...filters,
                  anoLectivo: v,
                })
              }
              tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 1}
              onlyConfigurable={false}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!temFiltroAtivo}
            onClick={handleClearFilters}
          >
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        </div>

        <div className="flex flex-col gap-3 py-1">
          {!filters.anoLectivo ? (
            <div className="text-center py-14 border rounded-md">
              <p className="text-sm text-muted-foreground">
                Selecione o ano letivo para ver o vínculo
              </p>
            </div>
          ) : isLoading || isFetching ? (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !plano ? (
            <div className="text-center py-14 border rounded-md">
              <Link2Off className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Não foi feito nenhum vínculo para este ano lectivo
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-lg border p-4">
                <div className="col-span-2 space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Curso
                  </p>
                  <p className="text-sm font-medium">{plano.curso}</p>
                </div>
                <div className="col-span-2 space-y-0.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Disciplina
                  </p>
                  <Badge variant="outline">{plano.disciplina}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Avaliações de Excepção
                </h4>

                <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="grade-ativar-oral"
                      className="text-sm cursor-pointer"
                    >
                      Ativar Oral
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Este vínculo passa a exigir prova oral (Aguarda Oral /
                      Oral de Recurso).
                    </p>
                  </div>
                  <Switch
                    id="grade-ativar-oral"
                    checked={plano.temOral}
                    onCheckedChange={handleToggleOral}
                    disabled={updatingPlanoExtras}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
                  <div className="space-y-0.5">
                    <Label
                      htmlFor="grade-ativar-pratica"
                      className="text-sm cursor-pointer"
                    >
                      Ativar Prática
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Este vínculo passa a exigir componente prática (Aguarda
                      Nota da Prática).
                    </p>
                  </div>
                  <Switch
                    id="grade-ativar-pratica"
                    checked={plano.temPratica}
                    onCheckedChange={handleTogglePratica}
                    disabled={updatingPlanoExtras}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
