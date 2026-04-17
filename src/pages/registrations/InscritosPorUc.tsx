import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, List, Loader2, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryInscritosPorUc } from "@/hooks/enrollment/use-query-inscritos-por-uc";
import { useQueryHorariosDisponiveisInscritosPorUc } from "@/hooks/enrollment/use-query-horarios-disponiveis-por-uc";


type InscritoPorUcRow = {
  numero: number;
  matricula: number | string;
  nome: string;
  tipo_aluno: string;
  curso: string;
  estado: string;
};

const ESTADOS = [
  { value: "0", label: "Todos" },
  { value: "1", label: "Em curso" },
  { value: "2", label: "Pendente" },
];

export default function InscritosPorUc() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    horario: "0",
    estado: "0",
    search: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    anoLectivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    horario: "0",
    estado: "0",
    search: "",
  });

  const { data: anosAcademicos = [] } = useQueryAnoAcademico();
  const { data: semestres = [] } = useQuerySemestres();
  const { data: periodos = [] } = useQueryPeriod();
  const { data: cursos = [] } = useCursos();

  console.log("PERIODOS: ", periodos)

  const { data: anosCurriculares = [], isLoading: isLoadingAnoCurricular } =
    useQueryClassFilterByCurso({
      curso: filters.curso,
    });

  const canLoadUcs = !!filters.curso && !!filters.semestre;

  const { data: unidadesCurriculares = [], isLoading: isLoadingUc } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe:
        filters.anoCurricular && filters.anoCurricular !== "all"
          ? filters.anoCurricular
          : undefined,
    });

  
  const { data: horarios = [], isLoading: isLoadingHorarios } =
  useQueryHorariosDisponiveisInscritosPorUc({
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : 0,
    curso: filters.curso ? Number(filters.curso) : 0,
    anoCurricular:
      filters.anoCurricular && filters.anoCurricular !== "all"
        ? Number(filters.anoCurricular)
        : 0,
    semestre: filters.semestre ? Number(filters.semestre) : 0,
    periodo: 0,
    cadeira: filters.unidadeCurricular
      ? Number(filters.unidadeCurricular)
      : 0,
  });

  const horariosOptions = Array.isArray(horarios)
  ? horarios
      .map((item: any) => ({
        codigo: item.codigo ?? item.CODIGO,
        designacao: item.designacao ?? item.DESIGNACAO,
      }))
      .filter((item) => item.codigo)
  : [];

  const canLoadHorarios =
    !!filters.anoLectivo &&
    !!filters.semestre &&
    !!filters.periodo &&
    !!filters.curso &&
    !!filters.unidadeCurricular;


  const canLoadInscritos =
    !!appliedFilters.anoLectivo &&
    !!appliedFilters.semestre &&
    !!appliedFilters.periodo &&
    !!appliedFilters.curso &&
    !!appliedFilters.unidadeCurricular;

  const {
    data: inscritosResponse,
    isLoading,
    isFetching,
  } = useQueryInscritosPorUc({
    page,
    limit,
    anoLectivo: appliedFilters.anoLectivo
      ? Number(appliedFilters.anoLectivo)
      : 0,
    curso: appliedFilters.curso ? Number(appliedFilters.curso) : 0,
    anoCurricular:
      appliedFilters.anoCurricular &&
      appliedFilters.anoCurricular !== "all"
        ? Number(appliedFilters.anoCurricular)
        : 0,
    semestre: appliedFilters.semestre ? Number(appliedFilters.semestre) : 0,
    periodo: 0,
    cadeira: appliedFilters.unidadeCurricular
      ? Number(appliedFilters.unidadeCurricular)
      : 0,
    horario: appliedFilters.horario ? Number(appliedFilters.horario) : 0,
    estado: appliedFilters.estado ?? "0",
    search: appliedFilters.search ?? "",
  });

  const inscritos = canLoadInscritos ? inscritosResponse?.data ?? [] : [];

  const exportRows = useMemo(
    () =>
      inscritos.map((item: InscritoPorUcRow) => ({
        matricula: item.matricula,
        nome: item.nome,
        tipo_aluno: item.tipo_aluno,
        curso: item.curso,
        estado: item.estado,
      })),
    [inscritos]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Lista de Inscritos por UC"
        subtitle="Listagem de estudantes inscritos por unidade curricular"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${inscritosResponse?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "matricula", label: "Matrícula", width: "15%" },
            { key: "nome", label: "Nome", width: "40%" },
            { key: "tipo_aluno", label: "Tipo Aluno", width: "15%" },
            { key: "curso", label: "Curso", width: "20%" },
            { key: "estado", label: "Estado", width: "10%" },
          ],
          rows: exportRows,
          headerBackground: "#1e40af",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Lista de Inscritos por UC",
          subtitle: "Listagem de estudantes inscritos por unidade curricular",
          infoSections: [
            {
              title: "Resumo",
              content: `Total de registos: ${inscritosResponse?.total ?? exportRows.length}`,
            },
          ],
          mainTable: {
            headers: [
              { key: "matricula", label: "Matrícula", width: 20 },
              { key: "nome", label: "Nome", width: 40 },
              { key: "tipo_aluno", label: "Tipo Aluno", width: 18 },
              { key: "curso", label: "Curso", width: 25 },
              { key: "estado", label: "Estado", width: 18 },
            ],
            rows: exportRows,
          },
          primaryColor: "#1e40af",
        }
      : null;

  const columns = [
    { header: "Matrícula", accessor: "matricula" },
    { header: "Nome", accessor: "nome" },
    { header: "Tipo Aluno", accessor: "tipo_aluno" },
    { header: "Curso", accessor: "curso" },
    { header: "Estado", accessor: "estado" },
  ];

  function handleListar() {
    setPage(1);
    setAppliedFilters(filters);
  }

  console.log("PARAMS HORARIO:", {
  anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : 0,
  curso: filters.curso ? Number(filters.curso) : 0,
  anoCurricular:
    filters.anoCurricular && filters.anoCurricular !== "all"
      ? Number(filters.anoCurricular)
      : 0,
  semestre: filters.semestre ? Number(filters.semestre) : 0,
  periodo: filters.periodo ? Number(filters.periodo) : 0,
  cadeira: filters.unidadeCurricular ? Number(filters.unidadeCurricular) : 0,
});

