import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { EstudanteFinalistaCommandSelect } from "@/components/common/global-selects/EstudanteFinalistaCommandSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationVincularOrientadorAluno } from "@/hooks/defesa-tfc/use-mutation-vincular-orientador-aluno";
import { useQueryOrientadoresTFC } from "@/hooks/defesa-tfc/use-query-orientadores-tfc";
import { parseFilter } from "@/util/parse-filter";
import { useState } from "react";

export function VinculosModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const mutation = useMutationVincularOrientadorAluno();

  const [filters, setFilters] = useState({
    anoLectivo: "",
    curso: "",
    faculdade: "",
    orientador: "",
    estudante: "",
    tema: "",
    tipoCandidatura: "2",
  });

  const { data: orientadoresResponse, isFetching: loadingOrientadores } =
    useQueryOrientadoresTFC({
      anoLectivoId: parseFilter(filters.anoLectivo),
      cursoId: parseFilter(filters.curso),
      estado: "activo",
    });

  const handleClose = () => {
    setOpen(false);
    setFilters({
      anoLectivo: "",
      curso: "",
      faculdade: "",
      orientador: "",
      estudante: "",
      tema: "",
      tipoCandidatura: "2",
    });
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleClose();
    }
  };

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync({
        anoLectivoId: parseFilter(filters.anoLectivo),
        codigoMatricula: Number(filters.estudante),
        codigoOrientador: Number(filters.orientador),
        tema: filters.tema.toUpperCase(),
      });

      handleClose();
    } catch (error) {
      console.error("Erro ao vincular:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-3xl!"
        onPointerDownOutside={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <DialogTitle className="text-xl font-bold border-b pb-2">
          Vincular Aluno ao TFC
        </DialogTitle>

        <div className="grid gap-6 py-4 grid-cols-1 md:grid-cols-3">
          {/* Filtros de Localização Acadêmica */}
          <TipoCandidaturaSelect
            isPostGraduation
            value={filters.tipoCandidatura}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                tipoCandidatura: v,
                anoLectivo: "",
                curso: "",
                orientador: "",
                estudante: "",
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
              setFilters({
                ...filters,
                anoLectivo: v,
                curso: "",
                orientador: "",
                estudante: "",
              })
            }
          />
          <FacultySelect
            value={filters.faculdade}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                faculdade: v,
                curso: "",
                orientador: "",
                estudante: "",
              })
            }
          />

          <CourseSelect
            params={{
              faculdadeId: parseFilter(filters.faculdade),
              tipoCandidaturaId: parseFilter(filters.tipoCandidatura),
            }}
            disabled={!filters.faculdade || !filters.tipoCandidatura}
            value={filters.curso}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                curso: v,
                orientador: "",
                estudante: "",
              })
            }
          />

          {/* Seleção de Pessoas */}
          <FormSelect
            label="Orientador"
            value={filters.orientador}
            onChange={(v) => setFilters({ ...filters, orientador: v })}
            options={orientadoresResponse?.data || []}
            loading={loadingOrientadores}
            disabled={loadingOrientadores}
            map={(u) => ({
              key: u.codigo,
              label: u.nome_orientador,
              value: u.codigo.toString(),
            })}
          />

          <EstudanteFinalistaCommandSelect
            label="Estudante Finalista"
            value={filters.estudante}
            onChangeValue={(v) => setFilters({ ...filters, estudante: v })}
            params={{
              anoLectivo: parseFilter(filters.anoLectivo),
              curso: parseFilter(filters.curso),
              tipoCandidatura: parseFilter(filters.tipoCandidatura),
            }}
          />

          {/* Campo de Tema */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label htmlFor="tema-tfc">Tema do Trabalho</Label>
            <Input
              id="tema-tfc"
              placeholder="Ex: Sistema de Gestão Escolar..."
              value={filters.tema}
              onChange={(e) =>
                setFilters({ ...filters, tema: e.target.value.trimStart() })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} type="button">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !filters.orientador ||
              !filters.estudante ||
              !filters.tema.trim() ||
              mutation.isPending
            }
          >
            {mutation.isPending ? "A processar..." : "Confirmar Vínculo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
