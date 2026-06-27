// src/pages/SchedulesByUC.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import {
  Download,
  FileText,
  Home,
  Search,
  BookOpen,
  Eye,
  Loader2,
  Plus,
  Printer,
  Pencil,
  User2,
  Trash2,
} from "lucide-react";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryMarkingAssessment } from "@/hooks/avaliacao/use-query-marking-assessment";
import { formatarData } from "@/util/date-formate";
import { parseFilter } from "@/util/parse-filter";
import { convertGuards } from "./convertGuards";
import MarkingDetailsGuardModal from "../components/MarkingDetailsGuardModal";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import AddMarkingAssessmentModal from "../components/AddMarkingAssessmentModal";
import { useQueryMarcacaoProvaPrazo } from "@/hooks/prazos/use-query-marcacao-prazo";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import {
  exportMarkingAssessmentExcelService,
  exportMarkingAssessmentPdfService,
} from "@/services/avaliacao/export-marking-assessment.service";
import { toast } from "sonner";

type ExportAction = "excel" | "pdf" | "print";
import EditMarkingAssessmentModal from "../components/EditMarkingAssessmentModal";
import { useMutationDeleteMarkingAssessment } from "@/hooks/avaliacao/use-mutation-delete-marking-assessment";

export default function AddMarkingAssessment() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setEditIsModalOpen] = useState(false);
  const [selectedMarkId, setSelectedMarkId] = useState<number>(null);
  const [isAddMarkingModalOpen, setIsMarkingModalOpen] = useState(false);
  const [guards, setGuards] = useState<string[]>([]);

  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);
  const onOpenEditModal = (id: number) => {
    setEditIsModalOpen(true);
    setSelectedMarkId(id);
  };

  // filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    prazoId: "",
    horarioId: "",
  });

  // paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [exportingAction, setExportingAction] = useState<ExportAction | null>(
    null,
  );

  // === Dados base ===
  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: periodos } = useQueryPeriod();

  const { data: prazos = [], isLoading: isLoadingPrazos } =
    useQueryMarcacaoProvaPrazo({
      anoLectivo: parseFilter(filters.anoLetivo),
      semestre: parseFilter(filters.semestre),
    });

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const { mutate: deleteMarkingAssessment, isPending: isPendingDelete } =
    useMutationDeleteMarkingAssessment();

  const canLoadUcs = !!filters.curso && !!filters.semestre;
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe: filters.anoCurricular,
    });

  const canLoadTurmas =
    !!filters.anoLetivo &&
    !!filters.semestre &&
    !!filters.curso &&
    !!filters.prazoId;

  const { data: markingResponse, isLoading: loadingTurmas } =
    useQueryMarkingAssessment(
      {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        periodo: parseFilter(filters.periodo),
        curso: Number(filters.curso),
        prazoId: Number(filters.prazoId),
        tipoHorario: 1,
        anoCurricular: parseFilter(filters.anoCurricular),
        horarioId: Number(filters.horarioId),
        page,
        limit,
      },
      { enabled: canLoadTurmas },
    );

  const { data: scheduleResponse, isLoading: loadingSchedule } =
    useQuerySchedulesByUc({
      anoLectivo: Number(filters.anoLetivo),
      semestre: Number(filters.semestre),
      periodo: Number(filters.periodo),
      curso: Number(filters.curso),
      unidadeCurricular: Number(filters.unidadeCurricular),
      page: 1,
      limit: 100,
    });

  const openDetails = (item: string | null) => {
    setGuards(convertGuards(item));
    setIsModalOpen(true);
  };
  const openAddMarkingModal = () => {
    setIsMarkingModalOpen(true);
  };
  const onDeleteMarkingAssessment = (id: number) => {
    setSelectedMarkId(id);
    deleteMarkingAssessment(id, {
      onSuccess() {
        setSelectedMarkId(null);
      },
    });
  };
  const schedules = scheduleResponse?.data || [];
  const tableData = markingResponse?.data || [];
  const total = markingResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleExport = async (action: ExportAction) => {
    if (exportingAction || !canLoadTurmas || total === 0) return;

    const printWindow = action === "print" ? window.open("", "_blank") : null;

    if (action === "print" && !printWindow) {
      toast.error("O navegador bloqueou a janela de impressão.");
      return;
    }

    setExportingAction(action);

    try {
      const exportPayload = {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        periodo: parseFilter(filters.periodo),
        curso: Number(filters.curso),
        prazoId: Number(filters.prazoId),
        tipoHorario: 1,
        anoCurricular: parseFilter(filters.anoCurricular),
        horarioId: parseFilter(filters.horarioId),
        unidadeCurricular: parseFilter(filters.unidadeCurricular),
      };

      const { blob, fileName } =
        action === "excel"
          ? await exportMarkingAssessmentExcelService(exportPayload, total)
          : await exportMarkingAssessmentPdfService(exportPayload);

      const downloadUrl = URL.createObjectURL(blob);

      if (action === "print") {
        printWindow!.location.href = downloadUrl;
        setTimeout(() => {
          printWindow!.print();
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      } else {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }

      toast.success("Exportação concluída com sucesso.");
    } catch {
      printWindow?.close();
      toast.error("Não foi possível exportar as marcações de provas.");
    } finally {
      setExportingAction(null);
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Marcação</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Marcação de Prova</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <header className="flex justify-between">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Marcação de Prova</h1>
            <p className="text-muted-foreground">Marcação de Prova</p>
          </div>
        </div>
        <Button size="sm" onClick={() => openAddMarkingModal()}>
          <Plus
            className={`w-4 h-4 mr-2 ${loadingTurmas ? "animate-spin" : ""}`}
          />
          Adicionar
        </Button>
      </header>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* Ano Letivo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Letivo</label>
              <Select
                value={filters.anoLetivo}
                onValueChange={(v) => setFilters({ ...filters, anoLetivo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {anosAcademicos?.map((a) => (
                    <SelectItem key={a.codigo} value={a.codigo?.toString()}>
                      {a.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Semestre */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select
                value={filters.semestre}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    semestre: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {semestres?.map((s) => (
                    <SelectItem key={s.codigo} value={s.codigo?.toString()}>
                      {s.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Período */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) => setFilters({ ...filters, periodo: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleciona Periodo" />
                </SelectTrigger>
                <SelectContent>
                  {periodos?.map((p) => (
                    <SelectItem key={p.codigo} value={p.codigo?.toString()}>
                      {p.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Curso */}
            <div className="space-y-2">
              <CourseSelect
                value={filters.curso}
                onChangeValue={(v) =>
                  setFilters({
                    ...filters,
                    curso: v,
                    anoCurricular: "all",
                  })
                }
              />
            </div>

            {/* Ano Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters({
                    ...filters,
                    anoCurricular: v,
                  })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      filters.curso ? "Selecione o ano" : "Selecione curso"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {anosCurriculares.map((ac) => (
                    <SelectItem key={ac.codigo} value={ac.codigo?.toString()}>
                      {ac.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Unidade Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !filters.curso
                        ? "Selecione curso"
                        : !filters.semestre
                          ? "Selecione semestre"
                          : isLoadingUC
                            ? "Carregando UCs..."
                            : "Selecionar UC"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {unidadesCurriculares?.map((uc) => (
                    <SelectItem key={uc.pk} value={uc.pk?.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormSelect
              label="Horarios"
              value={filters.horarioId}
              onChange={(v) => setFilters({ ...filters, horarioId: v })}
              options={schedules}
              loading={loadingSchedule}
              disabled={loadingSchedule}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />
            <FormSelect
              label="Tipo de Epoca"
              value={filters.prazoId}
              onChange={(v) => setFilters({ ...filters, prazoId: v })}
              options={prazos}
              loading={isLoadingPrazos}
              disabled={isLoadingPrazos}
              map={(u) => ({
                key: u.prazoid,
                label: u.designacao,
                value: u.prazoid,
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Horários Encontradas</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("pdf")}
                disabled={!canLoadTurmas || total === 0 || !!exportingAction}
              >
                <FileText className="mr-2 h-4 w-4" />
                {exportingAction === "pdf" ? "A exportar..." : "Exportar PDF"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("print")}
                disabled={!canLoadTurmas || total === 0 || !!exportingAction}
              >
                <Printer className="mr-2 h-4 w-4" />
                {exportingAction === "print" ? "A imprimir..." : "Imprimir"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport("excel")}
                disabled={!canLoadTurmas || total === 0 || !!exportingAction}
              >
                <Download className="mr-2 h-4 w-4" />
                {exportingAction === "excel"
                  ? "A exportar..."
                  : "Exportar Excel"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingTurmas ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Horários encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Data da Prova</TableHead>
                      <TableHead>Duração</TableHead>
                      <TableHead>Hora da Prova</TableHead>
                      <TableHead>Hora de Término</TableHead>
                      <TableHead className="text-center">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((item) => (
                      <TableRow key={item.codigoprova}>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.disciplina}</TableCell>
                        <TableCell>{item.anolectivo}</TableCell>
                        <TableCell>{item.classe}</TableCell>
                        <TableCell>{item.horario}</TableCell>
                        <TableCell>{item.periodo}</TableCell>
                        <TableCell>{item.tb_salas_designacao}</TableCell>
                        <TableCell>
                          {formatarData(item.tcp_data_prova)}
                        </TableCell>
                        <TableCell>{item.duracaoprova}</TableCell>
                        <TableCell>{item.tcp_hora_prova}</TableCell>
                        <TableCell>{item.horatermino}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex space-x-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openDetails(item.vigilantes)}
                            >
                              <User2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => onOpenEditModal(item.codigoprova)}
                            >
                              <Pencil className="h-4 w-4 " />
                            </Button>
                            <Button
                              disabled={
                                isPendingDelete &&
                                item.codigoprova == selectedMarkId
                              }
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                onDeleteMarkingAssessment(item.codigoprova)
                              }
                            >
                              {isPendingDelete &&
                              item.codigoprova == selectedMarkId ? (
                                <>
                                  <Loader2 className="animate-spin h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4" />
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {tableData.length} de {total} registos
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

      <AddMarkingAssessmentModal
        isOpen={isAddMarkingModalOpen}
        onClose={() => {
          setIsMarkingModalOpen(false);
        }}
      />

      {/* Modal */}
      <MarkingDetailsGuardModal
        item={guards}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTurmaId(null);
        }}
      />
      {selectedMarkId && (
        <EditMarkingAssessmentModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setEditIsModalOpen(false);
            setSelectedMarkId(null);
          }}
          provaId={selectedMarkId}
        />
      )}
    </div>
  );
}
