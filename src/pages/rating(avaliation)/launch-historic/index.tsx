import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChevronLeft,
  ChevronRight,
  Search,
  UserSearch,
  BookOpen,
  AlertCircle,
  ClipboardList,
  X,
} from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { FormInput } from "@/components/common/FormInput";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryCurricularPlanStudent } from "@/hooks/avaliacao/use-query-curriculum-plan-student";
import { useQueryHistoryNoteRelease } from "@/hooks/avaliacao/use-query-launch-historic";
import { formatDateForInput } from "@/pages/academiccalendar/activities-lectures/hooks";
import { parseFilter } from "@/util/parse-filter";

function gradeVariant(nota: string | number): "default" | "secondary" | "destructive" | "outline" {
  const n = Number(nota);
  if (isNaN(n)) return "secondary";
  return n >= 10 ? "default" : "destructive";
}

interface StepProps {
  number: number;
  label: string;
  done: boolean;
  active: boolean;
}

function Step({ number, label, done, active }: StepProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors
        ${done ? "bg-primary border-primary text-primary-foreground"
          : active ? "border-primary text-primary bg-primary/10"
            : "border-muted-foreground/30 text-muted-foreground/50 bg-transparent"}`}>
        {done ? "✓" : number}
      </div>
      <span className={`text-sm font-medium ${active ? "text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
        {label}
      </span>
    </div>
  );
}

function StepDivider({ active }: { active: boolean }) {
  return <div className={`h-px flex-1 mx-2 transition-colors ${active ? "bg-primary" : "bg-border"}`} />;
}

