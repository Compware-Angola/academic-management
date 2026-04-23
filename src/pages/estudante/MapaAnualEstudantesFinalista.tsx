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
import { useQueryMapaAnualFinalistas } from "@/hooks/students/use-query-mapa-anual-finalistas";


type Finalista = {
  numero: number;
  nome: string;
  numero_bilhete: string;
  genero: string;
  idade: number;
  data_nascimento: string;
  provincia: string;
  municipio: string;
  pais_origem: string;
  periodo_estudo: string;
  unidade_organica: string;
  curso: string;
  ano_primeira_matricula: string | number;
  trabalhador: string;
  duracao_curso: number;
  media_final: number;
};

const GRAUS = [
  { value: "1", label: "Licenciatura" },
  { value: "2", label: "Mestrado" },
  { value: "3", label: "Doutoramento" },
];

export default function MapaAnualEstudantesFinalistas() {
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    anoLectivo: "",
    grau: "1",
    search: "",
  });

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    anoLectivo: "",
    grau: "1",
    search: "",
  });

  const { data: anosLectivos = [] } = useQueryAnoAcademico();

  const { data, isLoading, isFetching } = useQueryMapaAnualFinalistas({
    page: currentPage,
    limit: 10,
    anoLectivo: filtrosAplicados.anoLectivo
      ? Number(filtrosAplicados.anoLectivo)
      : 0,
    grau: filtrosAplicados.grau ? Number(filtrosAplicados.grau) : 0,
    search: filters.search ?? "",
  });

  const finalistas = data?.data ?? [];

  function formatDate(dateString: string) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatMedia(value: number) {
    if (value === null || value === undefined) return "-";
    return Number(value).toFixed(0);
  }

  const exportRows = useMemo(
    () =>
      finalistas.map((item: Finalista) => ({
        nome: item.nome,
        numero_bilhete: item.numero_bilhete,
        genero: item.genero,
        idade: item.idade,
        data_nascimento: formatDate(item.data_nascimento),
        provincia: item.provincia,
        municipio: item.municipio,
        pais_origem: item.pais_origem,
        periodo_estudo: item.periodo_estudo,
        unidade_organica: item.unidade_organica,
        curso: item.curso,
        ano_primeira_matricula: item.ano_primeira_matricula,
        trabalhador: item.trabalhador,
        duracao_curso: item.duracao_curso,
        media_final: formatMedia(item.media_final),
      })),
    [finalistas]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        orientation="horizontal"
        documentTitle="Mapa Anual de Estudantes Finalistas"
        subtitle="Listagem de estudantes finalistas"
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
            { key: "genero", label: "Género", width: "8%" },
            { key: "idade", label: "Idade", width: "7%" },
            { key: "data_nascimento", label: "Nascimento", width: "10%" },
            { key: "provincia", label: "Província", width: "12%" },
            { key: "municipio", label: "Município", width: "12%" },
            { key: "pais_origem", label: "País", width: "12%" },
            { key: "periodo_estudo", label: "Período", width: "10%" },
            { key: "unidade_organica", label: "Unidade Orgânica", width: "14%" },
            { key: "curso", label: "Curso", width: "14%" },
            { key: "ano_primeira_matricula", label: "1ª Matrícula", width: "10%" },
            { key: "trabalhador", label: "Trabalhador", width: "10%" },
            { key: "duracao_curso", label: "Duração", width: "8%" },
            { key: "media_final", label: "Média Final", width: "8%" },
          ],
          rows: exportRows,
          headerBackground: "#1e40af",
        }}
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Mapa Anual de Estudantes Finalistas",
          subtitle: "Listagem de estudantes finalistas",
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
              { key: "genero", label: "Género", width: 12 },
              { key: "idade", label: "Idade", width: 10 },
              { key: "data_nascimento", label: "Nascimento", width: 16 },
              { key: "provincia", label: "Província", width: 18 },
              { key: "municipio", label: "Município", width: 18 },
              { key: "pais_origem", label: "País", width: 18 },
              { key: "periodo_estudo", label: "Período", width: 16 },
              { key: "unidade_organica", label: "Unidade Orgânica", width: 25 },
              { key: "curso", label: "Curso", width: 25 },
              { key: "ano_primeira_matricula", label: "1ª Matrícula", width: 14 },
              { key: "trabalhador", label: "Trabalhador", width: 14 },
              { key: "duracao_curso", label: "Duração", width: 12 },
              { key: "media_final", label: "Média Final", width: 12 },
            ],
            rows: exportRows,
          },
          primaryColor: "#1e40af",
        }
      : null;

  const columns = [
    { header: "Nome", accessor: "nome" },
    { header: "Nº Bilhete", accessor: "numero_bilhete" },
    { header: "Género", accessor: "genero" },
    { header: "Idade", accessor: "idade" },
    {
      header: "Nascimento",
      accessor: "data_nascimento",
      cell: (row: Finalista) => formatDate(row.data_nascimento),
    },
    { header: "Província", accessor: "provincia" },
    { header: "Município", accessor: "municipio" },
    { header: "País", accessor: "pais_origem" },
    { header: "Período", accessor: "periodo_estudo" },
    { header: "Unidade Orgânica", accessor: "unidade_organica" },
    { header: "Curso", accessor: "curso" },
    { header: "1ª Matrícula", accessor: "ano_primeira_matricula" },
    { header: "Trabalhador", accessor: "trabalhador" },
    { header: "Duração", accessor: "duracao_curso" },
    {
      header: "Média Final",
      accessor: "media_final",
      cell: (row: Finalista) => formatMedia(row.media_final),
    },
  ];

  function handleListar() {
    if (!filters.anoLectivo || filters.anoLectivo === "0") {
      return;
    }

    setCurrentPage(1);
    setFiltrosAplicados(filters);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mapa Anual de Estudantes Finalistas"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Mapa_Anual_Finalistas_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Mapa_Anual_Finalistas_${new Date()
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
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, grau: v }))
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
          </div>

          <div className="flex justify-start">
            <Button onClick={handleListar}>
              <List className="h-4 w-4 mr-2" />
              Listar
            </Button>

            
          </div>
        </CardContent>
      </Card>

      <div className="space-y">
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

      <div className="text-primary font-semibold">
        Total De Registros : {data?.total ?? 0}
      </div>

      <DataTable
        columns={columns}
        data={finalistas}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}