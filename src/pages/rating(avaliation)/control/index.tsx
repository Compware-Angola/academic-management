import { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

import { useQueryDisciplinasProva } from "@/hooks/avaliacao/use-query-disciplinas-prova";
import { ModalNotasDisciplina } from "./modal-notas-disciplina";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";

type SelectedNotas = {
  turmaOuHorarioId: number;
  tipoAvaliacaoId: number;
  anoLectivoId: number;
};

const VER_HORARIO = [{ codigo: "SIM", designacao: "SIM" }];
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

  // Filtros (apenas aplicados ao clicar em Pesquisar)
  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    curso: "",
    classes: "",
    unidadeCurricular: "",
    tipoAvaliacao: "",
    verHoario: "",
    filtro: "0",
  });

  // Estado para controlar quando os parâmetros foram enviados para a query
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
    verHorario: searchParams?.verHoario === "SIM",
    filtro: Number(searchParams?.filtro || 0),
    gradeSelecionada: searchParams?.unidadeCurricular
      ? Number(searchParams.unidadeCurricular)
      : undefined,
    cursoSelecionado: searchParams?.curso ? Number(searchParams.curso) : undefined,
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

  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } = useQuerySemestres();
  const { data: cursos, isLoading: isLoadingCurso } = useCursos();

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
  // VALIDAÇÃO PARA HABILITAR BOTÃO PESQUISAR
  // =======================================
  const isFormValid =
    formData.anoLetivo &&
    formData.semestre &&
    formData.curso &&
    formData.classes &&
    formData.unidadeCurricular &&
    formData.tipoAvaliacao;

  const handleSearch = () => {
    if (isFormValid) {
      setSearchParams({ ...formData });
      setCurrentPage(1); // Reset paginação
    }
  };

  // =======================================
  // PAGINAÇÃO
  // =======================================
  const totalPages = Math.ceil(disciplinasProva.length / itemsPerPage);
  const paginatedDisciplinas = disciplinasProva.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Controle de Lançamento
          </h1>
          <p className="text-muted-foreground">Gestão de lançamento de notas</p>
        </div>
      </div>

      {/* FILTROS */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
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
          <FormSelect
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
            options={academicYear}
            loading={isLoadingAcademicYear}
            disabled={isLoadingAcademicYear}
            map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
          />

          <FormSelect
            label="Semestre"
            value={formData.semestre}
            onChange={(v) => setFormData({ ...formData, semestre: v, classes: "", unidadeCurricular: "" })}
            options={semestres}
            loading={isLoadingSemestres}
            disabled={isLoadingSemestres}
            map={(s) => ({ key: s.codigo, label: s.designacao, value: s.codigo })}
          />

          <FormSelect
            label="Curso"
            value={formData.curso}
            onChange={(v) => setFormData({ ...formData, curso: v, classes: "", unidadeCurricular: "" })}
            options={cursos}
            loading={isLoadingCurso}
            disabled={isLoadingCurso}
            map={(c) => ({ key: c.codigo, label: c.designacao, value: c.codigo })}
          />

          <FormSelect
            label="Ano Curricular"
            value={formData.classes}
            onChange={(v) => setFormData({ ...formData, classes: v, unidadeCurricular: "" })}
            options={classes}
            loading={isLoadingClasses}
            disabled={isLoadingClasses || !formData.curso}
            map={(c) => ({ key: c.codigo, label: c.designacao, value: c.codigo })}
          />

          <FormSelect
            label="Unidade Curricular"
            value={formData.unidadeCurricular}
            onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
            options={unidadesCurriculares}
            loading={isLoadingUC}
            disabled={isLoadingUC || !formData.semestre || !formData.curso || !formData.classes}
            map={(u) => ({ key: u.codigo, label: u.descricao, value: u.pk })}
          />

          <FormSelect
            label="Tipo de Avaliação"
            value={formData.tipoAvaliacao}
            onChange={(v) => setFormData({ ...formData, tipoAvaliacao: v })}
            options={tipoAvaliacao}
            loading={isLoadingTipoAvaliacao}
            disabled={isLoadingTipoAvaliacao}
            map={(u) => ({ key: u.codigo, label: u.designacao, value: u.codigo })}
          />

          <FormSelect
            label="Ver Horário"
            value={formData.verHoario}
            onChange={(v) => setFormData({ ...formData, verHoario: v })}
            options={VER_HORARIO}
            map={(u) => ({ key: u.codigo, label: u.designacao, value: u.codigo })}
          />

          <FormSelect
            label="Estado"
            value={formData.filtro}
            onChange={(v) => setFormData({ ...formData, filtro: v })}
            options={ESTADO}
            map={(u) => ({ key: u.codigo, label: u.designacao, value: u.codigo.toString() })}
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
                    <TableCell className="font-medium">{item.disciplina}</TableCell>
                    <TableCell className="font-mono">{item.turmaOuHorario}</TableCell>
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
                        <Badge variant="destructive">{item.numNotaPorLancar}</Badge>
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
          <div className="flex items-center justify-between mt-6">
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
                {Math.min(currentPage * itemsPerPage, disciplinasProva.length)} de{" "}
                {disciplinasProva.length}
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