import { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ChevronLeft, ChevronRight, Shield } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";
import { FormInput } from "@/components/common/FormInput";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

import { useQueryCurricularPlanStudent } from "@/hooks/avaliacao/use-query-curriculum-plan-student";
import { useQueryHistoryNoteRelease } from "@/hooks/avaliacao/use-query-launch-historic";

export default function LaunchHistoric() {
  const [filters, setFilters] = useState({
    anoLetivo: "",
    disciplina: "",
    matricula: "",
  });
  const [matriculaText, setMatriculaText] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const { data: disciplinas } = useQueryCurricularPlanStudent({
    anoLectivo: Number(filters.anoLetivo),
    matricula: Number(filters.matricula),
  });

  const {
    data = [],
    isLoading,
    refetch,
  } = useQueryHistoryNoteRelease({
    codigoAnoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
    codigo_grade_curricular_aluno: filters.disciplina
      ? Number(filters.disciplina)
      : undefined,
    codigoMatricula: filters.matricula ? Number(filters.matricula) : undefined,
  });

  //PAGINAÇÃO
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginated = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground flex gap-2">
        <Link to="/">Início</Link>
        <span>/</span>
        <span className="text-foreground">histórico de lançamento</span>
      </nav>

      <header className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Histórico de Lançamento de Nota
          </h1>
        </div>
      </header>

      {/* ========== FILTROS ========== */}
      <div className="bg-card border rounded-lg p-6">
        <div className="grid grid-cols-3 gap-3">
          <FormSelect
            disabled={isLoadingAcademicYear}
            loading={isLoadingAcademicYear}
            label="Ano Letivo"
            value={filters.anoLetivo}
            onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />
          <FormInput
            type="search"
            label="Aluno"
            placeholder="Pesquisar por aluno"
            value={matriculaText}
            onValueChange={(v) => setMatriculaText(v)}
            onDebounce={(v) => {
              setFilters({ ...filters, matricula: v });
            }}
            debounceTime={600}
          />
          <FormSelect
            label="Unidade Curricular"
            disabled={!filters.matricula}
            value={filters.disciplina}
            onChange={(v) => setFilters({ ...filters, disciplina: v })}
            options={disciplinas}
            map={(c) => ({
              key: c.codigo_grade_curricular_aluno,
              label: c.designacao_disciplina,
              value: c.codigo_grade_curricular_aluno,
            })}
          />
        </div>
      </div>

      {/* ========== TABELA ========== */}

      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))
      ) : paginated.length === 0 ? (
        <div className="bg-card border rounded-lg text-center py-10">
          <Shield className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
          <p>Nenhum registro encontrado</p>
        </div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade Curricular</TableHead>
                <TableHead>Código da Matrícula</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Nota</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.grade}</TableCell>
                  <TableCell>{item.matricula}</TableCell>
                  <TableCell>{item.nome}</TableCell>
                  <TableCell className="flex justify-center">
                    {item.nota_lancada}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ========== PAGINAÇÃO ========== */}
      <div className="flex justify-end gap-3 items-center">
        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <span className="text-sm">
          Página {currentPage} de {totalPages}
        </span>

        <Button
          size="sm"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
