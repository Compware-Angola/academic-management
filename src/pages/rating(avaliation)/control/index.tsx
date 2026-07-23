import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Shield,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
  Printer,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useQueryDisciplinasProva } from "@/hooks/avaliacao/use-query-disciplinas-prova";
import { ModalNotasDisciplina } from "./modal-notas-disciplina";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import PDFActions, { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { useAcademicYears } from "@/hooks/academiccalendar/use-query-academic-years";


type SelectedNotas = {
  turmaOuHorarioId: number;
  tipoAvaliacaoId: number;
  anoLectivoId: number;
};

const ESTADO = [
  { codigo: 0, designacao: "Todos" },
  { codigo: 1, designacao: "Com Nota" },
  { codigo: 2, designacao: "Sem Nota" },
];

export default function ControlNotes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal
  const [openNotasModal, setOpenNotasModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedNotas | null>(null);

  // Filtros
  const [formData, setFormData] = useState({
    tipoCandidatura: "",
    anoLetivo: "",
    semestre: "",
    curso: "",
    classes: "",
    unidadeCurricular: "",
    tipoAvaliacao: "",
    filtro: "0",
  });

  const [searchParams, setSearchParams] = useState<typeof formData | null>(null);

  // =======================================
  // API QUERIES
  // =======================================
  const {
    data: disciplinasProva = [],
    isLoading: loadingDisciplinas,
    refetch,
    isFetching,
  } = useQueryDisciplinasProva({
    filtro: Number(searchParams?.filtro || 0),
    gradeSelecionada: searchParams?.unidadeCurricular
      ? Number(searchParams.unidadeCurricular)
      : undefined,
    cursoSelecionado: searchParams?.curso
      ? Number(searchParams.curso)
      : undefined,
    anoCurricularSelecionado: searchParams?.classes
      ? Number(searchParams.classes)
      : undefined,
    semestreSelecionado: searchParams?.semestre
      ? Number(searchParams.semestre)
      : undefined,
    anoLectivoSelecionado: searchParams?.anoLetivo
      ? Number(searchParams.anoLetivo)
      : undefined,
    tipoAvaliacaoSelecionada: searchParams?.tipoAvaliacao
      ? Number(searchParams.tipoAvaliacao)
      : undefined,
  });

  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: cursos } = useCursos();
  const { data: academicYearResponse } = useAcademicYears({
    tipoCandidatura: parseFilter(formData.tipoCandidatura) ?? 0
  });
  const academicYear = academicYearResponse?.data ?? [];

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      classe: formData.classes,
      curso: formData.curso,
      semestre: formData.semestre,
    });

  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: formData.curso });

  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();

  // =======================================
  // Preparação de dados para PDF (memoizado)
  // =======================================
  const pdfData = useMemo(() => {
    if (!disciplinasProva.length) return null;

    const rows = disciplinasProva.map((item) => {
      const total = item.numeroDeIscritos;
      const lancadas = item.numNotaLancada;
      const pendentes = item.numNotaPorLancar;
      const percent = total > 0 ? ((lancadas / total) * 100).toFixed(1) : "0.0";

      return {
        disciplina: item.disciplina,
        turma: item.turmaOuHorario,
        semestre: item.semestre,
        inscritos: total,
        lancadas,
        pendentes,
        percentagem: `${percent}%`,
        status: pendentes === 0 ? "Concluído" : "Pendente",
      };
    });

    const totalInscritos = disciplinasProva.reduce((sum, d) => sum + d.numeroDeIscritos, 0);
    const totalLancadas = disciplinasProva.reduce((sum, d) => sum + d.numNotaLancada, 0);
    const totalPendentes = disciplinasProva.reduce((sum, d) => sum + d.numNotaPorLancar, 0);
    const percentGlobal = totalInscritos > 0 ? ((totalLancadas / totalInscritos) * 100).toFixed(1) : "0.0";

    const filtroTexto = searchParams
      ? `Ano Letivo: ${academicYear?.find(a => a.codigo === Number(searchParams.anoLetivo))?.designacao || "—"} | ` +
        `Semestre: ${semestres?.find(s => s.codigo === Number(searchParams.semestre))?.designacao || "—"} | ` +
        `Curso: ${cursos?.find(c => c.codigo === Number(searchParams.curso))?.designacao || "—"} | ` +
        `Tipo de Avaliação: ${tipoAvaliacao?.find(t => t.codigo === Number(searchParams.tipoAvaliacao))?.designacao || "—"}`
      : "Filtros não aplicados";

    return {
      rows,
      totais: [
        { label: "Total de Inscritos", value: totalInscritos.toString() },
        { label: "Total de Notas Lançadas", value: totalLancadas.toString() },
        { label: "Total de Notas Pendentes", value: totalPendentes.toString() },
        { label: "Progresso Global", value: `${percentGlobal}%` },
      ],
      filtrosAplicados: filtroTexto,
    };
  }, [disciplinasProva, searchParams, academicYear, semestres, cursos, tipoAvaliacao]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Controle de Lançamento de Notas"
      subtitle="Gestão de lançamento de notas"
      infoSections={[
        {
          title: "Filtros Aplicados",
          content: pdfData.filtrosAplicados,
        },
        {
          title: "Resumo Geral",
          content: pdfData.totais.map((t) => `${t.label}: ${t.value}`),
        },
      ]}
      mainTable={{
        headers: [
          { key: "disciplina", label: "Disciplina", width: "22%" },
          { key: "turma", label: "Turma / Horário", width: "28%" },
          { key: "semestre", label: "Semestre", width: "14%" },
          { key: "inscritos", label: "Inscritos", width: "10%", align: "center" },
          { key: "lancadas", label: "Lançadas", width: "10%", align: "center" },
          { key: "pendentes", label: "Pendentes", width: "10%", align: "center" },
          { key: "percentagem", label: "% Lançado", width: "10%", align: "center" },
          { key: "status", label: "Estado", width: "16%", align: "center" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      totals={pdfData.totais}
      footerNotice={
        "Relatório gerado automaticamente pelo sistema académico. " +
        "Pendências devem ser resolvidas conforme regulamento. " +
        `Data de emissão: ${new Date().toLocaleDateString("pt-AO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      }
      customFooter="Sistema de Gestão Académica – Universidade Metodista de Angola"
    />
  ) : null;

  // =======================================
  // VALIDAÇÃO E PESQUISA
  // =======================================
  const isFormValid =
    formData.tipoCandidatura &&
    formData.anoLetivo &&
    formData.semestre &&
    formData.curso &&
    formData.classes &&
    formData.unidadeCurricular &&
    formData.tipoAvaliacao;

  const handleSearch = () => {
    if (isFormValid) {
      setSearchParams({ ...formData });
      setCurrentPage(1);
    }
  };

  // =======================================
  // PAGINAÇÃO
  // =======================================
  const totalPages = Math.ceil(disciplinasProva.length / itemsPerPage);
  const paginatedDisciplinas = disciplinasProva.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="text-foreground">Controle de Lançamento</span>
      </nav>

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Controle de Lançamento
          </h1>
          <p className="text-muted-foreground">Gestão de lançamento de notas</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handleSearch}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar lista
          </Button>


          {disciplinasProva.length > 0 && pdfContent && (
            <PDFActions
              document={pdfContent}
              fileName={`Controle_Lancamento_Notas_${new Date().toISOString().slice(0, 10)}.pdf`}
              showDownload={true}
              showPrint={true}
            />
          )}
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button
            onClick={handleSearch}
            disabled={!isFormValid || isFetching}
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Pesquisar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <TipoCandidaturaSelect
            value={formData.tipoCandidatura}
            onChangeValue={(v) =>
              setFormData({
                ...formData,
                tipoCandidatura: v,
                anoLetivo: "",
                curso: "",
                classes: "",
                unidadeCurricular: "",
              })
            }
          />

          <AcademicYearsAvailableForOperationSelect
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChangeValue={(v) => setFormData({ ...formData, anoLetivo: v })}
            tipoCandidaturaId={parseFilter(formData.tipoCandidatura) ?? 0}
            enableDefaultActiveYear
            disabled={!formData.tipoCandidatura}
            onlyConfigurable={false}
          />

          <FormSelect
            label="Semestre"
            value={formData.semestre}
            onChange={(v) =>
              setFormData({
                ...formData,
                semestre: v,
                classes: "",
                unidadeCurricular: "",
              })
            }
            options={semestres}
            loading={isLoadingSemestres}
            disabled={isLoadingSemestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />

          <CourseSelect
            value={formData.curso}
            onChangeValue={(v) =>
              setFormData({
                ...formData,
                curso: v,
                classes: "",
                unidadeCurricular: "",
              })
            }
            params={{
              tipoCandidaturaId: parseFilter(formData.tipoCandidatura),
            }}
            disabled={!formData.tipoCandidatura}
          />

          <FormSelect
            label="Ano Curricular"
            value={formData.classes}
            onChange={(v) =>
              setFormData({ ...formData, classes: v, unidadeCurricular: "" })
            }
            options={classes}
            loading={isLoadingClasses}
            disabled={isLoadingClasses || !formData.curso}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />

          <FormSelect
            label="Unidade Curricular"
            value={formData.unidadeCurricular}
            onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
            options={unidadesCurriculares}
            loading={isLoadingUC}
            disabled={
              isLoadingUC ||
              !formData.semestre ||
              !formData.curso ||
              !formData.classes
            }
            map={(u) => ({ key: u.codigo, label: u.descricao, value: u.pk })}
          />

          <FormSelect
            label="Tipo de Avaliação"
            value={formData.tipoAvaliacao}
            onChange={(v) => setFormData({ ...formData, tipoAvaliacao: v })}
            options={tipoAvaliacao}
            loading={isLoadingTipoAvaliacao}
            disabled={isLoadingTipoAvaliacao}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
          />

          <FormSelect
            label="Estado"
            value={formData.filtro}
            onChange={(v) => setFormData({ ...formData, filtro: v })}
            options={ESTADO}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo.toString(),
            })}
          />
        </div>
      </div>

      {/* TABELA */}
      {loadingDisciplinas || isFetching ? (
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : disciplinasProva.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Nenhuma disciplina encontrada</p>
          <p className="text-sm text-muted-foreground mt-2">
            {!searchParams
              ? "Preencha os filtros e clique em Pesquisar para ver os resultados."
              : "Tente ajustar os filtros."}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead className="text-center">Inscritos</TableHead>
                  <TableHead className="text-center">Notas lançadas</TableHead>
                  <TableHead className="text-center">Pendentes</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedDisciplinas.map((item) => (
                  <TableRow key={item.codigoTurmaHorario}>
                    <TableCell className="font-medium">
                      {item.disciplina}
                    </TableCell>
                    <TableCell className="font-mono">
                      {item.turmaOuHorario}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.semestre}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge>{item.numeroDeIscritos}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-emerald-500 text-white">
                        {item.numNotaLancada}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.numNotaPorLancar > 0 ? (
                        <Badge variant="destructive">
                          {item.numNotaPorLancar}
                        </Badge>
                      ) : (
                        <Badge variant="outline">0</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        disabled={item.numNotaLancada <= 0}
                        onClick={() => {
                          setSelectedRow({
                            turmaOuHorarioId: item.codigoTurmaHorario,
                            tipoAvaliacaoId: Number(formData.tipoAvaliacao),
                            anoLectivoId: Number(formData.anoLetivo),
                          });
                          setOpenNotasModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Notas
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* PAGINAÇÃO */}
          <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Label className="text-sm">Itens por página:</Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
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

              <span className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                {Math.min(currentPage * itemsPerPage, disciplinasProva.length)}{" "}
                de {disciplinasProva.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm px-3 py-1">
                {currentPage} / {totalPages || 1}
              </span>

              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      <ModalNotasDisciplina
        open={openNotasModal}
        onClose={() => setOpenNotasModal(false)}
        turmaOuHorarioId={selectedRow?.turmaOuHorarioId}
        tipoAvaliacaoId={selectedRow?.tipoAvaliacaoId}
        anoLectivoId={selectedRow?.anoLectivoId}
      />
    </div>
  );
}
