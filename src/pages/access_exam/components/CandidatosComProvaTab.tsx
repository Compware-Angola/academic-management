import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCandidatosComProva } from "@/hooks/access_exam/use-candidatos-com-prova";

type Filters = {
  codigoAnoLetivo: string;
  codigoCurso: string;
  dataRealizacao: string;
  dataRealizacaoInput: string;
  horaInicio: string;
  horaInicioInput: string;
  page: number;
  limit: number;
};

const INITIAL: Filters = {
  codigoAnoLetivo: "",
  codigoCurso: "",
  dataRealizacao: "",
  dataRealizacaoInput: "",
  horaInicio: "",
  horaInicioInput: "",
  page: 1,
  limit: 10,
};

export function CandidatosComProvaTab() {
  const [filters, setFilters] = useState<Filters>(INITIAL);

  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();

  const { data, isLoading } = useCandidatosComProva({
    codigoAnoLetivo: filters.codigoAnoLetivo ? Number(filters.codigoAnoLetivo) : undefined,
    codigoCurso: filters.codigoCurso ? Number(filters.codigoCurso) : undefined,
    dataRealizacao: filters.dataRealizacao || undefined,
    horaInicio: filters.horaInicio || undefined,
    page: filters.page,
    limit: filters.limit,
  });

  const candidatos = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalpages ?? 1;
  const offset = (filters.page - 1) * filters.limit;

  function handleData(val: string) {
    if (val) {
      const [yyyy, mm, dd] = val.split("-");
      setFilters((p) => ({
        ...p,
        dataRealizacaoInput: val,
        dataRealizacao: `${dd}/${mm}/${yyyy}`,
        page: 1,
      }));
    } else {
      setFilters((p) => ({ ...p, dataRealizacaoInput: "", dataRealizacao: "", page: 1 }));
    }
  }

  function handleHora(val: string) {
    setFilters((p) => ({
      ...p,
      horaInicioInput: val,
      horaInicio: val ? `${val}:00` : "",
      page: 1,
    }));
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={() => setFilters(INITIAL)}>
            <X className="h-4 w-4 mr-2" />Limpar filtros
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <FormSelect
              label="Ano Letivo"
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              value={filters.codigoAnoLetivo}
              onChange={(v) => setFilters((p) => ({ ...p, codigoAnoLetivo: v, page: 1 }))}
              options={academicYear}
              map={(a) => ({ key: a.codigo.toString(), label: a.designacao, value: a.codigo.toString() })}
            />
          </div>
          <div className="space-y-2">
            <CourseSelect
              value={filters.codigoCurso}
              onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v, page: 1 }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Data de Realização</Label>
            <Input
              type="date"
              value={filters.dataRealizacaoInput}
              onChange={(e) => handleData(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Hora Início</Label>
            <Input
              type="time"
              value={filters.horaInicioInput}
              onChange={(e) => handleHora(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Inscrição</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>BI</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Ano Lectivo</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Hora</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`sk-${i}`}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={`sk-${i}-${j}`}><Skeleton className="h-4 w-full" /></TableCell>
                ))}
              </TableRow>
            ))}

            {!isLoading && candidatos.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            )}

            {!isLoading && candidatos.map((item) => (
              <TableRow key={item.numero_inscricao}>
                <TableCell className="font-mono font-semibold">{item.numero_inscricao}</TableCell>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="font-mono text-sm">{item.numero_bilhete}</TableCell>
                <TableCell className="text-sm">{item.curso}</TableCell>
                <TableCell><Badge variant="outline">{item.sala}</Badge></TableCell>
                <TableCell className="text-sm">{item.ano_lectivo}</TableCell>
                <TableCell className="text-sm">{item.data_realizacao}</TableCell>
                <TableCell className="text-sm">{item.hora_inicio}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Mostrar</span>
          <Select
            value={filters.limit.toString()}
            onValueChange={(v) => setFilters((p) => ({ ...p, limit: Number(v), page: 1 }))}
          >
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-2">
            Mostrando {total === 0 ? 0 : offset + 1} a {Math.min(offset + filters.limit, total)} de {total} registos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters((p) => ({ ...p, page: p.page - 1 }))}
            disabled={filters.page === 1}
          >
            <ChevronLeft className="h-4 w-4" />Anterior
          </Button>
          <span className="text-sm">Página {filters.page} de {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            disabled={filters.page === totalPages}
          >
            Seguinte<ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}