import { useEffect, useMemo, useState, Fragment, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Home,
  Pencil,
  Plus,
  Search,
  Trash,
  X,
  XCircle,
} from "lucide-react";

import { fmt, fmtDate, getStatus } from "./contratos-data";
import ContratoModal from "./components/createOrUpdateModal";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { useQueryContracts } from "@/hooks/financas/credito-educacional/use-query-contracts";
import { parseFilter } from "@/util/parse-filter";
import { useDebounce } from "@/hooks/use-debounce";
import type { InstitutionalContract } from "@/services/financas/credito-educacional/institutional-contract/contract.service";
import { useQueryInstitutionalContractAlertas } from "@/hooks/financas/credito-educacional/use-query-contratct-estatistic";
import { Switch } from "@/components/ui/switch";
import { useToggleContractEstado } from "@/hooks/financas/credito-educacional/use-mutation-switch";
import { formatCurrency } from "@/util/finance-format";
import { useDeleteInstitutionalContract } from "@/hooks/financas/credito-educacional/use-delete-contract";

function StatusBadge({ dataFim }: { dataFim: string }) {
  const { status, diasRestantes } = getStatus(dataFim);
  if (status === "expirado")
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" /> Expirado há {Math.abs(diasRestantes)}d
      </Badge>
    );
  if (status === "expira_breve")
    return (
      <Badge className="gap-1 bg-amber-500 hover:bg-amber-500/90 text-white">
        <AlertTriangle className="h-3 w-3" /> Expira em {diasRestantes}d
      </Badge>
    );
  return (
    <Badge className="gap-1 bg-emerald-600 hover:bg-emerald-600/90 text-white">
      <CheckCircle2 className="h-3 w-3" /> Activo ({diasRestantes}d)
    </Badge>
  );
}

