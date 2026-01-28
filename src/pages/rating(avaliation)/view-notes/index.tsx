// src/pages/SchedulesByUC.tsx

import { useMemo } from "react";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";

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
import { Home, Search, BookOpen, Loader2 } from "lucide-react";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { Badge } from "@/components/ui/badge";
import { useQueryViewNotas } from "@/hooks/avaliacao/use-query-fetch-view-notes";
import { parseFilter } from "@/util/parse-filter";
import { formatarData } from "@/util/date-formate";
import { Button } from "@/components/ui/button";
import { useTeamOldRulesTurmas } from "@/hooks/team-Old-rules";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

export default function ViewNotes() {
  // filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    horarioId: "",
    turmaId: "",
    tipoProva: "",
    tipoAvaliacao: "",
  });

  // paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // === Dados base ===
  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
  const { data: cursos } = useCursos();
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } =
    useQueryTipoProva();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();

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
    !!filters.periodo &&
    !!filters.curso &&
    !!filters.unidadeCurricular;

  const { data: scheduleResponse, isLoading: loadingSchedule } =
    useQuerySchedulesByUc(
      {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        periodo: Number(filters.periodo),
        curso: Number(filters.curso),
        unidadeCurricular: Number(filters.unidadeCurricular),
        page: 1,
        limit: 100,
      },
      { enabled: canLoadTurmas }
    );
  const isShowSchedule =
    filters.anoLetivo == "" || Number(filters.anoLetivo) > 17;
  const { data: viewNotesResponse, isLoading: loadingViewNotes } =
    useQueryViewNotas({
      anoLectivo: parseFilter(filters.anoLetivo),
      horarioOrTurmaId: isShowSchedule
        ? parseFilter(filters.horarioId)
        : parseFilter(filters.turmaId),
      tipoAvaliacao: parseFilter(filters.tipoAvaliacao),
      tipoProva: parseFilter(filters.tipoProva),
      gradeId: parseFilter(filters.unidadeCurricular),
      tipoConsulta: isShowSchedule ? 1 : 2,
      page,
      limit,
    });
  const { data: turmas = [], isLoading: isLoadingTurma } =
    useTeamOldRulesTurmas({
      anoLectivo: filters.anoLetivo,
      classe: filters.anoCurricular,
      curso: filters.curso,
      periodo: filters.periodo,
    });
  const schedules = scheduleResponse?.data || [];
  const viewNotes = viewNotesResponse?.data || [];
  const total = viewNotesResponse?.total || 0;


const pdfData = useMemo(() => {
  if (!viewNotes.length) return null;

  const rows = viewNotes.map((item) => ({
    matricula: item.numero_matricula,
    nome: item.nome_completo,
    avaliacao: item.descricao_avaliacao,
    nota: item.nota ?? "-",
    docente: item.nome_docente,
    data: formatarData(item.data_lancamento),
  }));

  const filtrosTexto = [
    filters.anoLetivo && `Ano Letivo: ${filters.anoLetivo}`,
    filters.semestre && `Semestre: ${filters.semestre}`,
    filters.curso && `Curso: ${filters.curso}`,
    filters.unidadeCurricular &&
      `UC: ${filters.unidadeCurricular}`,
  ]
    .filter(Boolean)
    .join("  |  ");

  return {
    rows,
    filtros: filtrosTexto || "Nenhum filtro específico aplicado",
    total: `Total de notas: ${viewNotes.length}`,
  };
}, [viewNotes, filters]);


