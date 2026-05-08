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
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryEstudantesPorEstadoMatricula } from "@/hooks/registrations/use-query-estudantes-matriculados-por-estados";


type EstudantePorEstadoMatriculaRow = {
  numero: number;
  matricula: number;
  nome: string;
  tipo_aluno: string;
  telefone: string;
  email: string;
  curso: string;
  ano_curricular: number;
  estado: string;
  cor: string;
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

export default function ListarEstudantesPorEstadoMatricula() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [filters, setFilters] = useState({
    anoLectivo: "",
    curso: "",
    turno: "0",
    estado: "0",
    anoCurricular: "0",
    search: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    anoLectivo: "",
    curso: "",
    turno: "0",
    estado: "0",
    anoCurricular: "0",
    search: "",
  });

  const { data: anosAcademicos = [] } = useQueryAnoAcademico();
  const { data: periodos = [] } = useQueryPeriod();

  const { data: anosCurriculares = [], isLoading: isLoadingAnoCurricular } =
    useQueryClassFilterByCurso({
      curso: filters.curso,
    });

  const canLoadLista = !!appliedFilters.anoLectivo && !!appliedFilters.curso;

  const {
    data: listaResponse,
    isLoading,
    isFetching,
  } = useQueryEstudantesPorEstadoMatricula({
    page,
    limit,
    anoLectivo: appliedFilters.anoLectivo
      ? Number(appliedFilters.anoLectivo)
      : 0,
    curso: appliedFilters.curso ? Number(appliedFilters.curso) : 0,
    turno: appliedFilters.turno ? Number(appliedFilters.turno) : 0,
    estado: appliedFilters.estado ? Number(appliedFilters.estado) : 0,
    anoCurricular: appliedFilters.anoCurricular
      ? Number(appliedFilters.anoCurricular)
      : 0,
    search: appliedFilters.search ?? "",
  });

  const lista = canLoadLista ? listaResponse?.data ?? [] : [];

  const exportRows = useMemo(
    () =>
      lista.map((item: EstudantePorEstadoMatriculaRow) => ({
        matricula: item.matricula,
        nome: item.nome,
        tipo_aluno: item.tipo_aluno,
        telefone: item.telefone,
        email: item.email,
        curso: item.curso,
        ano_curricular: item.ano_curricular,
        estado: item.estado,
      })),
    [lista]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Estudantes por Estado da Matrícula"
        subtitle="Listagem de estudantes por estado da matrícula"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${listaResponse?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "matricula", label: "Matrícula", width: "12%" },
            { key: "nome", label: "Nome", width: "24%" },
            { key: "tipo_aluno", label: "Tipo Aluno", width: "14%" },
            { key: "telefone", label: "Telefone", width: "14%" },
            { key: "email", label: "Email", width: "18%" },
            { key: "curso", label: "Curso", width: "18%" },
            { key: "ano_curricular", label: "Ano Curricular", width: "10%" },
            { key: "estado", label: "Estado", width: "16%" },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
        documentTitle: "Estudantes por Estado da Matrícula",
        subtitle: "Listagem de estudantes por estado da matrícula",
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
            { key: "telefone", label: "Telefone", width: 18 },
            { key: "email", label: "Email", width: 28 },
            { key: "curso", label: "Curso", width: 25 },
            { key: "ano_curricular", label: "Ano Curricular", width: 16 },
            { key: "estado", label: "Estado", width: 22 },
          ],
          rows: exportRows,
        },
        primaryColor: "#0D1B48",
      }
      : null;

  const columns = [
    { header: "Matrícula", accessor: "matricula" },
    { header: "Nome", accessor: "nome" },
    { header: "Tipo Aluno", accessor: "tipo_aluno" },
    { header: "Telefone", accessor: "telefone" },
    { header: "Email", accessor: "email" },
    { header: "Curso", accessor: "curso" },
    { header: "Ano Curricular", accessor: "ano_curricular" },
    { header: "Estado", accessor: "estado" },
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
            <BreadcrumbPage>Estudantes por Estado da Matrícula</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Listar Estudantes por Estado da Matrícula"
        subtitle="Consulta de estudantes filtrados pelo estado da matrícula"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Estudantes_Por_Estado_Matricula_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Estudantes_Por_Estado_Matricula_${new Date()
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Lectivo</label>
              <Select
                value={filters.anoLectivo}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, anoLectivo: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano lectivo" />
                </SelectTrigger>
                <SelectContent>
                  {anosAcademicos.map((ano: any) => (
                    <SelectItem
                      key={ano.codigo ?? ano.CODIGO}
                      value={String(ano.codigo ?? ano.CODIGO)}
                    >
                      {ano.designacao ?? ano.DESIGNACAO}
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
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Turno</label>
              <Select
                value={filters.turno}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, turno: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {periodos.map((item: any) => (
                    <SelectItem
                      key={item.codigo ?? item.CODIGO}
                      value={String(item.codigo ?? item.CODIGO)}
                    >
                      {item.designacao ?? item.DESIGNACAO}
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
                  setFilters((prev) => ({ ...prev, estado: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    anoCurricular: v,
                  }))
                }
                disabled={!filters.curso || isLoadingAnoCurricular}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano curricular" />
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

            <div className="flex items-end md:col-span-1">
              <Button className="w-full" onClick={handleListar}>
                <List className="h-4 w-4 mr-2" />
                Listar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por matrícula, nome, telefone, email, curso ou estado"
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
              Selecione pelo menos o ano lectivo e o curso para listar os estudantes.
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