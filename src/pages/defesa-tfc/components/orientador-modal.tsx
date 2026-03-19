import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutationCreateOrientadorTfc } from "@/hooks/defesa-tfc/use-mutation-criar-orientador-tfc";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { parseFilter } from "@/util/parse-filter";
import { useState } from "react";

export function OrientadorModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const mutation = useMutationCreateOrientadorTfc();
  const { data: teachersData = [] } = useQueryTeacther();
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    docente: "",
  });
  const handleClose = () => {
    setOpen(false);
    setFilters({
      anoLectivo: "23",
      curso: "",
      docente: "",
    });
  };
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      handleClose();
    }
  };
  const handleSubmit = async () => {
    await mutation.mutateAsync({
      anoLectivoId: parseFilter(filters.anoLectivo),
      cursoId: parseFilter(filters.curso),
      docenteId: parseFilter(filters.docente),
      estado: "activo",
    });
    handleClose();
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl!"
        onPointerDownOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <DialogTitle>Adicionar Orientador</DialogTitle>
        <div className="grid gap-4 py-4 grid-cols-3">
          <AcademicYearSelect
            value={filters.anoLectivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
          />
          <div className="space-y-1.5">
            <Label>Docente</Label>
            <FormCommandSelect
              value={filters.docente}
              options={teachersData}
              map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
              onChange={(codigo) => setFilters({ ...filters, docente: codigo })}
              width="full"
            />
          </div>
          <CourseSelect
            value={filters.curso}
            onChangeValue={(v) => setFilters({ ...filters, curso: v })}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!filters.docente || !filters.curso || !filters.anoLectivo}
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
