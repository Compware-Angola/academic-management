import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useMemo, useState } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Home, Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { FormSelect } from "@/components/common/FormSelect";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { Skeleton } from "@/components/ui/skeleton";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { parseFilter } from "@/util/parse-filter";
import { Input } from "@/components/ui/input";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { GradeCurricularSelect } from "@/components/common/global-selects/GradeCurricularSelect";
import { useQueryRegistrationForEvaluation } from "@/hooks/students/use-query-registration-for-evaluation";
import { PaginationComponent } from "@/components/common/PaginationComponent";
import { InvoiceStatusBadge } from "@/components/common/Invoice-status-badge";
import { InvoiceStatusSelect } from "@/components/common/global-selects/InvoiceStatusSelect";
import {
  useQuerySchedulesByUc,
  useQuerySchedulesByUc2,
} from "@/hooks/horario/use-query-schedules-by-uc";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";

type Filters = {
  anoLetivo: string;
  semestre: string;
  curso: string;
  anoCurricular: string;
  unidadeCurricular: string;
  tiposAvaliacao: string;
  codigoFactura: string;
  periodo: string;
  horarioId: string;
};

function formatDataFactura(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("pt-PT");
}

export default function RegistrationForEvaluationList() {
  const [formData, setFormData] = useState<Filters>({
    anoLetivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    tiposAvaliacao: "",
    codigoFactura: "",
    periodo: "",
    horarioId: "",
  });
  const filtrosCompletos =
    !isNaN(parseInt(formData.anoLetivo)) &&
    !isNaN(parseInt(formData.semestre)) &&
    !isNaN(parseInt(formData.periodo)) &&
    !isNaN(parseInt(formData.curso)) &&
    !isNaN(parseInt(formData.unidadeCurricular));

  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();

  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: scheduleResponse, isLoading: loadingSchedule } =
    useQuerySchedulesByUc(
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
        enabled: filtrosCompletos,
      },
    );
  const canLoadUcs = !!formData.curso && !!formData.semestre;
  const { data: unidadesCurriculares = [] } = useQueryDisciplinaWithFilter({
    curso: formData.curso,
    semestre: formData.semestre,
    classe: formData.anoCurricular,
  });
  const schedules = scheduleResponse?.data || [];

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

  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
  ];

  const canSearch = !!parseFilter(formData.anoLetivo);

  const updateFilter = (key: keyof Filters, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const {
    data: registrationResponse,
    isLoading: loadingRegistrationList,
    error,
  } = useQueryRegistrationForEvaluation(
    {
      page,
      limit,
      codigoAnoLectivo: parseFilter(formData.anoLetivo),
      codigoCurso: parseFilter(formData.curso),
      codigoClasse: parseFilter(formData.anoCurricular),
      codigoSemestre: parseFilter(formData.semestre),
      codigoGrade: parseFilter(formData.unidadeCurricular),
      codigoHorario: parseFilter(formData.horarioId),
      tipoAvaliacao: parseFilter(formData.tiposAvaliacao),
      estadoFactura: parseFilter(formData.codigoFactura),
      codigoMatricula:
        searchBy === "codigoMatricula" ? parseFilter(searchTerm) : undefined,
      search: searchBy === "nome" ? searchTerm : undefined,
    },
    canSearch,
  );

  const registrations = registrationResponse?.data || [];
  const hasNext = page < (registrationResponse?.totalPages || 1);

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
              <BreadcrumbPage>Inscrições em Avaliação</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <h1 className="text-2xl font-bold">Inscrições em Avaliação</h1>
      <p className="text-muted-foreground">
        Gestão de inscrições de estudantes em avaliações académicas.
      </p>

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
              onChange={(v) => updateFilter("anoLetivo", v)}
              options={academicYear}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
            <PeriodoSelect
              onChangeValue={(v) => updateFilter("periodo", v)}
              value={formData.periodo}
            />
            <SemestreSelect
              onChangeValue={(v) => updateFilter("semestre", v)}
              value={formData.semestre}
            />
            <CourseSelect
              onChangeValue={(v) => updateFilter("curso", v)}
              value={formData.curso}
            />
            <AnoCurricularSelect
              curso={formData.curso}
              onChangeValue={(v) => updateFilter("anoCurricular", v)}
              value={formData.anoCurricular}
            />
            <GradeCurricularSelect
              value={formData.unidadeCurricular}
              disabled={!canLoadUcs}
              onChangeValue={(v) => updateFilter("unidadeCurricular", v)}
              curso={parseFilter(formData.curso)}
              semestre={parseFilter(formData.semestre)}
              classe={parseFilter(formData.anoCurricular)}
              anoLectivo={parseFilter(formData.anoLetivo)}
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
              label="Tipo de Avaliação"
              value={formData.tiposAvaliacao}
              disabled={isLoadingTipoAvaliacao}
              loading={isLoadingTipoAvaliacao}
              onChange={(v) => {
                updateFilter("tiposAvaliacao", v);
              }}
              options={tipoAvaliacao}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />
            <InvoiceStatusSelect
              value={formData.codigoFactura}
              onChangeValue={(v) => {
                updateFilter("codigoFactura", v);
              }}
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
              <div className="flex-1 min-w-[260px] relative">
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
          </div>
        </CardContent>
      </Card>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {!canSearch ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Selecione o Ano Letivo para começar
            </p>
            <p className="text-sm text-muted-foreground">
              Os restantes filtros são opcionais
            </p>
          </div>
        ) : loadingRegistrationList ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Ajuste os filtros acima para refinar a pesquisa
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Classe</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Situação</TableHead>
                    <TableHead>Data Factura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.codigo_inscricao}>
                      <TableCell className="font-mono">
                        {registration.codigo_matricula}
                      </TableCell>
                      <TableCell>{registration.nome_completo}</TableCell>
                      <TableCell>{registration.curso}</TableCell>
                      <TableCell>{registration.semestre}</TableCell>
                      <TableCell>{registration.classe}</TableCell>
                      <TableCell>{registration.disciplina}</TableCell>
                      <TableCell>{registration.avaliacao}</TableCell>
                      <TableCell>{registration.nota ?? "-"}</TableCell>
                      <TableCell>
                        <InvoiceStatusBadge
                          status={registration.estado_factura}
                        />
                      </TableCell>
                      <TableCell>
                        {formatDataFactura(registration.data_factura)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <PaginationComponent
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
  return !!(filters && filters.anoLetivo);
}
