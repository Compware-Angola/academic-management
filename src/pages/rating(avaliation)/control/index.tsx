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
} from "lucide-react";

import { Link } from "react-router-dom";

import { useQueryDisciplinasProva } from "@/hooks/discplina/use-query-disciplinas-prova";
import { ModalNotasDisciplina } from "./modal-notas-disciplina";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";

type SelectedNotas = {
  turmaOuHorarioId: number;
  tipoAvaliacaoId: number;
  anoLectivoId: number;
};
const VER_HORARIO = [
  { codigo: "SIM", designacao: "SIM" },
  { codigo: "NÃO", designacao: "NÃO" },
];

export default function ControlNotes() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =======================================
  // MODAL
  // =======================================
  const [openNotasModal, setOpenNotasModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedNotas | null>(null);
  const [formData, setFormData] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    unidadeCurricular: "",
    classes: "",
    tipoAvaliacao: "",
    tipoProva: "",
    verHoario: "",
    filtro: "",
  });
  // =======================================
  // API — DISCIPLINAS PROVA
  // =======================================
  const {
    data: disciplinasProva = [],
    isLoading: loadingDisciplinas,
    refetch,
  } = useQueryDisciplinasProva({
    verHorario: formData.verHoario === "SIM",
    filtro: 0,
    gradeSelecionada: formData.unidadeCurricular
      ? Number(formData.unidadeCurricular)
      : undefined,
    cursoSelecionado: formData.curso ? Number(formData.curso) : undefined,
    anoCurricularSelecionado: formData.classes
      ? Number(formData.classes)
      : undefined,
    semestreSelecionado: formData.semestre
      ? Number(formData.semestre)
      : undefined,
    anoLectivoSelecionado: formData.anoLetivo
      ? Number(formData.anoLetivo)
      : undefined,
    tipoProvaSelecionada: formData.tipoProva
      ? Number(formData.tipoProva)
      : undefined,
    tipoAvaliacaoSelecionada: formData.tipoAvaliacao
      ? Number(formData.tipoAvaliacao)
      : undefined,
  });

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();
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
  const { data: tipoProva = [], isLoading: isLoadingTipoProva } =
    useQueryTipoProva();

  // =======================================
  // PAGINAÇÃO LOCAL
  // =======================================
  const totalPages = Math.ceil(disciplinasProva.length / itemsPerPage);

  const paginatedDisciplinas = disciplinasProva?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* ===========================
          BREADCRUMB
      =========================== */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="text-foreground">Controle de Lançamento</span>
      </nav>

      {/* ===========================
           HEADER
      =========================== */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Controle de Lançamento
          </h1>
          <p className="text-muted-foreground">Gestão de lançamento de notas</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          disabled={loadingDisciplinas}
          onClick={() => refetch()}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${
              loadingDisciplinas ? "animate-spin" : ""
            }`}
          />
          Atualizar
        </Button>
      </div>

      {/* ===========================
            FILTROS
      =========================== */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <FormSelect
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={formData.anoLetivo}
            onChange={(v) => setFormData({ ...formData, anoLetivo: v })}
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
            })}
          />

          {/* SEMESTRE */}
          <FormSelect
            disabled={isLoadingSemestres}
            loading={isLoadingSemestres}
            label="Semestre"
            value={formData.semestre}
            onChange={(v) => setFormData({ ...formData, semestre: v })}
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
            })}
          />

          {/* CURSO */}
          <FormSelect
            disabled={isLoadingCurso}
            loading={isLoadingCurso}
            label="Curso"
            value={formData.curso}
            onChange={(v) => setFormData({ ...formData, curso: v })}
            options={cursos}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
            })}
          />
          <FormSelect
            label="Ano Curricular"
            value={formData.classes}
            disabled={isLoadingClasses || !formData.curso}
            onChange={(v) => setFormData({ ...formData, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
            })}
            loading={isLoadingClasses}
          />

          {/* PERÍODO */}

          {/* UC */}
          <FormSelect
            label="Unidade Curricular"
            value={formData.unidadeCurricular}
            disabled={
              isLoadingUC ||
              !formData.semestre ||
              !formData.curso ||
              !formData.classes
            }
            onChange={(v) => setFormData({ ...formData, unidadeCurricular: v })}
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.pk,
              label: u.descricao,
            })}
            loading={isLoadingUC}
          />
          <FormSelect
            label="Tipo de Prova"
            value={formData.tipoProva}
            disabled={isLoadingTipoProva}
            onChange={(v) => setFormData({ ...formData, tipoProva: v })}
            options={tipoProva}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
            })}
            loading={isLoadingTipoProva}
          />
          <FormSelect
            label="Tipo de Avaliação"
            value={formData.tipoAvaliacao}
            disabled={isLoadingTipoAvaliacao}
            onChange={(v) => setFormData({ ...formData, tipoAvaliacao: v })}
            options={tipoAvaliacao}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
            })}
            loading={isLoadingTipoAvaliacao}
          />
          <FormSelect
            label="Ver Horário"
            value={formData.verHoario}
            onChange={(v) => setFormData({ ...formData, verHoario: v })}
            options={VER_HORARIO}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
            })}
          />
        </div>
      </div>

      {/* ===========================
            TABELA
      =========================== */}
      {loadingDisciplinas ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : paginatedDisciplinas?.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Nenhuma disciplina encontrada</p>
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
                {paginatedDisciplinas?.map((item) => (
                  <TableRow key={item.codigoTurmaHorario}>
                    <TableCell>{item.disciplina}</TableCell>

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

          {/* ===========================
                PAGINAÇÃO
          =========================== */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
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

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm px-3 py-1">
                {currentPage} / {totalPages}
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

      {/* ===========================
              MODAL
      =========================== */}
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
