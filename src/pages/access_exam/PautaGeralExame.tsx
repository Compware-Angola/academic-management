import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { RefreshCw, Download, Printer, ChevronLeft, ChevronRight, Home, X, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { FormSelect } from "@/components/common/FormSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useResultadoProva } from "@/hooks/access_exam/use-resultado-prova";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQuerySalas } from "@/hooks/salas/use-query-sala";
import { parseFilter } from "@/util/parse-filter";

type Filters = {
  codigoAnoLetivo: string;
  codigoCurso: string;
  codigoTurno: string;
  codigoFaculdade: string;
  codigoSala: string;
  resultado: string;
  dataInicio: string;
  dataFim: string;
  dataInicioInput: string;
  search: string;
  dataFimInput: string;
  page: number;
  limit: number;
};

const FILTERS_INITIAL: Filters = {
  codigoAnoLetivo: "",
  codigoCurso: "",
  codigoTurno: "",
  codigoFaculdade: "",
  codigoSala: "",
  resultado: "",
  dataInicio: "",
  dataFim: "",
  search: "",
  dataInicioInput: "",
  dataFimInput: "",
  page: 1,
  limit: 10,
};

export default function PautaGeralExame() {
  const [filters, setFilters] = useState<Filters>(FILTERS_INITIAL);
  const { data: salas = [] } = useQuerySalas();
  const { data: academicYear, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();

  const { data, isLoading, refetch } = useResultadoProva({
    codigoAnoLetivo: filters.codigoAnoLetivo ? Number(filters.codigoAnoLetivo) : undefined,
    codigoCurso: filters.codigoCurso ? Number(filters.codigoCurso) : undefined,
    codigoTurno: filters.codigoTurno ? Number(filters.codigoTurno) : undefined,
    codigoFaculdade: filters.codigoFaculdade ? Number(filters.codigoFaculdade) : undefined,
    codigoSala: filters.codigoSala ? Number(filters.codigoSala) : undefined,
    resultado: parseFilter(filters.resultado),
        search:filters.search || undefined,
    dataInicio: filters.dataInicio || undefined,
    dataFim: filters.dataFim || undefined,
    page: filters.page,
    limit: filters.limit,
  });

  // Remove duplicados pelo numero_inscricao
  const seen = new Set<number>();
  const candidatos = (data?.data ?? []).filter((item) => {
    if (seen.has(item.numero_inscricao)) return false;
    seen.add(item.numero_inscricao);
    return true;
  });

  const total = data?.total ?? 0;
  const totalPages = data?.totalpages ?? 1;
  const offset = (filters.page - 1) * filters.limit;

  function limparFiltros() {
    setFilters({ ...FILTERS_INITIAL, limit: filters.limit });
  }

  function handleDataInicio(val: string) {
    if (val) {
      const [yyyy, mm, dd] = val.split("-");
      setFilters((p) => ({ ...p, dataInicioInput: val, dataInicio: `${dd}/${mm}/${yyyy}`, page: 1 }));
    } else {
      setFilters((p) => ({ ...p, dataInicioInput: "", dataInicio: "", page: 1 }));
    }
  }

  function handleDataFim(val: string) {
    if (val) {
      const [yyyy, mm, dd] = val.split("-");
      setFilters((p) => ({ ...p, dataFimInput: val, dataFim: `${dd}/${mm}/${yyyy}`, page: 1 }));
    } else {
      setFilters((p) => ({ ...p, dataFimInput: "", dataFim: "", page: 1 }));
    }
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Pauta Geral</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pauta Geral do Exame de Acesso</h1>
          <p className="text-muted-foreground mt-1">Pauta geral com a classificação de todos os candidatos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />Atualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />PDF
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />Imprimir
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <Button variant="ghost" size="sm" onClick={limparFiltros}>
            <X className="h-4 w-4 mr-2" />
            Limpar filtros
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
              map={(a) => ({
                key: a.codigo.toString(),
                label: a.designacao,
                value: a.codigo.toString(),
              })}
            />
          </div>

          <div className="space-y-2">
            <CourseSelect
              value={filters.codigoCurso}
              onChangeValue={(v) => setFilters((p) => ({ ...p, codigoCurso: v, page: 1 }))}
            />
          </div>

          <div className="space-y-2">
            <FormSelect
              disabled={isLoadingPeriodos}
              loading={isLoadingPeriodos}
              label="Período"
              value={filters.codigoTurno}
              onChange={(v) => setFilters((p) => ({ ...p, codigoTurno: v, page: 1 }))}
              options={periodos}
              map={(p) => ({
                key: p.codigo.toString(),
                label: p.designacao,
                value: p.codigo.toString(),
              })}
            />
          </div>
          <div className="space-y-2">
            <FormCommandSelect
              label="Sala"
              value={filters.codigoSala}
              width="full"
              placeholder="Selecionar sala"
              options={salas}
              map={(sala) => ({
                key: sala.pk,
                value: sala.pk,
                label: sala.descricao,
              })}
              onChange={(v) => setFilters({ ...filters, codigoSala: v })}
            />
          </div>

<div className="space-y-2">
  <Label>Resultado</Label>
  <Select
    value={filters.resultado !== undefined ? String(filters.resultado) : 'all'}
    onValueChange={(v) => setFilters((p) => ({ ...p, resultado: v === 'all' ? undefined : v, page: 1 }))}
  >
    <SelectTrigger><SelectValue placeholder="Todos" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todos</SelectItem>
      <SelectItem value="1">Admitido</SelectItem>
      <SelectItem value="0">Reprovado</SelectItem>
    </SelectContent>
  </Select>
</div>

          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={filters.dataInicioInput}
              onChange={(e) => handleDataInicio(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={filters.dataFimInput}
              onChange={(e) => handleDataFim(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Pesquisar por nome ou BI"
                value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value, page: 1 }))}
              />
            </div>
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
              <TableHead>Faculdade</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Data Realização</TableHead>
              <TableHead className="text-center">Nota</TableHead>
              <TableHead>Resultado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {isLoading && Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={`skeleton-${i}`}>
                {Array.from({ length: 10 }).map((_, j) => (
                  <TableCell key={`skeleton-${i}-${j}`}>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {!isLoading && candidatos.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            )}

            {!isLoading && candidatos.map((item) => (
              <TableRow key={`${item.numero_inscricao}-${item.codigo_curso}-${item.codigo_ano_lectivo}`}>
                <TableCell className="font-mono font-semibold">{item.numero_inscricao}</TableCell>
                <TableCell className="font-medium">{item.nome}</TableCell>
                <TableCell className="font-mono text-sm">{item.numero_bilhete}</TableCell>
                <TableCell className="text-sm">{item.curso}</TableCell>
                <TableCell className="text-sm">{item.faculdade}</TableCell>
                <TableCell>
                  <Badge variant="outline">{item.periodo}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.sala}</Badge>
                </TableCell>
                <TableCell className="text-sm">{item.data_realizacao}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={
                      item.nota >= 14
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : item.nota >= 10
                          ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          : "bg-red-500/10 text-red-600 border-red-500/20"
                    }
                  >
                    {item.nota}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.resultado === 1
                        ? "bg-green-500/10 text-green-600 border-green-500/20"
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    }
                  >
                    {item.resultado === 1 ? "Admitido" : "Reprovado"}
                  </Badge>
                </TableCell>
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
              <SelectItem value="100">100</SelectItem>
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
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <span className="text-sm">Página {filters.page} de {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFilters((p) => ({ ...p, page: p.page + 1 }))}
            disabled={filters.page === totalPages}
          >
            Seguinte
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}