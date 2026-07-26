import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { TeacherSelectList } from "@/components/common/global-selects/TeacherSelector";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutationCreateOrientadorTfc } from "@/hooks/defesa-tfc/use-mutation-criar-orientador-tfc";
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
  const [filters, setFilters] = useState({
    anoLectivo: "",
    curso: "",
    docente: "",
    faculdade: "",
    tipoCandidatura: "2",
  });
  const handleClose = () => {
    setOpen(false);
    setFilters({
      anoLectivo: "",
      curso: "",
      docente: "",
      faculdade: "",
      tipoCandidatura: "2",
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
        className="max-w-4xl!"
        onPointerDownOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <DialogTitle>Adicionar Orientador</DialogTitle>
        <div className="grid gap-4 py-4 grid-cols-3">
          <TipoCandidaturaSelect
            isPostGraduation
            value={filters.tipoCandidatura}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                tipoCandidatura: v,
                anoLectivo: "",
                curso: "",
              })
            }
          />
          <AcademicYearsAvailableForOperationSelect
            label="Ano Lectivo"
            value={filters.anoLectivo}
            enableDefaultActiveYear
            onlyConfigurable={false}
            disabled={!filters.tipoCandidatura}
            tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 2}
            onChangeValue={(v) =>
              setFilters({ ...filters, anoLectivo: v, curso: "" })
            }
          />

          <FacultySelect
            value={filters.faculdade}
            onChangeValue={(v) =>
              setFilters({ ...filters, faculdade: v, curso: "" })
            }
          />
          <CourseSelect
            disabled={!filters.faculdade || !filters.tipoCandidatura}
            value={filters.curso}
            onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            params={{
              faculdadeId: parseFilter(filters.faculdade),
              tipoCandidaturaId: parseFilter(filters.tipoCandidatura),
            }}
          />
          <div className="space-y-1.5">
            <TeacherSelectList
              value={filters.docente}
              onChangeValue={(codigo) =>
                setFilters({ ...filters, docente: codigo })
              }
              tipoCandidatura={parseFilter(filters.tipoCandidatura)}
            />
          </div>

        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !filters.docente ||
              !filters.curso ||
              !filters.anoLectivo ||
              mutation.isPending
            }
          >
            {mutation.isPending ? "A salvar..." : "Salvar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
