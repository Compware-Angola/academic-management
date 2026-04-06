import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { EstudanteFinalistaCommandSelect } from "@/components/common/global-selects/EstudanteFinalistaCommandSelect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationVincularOrientadorAluno } from "@/hooks/defesa-tfc/use-mutation-vincular-orientador-aluno";
import { useQueryOrientadoresTFC } from "@/hooks/defesa-tfc/use-query-orientadores-tfc";
import { parseFilter } from "@/util/parse-filter";
import { useState } from "react";

const TIPO_CANDIDATURA_LICENCIATURA_CODIGO = 1;

export function VinculosModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const mutation = useMutationVincularOrientadorAluno();

  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    faculdade: "",
    orientador: "",
    estudante: "",
    tema: "",
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
      anoLectivo: "23",
      curso: "",
      faculdade: "",
      orientador: "",
      estudante: "",
      tema: "",
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
          <AcademicYearSelect
            value={filters.anoLectivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            onlyActive
          />

          <CourseSelect
            enableDefaultSelectItem
            value={filters.curso}
            onChangeValue={(v) => setFilters({ ...filters, curso: v })}
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
              tipoCandidatura: TIPO_CANDIDATURA_LICENCIATURA_CODIGO,
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
