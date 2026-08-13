import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText,
  Home,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useDebounce } from "@/hooks/use-debounce";
import { parseFilter } from "@/util/parse-filter";
import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

import { useQueryConciliacaoDividas } from "@/hooks/financas/dividas/use-query-conciliacao-divida";
import {
  ConciliacaoDivida,
  ConciliacaoDividaStatus,
} from "@/services/financas/conciliacao-divida/fetch-conciliacao-divida";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper para formatação monetária (AOA)
const formatCurrency = (val?: number) => {
  if (val === undefined || val === null) return "0,00 Kz";
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  }).format(val);
};

export default function NegociacaoDividaConciliacao() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const navigate = useNavigate();
  const [searchBy, setSearchBy] = useState<"codigoMatricula" | "nome">(
    "codigoMatricula",
  );

  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [filters, setFilters] = useState({
    anoLectivo: "",
    faculdade: "",
    curso: "",
  });

  const queryFilters = {
    page,
    limit,
    status: (statusFilter === "ALL"
      ? undefined
      : statusFilter) as ConciliacaoDividaStatus,
    codigoAnoLectivo: filters.anoLectivo
      ? Number(filters.anoLectivo)
      : undefined,
    codigoCurso: filters.curso ? Number(filters.curso) : undefined,
    ...(debouncedSearchTerm && searchBy === "codigoMatricula"
      ? { codigoMatricula: Number(debouncedSearchTerm) || undefined }
      : {}),
    ...(debouncedSearchTerm && searchBy === "nome"
      ? { nome: debouncedSearchTerm }
      : {}),
  };

  const {
    data: conciliacoesData,
    isLoading,
    isFetching,
  } = useQueryConciliacaoDividas(queryFilters);

  const listData = conciliacoesData?.data ?? [];
  const totalPages = conciliacoesData?.totalPages ?? 1;
  const total = conciliacoesData?.total ?? 1;

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setFilters({ anoLectivo: "", faculdade: "", curso: "" });
    setPage(1);
  };

  const getStatusBadge = (status: ConciliacaoDividaStatus) => {
    switch (status) {
      case "APROVADO":
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200 gap-1 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Aprovado
          </Badge>
        );
      case "REJEITADO":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3.5 h-3.5" /> Rejeitado
          </Badge>
        );
      case "PENDENTE":
      default:
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-200 gap-1 dark:text-amber-400"
          >
            <Clock className="w-3.5 h-3.5" /> Pendente
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Navegação Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/" className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                Início
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Área Financeira</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold text-foreground">
              Conciliação de Dívida
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Aprovação de Conciliação de Dívidas
        </h1>
        <p className="text-muted-foreground text-sm max-w-3xl">
          Análise comparativa das facturas originais com as propostas de
          conciliação solicitadas para validação e liquidação financeira.
        </p>
      </div>

      {/* Filtros */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" /> Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => {
                setFilters({ ...filters, anoLectivo: v });
                setPage(1);
              }}
            />
            <FacultySelect
              allOption
              value={filters.faculdade}
              onChangeValue={(v) => {
                setFilters({ ...filters, faculdade: v, curso: "" });
                setPage(1);
              }}
            />
            <CourseSelect
              params={{
                faculdadeId: parseFilter(filters.faculdade),
              }}
              onChangeValue={(v) => {
                setFilters({ ...filters, curso: v });
                setPage(1);
              }}
              value={filters.curso}
            />
            <FormSelect
              label="Estado da Conciliação"
              value={statusFilter}
              onChange={(v) => {
                setStatusFilter(v);
                setPage(1);
              }}
              options={[
                { key: "ALL", label: "Todos os estados" },
                { key: "PENDENTE", label: "Pendente" },
                { key: "APROVADO", label: "Aprovado" },
                { key: "REJEITADO", label: "Rejeitado" },
              ]}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2 border-t border-border/40">
            <div className="w-full sm:w-64">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as "codigoMatricula" | "nome");
                  setSearchTerm("");
                }}
                options={[
                  { id: "codigoMatricula", label: "Código da Matrícula" },
                  { id: "nome", label: "Nome do Estudante" },
                ]}
                map={(o) => ({
                  key: o.id,
                  label: o.label,
                  value: o.id,
                })}
              />
            </div>

            <div className="flex-1 relative flex items-end">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder={
                    searchBy === "codigoMatricula"
                      ? "Digite o número de matrícula..."
                      : "Digite o nome do estudante..."
                  }
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full sm:w-auto"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Resultados */}
      <div className="bg-card border rounded-lg p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">
            Propostas de Conciliação
          </h3>
          {conciliacoesData?.total !== undefined && (
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
              Total: {conciliacoesData.total} registros
            </span>
          )}
        </div>

        {isLoading || isFetching ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-md" />
            ))}
          </div>
        ) : listData.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-base font-medium text-foreground">
              Nenhuma solicitação encontrada
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Ajuste os filtros de pesquisa ou limpe a busca para exibir os
              resultados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-md">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[180px]">Estudante</TableHead>
                  <TableHead>Curso / Faculdade</TableHead>
                  <TableHead className="text-right">Valor Original</TableHead>
                  <TableHead className="text-center w-[40px]"></TableHead>
                  <TableHead className="text-right">Valor Proposto</TableHead>
                  <TableHead className="text-right">Diferença</TableHead>
                  <TableHead className="text-center">Estado</TableHead>
                  <TableHead className="text-right">Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listData.map((item: ConciliacaoDivida) => {
                  const valOriginal = item.facturaOriginal?.valorApagar ?? 0;
                  const valProposto =
                    item.facturaPropostaAlteracao?.valorApagar ?? 0;
                  const diferenca = valOriginal - valProposto;

                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/40 transition-colors"
                    >
                      <TableCell>
                        <div className="font-medium text-foreground">
                          {item.estudante?.nome || "Não informado"}
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          Mat: {item.estudante?.codigoMatricula || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="text-sm truncate max-w-[200px]"
                          title={item.estudante?.curso || ""}
                        >
                          {item.estudante?.curso || "N/A"}
                        </div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {item.estudante?.faculdade || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {formatCurrency(valOriginal)}
                      </TableCell>
                      <TableCell className="text-center">
                        <ArrowRight className="h-4 w-4 text-muted-foreground mx-auto" />
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(valProposto)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
                        {formatCurrency(diferenca)}
                      </TableCell>
                      <TableCell className="text-center">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {item.createdAt
                          ? format(
                              new Date(item.createdAt),
                              "dd/MM/yyyy HH:mm",
                              {
                                locale: ptBR,
                              },
                            )
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigate(
                              `/financas/conciliacao-aprovacao/${item.id}`,
                            );
                          }}
                        >
                          Analisar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Paginação */}

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            A mostrar {listData.length} de {total} registos
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
    </div>
  );
}
