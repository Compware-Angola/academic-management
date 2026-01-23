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

import { ChevronLeft, ChevronRight, RefreshCw, Shield } from "lucide-react";

import { FormSelect } from "@/components/common/FormSelect";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";

import { useQueryDefinirOral } from "@/hooks/avaliacao/use-query-definir-oral";

import { DefinirOral } from "@/services/avaliacao/fetch-oral";
import { Switch } from "@/components/ui/switch";
import { useMutationUpdateDefinirOral } from "@/hooks/avaliacao/use-mutation-update-definir-oral";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

export default function FormulaOral() {
  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    curso: "",
    classes: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: academicYear, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const { data: semestres } = useQuerySemestres();
  const { data: cursos } = useCursos();

  const { data: classes = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });
  const mutation = useMutationUpdateDefinirOral();

  const {
    data = [],
    isLoading,
    refetch,
  } = useQueryDefinirOral({
    anoLectivo: filters.anoLetivo ? Number(filters.anoLetivo) : undefined,
    cursoId: filters.curso ? Number(filters.curso) : undefined,
    anoCurricular: filters.classes ? Number(filters.classes) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
  });

  // PAGINAÇÃO
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const paginated = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6">
      <nav className="text-sm text-muted-foreground flex gap-2">
        <Link to="/">Início</Link>
        <span>/</span>
        <span className="text-foreground">
          Definir unidade curricular com oral
        </span>
      </nav>

      <header className="flex justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Definir unidade cunicular com oral
          </h1>
          <p className="text-muted-foreground">Ativação por disciplina</p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Atualizar
        </Button>
      </header>

      {/* ========== FILTROS ========== */}
      <div className="bg-card border rounded-lg p-6">
        <div className="grid grid-cols-4 gap-4">
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
          <FormSelect
            label="Semestre"
            value={filters.semestre}
            onChange={(v) => setFilters({ ...filters, semestre: v })}
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />

          <CourseSelect
            value={filters.curso}
            onChangeValue={(v) =>
              setFilters({
                ...filters,
                curso: v,
              })
            }
          />

          <FormSelect
            label="Ano curricular"
            disabled={!filters.curso}
            value={filters.classes}
            onChange={(v) => setFilters({ ...filters, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
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
                <TableHead>Código</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead className="text-center">Oral</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginated.map((item) => (
                <TableRow key={item.codigoGrade}>
                  <TableCell>{item.codigoGrade}</TableCell>

                  <TableCell>{item.disciplina}</TableCell>

                  {/* STATUS + SWITCH */}
                  <TableCell className="flex justify-center">
                    <Switch
                      checked={item.habilitar}
                      disabled={mutation.isPending}
                      onCheckedChange={(checked) => {
                        mutation.mutate({
                          codigoGrade: item.codigoGrade,
                          habilitar: checked,
                        });
                      }}
                    />
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
