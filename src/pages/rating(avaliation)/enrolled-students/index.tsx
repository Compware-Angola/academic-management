import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

import { useEstudantesInscritos } from "@/hooks/avaliacao/useEstudantesInscritos";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

// PDF Components
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { useScheduleQuery } from "@/hooks/horario/use=query-fetch-schedule";
import { EstudanteInscritoResponse } from "@/services/avaliacao/fetch-estudantes-inscritos";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

type Filters = {
  anoLetivo: string;
  periodo: string;
  semestre: string;
  curso: string;
  classes: string;
  unidadeCurricular: string;
  horarioId: string;
  tiposAvaliacao: string;
};

export default function EstudantesInscritos() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [shouldFetch, setShouldFetch] = useState(false);

  // Novo estado para controlar a exportação completa
  const [exportingPDF, setExportingPDF] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    anoLetivo: "",
    periodo: "",
    semestre: "",
    curso: "",
    classes: "",
    unidadeCurricular: "",
    horarioId: "",
    tiposAvaliacao: "",
  });

  useEffect(() => {
    setShouldFetch(false);
  }, [filters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);

  // ─── Queries ──────────────────────────────────────────────────────────────

  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();
  const { data: periodos = [], isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: semestres = [], isLoading: loadingSemestres } =
    useQuerySemestres();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } =
    useQueryClassFilterByCurso({ curso: filters.curso });
  const { data: unidadesCurriculares = [], isLoading: loadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.classes,
      curso: filters.curso,
      semestre: filters.semestre,
    });
  const { data: schedules, isLoading: loadingSchedules } = useScheduleQuery({
    anoLectivo: Number(filters.anoLetivo),
    semestre: Number(filters.semestre),
    periodo: Number(filters.periodo),
    curso: Number(filters.curso),
    unidadeCurricular: Number(filters.unidadeCurricular),
  });
  const { data: tiposAvaliacao = [], isLoading: loadingTipoAvaliacao } =
    useQueryTipoAvaliacao();

  // Query PAGINADA - para a tabela
  const paginatedQuery = useEstudantesInscritos(
    {
      anoCurricular: filters.classes ? Number(filters.classes) : undefined,
      anoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
      curso: filters.curso ? Number(filters.curso) : undefined,
      horarioId: filters.horarioId ? Number(filters.horarioId) : undefined,
      semestre: filters.semestre ? Number(filters.semestre) : undefined,
      unidadeCurricular: filters.unidadeCurricular
        ? Number(filters.unidadeCurricular)
        : undefined,
      tipoAvaliacao: filters.tiposAvaliacao
        ? Number(filters.tiposAvaliacao)
        : undefined,
      periodo: filters.periodo ? Number(filters.periodo) : undefined,
      page: currentPage,
      limit: itemsPerPage,
    },
    shouldFetch,
  );

  const { data: paginatedData, isLoading: loadingPaginated } = paginatedQuery;
  const totalRecords = paginatedData?.total ?? 0;

  // Query COMPLETA - só para exportar PDF (ativa quando necessário)
  const fullExportQuery = useEstudantesInscritos(
    {
      anoCurricular: filters.classes ? Number(filters.classes) : undefined,
      anoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
      curso: filters.curso ? Number(filters.curso) : undefined,
      horarioId: filters.horarioId ? Number(filters.horarioId) : undefined,
      semestre: filters.semestre ? Number(filters.semestre) : undefined,
      unidadeCurricular: filters.unidadeCurricular
        ? Number(filters.unidadeCurricular)
        : undefined,
      tipoAvaliacao: filters.tiposAvaliacao
        ? Number(filters.tiposAvaliacao)
        : undefined,
      periodo: filters.periodo ? Number(filters.periodo) : undefined,
      page: 1,
      limit: totalRecords > 0 ? totalRecords : 100, // fallback caso total ainda não tenha chegado
    },
    shouldFetch && exportingPDF && totalRecords > 0,
  );

  const { data: fullData, isLoading: loadingFullExport } = fullExportQuery;
  useEffect(() => {
    if (exportingPDF && fullData?.data && !loadingFullExport) {
      setExportingPDF(false);
      // Opcional: toast de sucesso
      toast({
        title: "PDF pronto",
        description: `Exportação completa com ${fullData.data.length} registos.`,
        variant: "default",
      });
    }
  }, [fullData, loadingFullExport, exportingPDF, toast]);
  const handleSearch = () => {
    if (!isValidFilters(filters)) {
      toast({
        title: "Campos obrigatórios",
        description:
          "Preencha todos os filtros necessários antes de pesquisar.",
        variant: "destructive",
      });
      return;
    }
    setShouldFetch(true);
    setExportingPDF(false); // reseta exportação ao pesquisar novo filtro
  };

  const handleExportFullPDF = () => {
    if (totalRecords === 0) {
      toast({
        title: "Sem dados",
        description: "Não há registos para exportar.",
        variant: "destructive",
      });
      return;
    }

    setExportingPDF(true);
  };

  const data = useMemo(() => paginatedData?.data || [], [paginatedData]);

  const columns = useMemo<ColumnDef<EstudanteInscritoResponse>[]>(
    () => [
      {
        accessorKey: "codigo_matricula",
        header: "Matrícula",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("codigo_matricula")}</div>
        ),
      },
      {
        accessorKey: "nome",
        header: "Nome",
        cell: ({ row }) => (
          <div className="max-w-[260px] truncate" title={row.getValue("nome")}>
            {row.getValue("nome")}
          </div>
        ),
      },
      {
        accessorKey: "disciplina_designacao",
        header: "Unidade Curricular",
      },
      {
        accessorKey: "avaliacao",
        header: "Avaliação",
        cell: ({ row }) => row.getValue("avaliacao") || "—",
      },
      {
        accessorKey: "estado",
        header: () => <div className="text-center">Estado</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {getEstadoBadge(row.getValue("estado"))}
          </div>
        ),
      },
    ],
    [getEstadoBadge], // dependência se getEstadoBadge mudar
  );
  const [globalFilter, setGlobalFilter] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    // Se quiseres filtro fuzzy ou mais avançado no futuro:
    // globalFilterFn: "includesString", // ou "fuzzy" com plugin fuzzy
  });

  // ─── Preparação do PDF (usa dados completos quando disponíveis) ────────
  const pdfData = useMemo(() => {
    const source = fullData?.data || paginatedData?.data || [];

    if (source.length === 0) return null;

    const rows = source.map((est) => ({
      matricula: est.codigo_matricula,
      nome: est.nome,
      uc: est.disciplina_designacao,
      avaliacao: est.avaliacao || "—",
      estado: est.estado || "—",
    }));

    const countValidado = source.filter(
      (e) => e.estado?.toLowerCase() === "validado",
    ).length;
    const countAnulado = source.filter(
      (e) => e.estado?.toLowerCase() === "anulado",
    ).length;
    const countPendente = source.filter(
      (e) => e.estado?.toLowerCase() === "pendente",
    ).length;

    const anoLetivoNome =
      academicYear.find((a) => a.codigo === Number(filters.anoLetivo))
        ?.designacao || "—";
    const periodoNome =
      periodos.find((p) => p.codigo === Number(filters.periodo))?.designacao ||
      "—";
    const semestreNome =
      semestres.find((s) => s.codigo === Number(filters.semestre))
        ?.designacao || "—";
    const cursoNome =
      cursos.find((c) => c.codigo === Number(filters.curso))?.designacao || "—";
    const ucNome =
      unidadesCurriculares.find(
        (u) => u.pk === Number(filters.unidadeCurricular),
      )?.descricao || "—";
    const horarioNome =
      schedules?.data?.find((h) => h.codigo === Number(filters.horarioId))
        ?.designacao || "—";
    const tipoAvaliacaoNome =
      tiposAvaliacao.find((t) => t.codigo === Number(filters.tiposAvaliacao))
        ?.designacao || "—";

    const filtrosTexto = [
      `Ano Letivo: ${anoLetivoNome}`,
      `Período: ${periodoNome}`,
      `Semestre: ${semestreNome}`,
      `Curso: ${cursoNome}`,
      `Ano Curricular: ${filters.classes ? classes.find((c) => c.codigo === Number(filters.classes))?.designacao || "—" : "—"}`,
      `Unidade Curricular: ${ucNome}`,
      `Horário: ${horarioNome}`,
      `Tipo de Avaliação: ${tipoAvaliacaoNome}`,
    ]
      .filter(Boolean)
      .join("  |  ");

    return {
      rows,
      filtros: filtrosTexto || "Filtros não especificados",
      resumo: [
        `Total de inscritos: ${source.length}`,
        `Validado: ${countValidado}`,
        `Anulado: ${countAnulado}`,
        `Pendente: ${countPendente}`,
      ],
    };
  }, [
    fullData,
    paginatedData,
    filters,
    academicYear,
    periodos,
    semestres,
    cursos,
    classes,
    unidadesCurriculares,
    schedules,
    tiposAvaliacao,
  ]);
  useEffect(() => {
    setGlobalFilter(debouncedSearch);
  }, [debouncedSearch]);
  function getEstadoBadge(estado: string) {
    const lower = estado?.toLowerCase() || "";
    if (lower === "validado")
      return <Badge className="bg-green-600">Validado</Badge>;
    if (lower === "anulado")
      return <Badge variant="destructive">Anulado</Badge>;
    if (lower === "pendente")
      return <Badge variant="secondary">Pendente</Badge>;
    return <Badge variant="outline">{estado || "—"}</Badge>;
  }
  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Lista Completa de Estudantes Inscritos por Avaliação"
      subtitle="Exportação total - todos os registos conforme filtros"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo Geral", content: pdfData.resumo },
      ]}
      mainTable={{
        headers: [
          {
            key: "matricula",
            label: "Matrícula",
            width: "12%",
            align: "center",
          },
          { key: "nome", label: "Nome Completo", width: "38%" },
          { key: "uc", label: "Unidade Curricular", width: "25%" },
          {
            key: "avaliacao",
            label: "Avaliação",
            width: "15%",
            align: "center",
          },
          { key: "estado", label: "Estado", width: "10%", align: "center" },
        ],
        rows: pdfData.rows,
        headerBackground: "#1e40af",
      }}
      footerNotice="Documento gerado automaticamente. Lista completa baseada nos filtros aplicados."
      customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
    />
  ) : null;

  const totalPages = paginatedData?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Estudantes Inscritos</span>
      </nav>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            ESTUDANTES INSCRITOS POR AVALIAÇÃO
          </h1>
          <p className="text-muted-foreground mt-1">
            Listagem de estudantes inscritos em avaliações específicas
          </p>
        </div>

        {(paginatedData?.data?.length > 0 || fullData?.data?.length > 0) &&
          pdfContent && (
            <div className="flex flex-wrap gap-3 items-center">
              {/* Botão "Preparar PDF" aparece SOMENTE enquanto NÃO está carregando os dados completos */}
              {!exportingPDF && !fullData && (
                <Button
                  variant="outline"
                  onClick={handleExportFullPDF}
                  disabled={loadingFullExport || totalRecords === 0}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF Completo ({totalRecords})
                </Button>
              )}

              {/* Botão de loading / preparando aparece SOMENTE durante o carregamento */}
              {(exportingPDF || loadingFullExport) && (
                <Button variant="outline" disabled>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Preparando PDF completo...
                </Button>
              )}

              {/* PDFActions (exportar + imprimir) aparece SOMENTE quando os dados completos já chegaram */}
              {fullData?.data?.length > 0 &&
                !loadingFullExport &&
                !exportingPDF && (
                  <PDFActions
                    document={pdfContent}
                    fileName={`Inscritos_Completo_${filters.unidadeCurricular || "UC"}_${new Date().toISOString().slice(0, 10)}.pdf`}
                    showDownload={true}
                    showPrint={true}
                  />
                )}
            </div>
          )}
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            disabled={loadingYear}
            loading={loadingYear}
            label="Ano Letivo"
            value={filters.anoLetivo}
            onChange={(v) =>
              setFilters({ ...filters, anoLetivo: v, horarioId: "" })
            }
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            disabled={loadingPeriodos || loadingYear || !filters.anoLetivo}
            loading={loadingPeriodos}
            label="Período"
            value={filters.periodo}
            onChange={(v) =>
              setFilters({ ...filters, periodo: v, horarioId: "" })
            }
            options={periodos}
            map={(p) => ({
              key: p.codigo,
              label: p.designacao,
              value: p.codigo,
            })}
          />

          <FormSelect
            disabled={loadingSemestres}
            loading={loadingSemestres}
            label="Semestre"
            value={filters.semestre}
            onChange={(v) =>
              setFilters({ ...filters, semestre: v, horarioId: "" })
            }
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />

          <CourseSelect
            value={filters.curso}
            onChangeValue={(v) =>
              setFilters({ ...filters, curso: v, horarioId: "" })
            }
          />

          <FormSelect
            label="Ano Curricular"
            value={filters.classes}
            disabled={loadingClasses || !filters.curso}
            onChange={(v) => setFilters({ ...filters, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
            loading={loadingClasses}
          />

          <FormSelect
            label="Unidade Curricular"
            value={filters.unidadeCurricular}
            disabled={
              loadingUC ||
              !filters.semestre ||
              !filters.curso ||
              !filters.classes
            }
            onChange={(v) =>
              setFilters({ ...filters, unidadeCurricular: v, horarioId: "" })
            }
            options={unidadesCurriculares}
            map={(u) => ({ key: u.codigo, label: u.descricao, value: u.pk })}
            loading={loadingUC}
          />

          <FormSelect
            label="Horário"
            value={filters.horarioId}
            disabled={loadingSchedules || !filters.unidadeCurricular}
            onChange={(v) => setFilters({ ...filters, horarioId: v })}
            options={schedules?.data || []}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
            loading={loadingSchedules}
          />

          <FormSelect
            label="Tipo de Avaliação"
            value={filters.tiposAvaliacao}
            disabled={loadingTipoAvaliacao}
            onChange={(v) => setFilters({ ...filters, tiposAvaliacao: v })}
            options={tiposAvaliacao}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
            loading={loadingTipoAvaliacao}
          />
        </div>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSearch}
            disabled={loadingPaginated}
            className="min-w-[160px]"
          >
            {loadingPaginated ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Pesquisar
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {loadingPaginated ? (
          <div className="space-y-3">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !paginatedData || paginatedData.data.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Aplique os filtros e clique em Pesquisar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 max-w-md ml-auto">
              <Input
                placeholder="Filtrar por nome, matrícula..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        Nenhum resultado encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Label htmlFor="items-per-page" className="text-sm">
                  Itens por página:
                </Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(v) => setItemsPerPage(Number(v))}
                >
                  <SelectTrigger id="items-per-page" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>

                <span className="text-sm text-muted-foreground">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                  {Math.min(currentPage * itemsPerPage, totalRecords)} de{" "}
                  {totalRecords}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loadingPaginated}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages || loadingPaginated}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function isValidFilters(filters?: Filters): filters is Filters {
  return !!(
    filters &&
    filters.anoLetivo &&
    filters.semestre &&
    filters.periodo &&
    filters.curso &&
    filters.classes &&
    filters.unidadeCurricular &&
    filters.horarioId &&
    filters.tiposAvaliacao
  );
}
