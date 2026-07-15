import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Loader2,
  BookOpen,
  Check,
  CheckSquare,
  Square,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useQueryStudentsWithoutSchedule } from "@/hooks/horario/useQueryStudentsWithoutSchedule";
import { parseFilter } from "@/util/parse-filter";
import { useEffect, useRef, useState } from "react";

import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SelectUnidadeCurricularWithFilter } from "@/components/common/global-selects/SelectUnidadeCurricularWithFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  title: string;
  selectedGradeAlunoIds: number[];
  onChangeGradeAluno(ids: number[]): void;
  onChangeCourse(course: string): void;
  onFilterChange?: (filter: {
    tipoCandidatura: string;
    anoLetivo: string;
    semestre: string;
    curso: string;
    anoCurricular: string;
    searchTerm: string;
    unidadeCurricular: string;
  }) => void;
}

export const StudentWithoutScheduleCard = ({
  title,
  selectedGradeAlunoIds,
  onFilterChange,
  onChangeCourse,
  onChangeGradeAluno,
}: Props) => {
  const [filters, setFilters] = useState({
    tipoCandidatura: "1",
    anoLetivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    searchTerm: "",
    unidadeCurricular: "",
  });

  const selectAllRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const { data, isLoading } = useQueryStudentsWithoutSchedule({
    anoLectivo: parseFilter(filters.anoLetivo),
    semestre: parseFilter(filters.semestre),
    curso: parseFilter(filters.curso),
    classe: parseFilter(filters.anoCurricular),
    searchTerm: filters.searchTerm,
    page: page,
    limit: limit,
  });

  const students = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const canLoad =
    !!filters.anoLetivo &&
    !!filters.semestre &&
    !!filters.curso &&
    !!filters.anoCurricular;
  const allSelected =
    students.length > 0 &&
    students.every((s) => selectedGradeAlunoIds.includes(s.codigo_grade_aluno));

  const someSelected = students.some((s) =>
    selectedGradeAlunoIds.includes(s.codigo_grade_aluno),
  );

  useEffect(() => {
    if (!selectAllRef.current) return;

    selectAllRef.current.indeterminate = someSelected && !allSelected;
  }, [someSelected, allSelected]);

  useEffect(() => {
    onFilterChange?.(filters);
  }, [
    filters.anoLetivo,
    filters.tipoCandidatura,
    filters.semestre,
    filters.curso,
    filters.anoCurricular,
    filters.unidadeCurricular,
    filters.searchTerm,
  ]);

  useEffect(() => {
    onChangeGradeAluno([]);
    setPage(1);
  }, [
    filters.anoLetivo,
    filters.semestre,
    filters.curso,
    filters.anoCurricular,
    filters.unidadeCurricular,
  ]);

  const toggle = (id: number) => {
    const exists = selectedGradeAlunoIds.includes(id);

    const updated = exists
      ? selectedGradeAlunoIds.filter((x) => x !== id)
      : [...selectedGradeAlunoIds, id];

    onChangeGradeAluno(updated);
  };

  const isSelected = (id: number) => selectedGradeAlunoIds.includes(id);

  const toggleAll = () => {
    const allIds = students.map((s) => s.codigo_grade_aluno);

    if (allSelected) {
      const filtered = selectedGradeAlunoIds.filter(
        (id) => !allIds.includes(id),
      );
      onChangeGradeAluno(filtered);
    } else {
      const merged = Array.from(new Set([...selectedGradeAlunoIds, ...allIds]));
      onChangeGradeAluno(merged);
    }
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      semestre: "",
      curso: "",
      anoCurricular: "",
      searchTerm: "",
    }));
    onChangeCourse("");
  };

  return (
    <div className="p-4 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </CardTitle>

        <Badge variant="secondary">
          {selectedGradeAlunoIds.length} selecionado(s)
        </Badge>
      </div>

      {/* FILTROS */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TipoCandidaturaSelect
            value={filters.tipoCandidatura}
            label=""
            placeholder="Tipo de Candidatura"
            onChangeValue={(v) => {
              onChangeCourse("");
              setFilters({
                ...filters,
                tipoCandidatura: v,
                anoLetivo: "",
                curso: "",
                anoCurricular: "",
                unidadeCurricular: "",
                searchTerm: "",
              });
            }}
          />

          <AcademicYearSelect
            enableDefaultActiveYear
            onlyActive
            tipoCandidaturaId={parseFilter(filters.tipoCandidatura)}
            value={filters.anoLetivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLetivo: v })}
          />

          <SemestreSelect
            value={filters.semestre}
            onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
          />

          <CourseSelect
            params={{
              tipoCandidaturaId: parseFilter(filters.tipoCandidatura),
            }}
            value={filters.curso}
            onChangeValue={(v) => {
              onChangeCourse(v);
              setFilters({
                ...filters,
                curso: v,
                anoCurricular: "",
              });
            }}
          />

          <AnoCurricularSelect
            value={filters.anoCurricular}
            disabled={!filters.curso}
            curso={filters.curso}
            onChangeValue={(v) => setFilters({ ...filters, anoCurricular: v })}
          />
          <SelectUnidadeCurricularWithFilter
            onChangeValue={(v) => {}}
            onSelectItem={(it) =>
              setFilters({
                ...filters,
                unidadeCurricular: it.pk.toString(),
                searchTerm: it.descricao,
              })
            }
            value={filters.unidadeCurricular}
            filter={{
              classe: filters.anoCurricular,
              curso: filters.curso,
              semestre: filters.semestre,
            }}
            disabled={
              !filters.curso || !filters.semestre || !filters.anoCurricular
            }
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant={allSelected ? "default" : "ghost"}
            size="icon"
            aria-label={allSelected ? "Desmarcar todos" : "Selecionar todos"}
            onClick={toggleAll}
          >
            {allSelected ? (
              <CheckSquare className="h-4 w-4" />
            ) : (
              <Square className="h-4 w-4" />
            )}
          </Button>
          <Button
            className="bg-red-500 hover:bg-red-600"
            onClick={handleResetFilters}
          >
            Limpar Filtros
          </Button>
        </div>
      </div>

      {/* LISTA */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <BookOpen className="mx-auto mb-3 opacity-30" />
          {canLoad ? "Nenhum aluno encontrado" : "Selecione os filtros"}
        </div>
      ) : (
        <div className="max-h-[320px] overflow-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                {/* HEADER CHECKBOX (GMAIL STYLE) */}
                <TableHead className="w-12">
                  <Button
                    variant={allSelected ? "default" : "ghost"}
                    size="icon"
                    aria-label={
                      allSelected ? "Desmarcar todos" : "Selecionar todos"
                    }
                    onClick={toggleAll}
                  >
                    {allSelected ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </Button>
                </TableHead>

                <TableHead>Aluno</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Classe</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.map((s) => (
                <TableRow
                  key={s.codigo_grade_aluno}
                  className={`cursor-pointer transition-colors ${
                    isSelected(s.codigo_grade_aluno) ? "bg-primary/10" : ""
                  }`}
                  onClick={() => toggle(s.codigo_grade_aluno)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant={
                        isSelected(s.codigo_grade_aluno) ? "default" : "ghost"
                      }
                      size="icon"
                      aria-label={
                        isSelected(s.codigo_grade_aluno)
                          ? "Desmarcar"
                          : "Selecionar"
                      }
                      onClick={() => toggle(s.codigo_grade_aluno)}
                    >
                      {isSelected(s.codigo_grade_aluno) ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>

                  <TableCell>{s.nome}</TableCell>
                  <TableCell>{s.disciplina}</TableCell>
                  <TableCell>{s.curso}</TableCell>
                  <TableCell>{s.classe}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between px-4 py-3 border-t">
            {/* Info */}
            <span className="text-xs text-muted-foreground">
              {total === 0
                ? "Nenhum registo"
                : `${(page - 1) * limit + 1}–${Math.min(page * limit, total)} de ${total}`}
            </span>

            <div className="flex items-center gap-3">
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-9 w-9"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Página anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex flex-col items-center leading-tight">
                <span className="text-sm font-medium text-foreground">
                  {page} de {totalPages}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  páginas
                </span>
              </div>

              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-9 w-9"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Próxima página"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Limite por página */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Por página</span>
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-7 w-16 text-xs rounded-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 25, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
