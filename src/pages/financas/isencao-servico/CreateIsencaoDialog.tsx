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
import { useQueryStudents } from "@/hooks/students/use-query-students";
import { parseFilter } from "@/util/parse-filter";
import { Banknote, Eye, GraduationCap, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { useMutationCreateIsencaoServico } from "@/hooks/financas/isencao-servico/use-mutation-create-isencao-servico.ts";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type CreateIsencaoServicoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
type CreateIsencaoResponseError = {
  codigoMatricula: number;
  error: string;
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
  const [successFullStudents, setSuccessFullStudents] = useState<number[]>([]);
  const [errorStudents, setErroStudents] = useState<
    CreateIsencaoResponseError[]
  >([]);
  const { mutateAsync, isPending } = useMutationCreateIsencaoServico();
  const { toast } = useToast();
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

    if (errorStudents.some((e) => e.codigoMatricula === codigo)) {
      return "bg-destructive/70";
    }

    if (selectedStudents.includes(codigo)) {
      return "bg-muted";
    }

    return "";
  };
  const getError = (codigo: number) => {
    const error = errorStudents.find((e) => e.codigoMatricula === codigo).error;
    toast({
      title: "Erro",
      description: error,
      variant: "destructive",
    });
  };

  const { data: studentsResponse, isLoading: isLoadingStudent } =
    useQueryStudents({
      codigoCurso: parseFilter(filtersApplied.curso),
      codigoMatricula: parseFilter(filtersApplied.matricula),
      faculdadeId: parseFilter(filtersApplied.faculdade),
      limit,
      page,
    });
  const handleSubmit = async () => {
    setSuccessFullStudents([]);
    setErroStudents([]);

    await mutateAsync(
      {
        codigoMatriculas: selectedStudents,
        codigoServico: parseFilter(filters.codigoServico),
        codigoAnoLectivo: parseFilter(filters.anoLectivo),
      },
      {
        onSuccess(response) {
          console.log(response);
          const sucessos = response?.sucessos ?? [];
          const erros = response?.erros ?? [];
          setSelectedStudents([]);
          setErroStudents(erros);
          setSuccessFullStudents(sucessos);
        },
      },
    );
  };
  const disabledIsencaoButton =
    isPending ||
    selectedStudents.length == 0 ||
    !parseFilter(filters.codigoServico);
  const disabledPesquisaButtom = isPending || isLoadingStudent;
  const temErros = errorStudents.length > 0;
  const students = studentsResponse?.data ?? [];
  const total = studentsResponse?.total ?? 0;
  const totalPages = studentsResponse?.totalPages ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl!">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Banknote />
            <DialogTitle>Criar Nova Isenção de Serviço</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <AcademicYearSelect
            value={filters.anoLectivo}
            onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
          />
          {/*
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

          </div> */}
          <TypeServiceSelectList
            type="EXCEPTION"
            value={filters.codigoServico}
            onChangeValue={(v) => setFilters({ ...filters, codigoServico: v })}
          />
        </div>

        <div className="mt-5">
          <div className="flex justify-between  mb-2">
            <h3 className="flex items-center gap-2 font-semibold text-lg">
              <GraduationCap className="h-5 w-5 text-primary" />
              Estudantes
            </h3>
            <div className="flex space-x-2">
              <FacultySelect
                allOption
                width="sm"
                placeholder="Faculdade"
                showLabel={false}
                value={filters.faculdade}
                onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
              />
              <CourseSelect
                enableDefaultSelectItem
                width="sm"
                showLabel={false}
                params={{
                  faculdadeId: parseFilter(filters.faculdade),
                }}
                value={filters.curso}
                onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              />
              <Input
                placeholder="Matricula"
                className="w-[200px]!"
                value={filters.matricula}
                onChange={(e) =>
                  setFilters({ ...filters, matricula: e.target.value })
                }
              />
              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  disabled={disabledPesquisaButtom}
                >
                  <Search />
                </Button>
              </div>
            </div>
          </div>
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
                  {temErros && <TableHead>Erros</TableHead>}
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
                      {temErros && (
                        <TableCell>
                          <Button
                            onClick={() => getError(student.codigo_matricula)}
                            variant="outline"
                            size="icon"
                          >
                            <Eye />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              A mostrar {students.length} de {total} registos
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <span>
                Página {page} de {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>

              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
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
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => handleSubmit()}
            disabled={disabledIsencaoButton}
          >
            {isPending && <RefreshCw className={`h-4 w-4 mr-2 animate-spin`} />}
            Isentar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
