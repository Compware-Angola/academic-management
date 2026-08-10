import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { Link2, Plus, Trash2, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { CreateTroncoComumPayload } from "@/services/departamento/create-tronco-comum.service";
import { useMutationCreateTroncoComum } from "@/hooks/depatamento/use-mutation-create-tronco-comum";

interface UcResumo {
  codigo_grade: number;
  unidade_curricular: string;
  ano_curricular?: string;
  semestre?: string;
}
interface Filtro {
  anoLectivo: string;
  tipoCandidatura: string;
}
interface VinculoRow {
  id: string;
  curso: string;
  anoCurricular: string;
  semestre: string;
}

interface VincularCursoModalProps {
  open: boolean;
  onClose: () => void;
  uc: UcResumo | null;
}

function novoId() {
  return Math.random().toString(36).slice(2, 10);
}

function VinculoRowItem({
  index,
  tipoCandidatura,
  row,
  onChange,
  onRemove,
  removable,
}: {
  index: number;
  tipoCandidatura: number;
  row: VinculoRow;
  onChange: (row: VinculoRow) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  const { data: anosCurriculares = [], isLoading: isLoadingAnos } =
    useQueryClassFilterByCurso({ curso: row.curso });

  return (
    <div className="flex items-start gap-3 rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50">
      <div className="mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-medium text-primary">
        {index + 1}
      </div>

      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
        <CourseSelect
          params={{
            tipoCandidaturaId: tipoCandidatura,
          }}
          value={row.curso}
          onChangeValue={(v) =>
            onChange({ ...row, curso: v, anoCurricular: "" })
          }
        />

        <FormSelect
          label={"Ano Curricular"}
          value={row.anoCurricular}
          disabled={isLoadingAnos || !row.curso}
          loading={isLoadingAnos}
          onChange={(v) => onChange({ ...row, anoCurricular: v })}
          options={anosCurriculares}
          map={(c) => ({
            key: c.codigo,
            label: c.designacao,
            value: c.codigo,
          })}
        />
        <SemestreSelect
          onChangeValue={(v) => onChange({ ...row, semestre: v })}
          value={row.semestre}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-destructive"
        disabled={!removable}
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function VincularCursoModal({
  open,
  onClose,
  uc,
}: VincularCursoModalProps) {
  const [rows, setRows] = useState<VinculoRow[]>([
    { id: novoId(), curso: "", anoCurricular: "", semestre: "" },
  ]);
  const [filters, setFilters] = useState<Filtro>({
    anoLectivo: "",
    tipoCandidatura: "",
  });

  const { mutate: criarTroncoComum, isPending } =
    useMutationCreateTroncoComum();

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: novoId(), curso: "", anoCurricular: "", semestre: "" },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleChangeRow = (updated: VinculoRow) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleClose = () => {
    if (isPending) return;
    setRows([{ id: novoId(), curso: "", anoCurricular: "", semestre: "" }]);
    setFilters({ anoLectivo: "", tipoCandidatura: "" });
    onClose();
  };

  const vinculosValidos = rows.filter(
    (r) => r.curso && r.anoCurricular && r.semestre,
  );

  const handleSubmit = () => {
    if (!uc) return;

    if (!filters.tipoCandidatura || !filters.anoLectivo) {
      toast.error("Selecione o tipo de candidatura e o ano letivo.");
      return;
    }

    if (vinculosValidos.length === 0) {
      toast.error("Selecione pelo menos um curso, ano curricular e semestre.");
      return;
    }

    const payload: CreateTroncoComumPayload = {
      anoLetivo: Number(filters.anoLectivo),
      codigoGrade: uc.codigo_grade,
      cursos: vinculosValidos.map((r) => ({
        codigoCurso: Number(r.curso),
        codigoClasse: Number(r.anoCurricular),
        codigoSemestre: Number(r.semestre),
      })),
    };

    criarTroncoComum(payload, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-3xl!">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle>Vincular à Grade Curricular</DialogTitle>
              <DialogDescription className="mt-0.5">
                Associe esta disciplina a um ou mais cursos e respectivo ano
                curricular.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {uc && (
          <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-medium truncate">
              {uc.unidade_curricular}
            </span>
            <Badge variant="outline" className="ml-auto shrink-0">
              Grade {uc.codigo_grade}
            </Badge>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Filtros da candidatura
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TipoCandidaturaSelect
              value={filters.tipoCandidatura?.toString()}
              onChangeValue={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  tipoCandidatura: v,
                }))
              }
            />
            <AcademicYearsAvailableForOperationSelect
              label="Ano Letivo"
              value={filters.anoLectivo}
              onChangeValue={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  anoLectivo: v,
                }))
              }
              tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 1}
              onlyConfigurable={false}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">
              Cursos vinculados
            </p>
            <span className="text-xs text-muted-foreground">
              {vinculosValidos.length} de {rows.length} completo(s)
            </span>
          </div>

          <div className="flex max-h-[300px] flex-col gap-3 overflow-y-auto py-1 pr-1">
            {rows.map((row, index) => (
              <VinculoRowItem
                index={index}
                tipoCandidatura={parseFilter(filters.tipoCandidatura)}
                key={row.id}
                row={row}
                onChange={handleChangeRow}
                onRemove={() => handleRemoveRow(row.id)}
                removable={rows.length > 1}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-fit"
              onClick={handleAddRow}
              disabled={isPending}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Curso
            </Button>
          </div>
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            {vinculosValidos.length} vínculo(s) pronto(s)
          </span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4 mr-2" />
              )}
              {isPending ? "A vincular..." : "Vincular"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
