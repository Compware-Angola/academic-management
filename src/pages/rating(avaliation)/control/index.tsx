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

import { RefreshCw, Shield, ChevronLeft, ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

import { useQueryDisciplinasProva } from "@/hooks/discplina/use-query-disciplinas-prova";
import { ModalNotasDisciplina } from "./modal-notas-disciplina";

// ========================
// MOCK DOS SELECTS
// ========================
const MOCK_OPTIONS = {
  grades: [{ label: "Grade 98", value: "98" }],
  cursos: [{ label: "Arquitetura", value: "78" }],
  anosCurriculares: [{ label: "2º Ano", value: "2" }],
  semestres: [{ label: "1º Semestre", value: "1" }],
  anosLectivos: [{ label: "2022", value: "22" }],
  tiposProva: [{ label: "Teste", value: "2" }],
  tiposAvaliacao: [{ label: "Recurso", value: "2" }],
};

type SelectedNotas = {
  turmaOuHorarioId: number;
  tipoAvaliacaoId: number;
  anoLectivoId: number;
};

export default function ControlNotes() {
  // =======================================
  // FILTROS
  // =======================================
  const [grade, setGrade] = useState<string>();
  const [curso, setCurso] = useState<string>();
  const [anoCurricular, setAnoCurricular] = useState<string>();
  const [semestre, setSemestre] = useState<string>();
  const [anoLectivo, setAnoLectivo] = useState<string>();
  const [tipoProva, setTipoProva] = useState<string>();
  const [tipoAvaliacao, setTipoAvaliacao] = useState<string>();

  // =======================================
  // PAGINAÇÃO
  // =======================================
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // =======================================
  // MODAL
  // =======================================
  const [openNotasModal, setOpenNotasModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<SelectedNotas | null>(null);

  // =======================================
  // API — DISCIPLINAS PROVA
  // =======================================
  const {
    data: disciplinasProva = [],
    isLoading: loadingDisciplinas,
    refetch,
  } = useQueryDisciplinasProva({
    verHorario: true,
    gradeSelecionada: grade ? Number(grade) : undefined,
    cursoSelecionado: curso ? Number(curso) : undefined,
    anoCurricularSelecionado: anoCurricular ? Number(anoCurricular) : undefined,
    semestreSelecionado: semestre ? Number(semestre) : undefined,
    anoLectivoSelecionado: anoLectivo ? Number(anoLectivo) : undefined,
    tipoProvaSelecionada: tipoProva ? Number(tipoProva) : undefined,
    tipoAvaliacaoSelecionada: tipoAvaliacao ? Number(tipoAvaliacao) : undefined,
  });

  // =======================================
  // PAGINAÇÃO LOCAL
  // =======================================
  const totalPages = Math.ceil(disciplinasProva.length / itemsPerPage);

  const paginatedDisciplinas = disciplinasProva.slice(
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
          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger>
              <SelectValue placeholder="Grade" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.grades.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={curso} onValueChange={setCurso}>
            <SelectTrigger>
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.cursos.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={anoCurricular} onValueChange={setAnoCurricular}>
            <SelectTrigger>
              <SelectValue placeholder="Ano curricular" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.anosCurriculares.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={semestre} onValueChange={setSemestre}>
            <SelectTrigger>
              <SelectValue placeholder="Semestre" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.semestres.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={anoLectivo} onValueChange={setAnoLectivo}>
            <SelectTrigger>
              <SelectValue placeholder="Ano lectivo" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.anosLectivos.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoProva} onValueChange={setTipoProva}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo da prova" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.tiposProva.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={tipoAvaliacao} onValueChange={setTipoAvaliacao}>
            <SelectTrigger>
              <SelectValue placeholder="Tipo de avaliação" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_OPTIONS.tiposAvaliacao.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      ) : paginatedDisciplinas.length === 0 ? (
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
                {paginatedDisciplinas.map((item) => (
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
                            tipoAvaliacaoId: Number(tipoAvaliacao),
                            anoLectivoId: Number(anoLectivo),
                          });

                          setOpenNotasModal(true);
                        }}
                      >
                        Lançar notas
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