console.log("HORARIOS RAW:", horarios);
console.log("HORARIOS NORMALIZED:", horariosOptions);

  return (
    <div className="p-6 space-y-8">
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
          <BreadcrumbItem>Inscrições</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inscritos por UC</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Listar Inscritos por UC"
        subtitle="Consulta de estudantes inscritos por unidade curricular"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Inscritos_por_UC_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Inscritos_por_UC_${new Date()
                  .toISOString()
                  .slice(0, 10)}.xlsx`}
                showDownload
              />
            )}
          </>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Lectivo</label>
              <Select
                value={filters.anoLectivo}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    anoLectivo: v,
                    horario: "0",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {anosAcademicos.map((a: any) => (
                    <SelectItem key={a.codigo} value={a.codigo.toString()}>
                      {a.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select
                value={filters.semestre}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    semestre: v,
                    anoCurricular: "",
                    unidadeCurricular: "",
                    horario: "0",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {semestres.map((s: any) => (
                    <SelectItem key={s.codigo} value={s.codigo.toString()}>
                      {s.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    periodo: v,
                    horario: "0",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {periodos.map((p: any) => (
                    <SelectItem key={p.codigo} value={p.codigo.toString()}>
                      {p.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <CourseSelect
                value={filters.curso}
                onChangeValue={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    curso: String(v),
                    anoCurricular: "",
                    unidadeCurricular: "",
                    horario: "0",
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    anoCurricular: v,
                    unidadeCurricular: "",
                    horario: "0",
                  }))
                }
                disabled={!filters.curso || isLoadingAnoCurricular}
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
                  {anosCurriculares.map((ac: any) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                      {ac.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Unidade Curricular
              </label>
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    unidadeCurricular: v,
                    horario: "0",
                  }))
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
                          : isLoadingUc
                            ? "Carregando UCs..."
                            : "Selecionar UC"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {unidadesCurriculares.map((uc: any) => (
                    <SelectItem key={uc.pk} value={uc.pk.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Horário</label>
              <Select
                value={filters.horario}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    horario: v,
                  }))
                }
                disabled={!canLoadHorarios}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      canLoadHorarios
                        ? isLoadingHorarios
                          ? "Carregando horários..."
                          : "Selecionar horário"
                        : "Selecione os filtros"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {horariosOptions.map((item: any) => (
                    <SelectItem
                      key={item.codigo}
                      value={item.codigo.toString()}
                    >
                      {item.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select
                value={filters.estado}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    estado: v,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar estado" />
                </SelectTrigger>
                <SelectContent>
                  {ESTADOS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome ou matrícula"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button className="w-full" onClick={handleListar}>
                <List className="h-4 w-4 mr-2" />
                Listar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inscritos Encontrados</CardTitle>
        </CardHeader>

        <CardContent>
          {!canLoadInscritos ? (
            <div className="text-center py-16 text-muted-foreground">
              Selecione os filtros principais para listar os inscritos.
            </div>
          ) : isLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando inscritos...</p>
            </div>
          ) : inscritos.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum inscrito encontrado.
            </div>
          ) : (
            <>
              <div className="text-primary font-semibold mb-4">
                Total De Registros : {inscritosResponse?.total ?? 0}
              </div>

              <DataTable
                columns={columns}
                data={inscritos}
                loading={false}
                currentPage={inscritosResponse?.page ?? 1}
                totalPages={inscritosResponse?.totalPages ?? 1}
                onPageChange={setPage}
              />

              <div className="flex items-center justify-end gap-2 mt-4">
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}