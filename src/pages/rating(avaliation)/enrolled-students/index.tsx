import { useEffect, useMemo, useState } from "react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useScheduleQuery } from "@/hooks/horario/use=query-fetch-schedule";
import { useEstudantesInscritos } from "@/hooks/avaliacao/useEstudantesInscritos";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";

type Filters = {
  anoLetivo: string;
  periodo: string;
  semestre: string;
  curso: string;
  classes: string;
  unidadeCurricular: string;
  horarioId: string;
  tiposAvaliacao: string;
};
export default function EstudantesInscritos() {
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [shouldFetch, setShouldFetch] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    anoLetivo: "",
    periodo: "",
    semestre: "",
    curso: "",
    classes: "",
    unidadeCurricular: "",
    horarioId: "",
    tiposAvaliacao: "",
  });
  useEffect(() => {
    setShouldFetch(false);
  }, [filters]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, itemsPerPage]);
  /** ================== QUERIES BASE ================== */
  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();
  const { data: periodos = [], isLoading: loadingPeriodos } = useQueryPeriod();
  const { data: semestres = [], isLoading: loadingSemestres } =
    useQuerySemestres();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();

  const { data: classes = [], isLoading: loadingClasses } =
    useQueryClassFilterByCurso({ curso: filters.curso });

  const { data: unidadesCurriculares = [], isLoading: loadingUC } =
    useQueryDisciplinaWithFilter({
      classe: filters.classes,
      curso: filters.curso,
      semestre: filters.semestre,
    });

  const { data: schedules, isLoading: loadingSchedules } = useScheduleQuery({
    anoLectivo: Number(filters.anoLetivo),
    semestre: Number(filters.semestre),
    periodo: Number(filters.periodo),
    curso: Number(filters.curso),
    unidadeCurricular: Number(filters.unidadeCurricular),
  });

  const { data: tiposAvaliacao = [], isLoading: loadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: estudantesInscritos, isLoading: LoadingEstudantesInscritos } =
    useEstudantesInscritos(
      {
        anoCurricular:
          filters.anoLetivo === "" ? undefined : Number(filters.classes),
        anoLectivo:
          filters.anoLetivo === "" ? undefined : Number(filters.anoLetivo),
        curso: filters.curso === "" ? undefined : Number(filters.curso),
        horarioId:
          filters.horarioId === "" ? undefined : Number(filters.horarioId),
        semestre:
          filters.semestre === "" ? undefined : Number(filters.semestre),
        unidadeCurricular:
          filters.unidadeCurricular === ""
            ? undefined
            : Number(filters.unidadeCurricular),
        tipoAvaliacao:
          filters.tiposAvaliacao === ""
            ? undefined
            : Number(filters.tiposAvaliacao),
        periodo: filters.periodo === "" ? undefined : Number(filters.periodo),

        page: currentPage,
        limit: itemsPerPage,
      },
      shouldFetch
    );
  const handleSearch = () => {
    if (!isValidFilters(filters)) {
      toast({
        title: "Campos obrigatórios",

        variant: "destructive",
      });
      return;
    }

    setShouldFetch(true);
  };
  function getEstadoBadge(estado: string) {
    switch (estado) {
      case "validado":
        return <Badge className="bg-green-600">Validado</Badge>;
      case "anulado":
        return <Badge variant="destructive">Anulado</Badge>;
      case "pendente":
        return <Badge variant="secondary">Pendente</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  }

  const totalPages = estudantesInscritos?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Avaliações</span>
        <span>/</span>
        <span className="text-foreground">Estudantes Inscritos</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Estudantes Inscritos
          </h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormSelect
            disabled={loadingYear}
            loading={loadingYear}
            label="Ano Letivo"
            value={filters.anoLetivo}
            onChange={(v) =>
              setFilters({ ...filters, anoLetivo: v, horarioId: "" })
            }
            options={academicYear}
            map={(a) => ({
              key: a.codigo,
              label: a.designacao,
              value: a.codigo,
            })}
          />

          <FormSelect
            disabled={
              loadingPeriodos || loadingYear || filters.anoLetivo === ""
            }
            loading={loadingPeriodos}
            label="Período"
            value={filters.periodo}
            onChange={(v) =>
              setFilters({ ...filters, periodo: v, horarioId: "" })
            }
            options={periodos}
            map={(p) => ({
              key: p.codigo,
              label: p.designacao,
              value: p.codigo,
            })}
          />

          <FormSelect
            disabled={loadingSemestres}
            loading={loadingSemestres}
            label="Semestre"
            value={filters.semestre}
            onChange={(v) =>
              setFilters({ ...filters, semestre: v, horarioId: "" })
            }
            options={semestres}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />
          <FormSelect
            disabled={loadingCursos}
            loading={loadingCursos}
            label="Curso"
            value={filters.curso}
            onChange={(v) =>
              setFilters({ ...filters, curso: v, horarioId: "" })
            }
            options={cursos}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
          />
          <FormSelect
            label="Ano Curricular"
            value={filters.classes}
            disabled={loadingClasses || !filters.curso}
            onChange={(v) => setFilters({ ...filters, classes: v })}
            options={classes}
            map={(c) => ({
              key: c.codigo,
              label: c.designacao,
              value: c.codigo,
            })}
            loading={loadingClasses}
          />
          <FormSelect
            label="Unidade Curricular"
            value={filters.unidadeCurricular}
            disabled={
              loadingUC ||
              !filters.semestre ||
              !filters.curso ||
              !filters.classes
            }
            onChange={(v) =>
              setFilters({ ...filters, unidadeCurricular: v, horarioId: "" })
            }
            options={unidadesCurriculares}
            map={(u) => ({
              key: u.codigo,
              label: u.descricao,
              value: u.pk,
            })}
            loading={loadingUC}
          />
          <FormSelect
            label="Horario"
            value={filters.horarioId}
            disabled={loadingSchedules}
            onChange={(v) => setFilters({ ...filters, horarioId: v })}
            options={schedules?.data}
            map={(u) => ({
              key: u.codigo,
              value: u.codigo,
              label: `${u.designacao}`,
            })}
            loading={loadingSchedules}
          />
          <FormSelect
            label="Tipo de Avaliação"
            value={filters.tiposAvaliacao}
            disabled={loadingTipoAvaliacao}
            onChange={(v) =>
              setFilters({
                ...filters,
                tiposAvaliacao: v,
              })
            }
            options={tiposAvaliacao}
            map={(u) => ({
              key: u.codigo,
              label: u.designacao,
              value: u.codigo,
            })}
            loading={loadingTipoAvaliacao}
          />
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSearch} disabled={LoadingEstudantesInscritos}>
            {LoadingEstudantesInscritos ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Tabela de resultados */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {LoadingEstudantesInscritos ? (
          <div className="space-y-3">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !estudantesInscritos || estudantesInscritos.data.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Unidade Curricular</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                    <TableHead className="text-center">Info</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {estudantesInscritos?.data?.map((estudante) => (
                    <TableRow
                      key={`${estudante.codigo_matricula}-${estudante.codigo_grade}`}
                    >
                      <TableCell className="font-medium">
                        {estudante.codigo_matricula}
                      </TableCell>

                      <TableCell
                        className="max-w-[220px] truncate"
                        title={estudante.nome}
                      >
                        {estudante.nome}
                      </TableCell>

                      <TableCell>{estudante.disciplina_designacao}</TableCell>

                      <TableCell>{estudante.avaliacao}</TableCell>

                      <TableCell className="text-center">
                        {getEstadoBadge(estudante.estado)}
                      </TableCell>

                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Detalhes"
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page" className="text-sm">
                  Itens por página:
                </Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => setItemsPerPage(Number(value))}
                >
                  <SelectTrigger id="items-per-page" className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm">
                  Página {estudantesInscritos?.page ?? 1} de {totalPages}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || LoadingEstudantesInscritos}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(estudantesInscritos?.totalPages ?? 1, p + 1)
                    )
                  }
                  disabled={
                    currentPage === estudantesInscritos?.totalPages ||
                    LoadingEstudantesInscritos
                  }
                >
                  Próxima
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export function isValidFilters(filters?: Filters): filters is Filters {
  return !!(
    filters &&
    filters.anoLetivo &&
    filters.semestre &&
    filters.periodo &&
    filters.curso &&
    filters.unidadeCurricular &&
    filters.classes &&
    filters.tiposAvaliacao &&
    filters.horarioId
  );
}
