import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { parseFilter } from "@/util/parse-filter";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { FormSelect } from "@/components/common/FormSelect";
import { useEstatisticaDeEstudantesAprovadosEReprovados } from "@/hooks/registrations/estatisticas";
import { EstadoMatriculaSelect } from "@/components/common/global-selects/EstadoMatricula";
import { useQuerySexo } from "@/hooks/acess/use-query-sexo";

export function EstatisticaDeEstudantesAprovadosEReprovados() {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    anoLectivo: "",
    curso: "",
    anoCurricular: "",
    faculdade: "",
    estadoMatricula: "",
    estadoAprovacao: "",
    genero: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(null);

  const { data: sexos = [], isLoading: isLoadingSexo } = useQuerySexo();
  useEffect(() => {
    if (filters.faculdade === "all" || filters.faculdade === "") {
      setFilters((prev) => ({
        ...prev,
        curso: "",
        anoCurricular: "",
      }));
    }
  }, [filters.faculdade]);

  const {
    data: estatistica,
    isLoading: isLoadingEstatistica,
    refetch,
  } = useEstatisticaDeEstudantesAprovadosEReprovados(
    {
      anoLectivo: parseFilter(appliedFilters?.anoLectivo),
      curso: parseFilter(appliedFilters?.curso),
      genero: appliedFilters?.genero,
    },
    {
      enabled: !!appliedFilters,
    },
  );
  useEffect(() => {
    if (filters.curso === "all" || filters.curso === "") {
      setFilters((prev) => ({
        ...prev,
        anoCurricular: "",
      }));
    }
  }, [filters.curso]);
  console.log(appliedFilters);
  const students = [];
  const total = 0;
  const totalPages = 0;
  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Estatística de estudantes aprovados e reprovados
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Estatística de estudantes aprovados e reprovados
        </h1>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 grid-cols-1 lg:grid-cols-4 items-end">
            <AcademicYearSelect
              enableDefaultActiveYear
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <FacultySelect
              value={filters.faculdade}
              allOption
              onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
            />
            <CourseSelect
              enableDefaultSelectItem
              value={filters.curso}
              params={{
                faculdadeId: parseFilter(filters.faculdade),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />
            <AnoCurricularSelect
              value={filters.anoCurricular}
              onChangeValue={(v) =>
                setFilters({ ...filters, anoCurricular: v })
              }
              curso={filters.curso}
            />
            <FormSelect
              label="Género"
              value={filters.genero}
              onChange={(v) => setFilters({ ...filters, genero: v })}
              options={[
                {
                  codigo: "all",
                  designacao: "Todos",
                },
                ...sexos.filter((s) => s.codigo !== 3),
              ]}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.designacao,
              })}
            />
            <FormSelect
              label="Estado de Aprovação"
              value={filters.estadoAprovacao}
              onChange={(v) => setFilters({ ...filters, estadoAprovacao: v })}
              options={ESTADO_APROVACAO}
              map={(s) => ({
                key: s.codigo,
                label: s.designacao,
                value: s.codigo,
              })}
            />

            <EstadoMatriculaSelect
              enableDefaultSelectItem
              value={filters.estadoMatricula}
              onChangeValue={(v) =>
                setFilters({ ...filters, estadoMatricula: v })
              }
            />
            <Button
              onClick={() => {
                setAppliedFilters({
                  ...filters,
                  genero:
                    filters.genero === "todos" || filters.genero === ""
                      ? undefined
                      : filters.genero,
                  estadoAprovacao:
                    filters.estadoAprovacao === "all"
                      ? undefined
                      : filters.estadoAprovacao,
                });
              }}
            >
              Pesquisar
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estudantes Sem Inscrições em UC</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingEstatistica ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Estudantes...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum Estudante encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ano Letivo</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Género</TableHead>
                      <TableHead>Ano Curricular</TableHead>
                      <TableHead>Estado da Matrícula</TableHead>
                      <TableHead>Estado de Aprovação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{item.nomecompleto}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.tipo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
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
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}

const ESTADO_APROVACAO = [
  {
    codigo: "all",
    designacao: "Todos",
  },
  {
    codigo: "1",
    designacao: "Aprovado",
  },
  {
    codigo: "2",
    designacao: "Reprovado",
  },
];
