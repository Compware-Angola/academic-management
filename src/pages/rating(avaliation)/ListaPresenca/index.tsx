import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useEffect, useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Home, Search, RefreshCw, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySchedulesByUc2 } from "@/hooks/horario/use-query-schedules-by-uc";

import { Skeleton } from "@/components/ui/skeleton";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { parseFilter } from "@/util/parse-filter";
import { usePresenceAttendance } from "@/hooks/avaliacao/use-presence-attendance";
import { useQueryAssessmentAttendanceParameters } from "@/hooks/avaliacao/use-query-assessment-attendance-parameters";
import { useQueryMesTemp } from "@/hooks/avaliacao/use-query-mes-temp";
import { verificarPagamento } from "@/util/aparecer-lista-presenca";
import { ListaPresencaPaginacao } from "./components/ListaPresencaPaginacao";
import { Input } from "@/components/ui/input";
import { PresenceListPDFDocument } from "@/components/views/pdf/presenceListPDFDocument";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import {
  formatDataProva,
  formatDuracaoProva,
  formatIntervaloProva,
  formatHoraProva,
} from "@/util/format-data-lista-presenca";
import { useUsers } from "@/hooks/acess/use-query-users";
import { useCurrentUser } from "@/hooks/mutations/use-mutation-login";
import { MCALTipoAvaliacoesSelectSelect } from "@/components/common/global-selects/MCALTipoAvaliacoesSelect";

type Filters = {
  anoLetivo: string;
  horarioId: string;
  periodo: string;
  semestre: string;
  anoCurricular: string;
  tiposAvaliacao: string;
  curso: string;
  unidadeCurricular: string;
  situacaoFinanceira: string;
};

