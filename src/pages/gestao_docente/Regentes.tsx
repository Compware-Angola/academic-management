import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/common/DataTable";
import { List } from "lucide-react";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryListDocentesRegentes } from "@/hooks/gestao_docente/use-query-list-docentes-regentes";


type DocenteRegente = {
  codigo_grade: number;
  ano_curricular: string;
  semestre: string;
  unidade_curricular: string;
  docente: string;
  pk_afectacao: number | null;
};

const ESTADOS = [
  { value: "0", label: "Todos" },
  { value: "1", label: "Sem Regente definido" },
  { value: "2", label: "Com Regente definido" },
];

export default function Regentes() {
  const [currentPage, setCurrentPage] = useState(1);

  const [anoLectivo, setAnoLectivo] = useState("");
  const [curso, setCurso] = useState("");
  const [classe, setClasse] = useState("0");
  const [semestre, setSemestre] = useState("");
  const [estado, setEstado] = useState("0");

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    anoLectivo: "",
    curso: "",
    classe: "0",
    semestre: "",
    estado: "0",
  });

  const { data: anosLectivos } = useQueryAnoAcademico();
  const { data: cursos } = useCursos();
  
  const { data: semestres } = useQuerySemestres();
  const { data: classes = [], isLoading: isLoadingClasses } =
      useQueryClassFilterByCurso({ curso: filtrosAplicados.curso });


  const { data, isLoading, isFetching } = useQueryListDocentesRegentes({
    page: currentPage,
    limit: 25,
    ano_lectivo: filtrosAplicados.anoLectivo
      ? Number(filtrosAplicados.anoLectivo)
      : undefined,
    curso: filtrosAplicados.curso
      ? Number(filtrosAplicados.curso)
      : undefined,
    classe:
      filtrosAplicados.classe && filtrosAplicados.classe !== "0"
        ? Number(filtrosAplicados.classe)
        : undefined,
    semestre: filtrosAplicados.semestre
      ? Number(filtrosAplicados.semestre)
      : undefined,
    estado: Number(filtrosAplicados.estado),
  });

  const regentes = data?.data ?? [];

  const exportRows = useMemo(
    () =>
      regentes.map((item: DocenteRegente) => ({
        ano_curricular: item.ano_curricular,
        semestre: item.semestre,
        unidade_curricular: item.unidade_curricular,
        docente: item.docente,
      })),
    [regentes]
  );

  const pdfContent =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Lista de Docentes Regentes"
        subtitle="Listagem de docentes regentes por unidade curricular"
        infoSections={[
          {
            title: "Resumo",
            content: `Total de registos: ${data?.total ?? exportRows.length}`,
          },
        ]}
        mainTable={{
          headers: [
            {
              key: "ano_curricular",
              label: "Ano Curricular",
              width: "20%",
            },
            { key: "semestre", label: "Semestre", width: "20%" },
            {
              key: "unidade_curricular",
              label: "Unidade Curricular",
              width: "35%",
            },
            { key: "docente", label: "Docente", width: "25%" },
          ],
          rows: exportRows,
          headerBackground: "#1e40af",
        }}
        footerNotice="Documento gerado automaticamente pelo sistema."
      />
    ) : null;

  const excelProps =
    exportRows.length > 0
      ? {
          documentTitle: "Lista de Docentes Regentes",
          subtitle: "Listagem de docentes regentes por unidade curricular",
          infoSections: [
            {
              title: "Resumo",
              content: `Total de registos: ${data?.total ?? exportRows.length}`,
            },
          ],
          mainTable: {
            headers: [
              { key: "ano_curricular", label: "Ano Curricular", width: 20 },
              { key: "semestre", label: "Semestre", width: 20 },
              {
                key: "unidade_curricular",
                label: "Unidade Curricular",
                width: 40,
              },
              { key: "docente", label: "Docente", width: 35 },
            ],
            rows: exportRows,
          },
          footerNotice: "Documento gerado automaticamente pelo sistema.",
          primaryColor: "#1e40af",
        }
      : null;

  const columns = [
    { header: "Ano Curricular", accessor: "ano_curricular" },
    { header: "Semestre", accessor: "semestre" },
    { header: "Unidade Curricular", accessor: "unidade_curricular" },
    { header: "Docente", accessor: "docente" },
  ];

  function handleListar() {
    setCurrentPage(1);
    setFiltrosAplicados({
      anoLectivo,
      curso,
      classe,
      semestre,
      estado,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lista de Docentes Regentes"
        actions={
          <>
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`Docentes_Regentes_${new Date()
                  .toISOString()
                  .slice(0, 10)}.pdf`}
                showDownload
                showPrint
              />
            )}

            {excelProps && (
              <ExcelActions
                excelProps={excelProps}
                fileName={`Docentes_Regentes_${new Date()
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
              <Select value={anoLectivo} onValueChange={setAnoLectivo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ano lectivo" />
                </SelectTrigger>
                <SelectContent>
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
              <label className="text-sm font-medium">Curso</label>
              <Select value={curso} onValueChange={setCurso}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o curso" />
                </SelectTrigger>
                <SelectContent>
                  {cursos?.map((item: any) => (
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
              <label className="text-sm font-medium">Ano Curricular</label>
              <Select value={classe} onValueChange={setClasse}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>
                  {classes?.map((item: any) => (
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
              <label className="text-sm font-medium">Semestre</label>
              <Select value={semestre} onValueChange={setSemestre}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o semestre" />
                </SelectTrigger>
                <SelectContent>
                  {semestres?.map((item: any) => (
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
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

            <div className="flex items-end">
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
        data={regentes}
        loading={isLoading || isFetching}
        currentPage={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

