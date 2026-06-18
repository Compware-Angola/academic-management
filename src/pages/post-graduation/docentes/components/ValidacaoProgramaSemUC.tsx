import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
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
import { useQueryProgramasSemUC } from "@/hooks/docentes/use-query-docente-programa-sem-uc";
import { parseFilter } from "@/util/parse-filter";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";

const ValidacaoProgramaSemUC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    tipoCandidatura: "",
  });

  const { data: programaUcResponse, isLoading } = useQueryProgramasSemUC({
    anoCurricular: parseFilter(filters.anoCurricular),
    anoLectivo: parseFilter(filters.anoLectivo),
    codigoCurso: parseFilter(filters.curso),
    semestre: parseFilter(filters.semestre),
  });
  const programas = programaUcResponse?.data ?? [];
  const total = programaUcResponse?.total;
  const totalPages = programaUcResponse?.totalPages;
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 grid-cols-4">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <SemestreSelect
              value={filters.semestre}
              onChangeValue={(v) => setFilters({ ...filters, semestre: v })}
            />
            <TipoCandidaturaSelect
              isPostGraduation
              value={filters.tipoCandidatura}
              onChangeValue={(v) => setFilters({ ...filters, tipoCandidatura: v })}
            />
            <CourseSelect
              disabled={!filters.tipoCandidatura}
              params={{ tipoCandidaturaId: parseFilter(filters.tipoCandidatura) }}
              value={filters.curso}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
            />
            <AnoCurricularSelect
              value={filters.anoCurricular}
              onChangeValue={(v) =>
                setFilters({ ...filters, anoCurricular: v })
              }
              curso={filters.curso}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Programas com UC</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : programas.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhum Programa encontrada.
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>UC</TableHead>
                      <TableHead>Semestre</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programas.map((item) => (
                      <TableRow key={item.codigo}>
                        <TableCell>{item.codigo}</TableCell>
                        <TableCell>{"2024-2035"}</TableCell>
                        <TableCell>{item.curso}</TableCell>
                        <TableCell>{item.disciplina}</TableCell>
                        <TableCell> {item.semestre}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  A mostrar {programas.length} de {total} registos
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
export { ValidacaoProgramaSemUC };