export default function PresenceList() {
  const [formData, setFormData] = useState<Filters>({
    anoLetivo: "",
    horarioId: "",
    tiposAvaliacao: "",
    periodo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    situacaoFinanceira: "2",
  });
  const { data: users = [] } = useCurrentUser("GA");
  console.log(users);
  const { data: semestre = [] } = useQuerySemestres();
  const { data: periodos = [] } = useQueryPeriod();
  const { data: cursos = [] } = useCursos();
  const { data: classes = [] } = useQueryClassFilterByCurso({
    curso: formData.curso,
  });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();

  const filtrosCompletos =
    !isNaN(parseInt(formData.anoLetivo)) &&
    !isNaN(parseInt(formData.semestre)) &&
    !isNaN(parseInt(formData.periodo)) &&
    !isNaN(parseInt(formData.curso)) &&
    !isNaN(parseInt(formData.unidadeCurricular)) &&
    !isNaN(parseInt(formData.tiposAvaliacao));

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState<"codigoMatricula" | "nome">(
    "codigoMatricula",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  //Options
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
  ];

  const { data: parameterResponse, isLoading: isLoadingParameters } =
    useQueryAssessmentAttendanceParameters();

  const [appliedFilters, setAppliedFilters] = useState<Filters | null>(null);
  const [searchApplied, setSearchApplied] = useState({
    searchBy: "codigoMatricula" as "codigoMatricula" | "nome",
    searchTerm: "",
  });

  const situationOption = [
    {
      key: 1,
      label: "Situação Regularizada de Pagamento",
    },
    {
      key: 2,
      label: "Situação Irregular (Pagamento Pendente)",
    },
  ];

  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();

  const {
    data: presenceAttendanceList,
    isLoading: loadingPresenceAttendanceList,
    error,
  } = usePresenceAttendance(
    {
      anoLectivo: parseFilter(appliedFilters?.anoLetivo),
      horarioPk: parseFilter(appliedFilters?.horarioId),
      situacao_financeira: parseFilter(appliedFilters?.situacaoFinanceira),
      semestre: parseFilter(appliedFilters?.semestre),
      tipo_avaliacao: parseFilter(appliedFilters?.tiposAvaliacao),
      codigoMatricula:
        searchApplied.searchBy === "codigoMatricula"
          ? parseFilter(searchApplied.searchTerm)
          : null,

      nome: searchApplied.searchBy === "nome" ? searchApplied.searchTerm : null,
      page,
      limit,
    },
    !!appliedFilters,
  );

  const {
    data: presenceAttendanceListPDF,
    isLoading: loadingPresenceAttendanceListPDF,
    error: errorPDF,
  } = usePresenceAttendance(
    {
      anoLectivo: parseFilter(appliedFilters?.anoLetivo),
      horarioPk: parseFilter(appliedFilters?.horarioId),
      situacao_financeira: parseFilter(appliedFilters?.situacaoFinanceira),
      semestre: parseFilter(appliedFilters?.semestre),
      tipo_avaliacao: parseFilter(appliedFilters?.tiposAvaliacao),
      codigoMatricula:
        searchApplied.searchBy === "codigoMatricula"
          ? parseFilter(searchApplied.searchTerm)
          : null,

      nome: searchApplied.searchBy === "nome" ? searchApplied.searchTerm : null,
      page,
      limit: 500,
    },
    !!appliedFilters,
  );

  const handleSearch = () => {
    if (!isValidFilters(formData)) {
      toast({
        title: "Campos obrigatórios",

        variant: "destructive",
      });
      return;
    }
    setPage(1);
    setAppliedFilters({ ...formData });
    setSearchApplied({
      searchBy,
      searchTerm,
    });
  };

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: formData.curso,
      semestre: formData.semestre,
      classe: formData.anoCurricular,
    });
  const canLoadUcs = !!formData.curso && !!formData.semestre;

  const { data: scheduleResponse, isLoading: loadingSchedule } =
    useQuerySchedulesByUc2(
      {
        anoLectivo: parseInt(formData.anoLetivo),
        semestre: parseInt(formData.semestre),
        periodo: parseInt(formData.periodo),
        curso: parseInt(formData.curso),
        unidadeCurricular: parseInt(formData.unidadeCurricular),
        tipo_avaliacao: parseInt(formData.tiposAvaliacao),
        page: 1,
        limit: 100,
      },
      {
        enabled: filtrosCompletos, // só dispara a query quando os filtros estiverem completos
      },
    );

  const schedules = scheduleResponse?.data || [];
  // useEffect(() => {
  //   if (!loadingSchedule && schedules.length === 0) {
  //     toast({
  //       title: "Sem horário para o filtro selecionado.",

  //       variant: "destructive",
  //     });
  //   }
  // }, [filtrosCompletos, loadingSchedule, schedules.length]);

  const parameters = parameterResponse?.[0];

  const { data: mesTemp = [] } = useQueryMesTemp({
    id: parseFilter(parameters?.observacao),
  });

  const mesDescricao = mesTemp[0]?.designacao;

  const students = presenceAttendanceList?.data || [];
  const studentsPDF = presenceAttendanceListPDF?.data || [];

  const prova: any = presenceAttendanceList?.prova || [];
  const pdfData = useMemo(() => {
    if (!studentsPDF.length || !appliedFilters) return null;

    return {
      filtros: [
        `Ano Letivo: ${
          academicYear.find(
            (y) => y.codigo === parseFilter(appliedFilters.anoLetivo),
          )?.designacao
        }`,
        `Semestre: ${appliedFilters.semestre}`,
        `Curso: ${
          cursos.find((c) => c.codigo === parseFilter(appliedFilters.curso))
            ?.designacao
        }`,
        `UC: ${
          unidadesCurriculares.find(
            (u) => u.pk === parseFilter(appliedFilters.unidadeCurricular),
          )?.descricao
        }`,
        `Situação Financeira: ${
          appliedFilters.situacaoFinanceira === "1"
            ? "Situação Regularizada de Pagamento"
            : "Situação Irregular (Pagamento Pendente)"
        }`,
        searchApplied.searchTerm && `Pesquisa: ${searchApplied.searchTerm}`,
      ]
        .filter(Boolean)
        .join(" | "),
      total: studentsPDF.length,
      rows: studentsPDF.map((s) => ({
        curso: s.curso,
        classe: s.classe,
        periodo: s.periodo,
        numero_matricula: s.numero_matricula,
        nome: s.nome,
      })),
    };
  }, [studentsPDF, appliedFilters, searchApplied]);

  const pdfContent = appliedFilters ? (
    <PresenceListPDFDocument
      anoLetivo={
        academicYear.find(
          (y) => y.codigo === parseFilter(appliedFilters.anoLetivo),
        )?.designacao
      }
      semestre={
        semestre.find((s) => s.codigo === parseFilter(appliedFilters.semestre))
          ?.designacao
      }
      periodo={
        periodos.find((p) => p.codigo === parseFilter(appliedFilters.periodo))
          ?.designacao
      }
      curso={
        cursos.find((c) => c.codigo === parseFilter(appliedFilters.curso))
          ?.designacao
      }
      unidadeCurricular={
        unidadesCurriculares.find(
          (c) => c.pk === parseInt(appliedFilters.unidadeCurricular),
        )?.descricao
      }
      horario={
        schedules.find(
          (h) => h.codigo === parseFilter(appliedFilters.horarioId),
        )?.designacao
      }
      classes={
        classes.find(
          (c) => c.codigo === parseFilter(appliedFilters.anoCurricular),
        )?.designacao
      }
      total={studentsPDF.length}
      rows={studentsPDF.map((s, index) => ({
        numero: index + 1,
        matricula: s.numero_matricula,
        nome: s.nome,
      }))}
      // --- dados da prova ---
      uc={prova.uc}
      tipoAvaliacao={prova.tipo_avaliacao}
      tipoProva={prova.tipo_prova}
      dataProva={formatDataProva(prova?.data_prova)}
      horarioProva={formatIntervaloProva(
        prova?.hora_prova,
        prova?.hora_termino,
      )}
      duracaoProva={formatDuracaoProva(prova?.duracao_prova)}
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Lista de Presença",
        subtitle: "Presenças em Avaliações Académicas",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros },
          { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "curso", label: "Curso", width: 25 },
            { key: "classe", label: "Ano Curricular", width: 20 },
            { key: "periodo", label: "Período", width: 20 },
            { key: "numero_matricula", label: "Matrícula", width: 25 },
            { key: "nome", label: "Nome Completo", width: 40 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Lista_Presenca_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  const hasNext = presenceAttendanceList?.hasNextPage || false;
  const loadingSearchButton =
    loadingPresenceAttendanceList || isLoadingParameters;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
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
            <BreadcrumbItem>
              <BreadcrumbLink>Avaliações</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Lista de Presença</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {pdfData && excelProps && (
          <div className="flex gap-2">
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`${baseFileName}.pdf`}
                showDownload
                showPrint
              />
            )}

            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          </div>
        )}
      </div>

      <h1 className="text-2xl font-bold">Lista de Presença</h1>
      <p className="text-muted-foreground">
        Gestão de presenças em avaliações académicas.
      </p>
      <h2 className="text-base font-bold text-primary">
        {`Mês de referência: ${mesDescricao == undefined ? "*" : mesDescricao}`}{" "}
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormSelect
              disabled={loadingYear}
              loading={loadingYear}
              label="Ano Letivo"
              value={formData.anoLetivo}
              onChange={(v) =>
                setFormData({ ...formData, anoLetivo: v, horarioId: "" })
              }
              options={academicYear}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
            <SemestreSelect
              onChangeValue={(v) => setFormData({ ...formData, semestre: v })}
              value={formData.semestre}
            />
            <PeriodoSelect
              onChangeValue={(v) => setFormData({ ...formData, periodo: v })}
              value={formData.periodo}
            />
            <CourseSelect
              onChangeValue={(v) => setFormData({ ...formData, curso: v })}
              value={formData.curso}
            />
            <AnoCurricularSelect
              curso={formData.curso}
              onChangeValue={(v) =>
                setFormData({ ...formData, anoCurricular: v })
              }
              value={formData.anoCurricular}
            />
            {/* Unidade Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={formData.unidadeCurricular}
                onValueChange={(v) =>
                  setFormData({ ...formData, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.curso
                        ? "Selecione curso"
                        : !formData.semestre
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
            <MCALTipoAvaliacoesSelectSelect
              onChangeValue={(v) =>
                setFormData({ ...formData, tiposAvaliacao: v })
              }
              value={formData.tiposAvaliacao}
            />
            <FormSelect
              label="Horario"
              value={formData.horarioId}
              disabled={loadingSchedule}
              onChange={(v) => setFormData({ ...formData, horarioId: v })}
              options={schedules}
              map={(u) => ({
                key: u.codigo,
                value: u.codigo,
                label: `${u.designacao}`,
              })}
              loading={loadingSchedule}
            />
            <FormSelect
              label="Situação Financeira"
              value={formData.situacaoFinanceira}
              disabled={loadingSchedule}
              onChange={(v) =>
                setFormData({ ...formData, situacaoFinanceira: v })
              }
              options={situationOption}
              map={(u) => ({
                key: u.key,
                value: u.key,
                label: `${u.label}`,
              })}
            />

            {/* Tipo de Pesquisa */}
            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as "codigoMatricula" | "nome");
                  setSearchTerm("");
                  setPage(1);
                }}
                options={searchOptions}
                map={(o) => ({
                  key: o.id,
                  label: o.label,
                  value: o.id,
                })}
              />
            </div>

            {/* Input Pesquisa */}
            <div className="flex items-end">
              <div className="flex-1  min-w-[260px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder={placeholderText}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {/* Botão Listar na mesma linha */}
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={loadingSearchButton}>
                {loadingSearchButton ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {/* <ListaEstudantesPDF estudantes={estudantes2} titulo={titulo} /> */}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {loadingPresenceAttendanceList ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Curso</TableHead>
                    <TableHead>Ano Curricular</TableHead>
                    <TableHead>Periodo</TableHead>
                    <TableHead>Numero da Matricula</TableHead>
                    <TableHead>Nome Completo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.numero_matricula}>
                      <TableCell>{student.curso}</TableCell>
                      <TableCell>{student.classe}</TableCell>
                      <TableCell>{student.periodo}</TableCell>
                      <TableCell className="font-mono">
                        {student.numero_matricula}
                      </TableCell>
                      <TableCell>{student.nome}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ListaPresencaPaginacao
                hasNext={hasNext}
                limit={limit}
                page={page}
                setLimit={setLimit}
                setPage={setPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export function isValidFilters(filters?: Filters): filters is Filters {
  return !!(
    filters &&
    filters.anoLetivo &&
    filters.horarioId &&
    filters.tiposAvaliacao
  );
}