export default function ContratosInstituicao() {
  const [instituicaoId, setInstituicaoId] = useState<string>("all");
  const [busca, setBusca] = useState("");
  const debouncedBusca = useDebounce(busca, 400);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [situacao, setSituacao] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [contratoEmEdicao, setContratoEmEdicao] =
    useState<InstitutionalContract | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const formatDesconto = useCallback(
    (valor: number, tipo: string) =>
      tipo === "PERCENTUAL" ? `${valor}%` : formatCurrency(valor),
    [],
  );
  // sempre que os filtros ou o tamanho da página mudam, volta à primeira página
  useEffect(() => {
    setPage(1);
  }, [instituicaoId, debouncedBusca, pageSize, situacao]);

  const {
    data: responseContratos,
    isLoading,
    isFetching,
    error,
  } = useQueryContracts({
    codigoInstituicao: parseFilter(instituicaoId),
    situacao: parseFilter(situacao),
    estado: parseFilter(estado),
    page,
    limit: pageSize,
    codigoContrato: debouncedBusca || undefined,
  });
  const { data: alertas, isLoading: isLoadingAlertas } =
    useQueryInstitutionalContractAlertas();
  const deleteContract = useDeleteInstitutionalContract();
  const toggleEstado = useToggleContractEstado();
  const lista = responseContratos?.data ?? [];
  const total = responseContratos?.total ?? 0;
  const totalPaginas = responseContratos?.totalPages ?? 1;
  const inicioIntervalo = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const fimIntervalo = Math.min(page * pageSize, total);

  const temFiltrosActivos = instituicaoId !== "all" || busca.trim() !== "";

  const limparFiltros = () => {
    setInstituicaoId("all");
    setBusca("");
  };

  const openCreateModal = () => {
    setContratoEmEdicao(null);
    setModalOpen(true);
  };

  const openEditModal = (c: InstitutionalContract) => {
    setContratoEmEdicao(c);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Crédito Educacional</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Contratos da Instituição</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Contratos da Instituição
          </h1>
          <p className="text-muted-foreground mt-1">
            Consulte contratos por instituição, Crédito Educacional e monitorize
            expirações.
          </p>
        </div>
        <Button className="gap-2" onClick={openCreateModal}>
          <Plus className="h-4 w-4" /> Novo Contrato
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Filtros</CardTitle>
          {temFiltrosActivos && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={limparFiltros}
            >
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <InstituicaoSelect
              enableDefaultSelectItem={true}
              value={instituicaoId?.toString() || ""}
              onChangeValue={(v) => setInstituicaoId(v)}
            />
            <div className="space-y-2">
              <Label>Activo</Label>
              <Select value={estado} onValueChange={(v) => setEstado(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todas</SelectItem>
                  <SelectItem value="1">Activo</SelectItem>
                  <SelectItem value="0">Desactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 ">
              <Label>Situação</Label>
              <Select value={situacao} onValueChange={(v) => setSituacao(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>Todas</SelectItem>
                  <SelectItem value="1">Não expirado</SelectItem>
                  <SelectItem value="0">Expirado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Pesquisar contrato</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Nº do contrato"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao carregar contratos</AlertTitle>
          <AlertDescription>
            Não foi possível obter a lista de contratos. Tenta novamente mais
            tarde.
          </AlertDescription>
        </Alert>
      )}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{alertas?.total}</p>
            </div>
            <Building2 className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Activos</p>
              <p className="text-2xl font-bold">{alertas?.ativos}</p>
              <span className="inline-block text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                Activo e dentro do prazo
              </span>
            </div>
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">A expirar (≤30d)</p>
              <p className="text-2xl font-bold">{alertas?.aExpirar}</p>
            </div>
            <CalendarClock className="h-8 w-8 text-amber-500" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expirados</p>
              <p className="text-2xl font-bold">{alertas?.expirados}</p>
            </div>
            <XCircle className="h-8 w-8 text-destructive" />
          </CardContent>
        </Card>
      </div>

      {alertas?.expirados > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção: contratos requerem acção</AlertTitle>
          <AlertDescription>
            {alertas?.expirados} contrato(s) nesta página estão expirados ou
            prestes a expirar. Renove-os para evitar interrupções nos pagamentos
            aos bolseiros.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contratos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8" />
                <TableHead>Contrato</TableHead>
                {instituicaoId === "all" && <TableHead>Instituição</TableHead>}
                <TableHead>Data Início</TableHead>
                <TableHead>Data Fim</TableHead>
                <TableHead>Crédito Educacional</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="w-8"> Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={instituicaoId === "all" ? 9 : 8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    A carregar contratos...
                  </TableCell>
                </TableRow>
              ) : lista.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={instituicaoId === "all" ? 9 : 8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum contrato encontrado
                  </TableCell>
                </TableRow>
              ) : (
                lista.map((c) => {
                  const total = c.bolsas.reduce(
                    (s, b) => s + (b.valorDesconto ?? 0),
                    0,
                  );
                  const isOpen = !!expanded[c.codigoContrato];
                  const { status } = getStatus(c.dataFim);
                  const rowClassName = [
                    "cursor-pointer",
                    status === "expirado" &&
                      "bg-destructive/10 hover:bg-destructive/15",
                    status === "expira_breve" &&
                      "bg-amber-500/10 hover:bg-amber-500/15",
                  ]
                    .filter(Boolean)
                    .join(" ");
                  return (
                    <Fragment key={c.codigoContrato}>
                      <TableRow
                        className={rowClassName}
                        onClick={() =>
                          setExpanded((p) => ({
                            ...p,
                            [c.codigoContrato]: !p[c.codigoContrato],
                          }))
                        }
                      >
                        <TableCell>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </TableCell>
                        <TableCell className="font-mono">
                          {c.codigoContrato}
                        </TableCell>
                        {instituicaoId === "all" && (
                          <TableCell className="flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                            {c.instituicao}
                          </TableCell>
                        )}
                        <TableCell>{fmtDate(c.dataInicio)}</TableCell>
                        <TableCell>{fmtDate(c.dataFim)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{c.bolsas.length}</Badge>
                        </TableCell>
                        <TableCell>{fmt(total)}</TableCell>
                        <TableCell>
                          <StatusBadge dataFim={c.dataFim} />
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={c.estado === 1}
                              disabled={toggleEstado.isPending}
                              onCheckedChange={(checked) =>
                                toggleEstado.mutate({
                                  id: c.codigoContrato.toString(),
                                  estado: checked ? "1" : "0",
                                })
                              }
                            />
                            <span className="text-xs text-muted-foreground">
                              {c.estado === 1 ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditModal(c)}
                            title="Editar contrato"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {c.estado === 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                deleteContract.mutate(
                                  c.codigoContrato.toString(),
                                )
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                      {isOpen && (
                        <TableRow className={rowClassName}>
                          <TableCell
                            colSpan={instituicaoId === "all" ? 9 : 8}
                            className={
                              status === "expirado"
                                ? "bg-destructive/5"
                                : status === "expira_breve"
                                  ? "bg-amber-500/5"
                                  : "bg-muted/30"
                            }
                          >
                            <div className="p-2">
                              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                                Crédito Educacional do contrato
                              </p>
                              <div className="rounded-md border bg-background">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Crédito Educacional</TableHead>
                                      <TableHead>Tipo Crédito</TableHead>
                                      <TableHead>Tipo Desconto</TableHead>
                                      <TableHead className="text-right">
                                        Nº Máx. Estudantes
                                      </TableHead>
                                      <TableHead className="text-right">
                                        Valor
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {c.bolsas.map((b) => (
                                      <TableRow key={b.codigoItem}>
                                        <TableCell>{b.designacao}</TableCell>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {b.tipoCredito}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>
                                          <Badge variant="outline">
                                            {b.tipoDesconto}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {b.numeroMaximoEstudante}
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {formatDesconto(
                                            b.valorDesconto,
                                            b.tipoDesconto,
                                          )}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-3 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {total === 0 || isFetching
                  ? isFetching
                    ? "A actualizar..."
                    : "Nenhum resultado"
                  : `A mostrar ${inicioIntervalo}–${fimIntervalo} de ${total}`}
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(v) => setPageSize(Number(v))}
              >
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 / página</SelectItem>
                  <SelectItem value="10">10 / página</SelectItem>
                  <SelectItem value="20">20 / página</SelectItem>
                  <SelectItem value="50">50 / página</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(1)}
                disabled={page <= 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="px-2 text-sm text-muted-foreground whitespace-nowrap">
                Página {page} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))}
                disabled={page >= totalPaginas}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setPage(totalPaginas)}
                disabled={page >= totalPaginas}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <ContratoModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        contrato={contratoEmEdicao}
        defaultInstituicaoId={
          instituicaoId !== "all" ? instituicaoId : undefined
        }
      />
    </div>
  );
}
