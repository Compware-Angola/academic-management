import { useState, useEffect } from "react";
import { SearchX, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQueryLogsAccesses } from "@/hooks/acess/use-query-logs-accesses";

type FiltersLogs = {
  dataInicio: string;
  dataFim: string;
  utilizadorId?: number;
  page?: number;
  limit?: number;
  search?: string;
};

export default function LogsAcessos() {
  // ----- Estados -----
  const [filters, setFilters] = useState<FiltersLogs>({
    dataInicio: "",
    dataFim: "",
    page: 1,
    limit: 25,
    search: "",
  });
  

  const [paramsPesquisa, setParamsPesquisa] = useState<FiltersLogs | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // ----- Query -----
  const { data: logsResponse, isLoading } = useQueryLogsAccesses(
    paramsPesquisa && {
      ...paramsPesquisa,
      page: currentPage,
      limit: itemsPerPage,
    }
  );

  // ----- Extraindo dados -----
  const logs = logsResponse?.data ?? [];
  const total = logsResponse?.total ?? 0;
  const totalPages = logsResponse?.totalPages ?? 1;

  // ----- Handlers -----
  const handlePesquisar = () => {
    if (!filters.dataInicio || !filters.dataFim) return;

    setCurrentPage(1); // resetar página ao pesquisar

    const params: FiltersLogs = {
      dataInicio: filters.dataInicio,
      dataFim: filters.dataFim,
      page: 1,
      limit: itemsPerPage,
    };

    if (filters.search) params.search = filters.search;


    setParamsPesquisa(params);
  };

  const handleInputChange = (field: keyof FiltersLogs, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // ----- JSX -----
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Logs de Acessos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Logs de Acessos</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm lg:flex-row lg:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="DataInicio">Data Inicio</Label>
          <Input
            type="date"
            id="dataInicio"
            value={filters.dataInicio}
            onChange={(e) => handleInputChange("dataInicio", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="DataFim">Data Fim</Label>
          <Input
            type="date"
            id="dataFim"
            value={filters.dataFim}
            onChange={(e) => handleInputChange("dataFim", e.target.value)}
            className="bg-background"
          />
        </div>

        <div className="flex-1 space-y-2">
          <Label htmlFor="search">Pesquisar</Label>
          <Input
            id="search"
            placeholder="Nome ou email"
            value={filters.search ?? ""}
            onChange={(e) => handleInputChange("search", e.target.value)}
            className="bg-background"
          />
        </div>

        <div>
          <Button onClick={handlePesquisar}>
            <SearchX className="mr-2 h-4 w-4" />
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Descrição</TableHead>
              <TableHead>FkAcesso</TableHead>
              <TableHead>FkFuncionalidade</TableHead>
              <TableHead>FkGrupoAfetado</TableHead>
              <TableHead>FkOperaçãoLog</TableHead>
              <TableHead>FkUtilizadorResponsável</TableHead>
              <TableHead>Ip</TableHead>
              <TableHead className="text-right">PkLogAcesso</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              logs.map((item) => (
                <TableRow key={item.pkLogAcesso}>
                  <TableCell className="font-medium">{item.descricao}</TableCell>
                  <TableCell>{item.fkAcesso}</TableCell>
                  <TableCell>{item.fkFuncionalidade}</TableCell>
                  <TableCell>{item.fkGrupoAfetado}</TableCell>
                  <TableCell>{item.fkOperacaoLog}</TableCell>
                  <TableCell>{item.fkUtilizadorResponsavel}</TableCell>
                  <TableCell className="font-mono text-sm">{item.ip}</TableCell>
                  <TableCell>{item.pkLogAcesso}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {logs.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <div className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, total)} de {total} registos
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm px-3 py-1">
              Página {currentPage} de {totalPages || 1}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
