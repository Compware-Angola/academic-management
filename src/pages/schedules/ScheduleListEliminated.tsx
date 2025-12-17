// src/pages/horarios/ScheduleList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, MoreVertical, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";

import { useQueryHorariosEliminados } from "@/hooks/horario/use-query-horarios-existentes-eliminados";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

import { useRestaurarHorario } from "@/hooks/horario/use-restaurar-horario";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { HorarioEliminado } from "@/services/horario/listar-horarios-existentes-eliminado.service";
export default function ScheduleListEliminated() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    search: "",
    periodo: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedHorario, setSelectedHorario] = useState<{
    codigo: number;
    descricao: string;
  } | null>(null);
  // Queries dos filtros
  const { data: anosAcademicos, isLoading: loadingAnos } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const { data: periodos, isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: cursos, isLoading: loadingCursos } = useCursos();
  const { data: anosCurriculares = [], isLoading: loadingAnosCurriculares } =
    useQueryClassFilterByCurso({ curso: filters.curso });
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.anoCurricular,
      curso: filters.curso,
      semestre: filters.semestre,
    });
  const { data, isLoading, error, refetch } = useQueryHorariosEliminados({
    anoLectivo: Number(filters.anoLectivo),

    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    periodo: filters.periodo ? Number(filters.periodo) : undefined,
    curso: filters.curso ? Number(filters.curso) : undefined,
    anoCurricular: filters.anoCurricular
      ? Number(filters.anoCurricular)
      : undefined,
    unidadeCurricular: filters.unidadeCurricular
      ? Number(filters.unidadeCurricular)
      : undefined,

    page,
    limit,
  });

  const { mutate: restoreHorario, isPending: isRestore } =
    useRestaurarHorario();
  const horarios = data?.data ?? [];
  const handleOpenConfirm = (item: HorarioEliminado) => {
    setSelectedHorario({
      codigo: item.codigo,
      descricao: item.designacao,
    });
    setOpenDialog(true);
  };
  const handleConfirmRestore = () => {
    if (!selectedHorario) return;
    restoreHorario(
      { codigo: selectedHorario.codigo },
      {
        onSuccess: () => {
          setOpenDialog(false);
          setSelectedHorario(null);
        },
      }
    );
  };

  React.useEffect(() => {
    setPage(1);
  }, [filters.anoLectivo, filters.anoCurricular]);

  // Resetar página ao mudar filtros
  const resetPageOnFilterChange = () => {
    setPage(1);
  };
  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };
  // Monitora mudanças nos filtros para resetar a página
  React.useEffect(() => {
    resetPageOnFilterChange();
  }, [filters]);
  // Filtrar horários localmente
  const filteredHorarios = horarios.filter((h) => {
    if (!filters.search) return true;
    const searchNormalized = normalizeText(filters.search);

    return (
      normalizeText(h.designacao).includes(searchNormalized) ||
      normalizeText(h.unidadecurricular).includes(searchNormalized) ||
      normalizeText(h.curso).includes(searchNormalized) ||
      normalizeText(h.ano).includes(searchNormalized)
    );
  });

  const total = filteredHorarios.length;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="flex-1 space-y-6 p-8">
      <h1 className="text-3xl font-bold">Horários Eliminados</h1>

      {/* ---------- Filtros ---------- */}
      <div className="rounded-lg border bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Ano Letivo"
            value={filters.anoLectivo}
            loading={loadingAnos}
            onChange={(v) =>
              setFilters({
                anoLectivo: v,
                semestre: "",
                curso: "",
                anoCurricular: "",
                unidadeCurricular: "",
                search: "",
                periodo: "",
              })
            }
            options={anosAcademicos}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            label="Semestre"
            value={filters.semestre}
            disabled={!filters.anoLectivo}
            loading={loadingSemestres}
            onChange={(v) =>
              setFilters({
                ...filters,
                semestre: v,
                anoCurricular: "",
                unidadeCurricular: "",
              })
            }
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />
          <FormSelect
            label="Período"
            value={filters.periodo}
            disabled={!filters.anoLectivo}
            loading={loadingSemestres}
            onChange={(v) =>
              setFilters({
                ...filters,
                periodo: v,
              })
            }
            options={periodos}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />

          <FormSelect
            label="Curso"
            value={filters.curso}
            disabled={!filters.anoLectivo}
            loading={loadingCursos}
            onChange={(v) =>
              setFilters({
                ...filters,
                curso: v,
                anoCurricular: "",
                unidadeCurricular: "",
              })
            }
            options={cursos}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />

          <FormSelect
            label="Ano Curricular"
            value={filters.anoCurricular}
            disabled={!filters.curso}
            loading={loadingAnosCurriculares}
            onChange={(v) =>
              setFilters({
                ...filters,
                anoCurricular: v,
                unidadeCurricular: "",
              })
            }
            options={anosCurriculares}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            label="Unidade Curricular"
            value={filters.unidadeCurricular}
            disabled={
              !filters.curso || !filters.semestre || !filters.anoCurricular
            }
            loading={isLoadingUC}
            onChange={(v) =>
              setFilters({
                ...filters,
                unidadeCurricular: v,
              })
            }
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.pk,
              label: u.descricao,
              value: u.pk,
            })}
          />

          <Input
            className="col-span-3"
            placeholder="Pesquisar..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Horários Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : filteredHorarios.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Horários encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Designação</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHorarios.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.unidadecurricular}</TableCell>
                        <TableCell>{item.designacao}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.ano}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.estado.toLowerCase().includes("pendente") ||
                              item.estado.toLowerCase().includes("distribuição")
                                ? "secondary"
                                : "default"
                            }
                          >
                            {item.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              className="cursor-pointer"
                              title="Ver detalhes"
                              variant="outline"
                              size="icon"
                              onClick={() => openDetails(item.codigo)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              className="cursor-pointer"
                              title="Restaurar"
                              variant="outline"
                              size="icon"
                              onClick={() => handleOpenConfirm(item)}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center"></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {horarios.length} de {total} registos
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <span>
                    Página {page} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>

                  <Select
                    value={String(limit)}
                    onValueChange={(v) => {
                      setLimit(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Restauração?</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente restaurar o horário
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRestore}
              disabled={isRestore}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isRestore ? "Restarando..." : "Restaurar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ScheduleDetailsModal
        horarioId={selectedTurmaId}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />
    </div>
  );
}
const normalizeText = (text: string) =>
  text
    .normalize("NFD") // Normaliza acentos
    .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
    .toLowerCase(); // Deixa tudo em minúsculas
