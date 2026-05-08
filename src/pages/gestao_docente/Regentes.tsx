import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";


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
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useDefinirRegente } from "@/hooks/gestao_docente/use-definir-regente";


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
  const [classe, setClasse] = useState("");
  const [semestre, setSemestre] = useState("0");
  const [estado, setEstado] = useState("0");

  const { user: userData } = useAuth();
  const { mutateAsync: definirRegente, isPending: isSavingRegente } =
    useDefinirRegente();

  const [openModalRegente, setOpenModalRegente] = useState(false);
  const [linhaSelecionada, setLinhaSelecionada] = useState<DocenteRegente | null>(null);
  const [docenteSelecionado, setDocenteSelecionado] = useState("");

  const { data: teachersData = [] } = useQueryTeacther();

  const [filtrosAplicados, setFiltrosAplicados] = useState({
    anoLectivo: "",
    curso: "",
    classe: "0",
    semestre: "0",
    estado: "0",
  });

  const { data: anosLectivos } = useQueryAnoAcademico();
  const { data: cursos } = useCursos();

  const { data: semestres } = useQuerySemestres();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso });


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
          headerBackground: "#0D1B48",
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
        primaryColor: "#0D1B48",
      }
      : null;

  const columns = [
    { header: "Ano Curricular", accessor: "ano_curricular" },
    { header: "Semestre", accessor: "semestre" },
    { header: "Unidade Curricular", accessor: "unidade_curricular" },
    { header: "Docente", accessor: "docente" },
    {
      header: "Ação",
      accessor: "acao",
      cell: (row: DocenteRegente) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleOpenDefinirRegente(row)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  function handleOpenDefinirRegente(row: DocenteRegente) {
    setLinhaSelecionada(row);
    setDocenteSelecionado("");
    setOpenModalRegente(true);
  }

  async function handleSalvarRegente() {
    if (!linhaSelecionada) return;

    if (!anoLectivo && !filtrosAplicados.anoLectivo) {
      toast?.error?.("Selecione o ano lectivo");
      return;
    }

    if (!semestre && !filtrosAplicados.semestre) {
      toast?.error?.("Selecione o semestre");
      return;
    }

    if (!docenteSelecionado) {
      toast?.error?.("Selecione o docente");
      return;
    }

    try {
      await definirRegente({
        anoLectivo: Number(filtrosAplicados.anoLectivo || anoLectivo),
        gradeCurricular: Number(linhaSelecionada.codigo_grade),
        docente: Number(docenteSelecionado),
        semestre: Number(filtrosAplicados.semestre || semestre),
        createdBy: Number(userData?.user?.codigo_importado ?? 1),
      });

      toast?.success?.("Regente definido com sucesso");
      setOpenModalRegente(false);
      setLinhaSelecionada(null);
      setDocenteSelecionado("");
    } catch (error: any) {
      toast?.error?.(
        error?.response?.data?.message ?? "Erro ao definir regente"
      );
    }
  }

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

              <CourseSelect
                value={curso}
                onChangeValue={(v) => {
                  setCurso(String(v));
                  setClasse("0");
                }}
              />
            </div>

            <div className="space-y-2">
              <FormSelect
                label="Ano Curricular"
                value={classe}
                disabled={isLoadingClasses || !curso}
                onChange={(v) => setClasse(String(v))}
                options={[{ codigo: "0", designacao: "Todos" }, ...classes]}
                map={(c: any) => ({
                  key: c.codigo,
                  label: c.designacao,
                  value: String(c.codigo),
                })}
                loading={isLoadingClasses}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Semestre</label>
              <Select value={semestre} onValueChange={setSemestre}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Todos</SelectItem>

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

      <Dialog open={openModalRegente} onOpenChange={setOpenModalRegente}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Definir Regente</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Docente</label>
              <FormCommandSelect
                width="full"
                value={docenteSelecionado}
                options={teachersData}
                map={(t: any) => ({
                  key: t.codigo ?? t.CODIGO,
                  value: String(t.codigo ?? t.CODIGO),
                  label: t.nome ?? t.NOME,
                })}
                onChange={(codigo) => setDocenteSelecionado(String(codigo))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setOpenModalRegente(false);
                setLinhaSelecionada(null);
                setDocenteSelecionado("");
              }}
            >
              Cancelar
            </Button>

            <Button onClick={handleSalvarRegente} disabled={isSavingRegente}>
              {isSavingRegente ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

