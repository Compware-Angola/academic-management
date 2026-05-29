import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  Eye,
  Printer,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FileDown,
  Trash2,
  CircleX,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useQueryFacturas,
  useQueryFacturaItens,
  useReactivateInvoice,
  useAnnulInvoice,
} from "@/hooks/horario/use-query-invoice";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { Separator } from "@/components/ui/separator";
import { FacturaItem } from "@/services/finance/listar-facturas.service";
import { PaymentNoteActions } from "../components/views/uma-payment-invoice";
import { PermissionTypeDetails } from "@/constants/permission.type";

import { usePermission } from "@/auth/permission.helper";
import { Textarea } from "@/components/ui/textarea";

const estados = [
  { id: undefined, label: "Todos" },
  { id: "0", label: "Pendente" },
  { id: "1", label: "Pago" },
  { id: "2", label: "Parcelado" },
  { id: "3", label: "Anulado" },
];

const searchOptions = [
  { id: "codigoMatricula", label: "Código da Matrícula" },
  { id: "reference", label: "Referência da Factura" },
  { id: "codigoFatura", label: "Codigo da Factura" },
];
function truncate(text: string, max = 10) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

export default function ListarNotasPagamento() {
  const [motivo, setMotivo] = useState("");
  const { hasPermission } = usePermission();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFacturaCodigo, setSelectedFacturaCodigo] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [acaoTipo, setAcaoTipo] = useState<"anular" | "reactivar" | null>(null);
  const [facturaSelecionada, setFacturaSelecionada] = useState<any>(null);
  function handleOpenServices(services: string) {
    setSelectedServices(services);
    setOpenServicesModal(true);
  }

  const [searchBy, setSearchBy] = useState<
    "codigoMatricula" | "reference" | "codigoFatura"
  >("codigoMatricula");
  const [filters, setFilters] = useState({
    anoLetivo: "23",
    estado: undefined as string | undefined,
  });

  const limit = 10;

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const { mutate: annulInvoice } = useAnnulInvoice();
  const { mutate: reactivateInvoice } = useReactivateInvoice();
  const abrirConfirmacao = (tipo: "anular" | "reactivar", factura: any) => {
    setAcaoTipo(tipo);
    setFacturaSelecionada(factura);
    setIsConfirmModalOpen(true);
  };
  const confirmarAcao = (motivo: string) => {
    if (!facturaSelecionada) return;

    if (acaoTipo === "anular") {
      annulInvoice({ facturaId: Number(facturaSelecionada.codigo), motivo });
    }

    if (acaoTipo === "reactivar") {
      reactivateInvoice(facturaSelecionada.codigo);
    }

    setIsConfirmModalOpen(false);
    setMotivo("");
  };
  const { data, isLoading, refetch } = useQueryFacturas({
    anoLectivo: filters.anoLetivo,
    status: filters.estado,
    page,
    limit,

    codigoMatricula:
      searchBy === "codigoMatricula" && searchTerm ? searchTerm : undefined,

    reference: searchBy === "reference" && searchTerm ? searchTerm : undefined,
    codigoFatura:
      searchBy === "codigoFatura" && searchTerm ? searchTerm : undefined,
  });

  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetching: isFetchingItens,
  } = useQueryFacturaItens(selectedFacturaCodigo ?? undefined);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        );
      case 1:
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Pago
          </Badge>
        );
      case 2:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Parcelado
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Anulado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "—";
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-AO");
  };

  const handleViewDetails = (codigo: number) => {
    setSelectedFacturaCodigo(codigo);
    setIsModalOpen(true);
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const selectedFactura = data?.data.find(
    (f) => f.codigo === selectedFacturaCodigo,
  );
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    reference: "Pesquisar por referência da factura...",
    codigoFatura: "Pesquisar por Codigo da factura...",
  };

  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
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
            <BreadcrumbPage>Notas de Pagamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold">Notas de Pagamento</h1>
        <p className="text-muted-foreground">
          Listagem de todas as notas de pagamento emitidas.
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Ano Lectivo */}
            <div className="min-w-[200px]">
              <FormSelect
                label="Ano Letivo"
                disabled={isLoadingAcademicYear}
                loading={isLoadingAcademicYear}
                value={filters.anoLetivo}
                onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
                options={anosAcademicos}
                map={(a) => ({
                  key: a.codigo,
                  label: a.designacao,
                  value: a.codigo,
                })}
              />
            </div>

            {/* Estado */}
            <div className="min-w-[180px]">
              <FormSelect
                label="Estado"
                value={filters.estado}
                onChange={(v) => setFilters({ ...filters, estado: v })}
                options={estados}
                map={(e) => ({
                  key: e.id,
                  label: e.label,
                  value: e.id,
                })}
              />
            </div>

            {/* Tipo de Pesquisa */}
            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(
                    v as "codigoMatricula" | "reference" | "codigoFatura",
                  );
                  setSearchTerm("");
                  setPage(1);
                }}
                options={searchOptions}
                map={(o) => ({
                  key: o.id,
                  label: o.label,
                  value: o.id,
                })}
              />
            </div>

            {/* Input Pesquisa */}
            <div className="flex-1 min-w-[260px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder={placeholderText}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Button
              variant="outline"
              onClick={() => refetch()}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela principal */}
      <Card>
        <CardHeader>
          <CardTitle>Notas de Pagamento ({data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Codigo</TableHead>
                <TableHead>Ref</TableHead>
                <TableHead>Serviços</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Emissão</TableHead>

                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhuma nota de pagamento encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((nota) => (
                  <TableRow key={nota.codigo}>
                    <TableCell className="font-mono font-medium">
                      {nota.codigo}
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {nota.referencia}
                    </TableCell>
                    <TableCell className="font-mono">
                      {nota.servicos ? (
                        nota.servicos.length > 10 ? (
                          <span className="flex items-center gap-1">
                            {truncate(nota.servicos, 10)}
                            <button
                              className="text-blue-500 underline text-xs"
                              onClick={() => handleOpenServices(nota.servicos)}
                            >
                              ver mais
                            </button>
                          </span>
                        ) : (
                          nota.servicos
                        )
                      ) : (
                        "N/A"
                      )}
                    </TableCell>

                    <TableCell>{nota.nome_aluno}</TableCell>
                    <TableCell className="font-mono">
                      {nota.codigo_matricula || "N/A"}
                    </TableCell>
                    <TableCell>{nota.curso || "N/A"}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(nota.valor_pagar)}
                    </TableCell>
                    <TableCell>{formatDate(nota.data_factura)}</TableCell>

                    <TableCell>{getStatusBadge(nota.estado)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          title="Visualizar"
                          onClick={() => handleViewDetails(nota.codigo)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>

                        {nota.estado === 0 &&
                          hasPermission(
                            PermissionTypeDetails.DELETAR_FACTURA.sigla,
                          ) && (
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-red-600 hover:bg-red-50"
                              onClick={() => abrirConfirmacao("anular", nota)}
                            >
                              <CircleX className="h-4 w-4" />
                            </Button>
                          )}
                        {/* Botão de info de anulação — aparece quando motivo/data são null */}
                        {nota.motivo_anulacao != null &&
                          nota.data_anulacao != null &&
                          nota.estado != 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-amber-600 hover:bg-amber-50 border-amber-300"
                                  title="Informações de anulação"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>

                              <DialogContent className="max-w-sm">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Info className="h-4 w-4 text-amber-600" />
                                    Informações de Anulação
                                  </DialogTitle>
                                </DialogHeader>

                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Anulado Por
                                    </p>

                                    <p className="text-sm bg-muted/50 rounded-md px-3 py-2">
                                      {nota.utilizador_anulacao ||
                                        "Não informado"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Data de Anulação
                                    </p>

                                    <p className="text-sm bg-muted/50 rounded-md px-3 py-2">
                                      {nota.data_anulacao
                                        ? formatDate(nota.data_anulacao)
                                        : "Não informada"}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                      Motivo de Anulação
                                    </p>

                                    <p className="text-sm bg-muted/50 rounded-md px-3 py-2">
                                      {nota.motivo_anulacao ?? "Não informado"}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-end items-center gap-3 mt-6">
              <Button
                size="sm"
                variant="outline"
                onClick={handlePrevPage}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Página <strong>{page}</strong> de {data.totalPages}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleNextPage}
                disabled={page === data.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ================================================ */}
      {/*               MODAL DE DETALHES                */}
      {/* ================================================ */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl! max-h-[90vh]! overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md">
          <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="flex items-center justify-between gap-4 text-2xl font-bold">
              <div className="flex items-center gap-3">
                Detalhes da Nota de Pagamento
                {selectedFactura && (
                  <span className="inline-flex px-3 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium">
                    {selectedFactura.referencia ||
                      selectedFactura.codigo ||
                      "—"}
                  </span>
                )}
              </div>
              {selectedFactura && getStatusBadge(selectedFactura.estado)}
            </DialogTitle>
          </DialogHeader>

          {selectedFactura && (
            <div className="space-y-8 pt-6">
              {/* Valor total destacado, mas sem gradiente */}
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Valor Total
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {formatCurrency(selectedFactura.total_preco)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Valor a Pagar
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedFactura.valor_pagar)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Emitida em
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatDate(selectedFactura.data_factura)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dados do Estudante */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Dados do Estudante
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Código da Matrícula
                    </p>
                    <p className="font-medium font-mono">
                      {selectedFactura.codigo_matricula || "—"}
                    </p>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <p className="text-sm text-muted-foreground">
                      Nome do Estudante
                    </p>
                    <p className="font-semibold text-lg">
                      {selectedFactura.nome_aluno || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Curso</p>
                    <p className="font-medium">
                      {selectedFactura.curso || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ano Lectivo</p>
                    <p className="font-medium">
                      {selectedFactura.ano_lectivo || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informações da Nota */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Informações da Nota
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Nº da Nota</p>
                    <p className="font-medium font-mono">
                      {selectedFactura.referencia ||
                        selectedFactura.codigo ||
                        "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data de Emissão
                    </p>
                    <p className="font-medium">
                      {formatDate(selectedFactura.data_factura)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Multa</p>
                    <p className="font-medium text-orange-600 dark:text-orange-400">
                      {formatCurrency(selectedFactura.total_multa || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    {getStatusBadge(selectedFactura.estado)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Itens da Factura */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Itens da Nota de Pagamento
                </h3>

                {isLoadingItens || isFetchingItens ? (
                  <div className="py-10 text-center text-muted-foreground bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    A carregar itens da factura...
                  </div>
                ) : !itens.data?.length ? (
                  <div className="py-10 text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30 text-muted-foreground">
                    Nenhum item encontrado para esta nota de pagamento
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-100 dark:bg-gray-800">
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-center">Qtd</TableHead>
                          <TableHead className="text-center">Multa</TableHead>
                          <TableHead className="text-right">
                            Valor Unit.
                          </TableHead>
                          <TableHead className="text-right pr-6">
                            Valor Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itens.data.map((item: FacturaItem, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell>
                              {(item.descricaoservico || "—") +
                                (Number(item.mesid) !== 3 &&
                                item.mesid &&
                                item.mesdescricao
                                  ? ` (${item.mesdescricao})`
                                  : "")}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantidade ?? 1}
                            </TableCell>
                            <TableCell className="text-center text-orange-600 dark:text-orange-400">
                              {item.multa ? formatCurrency(item.multa) : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(item.preco)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold pr-6">
                              {formatCurrency(item.total)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
                          <TableCell colSpan={4} className="text-right">
                            Total Unitário
                          </TableCell>
                          <TableCell className="text-right text-primary pr-6">
                            {formatCurrency(
                              itens.data.reduce((total, item) => {
                                const quantidade = item.quantidade ?? 1;
                                return total + item.preco * quantidade;
                              }, 0),
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
                          <TableCell colSpan={4} className="text-right">
                            Total Preço
                          </TableCell>
                          <TableCell className="text-right text-primary pr-6">
                            {formatCurrency(
                              itens.data.reduce((total, item) => {
                                const quantidade = item.quantidade ?? 1;
                                return total + item.total * quantidade;
                              }, 0),
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <Separator />

              {/* Ações */}
              <div className="flex justify-end pt-2">
                <PaymentNoteActions
                  nota={selectedFactura}
                  itens={itens?.data || []}
                  showDownload={true}
                  showPrint={true}
                  showliquidarNota={hasPermission(
                    PermissionTypeDetails.LIQUIDAR_NOTA_PAGAMENTO.sigla,
                  )}
                />
              </div>
            </div>
          )}

          {!selectedFactura && !isLoadingItens && (
            <div className="py-12 text-center text-muted-foreground">
              Não foi possível carregar os detalhes desta nota de pagamento.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={openServicesModal} onOpenChange={setOpenServicesModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Serviços da Nota</DialogTitle>
          </DialogHeader>

          <div className="text-sm whitespace-pre-wrap">{selectedServices}</div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => setOpenServicesModal(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {acaoTipo === "anular" ? "Anular Factura" : "Reactivar Factura"}
            </DialogTitle>

            <DialogDescription>
              Tem certeza que deseja{" "}
              <strong>{acaoTipo === "anular" ? "anular" : "reactivar"}</strong>{" "}
              esta factura?
              <br />
              {facturaSelecionada && (
                <>
                  <strong>Nº Factura:</strong> {facturaSelecionada.codigo}
                  <br />
                  <strong>Aluno:</strong> {facturaSelecionada.nome_aluno}
                  <br />
                  <strong>Valor:</strong> {facturaSelecionada.valor_pagar} Kz
                </>
              )}
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          {/* Campo motivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Motivo{" "}
              {acaoTipo === "anular" && <span className="text-red-500">*</span>}
            </label>

            <Textarea
              placeholder={`Digite o motivo da ${
                acaoTipo === "anular" ? "anulação" : "reactivação"
              }`}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />

            {acaoTipo === "anular" && !motivo.trim() && (
              <p className="text-xs text-red-500">
                O motivo é obrigatório para anular a factura.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmModalOpen(false);
                setMotivo("");
              }}
            >
              Cancelar
            </Button>

            <Button
              variant={acaoTipo === "anular" ? "destructive" : "default"}
              disabled={acaoTipo === "anular" && !motivo.trim()}
              onClick={() => confirmarAcao(motivo)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
