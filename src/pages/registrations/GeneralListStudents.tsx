import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/DataTable";
import { List, Search } from "lucide-react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryNacionalidade } from "@/hooks/acess/use-query-nacionalidade";
import { useQueryListagemGeralEstudantes } from "@/hooks/enrollment/use-query-listagem-geral-estudantes";
import { useQueryPeriod } from "@/hooks/period/use-query-period";

type EstudanteGeral = {
  numero: number;
  numero_matricula: string | number;
  nome: string;
  tipo_aluno: string;
  ano_lectivo: string;
  sexo: string;
  naturalidade: string;
  necessidade: string;
  faculdade: string;
  curso: string;
  ano_curricular: string | number;
  periodo: string;
};

const SEXOS = [
  { value: "0", label: "Todos" },
  { value: "1", label: "Masculino" },
  { value: "2", label: "Feminino" },
  { value: "3", label: "Não quero declarar" },
];

// placeholders temporários
const GRAUS_ACADEMICOS = [
  { value: "0",           label: "Todos" },
  {value: "doutoramento", label: "Doutoramento"},
  {value: "licenciatura", label: "Licenciatura"},
  {value: "Mestrado",     label: "Mestrado"}
];

const NECESSIDADES = [
  { value: "0", label: "Todos" },
];


export default function ListaGeralEstudantes() {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    anoLectivo: "",
    faculdade: "",
    grauAcademico: "0",
    curso: "",
    anoCurricular: "0",
    periodo: "0",
    nacionalidade: "0",
    necessidade: "0",
    sexo: "0",
    search: "",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    anoLectivo: "",
    faculdade: "",
    grauAcademico: "0",
    curso: "",
    anoCurricular: "0",
    periodo: "0",
    nacionalidade: "0",
    necessidade: "0",
    sexo: "0",
    search: "",
  });

  const { data: anosLectivos = [] } = useQueryAnoAcademico();
  const { data: cursos = [] } = useCursos();
  const { data: estadosNacionalidade = [], isLoading: isLoadingNacionalidade } =
    useQueryNacionalidade();
