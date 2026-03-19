import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryStudents } from "@/hooks/tudents/use-query-students";
import { parseFilter } from "@/util/parse-filter";
import { Banknote, GraduationCap, RefreshCw } from "lucide-react";
import { useState } from "react";

type CreateIsencaoServicoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateIsencaoDialog({
  open,
  onOpenChange,
}: CreateIsencaoServicoDialogProps) {
  const [filters, setFilters] = useState({
    matricula: null,
    anoLectivo: "",
    faculdade: "",
    curso: "",
    codigoServico: "",
  });
  const [filtersApplied, setFiltersApplied] = useState({
    matricula: null,
    anoLectivo: "",
    faculdade: "",
    curso: "",
    codigoServico: "",
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [successFullStudents, setSuccessFullStudents] = useState<number[]>([
    61644,
  ]);
  const [errorStudents, setErroStudents] = useState<number[]>([61647]);

  const handleSearch = () => {
    setFiltersApplied(filters);
    setPage(1);
  };
  const toggleStudent = (codigo: number) => {
    setSelectedStudents((prev) =>
      prev.includes(codigo)
        ? prev.filter((item) => item !== codigo)
        : [...prev, codigo],
    );
  };
  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.codigo_matricula));
    }
  };
  const getRowStyle = (codigo: number) => {
    if (successFullStudents.includes(codigo)) {
      return "bg-emerald-100 dark:bg-emerald-700";
    }

    if (errorStudents.includes(codigo)) {
      return "bg-destructive/70";
    }

    if (selectedStudents.includes(codigo)) {
      return "bg-muted";
    }

    return "";
  };

  const { data: studentsResponse, isLoading: isLoadingStudent } =
    useQueryStudents({
      anoLectivo: parseFilter(filtersApplied.anoLectivo),
      codigoCurso: parseFilter(filtersApplied.curso),
      codigoMatricula: parseFilter(filtersApplied.matricula),
      faculdadeId: parseFilter(filtersApplied.faculdade),
      limit,
      page,
    });
  const students = studentsResponse?.data ?? [];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl!">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Banknote />
            <DialogTitle>Criar Nova Isenção de Serviço</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4">
          <AcademicYearSelect
            value={filters.anoLectivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
          />
          <FacultySelect
            value={filters.faculdade}
            onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
          />
          <CourseSelect
            params={{
              faculdadeId: parseFilter(filters.faculdade),
            }}
            value={filters.curso}
            onChangeValue={(v) => setFilters({ ...filters, curso: v })}
          />
          <div className="space-y-1">
            <Label>Matricula</Label>
            <Input
              placeholder="Ex: 12345"
              value={filters.matricula}
              onChange={(e) =>
                setFilters({ ...filters, matricula: e.target.value })
              }
            />
          </div>
          <TypeServiceSelectList
            value={filters.codigoServico}
            onChangeValue={(v) => setFilters({ ...filters, codigoServico: v })}
          />
          <div className="flex items-end">
            <Button onClick={handleSearch} disabled={isLoadingStudent}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoadingStudent ? "animate-spin" : ""}`}
              />
              Pesquisar
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="flex items-center gap-2 font-semibold text-lg mb-4">
            <GraduationCap className="h-5 w-5 text-primary" />
            Estudantes
          </h3>
          <div className="h-[400px] overflow-y-auto border rounded-md">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>B.I</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Grau Academico</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingStudent && students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow
                      className={getRowStyle(student.codigo_matricula)}
                      key={student.bi}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(
                            student.codigo_matricula,
                          )}
                          onCheckedChange={() =>
                            toggleStudent(student.codigo_matricula)
                          }
                        />
                      </TableCell>
                      <TableCell>{student?.codigo_matricula ?? "-"}</TableCell>
                      <TableCell>{student?.nome_completo ?? "-"}</TableCell>
                      <TableCell>{student?.bi ?? "-"}</TableCell>
                      <TableCell>{student?.curso ?? "-"}</TableCell>
                      <TableCell>{student?.candidatura ?? "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button>Isentar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
