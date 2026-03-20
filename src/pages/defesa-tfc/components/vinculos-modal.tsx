import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useMutationCreateOrientadorTfc } from "@/hooks/defesa-tfc/use-mutation-criar-orientador-tfc";
import { useQueryOrientadoresTFC } from "@/hooks/defesa-tfc/use-query-orientadores-tfc";
import { useQueryVinculos } from "@/hooks/defesa-tfc/use-query-vinculos";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { parseFilter } from "@/util/parse-filter";
import { useEffect, useState } from "react";

export function VinculosModal({
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
    faculdade: "",
    orientador: "",
  });
  useEffect(() => {
    refetch();
  }, [filters]);
  const { data: orientadoresResponse } = useQueryOrientadoresTFC({
    anoLectivoId: parseFilter(filters.anoLectivo),
    cursoId: parseFilter(filters.curso),
    estado: "activo",
  });
  const {
    data: vinculosResponse,
    refetch,
    isFetching,
  } = useQueryVinculos({
    anoLectivoId:
      filters.anoLectivo === "all"
        ? undefined
        : parseFilter(filters.anoLectivo),
    cursoId: parseFilter(filters.curso),
    search: undefined,
  });

  const handleClose = () => {
    setOpen(false);
    setFilters({
      anoLectivo: "23",
      curso: "",
      docente: "",
      faculdade: "",
      orientador: "",
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
        className="max-w-3xl!"
        onPointerDownOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <DialogTitle>Vincular Aluno ao TFC</DialogTitle>
        <div className="grid gap-4 py-4 grid-cols-3">
          <AcademicYearSelect
            value={filters.anoLectivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            onlyActive
          />

          <FacultySelect
            allOption
            value={filters.faculdade}
            onChangeValue={(v) =>
              setFilters({ ...filters, faculdade: v, curso: "" })
            }
          />
          <CourseSelect
            params={{
              faculdadeId: parseFilter(filters.faculdade),
            }}
            onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            value={filters.curso}
          />
          <FormSelect
            label="Orientador"
            value={filters.orientador}
            onChange={(v) => setFilters({ ...filters, orientador: v })}
            options={orientadoresResponse?.data || []}
            loading={isFetching}
            disabled={isFetching}
            map={(u) => ({
              key: u.codigo,
              label: u.nome_orientador,
              value: u.codigo.toString(),
            })}
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
