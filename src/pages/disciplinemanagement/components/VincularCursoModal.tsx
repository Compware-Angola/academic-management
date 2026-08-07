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
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { Link2, Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface UcResumo {
  codigo_grade: number;
  unidade_curricular: string;
  ano_curricular?: string;
  semestre?: string;
}

interface VinculoRow {
  id: string;
  curso: string;
  anoCurricular: string;
}

interface VincularCursoModalProps {
  open: boolean;
  onClose: () => void;
  uc: UcResumo | null;
  onSubmit?: (
    uc: UcResumo,
    vinculos: { curso: string; anoCurricular: string }[],
  ) => void;
}

function novoId() {
  return Math.random().toString(36).slice(2, 10);
}

function VinculoRowItem({
  row,
  onChange,
  onRemove,
  removable,
}: {
  row: VinculoRow;
  onChange: (row: VinculoRow) => void;
  onRemove: () => void;
  removable: boolean;
}) {
  const { data: anosCurriculares = [], isLoading: isLoadingAnos } =
    useQueryClassFilterByCurso({ curso: row.curso });

  return (
    <div className="flex  items-center gap-3 rounded-lg border bg-muted/30 p-3">
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <CourseSelect
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
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="mt-0.5 text-muted-foreground hover:text-destructive"
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
  onSubmit,
}: VincularCursoModalProps) {
  const [rows, setRows] = useState<VinculoRow[]>([
    { id: novoId(), curso: "", anoCurricular: "" },
  ]);

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      { id: novoId(), curso: "", anoCurricular: "" },
    ]);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleChangeRow = (updated: VinculoRow) => {
    setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleClose = () => {
    setRows([{ id: novoId(), curso: "", anoCurricular: "" }]);
    onClose();
  };

  const vinculosValidos = rows.filter((r) => r.curso && r.anoCurricular);

  const handleSubmit = () => {
    if (!uc) return;

    if (vinculosValidos.length === 0) {
      toast.error("Selecione pelo menos um curso e ano curricular.");
      return;
    }

    onSubmit?.(
      uc,
      vinculosValidos.map(({ curso, anoCurricular }) => ({
        curso,
        anoCurricular,
      })),
    );

    toast.success(
      `${vinculosValidos.length} vínculo(s) adicionado(s) à grade curricular.`,
    );
    handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-xl">
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
              {uc.codigo_grade}
            </Badge>
          </div>
        )}

        <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto py-1 pr-1">
          {rows.map((row) => (
            <VinculoRowItem
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
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Curso
          </Button>
        </div>

        <DialogFooter className="items-center sm:justify-between">
          <span className="text-sm text-muted-foreground">
            {vinculosValidos.length} vínculo(s) pronto(s)
          </span>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSubmit}>
              <Link2 className="h-4 w-4 mr-2" />
              Vincular
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
