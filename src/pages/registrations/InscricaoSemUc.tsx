import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

import { parseFilter } from "@/util/parse-filter";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { useQueryListInscricaoSemUc } from "@/hooks/registrations/use-query-inscricao-sem-uc";

const InscricaoSemUc = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    semestre: "all",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    faculdade: "",
  });

  const { data: studentsResponse, isLoading } = useQueryListInscricaoSemUc({
    codigoAnoLectivo: parseFilter(filters.anoLectivo),
    codigoCurso: parseFilter(filters.curso),
    grade: parseFilter(filters.unidadeCurricular),
    limit,
    page,
  });

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter(
      {
        curso: filters.curso,
        semestre: filters.semestre == "all" ? null : filters.semestre,
        classe: filters.anoCurricular,
      },
      {
        enabled: !!filters.curso && !!filters.anoCurricular,
      },
    );

  const canLoadUcs = !!filters.curso && !!filters.semestre;
  const students = studentsResponse?.data ?? [];
  const total = studentsResponse?.total;
  const totalPages = studentsResponse?.totalPages;
  return (
    <>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Inscrições e Matrículas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inscrições Sem Uc</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          Estudantes Sem Inscrições em UC
        </h1>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-3">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <SemestreSelect
              enableDefaultSelectItem
              value={filters.semestre}
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
            />
            <FacultySelect
              value={filters.faculdade}
              onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
            />
            <CourseSelect
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={filters.unidadeCurricular}
                onValueChange={(v) =>
                  setFilters({ ...filters, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !filters.curso
                        ? "Selecione curso"
                        : !filters.semestre
                          ? "Selecione semestre"
                          : isLoadingUC
                            ? "Carregando UCs..."
                            : "Selecionar UC"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {unidadesCurriculares.map((uc) => (
                    <SelectItem key={uc.pk} value={uc.pk.toString()}>
                      {uc.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Estudantes Sem Inscrições em UC</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
                      <TableHead>Matricula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Tipo</TableHead>
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
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
export { InscricaoSemUc };
