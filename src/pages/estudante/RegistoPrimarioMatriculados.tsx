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
import { useQueryRegistoPrimarioMatriculados } from "@/hooks/students/use-query-registo-primario-matriculados";
import { useClasses } from "@/hooks/use-classes";

type RegistoPrimarioMatriculado = {
  numero: number;
  nome: string;
  numero_bilhete: string;
  sexo: string;
  idade: number;
  data_nascimento: string;
  provincia: string;
  municipio: string | null;
  pais_origem: string;
  periodo_estudo: string;
  unidade_organica: string;
  nome_curso_inscrito_ensino_superior: string;
  ano_frequencia: number | string;
  situacao_academica: string;
  aproveitamento_anual: number;
};

const GRAUS = [
  { value: "0", label: "Todos" },
  { value: "1", label: "Licenciatura" },
  { value: "2", label: "Mestrado" },
  { value: "3", label: "Doutoramento" },
];

const ESTADOS = [
  { value: "2", label: "Todos" },
  { value: "0", label: "Estudantes Antigos" },
  { value: "1", label: "Estudantes Novos" },
];

type FiltersState = {
  anoLectivo: string;
  grau: string;
  anoCurricular: string;
  estado: string;
  search: string;
};

const initialFilters: FiltersState = {
  anoLectivo: "",
  grau: "0",
  anoCurricular: "0",
  estado: "2",
  search: "",
};

