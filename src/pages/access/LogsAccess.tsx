import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

import { useState, useEffect, useMemo } from "react";
import {
  SearchX,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Globe,
  Info,
  X,
  Server,
  Layers,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Link2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useQueryLogsAccesses } from "@/hooks/acess/use-query-logs-accesses";
import { useQueryLogsFilterOptions } from "@/hooks/acess/use-query-logs-options";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import {
  LogAudit,
  LogOutcome,
  fetchLogsParams,
} from "@/services/access/fetch-logs-acesses.service";

type FiltersLogs = {
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  serviceName?: string;
  module?: string;
  action?: string;
  outcome?: LogOutcome;
  page?: number;
  limit?: number;
};

const OUTCOME_STYLES: Record<LogOutcome, { label: string; className: string }> =
  {
    SUCCESS: {
      label: "Sucesso",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    FAILURE: {
      label: "Falha",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    ERROR: {
      label: "Erro",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
  };

export default function LogsAcessos() {
  const [filters, setFilters] = useState<FiltersLogs>({
    dataInicio: "",
    dataFim: "",
    search: "",
    serviceName: "",
    module: "",
    action: "",
    outcome: undefined,
  });

  const [paramsPesquisa, setParamsPesquisa] = useState<
    Partial<fetchLogsParams> | null
  >(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      atualizarParamsPesquisa();
    }, 500);

    return () => clearTimeout(timeout);
  }, [filters.search, filters.serviceName, filters.module, filters.action]);

  useEffect(() => {
    atualizarParamsPesquisa();
  }, [filters.dataInicio, filters.dataFim, filters.outcome]);

  const atualizarParamsPesquisa = () => {
    const params: Partial<fetchLogsParams> = {};

    if (filters.dataInicio?.trim()) {
      params.dataInicio = filters.dataInicio.trim();
    }

    if (filters.dataFim?.trim()) {
      params.dataFim = filters.dataFim.trim();
    }

    const searchTrimmed = filters.search?.trim();
    if (searchTrimmed) {
      params.search = searchTrimmed;
    }

    if (filters.serviceName?.trim()) {
      params.serviceName = filters.serviceName.trim();
    }

    if (filters.module?.trim()) {
      params.module = filters.module.trim();
    }

    if (filters.action?.trim()) {
      params.action = filters.action.trim();
    }

    if (filters.outcome) {
      params.outcome = filters.outcome;
    }

    setParamsPesquisa(
      Object.keys(params).length > 0 ? (params as fetchLogsParams) : null
    );
  };

  const { data: logsResponse, isLoading } = useQueryLogsAccesses({
    ...(paramsPesquisa || {}),
    page: currentPage,
    limit: itemsPerPage,
  });

  const { data: filterOptions, isLoading: isLoadingOptions } =
    useQueryLogsFilterOptions();

  const serviceOptions = filterOptions?.serviceNames ?? [];
  const moduleOptions = filterOptions?.modules ?? [];
  const actionOptions = filterOptions?.actions ?? [];

  const logs: LogAudit[] = logsResponse?.data ?? [];
  const total = logsResponse?.total ?? 0;
  const totalPages = logsResponse?.totalPages ?? 1;

  const pdfData = useMemo(() => {
    if (!logs.length) return null;

    return {
      filtros: [
        filters.dataInicio && `Data início: ${filters.dataInicio}`,
        filters.dataFim && `Data fim: ${filters.dataFim}`,
        filters.search && `Pesquisa: ${filters.search}`,
        filters.serviceName && `Serviço: ${filters.serviceName}`,
        filters.module && `Módulo: ${filters.module}`,
        filters.action && `Ação: ${filters.action}`,
        filters.outcome && `Resultado: ${filters.outcome}`,
      ]
        .filter(Boolean)
        .join(" | ") || "Sem filtros",

      total: logs.length,

      rows: logs.map((l) => ({
        id: l._id,
        descricao: l.actionDescription || l.action,
        utilizador: l.userName ?? "—",
        servico: l.serviceName,
        modulo: l.module,
        ip: l.ip ?? "—",
        resultado: l.outcome,
        data: formatDate(l.timestamp),
      })),
    };
  }, [logs, filters]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Logs de Acessos"
      subtitle="Registo de todas as ações e acessos realizados no sistema"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "id", label: "ID", width: "14%" },
          { key: "descricao", label: "Descrição", width: "26%" },
          { key: "utilizador", label: "Utilizador", width: "14%" },
          { key: "servico", label: "Serviço", width: "14%" },
          { key: "modulo", label: "Módulo", width: "12%" },
          { key: "ip", label: "IP", width: "10%" },
          { key: "resultado", label: "Resultado", width: "10%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = {
    documentTitle: "Logs de Acessos",
    subtitle: "Registo de todas as ações e acessos realizados no sistema",
    infoSections: [
      { title: "Filtros Aplicados", content: pdfData?.filtros ?? "Sem filtros" },
      { title: "Resumo", content: [`Total de registos: ${logs.length}`] },
    ],
    mainTable: {
      headers: [
        { key: "id", label: "ID", width: 26 },
        { key: "descricao", label: "Descrição", width: 40 },
        { key: "utilizador", label: "Utilizador", width: 25 },
        { key: "servico", label: "Serviço", width: 20 },
        { key: "modulo", label: "Módulo", width: 20 },
        { key: "ip", label: "IP", width: 16 },
        { key: "resultado", label: "Resultado", width: 12 },
      ],
      rows: logs.map((l) => ({
        id: l._id,
        descricao: l.actionDescription || l.action,
        utilizador: l.userName ?? "—",
        servico: l.serviceName,
        modulo: l.module,
        ip: l.ip ?? "—",
        resultado: l.outcome,
      })),
    },
    footerNotice: "Documento gerado automaticamente pelo sistema.",
    primaryColor: "#0D1B48",
  };

  const baseFileName = `Logs_Acessos_${new Date().toISOString().slice(0, 10)}`;

  const handlePesquisar = () => {
    setCurrentPage(1);
    atualizarParamsPesquisa();
  };

  const handleLimparFiltros = () => {
    setFilters({
      dataInicio: "",
      dataFim: "",
      search: "",
      serviceName: "",
      module: "",
      action: "",
      outcome: undefined,
    });
    setCurrentPage(1);
    setParamsPesquisa(null);
  };

  const handleInputChange = (field: keyof FiltersLogs, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const hasFilters =
    !!filters.dataInicio?.trim() ||
    !!filters.dataFim?.trim() ||
    !!filters.search?.trim() ||
    !!filters.serviceName?.trim() ||
    !!filters.module?.trim() ||
    !!filters.action?.trim() ||
    !!filters.outcome;

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
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
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Logs de Acessos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registo de todas as ações e acessos realizados no sistema
          </p>
        </div>

        {logs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`${baseFileName}.pdf`}
                showDownload
                showPrint
              />
            )}

            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          </div>
        )}
      </div>

      {/* Filtros */}
      <div className="rounded-xl border bg-card shadow-sm p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Input
              type="date"
              id="dataInicio"
              value={filters.dataInicio ?? ""}
              onChange={(e) => handleInputChange("dataInicio", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Input
              type="date"
              id="dataFim"
              value={filters.dataFim ?? ""}
              onChange={(e) => handleInputChange("dataFim", e.target.value)}
            />
          </div>

          <FormCommandSelect
            label="Serviço"
            value={filters.serviceName ?? ""}
            options={serviceOptions}
            map={(s) => ({ key: s, value: s, label: s })}
            onChange={(v) => handleInputChange("serviceName", v)}
            placeholder="Todos os serviços"
            width="full"
            isLoading={isLoadingOptions}
          />

          <FormCommandSelect
            label="Módulo"
            value={filters.module ?? ""}
            options={moduleOptions}
            map={(s) => ({ key: s, value: s, label: s })}
            onChange={(v) => handleInputChange("module", v)}
            placeholder="Todos os módulos"
            width="full"
            isLoading={isLoadingOptions}
          />

          <FormCommandSelect
            label="Ação"
            value={filters.action ?? ""}
            options={actionOptions}
            map={(s) => ({ key: s, value: s, label: s })}
            onChange={(v) => handleInputChange("action", v)}
            placeholder="Todas as ações"
            width="full"
            isLoading={isLoadingOptions}
          />

          <div className="space-y-2">
            <Label htmlFor="outcome">Resultado</Label>
            <Select
              value={filters.outcome ?? "all"}
              onValueChange={(v) =>
                handleInputChange("outcome", v === "all" ? "" : v)
              }
            >
              <SelectTrigger id="outcome" className="w-full">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="SUCCESS">Sucesso</SelectItem>
                <SelectItem value="FAILURE">Falha</SelectItem>
                <SelectItem value="ERROR">Erro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Descrição, IP, utilizador, serviço..."
              value={filters.search ?? ""}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>

          <div className="flex items-end gap-3 pt-2 sm:pt-0 flex-col sm:flex-row">
            <Button
              onClick={handlePesquisar}
              className="w-full sm:w-auto"
            >
              <SearchX className="mr-2 h-4 w-4" />
              Filtrar
            </Button>

            <Button
              variant="outline"
              onClick={handleLimparFiltros}
              className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={!hasFilters}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="w-[28%]">Descrição</TableHead>
                <TableHead>Utilizador</TableHead>
                <TableHead>Serviço / Módulo</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Rota</TableHead>
                <TableHead>Resultado</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead className="text-right">ID Log</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={9}>
                      <Skeleton className="h-8 w-full rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <SearchX className="h-10 w-10 mb-3 opacity-40" />
                      <p className="text-lg font-medium">
                        Nenhum registo encontrado
                      </p>
                      <p className="text-sm mt-1">
                        Tente ajustar os filtros de data ou pesquisa
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((item: LogAudit) => {
                  const outcomeStyle = OUTCOME_STYLES[item.outcome] ?? {
                    label: item.outcome,
                    className: "bg-muted text-muted-foreground",
                  };

                  return (
                    <TableRow
                      key={item._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-2 cursor-help">
                                <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                                <div className="min-w-0">
                                  <span className="line-clamp-2">
                                    {item.actionDescription || item.action}
                                  </span>
                                  {item.outcomeDetail && (
                                    <span className="line-clamp-1 text-xs text-muted-foreground">
                                      {item.outcomeDetail}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-md">
                              <p>{item.actionDescription || item.action}</p>
                              {item.outcomeDetail && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {item.outcomeDetail}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {item.userName || "—"}
                            {item.userId && (
                              <span className="text-xs text-muted-foreground ml-1.5">
                                ({item.userId})
                              </span>
                            )}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex items-center gap-1.5">
                            <Server className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.serviceName}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Layers className="h-3.5 w-3.5" />
                            {item.module}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Activity className="h-3.5 w-3.5" />
                            {item.action}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="font-mono text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5" />
                          {item.ip || "—"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1.5 text-xs font-mono">
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-semibold text-primary">
                              {item.method || "—"}
                            </span>
                          </span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="line-clamp-1 text-xs text-muted-foreground font-mono cursor-help">
                                  {item.path || "—"}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-md">
                                {item.path || "—"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>

                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium cursor-help ${outcomeStyle.className}`}
                              >
                                {item.outcome === "SUCCESS" && (
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                )}
                                {item.outcome === "FAILURE" && (
                                  <XCircle className="h-3.5 w-3.5" />
                                )}
                                {item.outcome === "ERROR" && (
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                )}
                                {outcomeStyle.label}
                                {item.statusCode && (
                                  <span className="opacity-70">
                                    ({item.statusCode})
                                  </span>
                                )}
                              </span>
                            </TooltipTrigger>
                            {item.outcomeDetail && (
                              <TooltipContent className="max-w-md">
                                {item.outcomeDetail}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>

                      <TableCell className="text-sm">
                        {item.responseTimeMs != null ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {item.responseTimeMs} ms
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      <TableCell className="text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(item.timestamp)}
                        </div>
                      </TableCell>

                      <TableCell className="text-right text-xs text-muted-foreground font-mono">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                #{item.requestId.slice(0, 8)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Request ID: {item.requestId}</p>
                              <p className="text-xs text-muted-foreground">
                                _id: {item._id}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      {(logs.length > 0 || paramsPesquisa) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 py-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              Mostrando {(currentPage - 1) * itemsPerPage + 1}–
              {Math.min(currentPage * itemsPerPage, total)} de {total}
            </span>

            <div className="flex items-center gap-2">
              <span>Itens por página:</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-20 h-8">
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

          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm font-medium min-w-[100px] text-center">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
