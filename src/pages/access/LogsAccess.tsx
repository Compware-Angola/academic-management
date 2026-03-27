import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";


import { useState, useEffect, useMemo } from "react";
import { SearchX, ChevronLeft, ChevronRight, User, Calendar, Globe, Info, X } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useQueryLogsAccesses } from "@/hooks/acess/use-query-logs-accesses";

// Tipo baseado no retorno real da API
export type TipoLogsAccesses = {
  pkLogAcesso: number;
  descricao: string;
  fkAcesso: number | null;
  fkFuncionalidade: number | null;
  fkUtilizadorResponsavel: number;
  fkGrupoAfetado: number | null;
  fkOperacaoLog: number;
  createdAt: string;
  ip: string;
  nomeUtilizadorResponsavel?: string;
  codigoUtilizador?: number;
  nomeFuncionalidade?: string | null;
  designacaoAcesso?: string | null;
};

type FiltersLogs = {
  dataInicio?: string;
  dataFim?: string;
  search?: string;
  page?: number;
  limit?: number;
};

export default function LogsAcessos() {
  const [filters, setFilters] = useState<FiltersLogs>({
    dataInicio: "",
    dataFim: "",
    search: "",
  });

  const [paramsPesquisa, setParamsPesquisa] = useState<FiltersLogs | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  // Atualiza automaticamente quando o search muda (pesquisa instantânea)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      atualizarParamsPesquisa();
    }, 500); // debounce de 500ms para não disparar a cada tecla

    return () => clearTimeout(timeout);
  }, [filters.search]);

  // Atualiza params quando datas ou search mudam (para consistência)
  useEffect(() => {
    atualizarParamsPesquisa();
  }, [filters.dataInicio, filters.dataFim]);

  const atualizarParamsPesquisa = () => {
    const params: Partial<FiltersLogs> = {};

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

    // Se não houver nenhum filtro → null (busca padrão)
    setParamsPesquisa(
      Object.keys(params).length > 0 ? (params as FiltersLogs) : null
    );
  };

  // Query: executa sempre, com filtros ou sem
  const { data: logsResponse, isLoading } = useQueryLogsAccesses({
    ...(paramsPesquisa || {}),
    page: currentPage,
    limit: itemsPerPage,
  });

  const logs = logsResponse?.data ?? [];
  const total = logsResponse?.total ?? 0;
  const totalPages = logsResponse?.totalPages ?? 1;


  const pdfData = useMemo(() => {
  if (!logs.length) return null;

  return {
    filtros: [
      filters.dataInicio && `Data início: ${filters.dataInicio}`,
      filters.dataFim && `Data fim: ${filters.dataFim}`,
      filters.search && `Pesquisa: ${filters.search}`,
    ]
      .filter(Boolean)
      .join(" | ") || "Sem filtros",

    total: logs.length,

    rows: logs.map((l) => ({
      id: l.pkLogAcesso,
      descricao: l.descricao,
      utilizador: l.nomeUtilizadorResponsavel ?? "—",
      funcionalidade: l.nomeFuncionalidade ?? "—",
      ip: l.ip,
      data: formatDate(l.createdAt),
    })),
  };
}, [logs, filters]);

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Logs de Acessos"
    subtitle="Registo de atividades e acessos do sistema"
    infoSections={[
      { title: "Filtros Aplicados", content: pdfData.filtros },
      { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
    ]}
    mainTable={{
      headers: [
        { key: "id", label: "ID", width: "8%" },
        { key: "descricao", label: "Descrição", width: "32%" },
        { key: "utilizador", label: "Utilizador", width: "18%" },
        { key: "funcionalidade", label: "Funcionalidade", width: "18%" },
        { key: "ip", label: "IP", width: "12%" },
        { key: "data", label: "Data/Hora", width: "12%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#0D1B48",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;

const excelProps = {
  documentTitle: "Logs de Acessos",
  subtitle: "Registo de atividades e acessos do sistema",
  infoSections: [
    { title: "Filtros Aplicados", content: pdfData?.filtros ?? "Sem filtros" },
    { title: "Resumo", content: [`Total de registos: ${logs.length}`] },
  ],
  mainTable: {
    headers: [
      { key: "id", label: "ID", width: 10 },
      { key: "descricao", label: "Descrição", width: 50 },
      { key: "utilizador", label: "Utilizador", width: 25 },
      { key: "funcionalidade", label: "Funcionalidade", width: 25 },
      { key: "ip", label: "IP", width: 20 },
      { key: "data", label: "Data/Hora", width: 22 },
    ],
    rows: logs.map(l => ({
      id: l.pkLogAcesso,
      descricao: l.descricao,
      utilizador: l.nomeUtilizadorResponsavel ?? "—",
      funcionalidade: l.nomeFuncionalidade ?? "—",
      ip: l.ip,
      data: formatDate(l.createdAt),
    })),
  },
  footerNotice: "Documento gerado automaticamente pelo sistema.",
  primaryColor: "#0D1B48",
};

const baseFileName = `Logs_Acessos_${new Date().toISOString().slice(0, 10)}`;


  // Handlers
  const handlePesquisar = () => {
    setCurrentPage(1);
    atualizarParamsPesquisa();
  };

  const handleLimparFiltros = () => {
    setFilters({
      dataInicio: "",
      dataFim: "",
      search: "",
    });
    setCurrentPage(1);
    setParamsPesquisa(null); // busca sem filtros
  };

  const handleInputChange = (field: keyof FiltersLogs, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };


  // Render
  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Cabeçalho */}
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
          <h1 className="mt-1 text-3xl font-bold tracking-tight">Logs de Acessos</h1>
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

          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar utilizador</Label>
            <Input
              id="search"
              placeholder="Nome, email ou código..."
              value={filters.search ?? ""}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>

          <div className="flex items-end gap-3 pt-2 sm:pt-0 flex-col sm:flex-row">
            <Button
              onClick={handlePesquisar}
              className="w-full sm:w-auto"
              disabled={!filters.dataInicio?.trim() || !filters.dataFim?.trim()}
            >
              <SearchX className="mr-2 h-4 w-4" />
              Filtrar
            </Button>

            <Button
              variant="outline"
              onClick={handleLimparFiltros}
              className="w-full sm:w-auto border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={
                !filters.dataInicio?.trim() &&
                !filters.dataFim?.trim() &&
                !filters.search?.trim()
              }
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60 hover:bg-muted/60">
              <TableHead className="w-[35%]">Descrição</TableHead>
              <TableHead>Utilizador</TableHead>
              <TableHead>Funcionalidade</TableHead>
              <TableHead>Operação</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Data/Hora</TableHead>
              <TableHead className="text-right">ID Log</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={7}>
                    <Skeleton className="h-8 w-full rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <SearchX className="h-10 w-10 mb-3 opacity-40" />
                    <p className="text-lg font-medium">Nenhum registo encontrado</p>
                    <p className="text-sm mt-1">
                      Tente ajustar os filtros de data ou pesquisa
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              logs.map((item: TipoLogsAccesses) => (
                <TableRow
                  key={item.pkLogAcesso}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <Info className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="line-clamp-2">{item.descricao}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md">
                          {item.descricao}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {item.nomeUtilizadorResponsavel || "—"}
                        <span className="text-xs text-muted-foreground ml-1.5">
                          ({item.fkUtilizadorResponsavel})
                        </span>
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{item.nomeFuncionalidade || "—"}</TableCell>

                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {item.fkOperacaoLog}
                    </span>
                  </TableCell>

                  <TableCell className="font-mono text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {item.ip}
                    </div>
                  </TableCell>

                  <TableCell className="text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {formatDate(item.createdAt)}
                    </div>
                  </TableCell>

                  <TableCell className="text-right text-xs text-muted-foreground font-mono">
                    #{item.pkLogAcesso}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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