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

import { useQueryRegistoPrimarioExamesAcesso } from "@/hooks/students/use-query-registo-primario-exames-acesso";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";


type RegistoPrimarioExameAcesso = {
  numero: number;
  nome: string;
  numero_bilhete: string;
  sexo: string;
  idade: number;
  data_nascimento: string;
  provincia_residencia: string;
  pais_origem: string;
  municipio: string;
  periodo_estudo: string;
  curso: string;
  nota_exame_acesso: number;
  escola_ensino_medio: string;
  trabalhador: string;
  unidade_organica: string;
  necessidade_especial: string;
  proveniencia: string;
  curso_ensino_medio: string;
  estudante_matriculado_primeira_vez: string;
  admissao: string;
};

const GRAUS = [
  { value: "1", label: "Licenciatura" },
  { value: "2", label: "Mestrado" },
  { value: "3", label: "Doutoramento" },
];

export default function RegistoPrimarioExamesAcesso() {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    anoLectivo: "23",
    grau: "1",
    search: "",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    anoLectivo: "23",
    grau: "1",
    search: "",
  });

  const { data, isLoading, isFetching } = useQueryRegistoPrimarioExamesAcesso({
    page: currentPage,
    limit: 10,
    anoLectivo: filtrosAplicados.anoLectivo
      ? Number(filtrosAplicados.anoLectivo)
      : 0,
    grau: filtrosAplicados.grau ? Number(filtrosAplicados.grau) : 0,
    search: filters.search ?? "",
  });

  const registos = data?.data ?? [];

  function formatDate(dateString: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatNota(value: number) {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(2);
  }

  const exportRows = useMemo(
    () =>
      registos.map((item: RegistoPrimarioExameAcesso) => ({
        nome: item.nome,
        numero_bilhete: item.numero_bilhete,
        sexo: item.sexo,
        idade: item.idade,
        data_nascimento: formatDate(item.data_nascimento),
        provincia_residencia: item.provincia_residencia,
        pais_origem: item.pais_origem,
        municipio: item.municipio,
        unidade_organica: item.unidade_organica,
        curso: item.curso,
        nota_exame_acesso: formatNota(item.nota_exame_acesso),
        escola_ensino_medio: item.escola_ensino_medio,
        trabalhador: item.trabalhador,
        periodo_estudo: item.periodo_estudo,
        necessidade_especial: item.necessidade_especial,
        proveniencia: item.proveniencia,
        curso_ensino_medio: item.curso_ensino_medio,
        estudante_matriculado_primeira_vez:
          item.estudante_matriculado_primeira_vez,
        admissao: item.admissao,
      })),
    [registos]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        orientation="horizontal"
        documentTitle="Registo Primário de Exames de Acesso"
        subtitle="Listagem de candidatos dos exames de acesso"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            { key: "nome", label: "Nome", width: "24%" },
            { key: "numero_bilhete", label: "Nº Bilhete", width: "12%" },
            { key: "sexo", label: "Sexo", width: "8%" },
            { key: "idade", label: "Idade", width: "8%" },
            { key: "data_nascimento", label: "Nascimento", width: "10%" },
            { key: "provincia_residencia", label: "Província", width: "12%" },
            { key: "pais_origem", label: "País", width: "12%" },
            { key: "municipio", label: "Município", width: "12%" },
            { key: "periodo_estudo", label: "Período", width: "10%" },
            { key: "curso", label: "Curso", width: "14%" },
            { key: "nota_exame_acesso", label: "Nota Exame", width: "10%" },
            { key: "escola_ensino_medio", label: "Escola", width: "14%" },
            { key: "trabalhador", label: "Trabalhador", width: "10%" },
            { key: "unidade_organica", label: "Unidade Orgânica", width: "14%" },
            { key: "necessidade_especial", label: "Necessidade", width: "12%" },

            {
              key: "estudante_matriculado_primeira_vez",
              label: "1ª Vez",
              width: "10%",
            },
            { key: "admissao", label: "Admissão", width: "10%" },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
        documentTitle: "Registo Primário de Exames de Acesso",
        subtitle: "Listagem de candidatos dos exames de acesso",
        infoSections: [
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ],
        mainTable: {
          headers: [
            { key: "nome", label: "Nome", width: 35 },
            { key: "numero_bilhete", label: "Nº Bilhete", width: 20 },
            { key: "sexo", label: "Sexo", width: 10 },
            { key: "idade", label: "Idade", width: 10 },
            { key: "data_nascimento", label: "Nascimento", width: 16 },
            { key: "provincia_residencia", label: "Província", width: 20 },
            { key: "pais_origem", label: "País", width: 20 },
            { key: "municipio", label: "Município", width: 20 },
            { key: "periodo_estudo", label: "Período", width: 15 },
            { key: "curso", label: "Curso", width: 25 },
            { key: "nota_exame_acesso", label: "Nota Exame", width: 15 },
            { key: "escola_ensino_medio", label: "Escola", width: 25 },
            { key: "trabalhador", label: "Trabalhador", width: 15 },
            { key: "unidade_organica", label: "Unidade Orgânica", width: 25 },
            { key: "necessidade_especial", label: "Necessidade", width: 20 },
            { key: "proveniencia", label: "Proveniência", width: 20 },
            { key: "curso_ensino_medio", label: "Curso Ensino Médio", width: 25 },
            { key: "estudante_matriculado_primeira_vez", label: "1ª Vez", width: 15 },
            { key: "admissao", label: "Admissão", width: 12 },
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
      header: "Data Nascimento",
      accessor: "data_nascimento",
      cell: (row: RegistoPrimarioExameAcesso) =>
        formatDate(row.data_nascimento),
    },
    { header: "Província", accessor: "provincia_residencia" },
    { header: "País", accessor: "pais_origem" },
    { header: "Município", accessor: "municipio" },
    { header: "Unidade Orgânica", accessor: "unidade_organica" },
    { header: "Curso Inscrito no Ensino superior", accessor: "curso" },
    {
      header: "Nota Exame de Acesso",
      accessor: "nota_exame_acesso",
      cell: (row: RegistoPrimarioExameAcesso) =>
        formatNota(row.nota_exame_acesso),
    },

    { header: "Unidade Orgânica", accessor: "unidade_organica" },
    { header: "Turno de Estudo", accessor: "periodo_estudo" },


    {
      header: "Estudantes Matriculados pela 1ª Vez",
      accessor: "estudante_matriculado_primeira_vez",
    },
    { header: "Admissão", accessor: "admissao" },
    {
      header: "Necessidade Especial", accessor: "necessidade_especial",
    }

  ];

  function handleListar() {
    if (!filters.anoLectivo || !filters.grau || filters.grau === "0") return;

    setCurrentPage(1);
    setFiltrosAplicados(filters);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Registo Primário de Exames de Acesso"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Registo_Primario_Exames_Acesso_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Registo_Primario_Exames_Acesso_${new Date()
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Grau</label>
              <Select
                value={filters.grau}
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    grau: v,
                    anoLectivo: "",
                  }))
                }
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
              <AcademicYearsAvailableForOperationSelect
                value={filters.anoLectivo}
                onChangeValue={(v) =>
                  setFilters((prev) => ({ ...prev, anoLectivo: v }))
                }
                tipoCandidaturaId={parseFilter(filters.grau) ?? 1}
                onlyConfigurable={false}
                disabled={!filters.grau}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Pesquisar</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome ou nº bilhete"
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

          <div className="flex justify-start">
            <Button onClick={handleListar}>
              <List className="h-4 w-4 mr-2" />
              Listar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-primary font-semibold">
        Total De Registos : {data?.total ?? 0}
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
