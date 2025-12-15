// src/pages/SchedulesWithPermission.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, Plus, Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import { FormSelect } from "@/components/common/FormSelect";
import ScheduleDetailsModal from "./components/ScheduleDetailsModal";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useScheduleQuery } from "@/hooks/horario/use=query-fetch-schedule";
import { useSchedulePermission } from "@/hooks/horario/use-schedule-permission";
import { Schedule } from "@/services/horario/fetch-schedule.service";

export default function SchedulesWithPermission() {
  const navigate = useNavigate();

  // --------- Estado ---------
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    search: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHorarioId, setSelectedHorarioId] = useState<number | null>(
    null
  );

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedHorarioForPermission, setSelectedHorarioForPermission] =
    useState<Schedule | null>(null);

  const [permissionForm, setPermissionForm] = useState({
    dataInicio: "",
    dataFim: "",
  });

  // --------- Queries de filtros ---------
  const { data: anosAcademicos, isLoading: loadingAnos } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
  const { data: cursos } = useCursos();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const canLoadUCs = !!filters.curso && !!filters.semestre;
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe: filters.anoCurricular || undefined,
    });

  // --------- Query de horários ---------
  const { data: scheduleResponse, isLoading: isLoadingSchedule } =
    useScheduleQuery({
      anoLectivo: Number(filters.anoLetivo),
      semestre: Number(filters.semestre),
      periodo: Number(filters.periodo),
      curso: Number(filters.curso),
      unidadeCurricular: Number(filters.unidadeCurricular),
      page,
      limit,
    });

  const tableData = scheduleResponse?.data ?? [];
  const total = scheduleResponse?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  // --------- Hook para criar permissão ---------
  const { mutate: createPermission, isPending: isCreatingPermission } =
    useSchedulePermission();

  // --------- Funções ---------
  const openDetails = (horarioId: number) => {
    setSelectedHorarioId(horarioId);
    setIsDetailsModalOpen(true);
  };

  const openPermissionModal = (horario: Schedule) => {
    setSelectedHorarioForPermission(horario);
    setPermissionForm({ dataInicio: "", dataFim: "" });
    setIsPermissionModalOpen(true);
  };

  const handleConfirmPermission = () => {
    if (!selectedHorarioForPermission) return;
    const payload = {
      fkHorario: selectedHorarioForPermission.codigo,
      dataInicio: permissionForm.dataInicio,
      dataFim: permissionForm.dataFim,
    };
    createPermission(payload, {
      onSuccess: () => {
        setIsPermissionModalOpen(false);
        setSelectedHorarioForPermission(null);
      },
    });
  };

  // --------- Pesquisa no front-end ---------
  const filteredData = tableData.filter(
    (h) =>
      filters.search === "" ||
      h.designacao.toLowerCase().includes(filters.search.toLowerCase()) ||
      h.unidadecurricular
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      h.curso.toLowerCase().includes(filters.search.toLowerCase()) ||
      h.ano.toLowerCase().includes(filters.search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold">Horários Existentes</h1>

      {/* ---------- Filtros ---------- */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <FormSelect
              label="Ano Letivo"
              value={filters.anoLetivo}
              loading={loadingAnos}
              options={anosAcademicos}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  anoLetivo: v,
                  semestre: "",
                  periodo: "",
                  curso: "",
                  anoCurricular: "",
                  unidadeCurricular: "",
                })
              }
            />
            <FormSelect
              label="Semestre"
              value={filters.semestre}
              loading={loadingSemestres}
              options={semestres}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo,
              })}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  semestre: v,
                  anoCurricular: "",
                  unidadeCurricular: "",
                })
              }
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) => setFilters({ ...filters, periodo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {periodos?.map((p) => (
                    <SelectItem key={p.codigo} value={p.codigo.toString()}>
                      {p.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormSelect
              label="Curso"
              value={filters.curso}
              options={cursos}
              map={(c) => ({
                key: c.codigo,
                label: c.designacao,
                value: c.codigo,
              })}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  curso: v,
                  anoCurricular: "",
                  unidadeCurricular: "",
                })
              }
            />
            <FormSelect
              label="Ano Curricular"
              value={filters.anoCurricular}
              options={anosCurriculares}
              map={(ac) => ({
                key: ac.codigo,
                label: ac.designacao,
                value: ac.codigo,
              })}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  anoCurricular: v,
                  unidadeCurricular: "",
                })
              }
              disabled={!filters.curso}
            />
            <FormSelect
              label="Unidade Curricular"
              value={filters.unidadeCurricular}
              options={unidadesCurriculares}
              map={(uc) => ({ key: uc.pk, label: uc.descricao, value: uc.pk })}
              onChange={(v) => setFilters({ ...filters, unidadeCurricular: v })}
              disabled={!canLoadUCs}
            />
            <Input
              placeholder="Pesquisar..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </CardContent>
      </Card>

      {/* ---------- Tabela ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>Horários Encontrados</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingSchedule ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Horário encontrada.
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
                    {filteredData.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.unidadecurricular}</TableCell>
                        <TableCell>{item.designacao}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.ano}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.estado.toLowerCase().includes("pendente")
                                ? "secondary"
                                : "default"
                            }
                          >
                            {item.estado}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openDetails(item.codigo)}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Ver
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openPermissionModal(item)}
                          >
                            <Plus className="h-4 w-4 mr-2" /> Permissão
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {filteredData.length} de {total} registos
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

      {/* ---------- Modal Detalhes ---------- */}
      <ScheduleDetailsModal
        horarioId={selectedHorarioId}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedHorarioId(null);
        }}
      />

      {/* ---------- Modal Permissão ---------- */}
      <AlertDialog
        open={isPermissionModalOpen}
        onOpenChange={setIsPermissionModalOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conceder Permissão</AlertDialogTitle>
            <AlertDialogDescription>
              Horário: {selectedHorarioForPermission?.designacao}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid grid-cols-1 gap-2 p-4">
            <Input
              type="date"
              placeholder="Data Início"
              value={permissionForm.dataInicio}
              onChange={(e) =>
                setPermissionForm({
                  ...permissionForm,
                  dataInicio: e.target.value,
                })
              }
            />
            <Input
              type="date"
              placeholder="Data Fim"
              value={permissionForm.dataFim}
              onChange={(e) =>
                setPermissionForm({
                  ...permissionForm,
                  dataFim: e.target.value,
                })
              }
            />
          </div>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPermission}
              disabled={isCreatingPermission}
            >
              {isCreatingPermission ? "Concedendo..." : "Conceder"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