const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Notas Lançadas"
    subtitle="Relatório de notas por unidade curricular"
    infoSections={[
      {
        title: "Filtros Aplicados",
        content: pdfData.filtros,
      },
      {
        title: "Resumo",
        content: pdfData.total,
      },
    ]}
    mainTable={{
      headers: [
        { key: "matricula", label: "Matrícula", width: "14%" },
        { key: "nome", label: "Nome Completo", width: "26%" },
        { key: "avaliacao", label: "Avaliação", width: "18%" },
        {
          key: "nota",
          label: "Nota",
          width: "8%",
          align: "center",
        },
        { key: "docente", label: "Docente", width: "18%" },
        { key: "data", label: "Data", width: "16%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#1e40af",
    }}
    footerNotice="Relatório gerado a partir do sistema académico."
    customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
  />
) : null;


  const totalPages = Math.ceil(total / limit);

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
          <BreadcrumbItem>Avaliação</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Visualizar Notas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Visualizar</h1>
          <p className="text-muted-foreground">Notas Lançadas.</p>
        </div>

        {viewNotes.length > 0 && pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`Notas_Lancadas_${new Date()
                .toISOString()
                .slice(0, 10)}.pdf`}
              showDownload
              showPrint
            />
          )}

      </div>

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
                    <SelectItem key={a.codigo} value={a.codigo.toString()}>
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
                    <SelectItem key={s.codigo} value={s.codigo.toString()}>
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

            {/* Curso */}

                  <div className="space-y-2">
                      <CourseSelect
                          value={filters.curso}
                          onChangeValue={(v) => {
                            setFilters({
                              ...filters,
                              curso: v,
                              anoCurricular: "",
                              unidadeCurricular: "",
                            });
                            
                          }}
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
                    unidadeCurricular: "",
                  })
                }
                disabled={!filters.curso}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      filters.curso ? "Selecione Ano" : "Selecione curso"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {anosCurriculares.map((ac) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
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
                  {unidadesCurriculares.map((uc) => (
                    <SelectItem key={uc.pk} value={uc.pk.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isShowSchedule ? (
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
            ) : (
              <FormSelect
                label="Turmas"
                value={filters.turmaId}
                onChange={(v) => setFilters({ ...filters, turmaId: v })}
                options={turmas}
                loading={isLoadingTurma}
                disabled={isLoadingTurma}
                map={(u) => ({
                  key: u.codigo,
                  label: u.designacao,
                  value: u.codigo,
                })}
              />
            )}

            <FormSelect
              label="Tipo de Prova"
              value={filters.tipoProva}
              disabled={isLoadingTipoProva}
              onChange={(v) => setFilters({ ...filters, tipoProva: v })}
              options={tipoProva}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
              loading={isLoadingTipoProva}
            />
            <FormSelect
              label="Tipo de Avaliação"
              value={filters.tipoAvaliacao}
              disabled={isLoadingTipoAvaliacao}
              onChange={(v) => setFilters({ ...filters, tipoAvaliacao: v })}
              options={tipoAvaliacao}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
              loading={isLoadingTipoAvaliacao}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Notas Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            {loadingViewNotes ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando Notas...</p>
              </div>
            ) : viewNotes.length == 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                Nenhuma Nota encontrada.
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matricula</TableHead>
                      <TableHead>Nome Completo</TableHead>
                      <TableHead>Tipo de Avaliação</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Lançada por</TableHead>
                      <TableHead>Data de Lançamento</TableHead>
                      
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewNotes.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.numero_matricula}</TableCell>
                        <TableCell>{item.nome_completo}</TableCell>
                        <TableCell>{item.descricao_avaliacao}</TableCell>
                        <TableCell>
                          <Badge
                            variant="default"
                            className={`${
                              item.nota > 10 ? "bg-green-600" : ""
                            }`}
                          >
                            {item.nota == null ? "-" : item.nota}
                          </Badge>
                        </TableCell>
                        <TableCell> {item.nome_docente} </TableCell>
                        <TableCell>
                          {" "}
                          {formatarData(item.data_lancamento)}{" "}
                        </TableCell>
                        <TableCell>
                          {" "}
                          {formatarData(item.data_atualizacao)}{" "}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Paginação */}

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                A mostrar {viewNotes.length} de {total} registos
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
        </CardContent>
      </Card>
    </div>
  );
}