export default function RegistoPrimarioMatriculados() {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltersState>(initialFilters);

  const { data: anosLectivos = [] } = useQueryAnoAcademico();
  const { data: anosCurriculares = [] } = useClasses();

  const anosFiltrados = anosCurriculares.filter(
    (item) =>
      item.designacao !== "Poś-Graduação" && item.designacao !== "Todos"
  );

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: 10,
      anoLectivo: filtrosAplicados.anoLectivo
        ? Number(filtrosAplicados.anoLectivo)
        : undefined,
      grau: Number(filtrosAplicados.grau),
      anoCurricular: Number(filtrosAplicados.anoCurricular),
      estado: Number(filtrosAplicados.estado),
      search: filtrosAplicados.search.trim() || undefined,
    }),
    [currentPage, filtrosAplicados]
  );

  const { data, isLoading, isFetching } =
    useQueryRegistoPrimarioMatriculados(queryParams, {
      enabled: shouldFetch && !!filtrosAplicados.anoLectivo,
    });

  const registos = Array.isArray(data?.data) ? data.data : [];

  function formatDate(dateString: string) {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatAproveitamento(value: number) {
    if (value === null || value === undefined) return "-";
    return `${Number(value).toFixed(2)}%`;
  }

  const exportRows = useMemo(
    () =>
      registos.map((item: RegistoPrimarioMatriculado) => ({
        nome: item.nome,
        numero_bilhete: item.numero_bilhete,
        sexo: item.sexo,
        idade: item.idade,
        data_nascimento: formatDate(item.data_nascimento),
        provincia: item.provincia,
        municipio: item.municipio ?? "-",
        pais_origem: item.pais_origem,
        periodo_estudo: item.periodo_estudo,
        unidade_organica: item.unidade_organica,
        nome_curso_inscrito_ensino_superior:
          item.nome_curso_inscrito_ensino_superior,
        ano_frequencia: item.ano_frequencia,
        situacao_academica: item.situacao_academica,
        aproveitamento_anual: formatAproveitamento(item.aproveitamento_anual),
      })),
    [registos]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        orientation="horizontal"
        documentTitle="Registo Primário de Matriculados"
        subtitle="Listagem de estudantes matriculados"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "nome", label: "Nome", width: "22%" },
            { key: "numero_bilhete", label: "Nº Bilhete", width: "12%" },
            { key: "sexo", label: "Sexo", width: "8%" },
            { key: "idade", label: "Idade", width: "8%" },
            { key: "data_nascimento", label: "Nascimento", width: "10%" },
            { key: "provincia", label: "Província", width: "12%" },
            { key: "municipio", label: "Município", width: "12%" },
            { key: "pais_origem", label: "País", width: "12%" },
            { key: "periodo_estudo", label: "Período", width: "10%" },
            { key: "unidade_organica", label: "Unidade Orgânica", width: "14%" },
            {
              key: "nome_curso_inscrito_ensino_superior",
              label: "Curso",
              width: "16%",
            },
            { key: "ano_frequencia", label: "Ano Frequência", width: "10%" },
            {
              key: "situacao_academica",
              label: "Situação Académica",
              width: "14%",
            },
            {
              key: "aproveitamento_anual",
              label: "Aproveitamento",
              width: "12%",
            },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
        documentTitle: "Registo Primário de Matriculados",
        subtitle: "Listagem de estudantes matriculados",
        infoSections: [
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ],
        mainTable: {
          headers: [
            { key: "nome", label: "Nome", width: 35 },
            { key: "numero_bilhete", label: "Nº Bilhete", width: 18 },
            { key: "sexo", label: "Sexo", width: 10 },
            { key: "idade", label: "Idade", width: 10 },
            { key: "data_nascimento", label: "Nascimento", width: 16 },
            { key: "provincia", label: "Província", width: 18 },
            { key: "municipio", label: "Município", width: 18 },
            { key: "pais_origem", label: "País", width: 18 },
            { key: "periodo_estudo", label: "Período", width: 15 },
            { key: "unidade_organica", label: "Unidade Orgânica", width: 25 },
            {
              key: "nome_curso_inscrito_ensino_superior",
              label: "Curso",
              width: 28,
            },
            { key: "ano_frequencia", label: "Ano Frequência", width: 14 },
            {
              key: "situacao_academica",
              label: "Situação Académica",
              width: 20,
            },
            {
              key: "aproveitamento_anual",
              label: "Aproveitamento",
              width: 16,
            },
          ],
          rows: exportRows,
        },
        primaryColor: "#0D1B48",
      }
      : null;

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Nº Bilhete", accessor: "numero_bilhete" },
    { header: "Sexo", accessor: "sexo" },
    { header: "Idade", accessor: "idade" },
    {
      header: "Nascimento",
      accessor: "data_nascimento",
      cell: (row: RegistoPrimarioMatriculado) =>
        formatDate(row.data_nascimento),
    },
    { header: "Província", accessor: "provincia" },
    {
      header: "Município",
      accessor: "municipio",
      cell: (row: RegistoPrimarioMatriculado) => row.municipio ?? "-",
    },
    { header: "País", accessor: "pais_origem" },
    { header: "Período", accessor: "periodo_estudo" },
    { header: "Unidade Orgânica", accessor: "unidade_organica" },
    {
      header: "Curso",
      accessor: "nome_curso_inscrito_ensino_superior",
    },
    { header: "Ano Frequência", accessor: "ano_frequencia" },
    { header: "Situação Académica", accessor: "situacao_academica" },
    {
      header: "Aproveitamento",
      accessor: "aproveitamento_anual",
      cell: (row: RegistoPrimarioMatriculado) =>
        formatAproveitamento(row.aproveitamento_anual),
    },
  ];

  function handleFilterChange<K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K]
  ) {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleListar() {
    if (!filters.anoLectivo) return;

    setCurrentPage(1);
    setFiltrosAplicados(filters);
    setShouldFetch(true);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registo Primário de Matriculados"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Registo_Primario_Matriculados_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Registo_Primario_Matriculados_${new Date()
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
          <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Lectivo</label>
              <Select
                value={filters.anoLectivo}
                onValueChange={(value) =>
                  handleFilterChange("anoLectivo", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano lectivo" />
                </SelectTrigger>
                <SelectContent>
                  {anosLectivos.map((ano: any) => (
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
              <label className="text-sm font-medium">Grau</label>
              <Select
                value={filters.grau}
                onValueChange={(value) => handleFilterChange("grau", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o grau" />
                </SelectTrigger>
                <SelectContent>
                  {GRAUS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select
                value={filters.anoCurricular}
                onValueChange={(value) =>
                  handleFilterChange("anoCurricular", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano curricular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {anosFiltrados.map((item: any) => (
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
                onValueChange={(value) => handleFilterChange("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, bilhete, curso ou unidade orgânica"
                  value={filters.search}
                  onChange={(e) =>
                    handleFilterChange("search", e.target.value)
                  }
                  className="pl-9"
                />
              </div>
            </div>

            <div className="flex items-end md:col-span-1">
              <Button className="w-full" onClick={handleListar}>
                <List className="mr-2 h-4 w-4" />
                Listar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="font-semibold text-primary">
        Total De Registros : {data?.total ?? 0}
      </div>

      <DataTable
        columns={columns}
        data={registos}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}