const { data: periodos = [] } = useQueryPeriod();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  const { data, isLoading, isFetching } = useQueryListagemGeralEstudantes({
    page: currentPage,
    limit: 10,
    anoLectivo: filtrosAplicados.anoLectivo
      ? Number(filtrosAplicados.anoLectivo)
      : 0,
    faculdade: filtrosAplicados.faculdade
      ? Number(filtrosAplicados.faculdade)
      : 0,
    grauAcademico: filtrosAplicados.grauAcademico
      ? Number(filtrosAplicados.grauAcademico)
      : 0,
    curso: filtrosAplicados.curso ? Number(filtrosAplicados.curso) : 0,
    anoCurricular: filtrosAplicados.anoCurricular
      ? Number(filtrosAplicados.anoCurricular)
      : 0,
    periodo: filtrosAplicados.periodo ? Number(filtrosAplicados.periodo) : 0,
    nacionalidade: filtrosAplicados.nacionalidade
      ? Number(filtrosAplicados.nacionalidade)
      : 0,
    necessidade: filtrosAplicados.necessidade
      ? Number(filtrosAplicados.necessidade)
      : 0,
    sexo: filtrosAplicados.sexo ? Number(filtrosAplicados.sexo) : 0,
    search: filtrosAplicados.search ?? "",
  });

  const estudantes = data?.data ?? [];

  const exportRows = useMemo(
    () =>
      estudantes.map((item: EstudanteGeral) => ({
        numero_matricula: item.numero_matricula,
        nome: item.nome,
        tipo_aluno: item.tipo_aluno,
        ano_lectivo: item.ano_lectivo,
        sexo: item.sexo,
        naturalidade: item.naturalidade,
        necessidade: item.necessidade,
        faculdade: item.faculdade,
        curso: item.curso,
        ano_curricular: item.ano_curricular,
        periodo: item.periodo,
      })),
    [estudantes]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Listagem Geral de Estudantes"
        subtitle="Listagem completa de estudantes"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "numero_matricula", label: "Nº Matrícula", width: "12%" },
            { key: "nome", label: "Nome", width: "25%" },
            { key: "tipo_aluno", label: "Tipo Aluno", width: "12%" },
            { key: "ano_lectivo", label: "Ano Lectivo", width: "10%" },
            { key: "sexo", label: "Sexo", width: "8%" },
            { key: "naturalidade", label: "Naturalidade", width: "12%" },
            { key: "necessidade", label: "Necessidade", width: "12%" },
            { key: "faculdade", label: "Faculdade", width: "12%" },
            { key: "curso", label: "Curso", width: "15%" },
            { key: "ano_curricular", label: "Ano Curricular", width: "10%" },
            { key: "periodo", label: "Período", width: "10%" },
          ],
          rows: exportRows,
          headerBackground: "#1e40af",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Listagem Geral de Estudantes",
          subtitle: "Listagem completa de estudantes",
          infoSections: [
            {
              title: "Resumo",
              content: `Total de registos: ${data?.total ?? exportRows.length}`,
            },
          ],
          mainTable: {
            headers: [
              { key: "numero_matricula", label: "Nº Matrícula", width: 18 },
              { key: "nome", label: "Nome", width: 35 },
              { key: "tipo_aluno", label: "Tipo Aluno", width: 18 },
              { key: "ano_lectivo", label: "Ano Lectivo", width: 15 },
              { key: "sexo", label: "Sexo", width: 12 },
              { key: "naturalidade", label: "Naturalidade", width: 20 },
              { key: "necessidade", label: "Necessidade", width: 20 },
              { key: "faculdade", label: "Faculdade", width: 20 },
              { key: "curso", label: "Curso", width: 25 },
              { key: "ano_curricular", label: "Ano Curricular", width: 15 },
              { key: "periodo", label: "Período", width: 15 },
            ],
            rows: exportRows,
          },
          primaryColor: "#1e40af",
        }
      : null;

  const columns = [
    { header: "Nº Matrícula", accessor: "numero_matricula" },
    { header: "Nome", accessor: "nome" },
    { header: "Tipo Aluno", accessor: "tipo_aluno" },
    { header: "Ano Lectivo", accessor: "ano_lectivo" },
    { header: "Sexo", accessor: "sexo" },
    { header: "Naturalidade", accessor: "naturalidade" },
    { header: "Necessidade", accessor: "necessidade" },
    { header: "Faculdade", accessor: "faculdade" },
    { header: "Curso", accessor: "curso" },
    { header: "Ano Curricular", accessor: "ano_curricular" },
    { header: "Período", accessor: "periodo" },
  ];

  function handleListar() {
    setCurrentPage(1);
    setFiltrosAplicados(filters);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listagem Geral de Estudantes"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Lista_Geral_Estudantes_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Lista_Geral_Estudantes_${new Date()
                  .toISOString()
                  .slice(0, 10)}.xlsx`}
                showDownload
              />
            )}
          </>
        }
      />

      <Card>
        <CardContent className="pt-6">
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
                  <SelectItem value="0">Todos</SelectItem>
                  {anosLectivos?.map((ano: any) => (
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
              <label className="text-sm font-medium">Grau Académico</label>
              <Select
                value={filters.grauAcademico}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, grauAcademico: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grau académico" />
                </SelectTrigger>
                <SelectContent>
                  {GRAUS_ACADEMICOS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
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
              <FormSelect
                label="Ano Curricular"
                value={filters.anoCurricular}
                disabled={!filters.curso}
                onChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    anoCurricular: String(v),
                  }))
                }
                options={anosCurriculares}
                map={(c: any) => ({
                  key: c.codigo,
                  label: c.designacao,
                  value: String(c.codigo),
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sexo</label>
              <Select
                value={filters.sexo}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, sexo: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  {SEXOS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Nacionalidade</label>
              <Select
                value={filters.nacionalidade}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, nacionalidade: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a nacionalidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {estadosNacionalidade?.map((item: any) => (
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
              <label className="text-sm font-medium">Período</label>
              <Select
                value={filters.periodo}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, periodo: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o período" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="0">Todos</SelectItem>
                    {periodos?.map((item: any) => (
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
              <label className="text-sm font-medium">Necessidade</label>
              <Select
                value={filters.necessidade}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, necessidade: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a necessidade" />
                </SelectTrigger>
                <SelectContent>
                  {NECESSIDADES.map((item) => (
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
                  placeholder="Pesquisar por nome ou nº matrícula"
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

            <div className="flex items-end md:col-span-1">
              <Button className="w-full" onClick={handleListar}>
                <List className="h-4 w-4 mr-2" />
                Listar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-primary font-semibold">
        Total De Registros : {data?.total ?? 0}
      </div>

      <DataTable
        columns={columns}
        data={estudantes}
        loading={isLoading || isFetching || isLoadingNacionalidade}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}