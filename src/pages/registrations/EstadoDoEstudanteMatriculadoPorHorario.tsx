import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, List, Loader2, Search, Users } from "lucide-react";

import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/common/DataTable";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
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
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryHorariosDisponiveisInscritosPorUc } from "@/hooks/enrollment/use-query-horarios-disponiveis-por-uc";
import { useQueryEstadoMatriculaPorHorario } from "@/hooks/registrations/use-query-estado-matriculados-por-horario";


type EstadoMatriculaPorHorarioRow = {
  numero: number;
  matricula: number;
  nome: string;
  tipo_aluno: string;
  horario: string;
  curso: string;
  estado: string;
  cor: string;
  ano_curricular: number;
};

const ESTADOS_MATRICULA = [
  { value: "0", label: "Todos" },
  { value: "1", label: "ACTIVO REGULAR" },
  { value: "4", label: "INACTIVO DEVEDOR AC" },
  { value: "6", label: "DIPLOMADO" },
  { value: "7", label: "ACTIVO IRREGULAR" },
  { value: "8", label: "ACTIVO FINALISTA" },
  { value: "10", label: "INACTIVO" },
];

export default function EstadoMatriculaPorHorario() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({
    anoLectivo: "",
    curso: "",
    anoCurricular: "0",
    semestre: "",
    turno: "",
    unidadeCurricular: "",
    horario: "0",
    estado: "0",
    search: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    anoLectivo: "",
    curso: "",
    anoCurricular: "0",
    semestre: "",
    turno: "",
    unidadeCurricular: "",
    horario: "0",
    estado: "0",
    search: "",
  });

  const { data: anosAcademicos = [] } = useQueryAnoAcademico();
  const { data: semestres = [] } = useQuerySemestres();
  const { data: periodos = [] } = useQueryPeriod();

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
        filters.anoCurricular && filters.anoCurricular !== "0"
          ? filters.anoCurricular
          : undefined,
    });

  const canLoadHorarios =
    !!filters.anoLectivo &&
    !!filters.semestre &&
    !!filters.turno &&
    !!filters.curso &&
    !!filters.unidadeCurricular;

  const { data: horarios = [], isLoading: isLoadingHorarios } =
    useQueryHorariosDisponiveisInscritosPorUc({
      anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : 0,
      curso: filters.curso ? Number(filters.curso) : 0,
      anoCurricular:
        filters.anoCurricular && filters.anoCurricular !== "0"
          ? Number(filters.anoCurricular)
          : 0,
      semestre: filters.semestre ? Number(filters.semestre) : 0,
      periodo: filters.turno ? Number(filters.turno) : 0,
      cadeira: filters.unidadeCurricular
        ? Number(filters.unidadeCurricular)
        : 0,
    });

  const canLoadLista =
    !!appliedFilters.anoLectivo &&
    !!appliedFilters.semestre &&
    !!appliedFilters.turno &&
    !!appliedFilters.curso &&
    !!appliedFilters.unidadeCurricular;

  const {
    data: listaResponse,
    isLoading,
    isFetching,
  } = useQueryEstadoMatriculaPorHorario({
    page,
    limit,
    anoLectivo: appliedFilters.anoLectivo
      ? Number(appliedFilters.anoLectivo)
      : 0,
    curso: appliedFilters.curso ? Number(appliedFilters.curso) : 0,
    anoCurricular: appliedFilters.anoCurricular
      ? Number(appliedFilters.anoCurricular)
      : 0,
    semestre: appliedFilters.semestre
      ? Number(appliedFilters.semestre)
      : 0,
    turno: appliedFilters.turno ? Number(appliedFilters.turno) : 0,
    unidadeCurricular: appliedFilters.unidadeCurricular
      ? Number(appliedFilters.unidadeCurricular)
      : 0,
    horario: appliedFilters.horario ? Number(appliedFilters.horario) : 0,
    estado: appliedFilters.estado ? Number(appliedFilters.estado) : 0,
    search: appliedFilters.search ?? "",
  });

  const lista = canLoadLista ? listaResponse?.data ?? [] : [];

  const exportRows = useMemo(
    () =>
      lista.map((item: EstadoMatriculaPorHorarioRow) => ({
        matricula: item.matricula,
        nome: item.nome,
        tipo_aluno: item.tipo_aluno,
        horario: item.horario,
        curso: item.curso,
        estado: item.estado,
        ano_curricular: item.ano_curricular,
      })),
    [lista]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Estado da Matrícula por Horário"
        subtitle="Listagem de estudantes por estado da matrícula e horário"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${listaResponse?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "matricula", label: "Matrícula", width: "12%" },
            { key: "nome", label: "Nome", width: "28%" },
            { key: "tipo_aluno", label: "Tipo Aluno", width: "14%" },
            { key: "horario", label: "Horário", width: "16%" },
            { key: "curso", label: "Curso", width: "18%" },
            { key: "estado", label: "Estado", width: "18%" },
            { key: "ano_curricular", label: "Ano Curricular", width: "10%" },
          ],
          rows: exportRows,
          headerBackground: "#1e40af",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Estado da Matrícula por Horário",
          subtitle: "Listagem de estudantes por estado da matrícula e horário",
          infoSections: [
            {
              title: "Resumo",
              content: `Total de registos: ${listaResponse?.total ?? exportRows.length}`,
            },
          ],
          mainTable: {
            headers: [
              { key: "matricula", label: "Matrícula", width: 16 },
              { key: "nome", label: "Nome", width: 35 },
              { key: "tipo_aluno", label: "Tipo Aluno", width: 18 },
              { key: "horario", label: "Horário", width: 22 },
              { key: "curso", label: "Curso", width: 25 },
              { key: "estado", label: "Estado", width: 22 },
              { key: "ano_curricular", label: "Ano Curricular", width: 16 },
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
    { header: "Horário", accessor: "horario" },
    { header: "Curso", accessor: "curso" },
    { header: "Estado", accessor: "estado" },
    { header: "Ano Curricular", accessor: "ano_curricular" },
  ];

  function handleListar() {
    setPage(1);
    setAppliedFilters(filters);
  }

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
          <BreadcrumbItem>Matrículas</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Estado da Matrícula por Horário</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Listar Estado da Matrícula por Horário"
        subtitle="Consulta de estudantes por horário e estado da matrícula"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Estado_Matricula_Horario_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Estado_Matricula_Horario_${new Date()
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
              <CourseSelect
                value={filters.curso}
                onChangeValue={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    curso: String(v),
                    anoCurricular: "0",
                    unidadeCurricular: "",
                    horario: "0",
                  }))
                }
              />
            </div>

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
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {anosCurriculares.map((ac: any) => (
                    <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                      {ac.designacao}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select
                value={filters.turno}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    turno: v,
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
              <label className="text-sm font-medium">Unidade Curricular</label>
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
                  {horarios.map((item: any) => (
                    <SelectItem
                      key={item.CODIGO ?? item.codigo}
                      value={String(item.CODIGO ?? item.codigo)}
                    >
                      {item.DESIGNACAO ?? item.designacao}
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
                  {ESTADOS_MATRICULA.map((item) => (
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
                  placeholder="Pesquisar por nome, matrícula, curso, estado ou horário"
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
          <CardTitle>Estudantes Encontrados</CardTitle>
        </CardHeader>

        <CardContent>
          {!canLoadLista ? (
            <div className="text-center py-16 text-muted-foreground">
              Selecione os filtros principais para listar os estudantes.
            </div>
          ) : isLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando estudantes...</p>
            </div>
          ) : lista.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum estudante encontrado.
            </div>
          ) : (
            <>
              <div className="text-primary font-semibold mb-4">
                Total De Registros : {listaResponse?.total ?? 0}
              </div>

              <DataTable
                columns={columns}
                data={lista}
                loading={false}
                currentPage={listaResponse?.page ?? 1}
                totalPages={listaResponse?.totalPages ?? 1}
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