export default function LaunchHistoric() {
  const [matriculaText, setMatriculaText] = useState("");
  const [filters, setFilters] = useState({
    matricula: "",
    anoLetivo: "",
    disciplina: undefined,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Debug removido (podes voltar a colocar se quiseres)

  const { data: academicYears = [], isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();

  const { data: disciplinas = [] } = useQueryCurricularPlanStudent({
    anoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
    matricula: filters.matricula ? Number(filters.matricula) : undefined,
  });

  const {
    data = [],
    isLoading,
  } = useQueryHistoryNoteRelease(
    {
      codigoAnoLectivo: parseFilter(filters.anoLetivo),
      codigo_grade_curricular_aluno: parseFilter(filters.disciplina),
      codigoMatricula: parseFilter(filters.matricula),
    },
    { enabled: !!filters.matricula && !!filters.anoLetivo }
  );

  const hasMatricula = Boolean(filters.matricula);
  const step = !hasMatricula ? 1 : !filters.anoLetivo ? 2 : 3;

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginated = useMemo(() =>
    data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage),
    [data, currentPage]
  );

  // ====================== HANDLERS ======================
  const handleAnoLetivoChange = useCallback((value: string) => {
    if (!value) return;
    setCurrentPage(1);
    setFilters(prev => ({
      ...prev,
      anoLetivo: value,
      disciplina: "",
    }));
  }, []);

  const handleDisciplinaChange = useCallback((value: string) => {
    setCurrentPage(1);
    setFilters(prev => ({ ...prev, disciplina: value }));
  }, []);

  const handleMatriculaChange = useCallback((v: string) => {
    const newMatricula = v.trim();

    // Proteção contra loop: só atualiza se realmente mudou
    if (newMatricula === filters.matricula) return;

    setMatriculaText(newMatricula);
    setFilters({
      matricula: newMatricula,
      anoLetivo: "",
      disciplina: "",
    });
    setCurrentPage(1);
  }, [filters.matricula]);

  const clearAllFilters = () => {
    setMatriculaText("");
    setFilters({ matricula: "", anoLetivo: "", disciplina: "" });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground flex gap-2">
        <Link to="/" className="hover:text-foreground transition-colors">Início</Link>
        <span>/</span>
        <span className="text-foreground">Histórico de Lançamento</span>
      </nav>

      <header className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ClipboardList className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Histórico de Lançamento de Notas</h1>
            <p className="text-sm text-muted-foreground">
              Consulte o registo de todas as notas lançadas.
            </p>
          </div>
        </div>

        {hasMatricula && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters}>
            <X className="w-4 h-4 mr-2" /> Limpar tudo
          </Button>
        )}
      </header>

      <div className="flex items-center">
        <Step number={1} label="Identificar estudante" done={step > 1} active={step === 1} />
        <StepDivider active={step >= 2} />
        <Step number={2} label="Refinar pesquisa (opcional)" done={step > 2} active={step === 2} />
        <StepDivider active={step >= 3} />
        <Step number={3} label="Ver resultados" done={false} active={step === 3} />
      </div>

      <div className="bg-card border rounded-xl p-6 space-y-6">
        {/* Matrícula */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserSearch className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Passo 1 — Pesquisar estudante</span>
            <span className="text-xs text-muted-foreground">(obrigatório)</span>
          </div>
          <div className="max-w-sm">
            <FormInput
              type="search"
              label="Número de Matrícula"
              placeholder="Ex: 20240001"
              value={matriculaText}
              onValueChange={setMatriculaText}
              onDebounce={handleMatriculaChange}
              debounceTime={500}   // aumentado um pouco
            />
          </div>
        </div>

        {!hasMatricula && (
          <div className="flex items-start gap-3 bg-muted/50 border border-dashed rounded-lg p-4">
            <Search className="w-5 h-5 text-muted-foreground mt-0.5" />
            <p className="text-sm text-muted-foreground">Introduza o número de matrícula para continuar.</p>
          </div>
        )}

        {hasMatricula && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Passo 2 — Refinar por ano lectivo e unidade curricular</span>
              <Badge variant="secondary" className="text-xs"> UC — Opcional</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormSelect
                key={`ano-select-${academicYears.length}`}
                disabled={isLoadingAcademicYear}
                loading={isLoadingAcademicYear}
                label="Ano Lectivo"
                value={filters.anoLetivo}
                onChange={handleAnoLetivoChange}
                options={academicYears}
                map={(a: any) => ({
                  key: a.codigo,
                  label: a.designacao,
                  value: a.codigo
                })}
                placeholder="Selecione o ano letivo"
              />

              <FormSelect
                key={`disc-select-${filters?.anoLetivo}`}
                label="Unidade Curricular"
                disabled={!filters?.anoLetivo}
                value={filters?.disciplina ?? undefined}
                onChange={handleDisciplinaChange}
                options={[
                  {
                    codigo_grade_curricular_aluno: undefined,
                    designacao_disciplina: "Todas as disciplinas",
                  },
                  ...(disciplinas ?? []),
                ]}
                map={(c: any) => ({
                  key: c.codigo_grade_curricular_aluno ?? "all",
                  label: c.designacao_disciplina,
                  value: c.codigo_grade_curricular_aluno ?? undefined,
                })}
                placeholder="Todas as disciplinas"
              />
            </div>
          </div>
        )}
      </div>

      {/* Resultados */}
      {!hasMatricula ? null : isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : data.length === 0 ? (
        <div className="bg-card border rounded-xl text-center py-16 space-y-3">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-muted">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
          </div>
          <p className="font-semibold text-lg">Nenhum lançamento encontrado</p>
          <p className="text-sm text-muted-foreground">Tente alterar os filtros acima.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {data.length} registo{data.length !== 1 ? "s" : ""} encontrado{data.length !== 1 ? "s" : ""}
            </p>
            {filters.disciplina && <Badge variant="outline">Disciplina filtrada</Badge>}
          </div>

          <div className="bg-card border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Unidade Curricular</TableHead>
                  <TableHead>Matrícula</TableHead>
                  <TableHead>Nome do Estudante</TableHead>
                  <TableHead>Tipo de Avaliação</TableHead>
                  <TableHead className="text-center">Nota</TableHead>
                  <TableHead className="text-center">Data de Lançamento</TableHead>
                  <TableHead>Lançado por</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((item: any, i: number) => (
                  <TableRow key={i} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{item.grade}</TableCell>
                    <TableCell className="text-muted-foreground">{item.matricula}</TableCell>
                    <TableCell>{item.nome}</TableCell>
                    <TableCell>{item.tipo_avaliacao}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={gradeVariant(item.nota_lancada)}>{item.nota_lancada}</Badge>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {formatDateForInput(item.datalancada)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.utilizador}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-end gap-3 items-center">
              <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Página <span className="font-semibold">{currentPage}</span> de {totalPages}
              </span>
              <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}