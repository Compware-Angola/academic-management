import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";

import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";

import { Button } from "@/components/ui/button";
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

import { parseFilter } from "@/util/parse-filter";
import { useQuerySexo } from "@/hooks/acess/use-query-sexo";
import { useQueryEstudantesDiplomados } from "@/hooks/students/use-query-estudantes-diplomados";
import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { Input } from "@/components/ui/input";

type GeneroDiplomado = "todos" | "Masculino" | "Feminino";

export function ListaEstudantesDiplomados() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState<{
    anoLectivo: string;
    faculdade: string;
    curso: string;
    genero: GeneroDiplomado;
    tipoCandidatura: string;
  }>({
    anoLectivo: "",
    faculdade: "",
    curso: "",
    genero: "todos",
    tipoCandidatura: "0",
  });

  const [appliedFilters, setAppliedFilters] = useState<typeof filters | null>(
    null,
  );

  const { data: sexos = [], isLoading: isLoadingSexo } = useQuerySexo();

  useEffect(() => {
    if (filters.faculdade === "all" || filters.faculdade === "") {
      setFilters((prev) => ({
        ...prev,
        curso: "",
      }));
    }
  }, [filters.faculdade]);

  const { data, isLoading } = useQueryEstudantesDiplomados(
    {
      anoLectivo: Number(appliedFilters?.anoLectivo),
      codigoCurso: Number(parseFilter(appliedFilters?.curso) ?? 0),
      genero: appliedFilters?.genero ?? "todos",
      tipoCandidatura: Number(appliedFilters?.tipoCandidatura || 0),
      page,
      limit,
      search
    },
    !!appliedFilters?.anoLectivo,
  );

  const estudantes = data?.data ?? [];
  const total = data?.total ?? 0;

  const exportRows = useMemo(
    () =>
      estudantes.map((e) => ({
        matricula: e.matricula,
        nome: e.nome,
        bilhete: e.bilhete,
        curso: e.curso,
        tipoCandidatura: e.tipo_candidatura,
        dataMatricula: e.data_matricula,
        dataConclusao: e.data_conclusao,
        genero: e.genero,
        idade: e.idade,
        media: e.media,
      })),
    [estudantes]
  );
  const pdfData = exportRows.length
    ? {
      filtros: [
        filters.anoLectivo ? `Ano Letivo: ${filters.anoLectivo}` : null,
        filters.faculdade ? `Faculdade: ${filters.faculdade}` : null,
        filters.curso ? `Curso: ${filters.curso}` : null,
        filters.genero ? `Género: ${filters.genero}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
      rows: exportRows,
    }
    : null;
  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Lista de Estudantes Diplomados"
      subtitle="Relatório académico"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
      ]}
      mainTable={{
        headers: [
          { key: "matricula", label: "Matrícula", width: "12%" },
          { key: "nome", label: "Nome", width: "20%" },
          { key: "bilhete", label: "BI", width: "15%" },
          { key: "curso", label: "Curso", width: "20%" },
          { key: "media", label: "Média", width: "10%" },
          { key: "genero", label: "Género", width: "10%" },
        ],
        rows: pdfData.rows,
      }}
      footerNotice="Documento gerado automaticamente"
    />
  ) : null;

  const excelProps = pdfData
    ? {
      documentTitle: "Lista de Estudantes Diplomados",
      subtitle: "Relatório académico",
      infoSections: [
        { title: "Filtros Aplicados", content: pdfData.filtros || "Sem filtros" },
        { title: "Total", content: [`${total}`] },
      ],
      mainTable: {
        headers: [
          { key: "matricula", label: "Matrícula", width: 18 },
          { key: "nome", label: "Nome", width: 30 },
          { key: "bilhete", label: "BI", width: 20 },
          { key: "curso", label: "Curso", width: 25 },
          { key: "media", label: "Média", width: 15 },
          { key: "genero", label: "Género", width: 15 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente",
    }
    : null;

  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lista de estudantes diplomados</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>


      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-6">Lista de Estudantes Diplomados</h1>

        {pdfContent && (
          <div className="flex gap-2">
            <PDFActions document={pdfContent} fileName="estudantes_diplomados.pdf" />
            <ExcelActions excelProps={excelProps!} fileName="estudantes_diplomados.xlsx" />
          </div>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 grid-cols-1 lg:grid-cols-4 items-end">
            <AcademicYearSelect
              enableDefaultActiveYear
              value={filters.anoLectivo}
              onChangeValue={(v) =>
                setFilters({ ...filters, anoLectivo: v })
              }
            />

            <FacultySelect
              value={filters.faculdade}
              allOption
              onChangeValue={(v) =>
                setFilters({ ...filters, faculdade: v })
              }
            />

            <CourseSelect
              enableDefaultSelectItem
              value={filters.curso}
              params={{
                faculdadeId: parseFilter(filters.faculdade),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />

            <FormSelect
              label="Género"
              value={filters.genero}
              loading={isLoadingSexo}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  genero: v as GeneroDiplomado,
                })
              }
              options={[
                {
                  codigo: "todos",
                  designacao: "Todos",
                },
                ...sexos.filter((s) => s.codigo !== 3),
              ]}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo === "todos" ? "todos" : s.designacao,
              })}
            />

            <FormSelect
              label="Grau"
              value={filters.tipoCandidatura}
              onChange={(v) =>
                setFilters({ ...filters, tipoCandidatura: v })
              }
              options={TIPOS_CANDIDATURA}
              map={(item) => ({
                key: item.codigo,
                label: item.designacao,
                value: item.codigo,
              })}
            />

            <Button
              className="gap-2"
              onClick={() => {
                setPage(1);
                setAppliedFilters(filters);
              }}
              disabled={!filters.anoLectivo}
            >
              <Search className="h-4 w-4" />
              Listar
            </Button>
          </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-sm font-medium">Pesquisar</label>
                            <div className="relative">
                              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                          placeholder="Pesquisar por nome, matrícula, BI ou curso..."
                          value={search}
                          onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                          }}
                          className="max-w-sm"
                        />
                            </div>
                          </div>
                        </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de Registros: {total}</CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">
                Carregando estudantes diplomados...
              </p>
            </div>
          ) : estudantes.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum estudante diplomado encontrado.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Nº Bilhete</TableHead>
                    <TableHead>Data nascimento</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Tipo candidatura</TableHead>
                    <TableHead>Tipo Aluno</TableHead>
                    <TableHead>Data matrícula</TableHead>
                    <TableHead>Data conclusão</TableHead>
                    <TableHead>Género</TableHead>
                    <TableHead>Idade</TableHead>
                    <TableHead>Média</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {estudantes.map((estudante) => (
                    <TableRow key={estudante.matricula}>
                      <TableCell>{estudante.matricula}</TableCell>
                      <TableCell>{estudante.nome}</TableCell>
                      <TableCell>{estudante.bilhete}</TableCell>
                      <TableCell>
                        {formatDate(estudante.data_nascimento)}
                      </TableCell>
                      <TableCell>{estudante.curso}</TableCell>
                      <TableCell>{estudante.tipo_candidatura}</TableCell>
                      <TableCell>{estudante.tipo_aluno}</TableCell>
                      <TableCell>{formatDate(estudante.data_matricula)}</TableCell>
                      <TableCell>{formatDate(estudante.data_conclusao)}</TableCell>
                      <TableCell>{estudante.genero}</TableCell>
                      <TableCell>{estudante.idade}</TableCell>
                      <TableCell>{estudante.media}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>


              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Página {data?.page ?? 1} de {data?.totalPages ?? 1}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>

                  <Button
                    variant="outline"
                    disabled={page >= (data?.totalPages ?? 1)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>

            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

const TIPOS_CANDIDATURA = [
  {
    codigo: "0",
    designacao: "Todos",
  },
  {
    codigo: "1",
    designacao: "Licenciatura",
  },
  {
    codigo: "2",
    designacao: "Mestrado",
  },
  {
    codigo: "3",
    designacao: "Doutoramento",
  },
];

function formatDate(value?: string) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-AO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}