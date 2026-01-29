// src/pages/SchedulesByUC.tsx
import { useMemo, useState } from "react";
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
import { useQueryAssessmentStats } from "@/hooks/avaliacao/use-query-statistic-assessment";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { Badge } from "@/components/ui/badge";
import { FormMultiSelect } from "@/components/common/FormMultiSelect";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

export default function StatisticAssessment() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  const [avaliacoes, setAvaliacoes] = useState<string[]>([]);
  // filtros
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    horarioId: "",
    tipoProva: "",
    tipoAvaliacao: "",
  });

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
      classe:
        filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
    });
  const tipoAvaliacaoOptions = tipoAvaliacao.map((item) => ({
    label: item.designacao,
    value: item.codigo.toString(),
  }));
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
      { enabled: canLoadTurmas },
    );
  const { data: statisticResponse, isLoading: loadingStatistic } =
    useQueryAssessmentStats({
      anoLectivo: Number(filters.anoLetivo),
      horarioId: Number(filters.horarioId),
      gradeId: Number(filters.unidadeCurricular),
      tipoProva: Number(filters.tipoProva),
      tipoAvaliacao: avaliacoes.map((t) => parseInt(t)),
    });

  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpen(true);
  };

  const schedules = scheduleResponse?.data || [];
  const statistics = statisticResponse?.data || [];

  const pdfData = useMemo(() => {
    if (!statistics.length) return null;

    const rows = statistics.map((item) => ({
      curso: item.curso,
      disciplina: item.disciplina,
      horario: item.nomehorario,
      avaliacao: item.avaliacao,
      inscritos: item.qtdinscrito,
      avaliados: item.qtdavaliados,
      aprovados: item.qtdaprovados,
      reprovados: item.qtdreprovados,
      taxa_avaliacao: `${item.taxaavaliacao_sobreinscritos.toFixed(1)}%`,
      taxa_aprovados: `${item.taxaaprovacao_sobreavaliados.toFixed(1)}%`,
      taxa_reprovados: `${item.taxareprovacao_sobreavaliados.toFixed(1)}%`,
    }));

    // Totais
    const totalInscritos = statistics.reduce(
      (sum, item) => sum + item.qtdinscrito,
      0,
    );
    const totalAvaliados = statistics.reduce(
      (sum, item) => sum + item.qtdavaliados,
      0,
    );
    const totalAprovados = statistics.reduce(
      (sum, item) => sum + item.qtdaprovados,
      0,
    );
    const totalReprovados = statistics.reduce(
      (sum, item) => sum + item.qtdreprovados,
      0,
    );

    // Filtros exibidos
    const anoLetivoNome =
      anosAcademicos?.find((a) => a.codigo === Number(filters.anoLetivo))
        ?.designacao || "—";
    const semestreNome =
      semestres?.find((s) => s.codigo === Number(filters.semestre))
        ?.designacao || "—";
    const periodoNome =
      periodos?.find((p) => p.codigo === Number(filters.periodo))?.designacao ||
      "—";
    const cursoNome =
      cursos?.find((c) => c.codigo === Number(filters.curso))?.designacao ||
      "—";
    const ucNome =
      unidadesCurriculares.find(
        (uc) => uc.pk === Number(filters.unidadeCurricular),
      )?.descricao || "—";
    const horarioNome =
      schedules.find((h) => h.codigo === Number(filters.horarioId))
        ?.designacao || "—";
    const tipoProvaNome =
      tipoProva.find((tp) => tp.codigo === Number(filters.tipoProva))
        ?.designacao || "—";

    const filtrosTexto = [
      `Ano Letivo: ${anoLetivoNome}`,
      `Semestre: ${semestreNome}`,
      `Período: ${periodoNome}`,
      `Curso: ${cursoNome}`,
      `UC: ${ucNome}`,
      `Horário: ${horarioNome}`,
      `Tipo Prova: ${tipoProvaNome}`,
      `Tipos Avaliação: ${avaliacoes.length > 0 ? avaliacoes.length : "Todos"} selecionado(s)`,
    ]
      .filter(Boolean)
      .join("  |  ");

    return {
      rows,
      filtros: filtrosTexto || "Nenhum filtro específico aplicado",
      totais: [
        `Total de registos: ${statistics.length}`,
        `Total inscritos: ${totalInscritos}`,
        `Total avaliados: ${totalAvaliados}`,
        `Total aprovados: ${totalAprovados}`,
        `Total reprovados: ${totalReprovados}`,
      ],
    };
  }, [
    statistics,
    filters,
    anosAcademicos,
    semestres,
    periodos,
    cursos,
    unidadesCurriculares,
    schedules,
    tipoProva,
    avaliacoes,
  ]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Estatística de Notas Lançadas"
      subtitle="Resumo por unidade curricular, horário e tipo de avaliação"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: pdfData.filtros,
        },
        {
          title: "Resumo Geral",
          content: pdfData.totais,
        },
      ]}
      mainTable={{
        headers: [
          { key: "curso", label: "Curso", width: "14%" },
          { key: "disciplina", label: "Unidade Curricular", width: "22%" },
          { key: "horario", label: "Horário", width: "12%" },
          {
            key: "avaliacao",
            label: "Avaliação",
            width: "10%",
            align: "center",
          },
          {
            key: "inscritos",
            label: "Inscritos",
            width: "8%",
            align: "center",
          },
          {
            key: "avaliados",
            label: "Avaliados",
            width: "8%",
            align: "center",
          },
          {
            key: "aprovados",
            label: "Aprovados",
            width: "8%",
            align: "center",
          },
          {
            key: "reprovados",
            label: "Reprovados",
            width: "8%",
            align: "center",
          },
          {
            key: "taxa_avaliacao",
            label: "Taxa Avaliação",
            width: "10%",
            align: "center",
          },
          {
            key: "taxa_aprovados",
            label: "Taxa Aprov.",
            width: "10%",
            align: "center",
          },
        ],
        rows: pdfData.rows,
        headerBackground: "#1e40af",
      }}
      footerNotice="Estatísticas baseadas nos lançamentos registados até ao momento. Sujeito a alterações."
      customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
    />
  ) : null;

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
            <BreadcrumbPage>Estatística de notas lançadas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">
              Estatística de notas lançadas
            </h1>
            <p className="text-muted-foreground">
              Estatística de notas lançadas por UC e avaliação
            </p>
          </div>
        </div>

        {statistics.length > 0 && pdfContent && (
          <PDFActions
            document={pdfContent}
            fileName={`Estatisticas_Notas_${filters.curso || "geral"}_${new Date().toISOString().slice(0, 10)}.pdf`}
            showDownload={true}
            showPrint={true}
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
                      filters.curso ? "Todos os anos" : "Selecione curso"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os anos</SelectItem>
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

            <FormMultiSelect
              search={false}
              label="Tipo de Avaliação"
              values={avaliacoes}
              options={tipoAvaliacao}
              onChange={setAvaliacoes}
              map={(u) => ({
                key: u.codigo.toString(),
                label: u.designacao,
                value: u.codigo.toString(),
              })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Estatística Encontradas</CardTitle>
        </CardHeader>
        <CardContent>
          <>
            {loadingStatistic ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando Horários...</p>
              </div>
            ) : statistics.length == 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                Nenhuma Estatística encontrada.
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Curso</TableHead>
                      <TableHead>Unidade Curricular</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Avaliação</TableHead>
                      <TableHead>Quantidade Inscritos</TableHead>
                      <TableHead>Quantidade Avaliados</TableHead>
                      <TableHead>Quantidade Aprovados</TableHead>
                      <TableHead>Quantidade Reprovados</TableHead>
                      <TableHead>Taxa de Avaliação</TableHead>
                      <TableHead>Taxa de Aprovados</TableHead>
                      <TableHead>Taxa de Reprovados</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statistics.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.disciplina}</TableCell>
                        <TableCell>{item.nomehorario}</TableCell>
                        <TableCell>{item.avaliacao}</TableCell>
                        <TableCell>{item.qtdinscrito}</TableCell>
                        <TableCell>{item.qtdavaliados}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">
                            {item.qtdaprovados}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{item.qtdreprovados}</Badge>
                        </TableCell>
                        <TableCell>
                          {item.taxaavaliacao_sobreinscritos}
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-600">
                            {item.taxaaprovacao_sobreavaliados}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{item.taxareprovacao_sobreavaliados}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Paginação */}
            {/*
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
              </div>*/}
          </>
        </CardContent>
      </Card>
    </div>
  );
}
