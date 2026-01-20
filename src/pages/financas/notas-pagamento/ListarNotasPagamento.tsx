import { useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogHeader,
  DialogTitle,
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryFacturas, useQueryFacturaItens } from "@/hooks/horario/use-query-invoice";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { Separator } from "@/components/ui/separator";
import { FacturaItem } from "@/services/finance/listar-facturas.service";
import { PaymentNoteActions } from "../components/views/uma-payment-invoice";

const estados = [
  { id: undefined, label: "Todos" },
  { id: "0", label: "Pendente" },
  { id: "1", label: "Pago" },
  { id: "2", label: "Parcelado" },
  { id: "3", label: "Anulado" },
];

const searchOptions = [
  { id: "codigoMatricula", label: "Código da Matrícula" },
  { id: "reference", label: "Referência" },
];

export default function ListarNotasPagamento() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedFacturaCodigo, setSelectedFacturaCodigo] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchBy, setSearchBy] = useState<
    "codigoMatricula" | "reference"
  >("codigoMatricula");
  const [filters, setFilters] = useState({
    anoLetivo: "23",
    estado: undefined as string | undefined,
  });

  const limit = 10;

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();



  const { data, isLoading, refetch } = useQueryFacturas({
    anoLectivo: filters.anoLetivo,
    status: filters.estado,
    page,
    limit,

    codigoMatricula:
      searchBy === "codigoMatricula" && searchTerm
        ? searchTerm
        : undefined,

    reference:
      searchBy === "reference" && searchTerm
        ? searchTerm
        : undefined,
  });

  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetching: isFetchingItens,
  } = useQueryFacturaItens(selectedFacturaCodigo ?? undefined);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case 1:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>;
      case 2:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Parcelado</Badge>;
      case 3:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Anulado</Badge>;
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

  const selectedFactura = data?.data.find((f) => f.codigo === selectedFacturaCodigo);

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
        <p className="text-muted-foreground">Listagem de todas as notas de pagamento emitidas.</p>
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
                onChange={(v) =>
                  setFilters({ ...filters, anoLetivo: v })
                }
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
                onChange={(v) =>
                  setFilters({ ...filters, estado: v })
                }
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
                    v as "codigoMatricula" | "reference"
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
                placeholder={
                  searchBy === "codigoMatricula"
                    ? "Pesquisar por código da matrícula..."
                    : "Pesquisar por referência..."
                }
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
                <TableHead>Ref</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma nota de pagamento encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((nota) => (
                  <TableRow key={nota.codigo}>
                    <TableCell className="font-mono font-medium">{nota.referencia}</TableCell>
                    <TableCell>{nota.nome_aluno}</TableCell>
                    <TableCell className="font-mono">{nota.codigo_matricula}</TableCell>
                    <TableCell>{nota.curso}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(nota.total_preco)}</TableCell>
                    <TableCell>{formatDate(nota.data_factura)}</TableCell>
                    <TableCell>{formatDate(nota.data_factura || nota.data_factura)}</TableCell>
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
        <DialogContent className="max-w-5xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Detalhes da Nota de Pagamento
              {selectedFactura && (
                <span className="font-mono text-muted-foreground">
                  {selectedFactura.referencia || selectedFactura.codigo}
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedFactura && (
            <div className="space-y-6">
              {/* Status e Referência + Valor Total */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedFactura.estado)}
                  <span className="text-sm text-muted-foreground">
                    Referência: <span className="font-mono">{selectedFactura.referencia || "—"}</span>
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(selectedFactura.total_preco)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Dados do Estudante */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Dados do Estudante</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Código da Matrícula</p>
                    <p className="font-medium font-mono">{selectedFactura.codigo_matricula || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Nome do Estudante</p>
                    <p className="font-medium">{selectedFactura.nome_aluno || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Curso</p>
                    <p className="font-medium">{selectedFactura.curso || "—"}</p>
                  </div>
                
                  <div>
                    <p className="text-sm text-muted-foreground">Ano Lectivo</p>
                    <p className="font-medium">{selectedFactura.ano_lectivo || "—"}</p>
                  </div>
                 
                
                
                </div>
              </div>

              <Separator />

              {/* Informações da Nota */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Informações da Nota</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Nº da Nota</p>
                    <p className="font-medium font-mono">{selectedFactura.referencia || selectedFactura.codigo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Emissão</p>
                    <p className="font-medium">{formatDate(selectedFactura.data_factura)}</p>
                  </div>
                 
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedFactura.estado)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Itens da Factura */}
              <div>
                <h3 className="font-semibold mb-4 text-lg">Itens da Factura</h3>

                {isLoadingItens || isFetchingItens ? (
                  <div className="text-center py-10 text-muted-foreground">
                    A carregar itens da factura...
                  </div>
                ) : !itens.data?.length ? (
                  <div className="text-center py-8 border rounded-md bg-muted/30 text-muted-foreground">
                    Nenhum item encontrado para esta nota de pagamento
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Descrição</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">Valor Unit.</TableHead>
                        <TableHead className="text-right">Valor Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itens.data.map((item: FacturaItem, index: number) => (
                        <TableRow key={index}>
                        <TableCell>
  {( item.descricaoservico || "—") + 
   (item.mesid && item.mesdescricao ? ` (${item.mesdescricao})` : "")}
</TableCell>
                          <TableCell className="text-center">{item.quantidade ?? 1}</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(item.preco)}
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium">
                            {formatCurrency(item.total )}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-muted/50">
                        <TableCell colSpan={3} className="text-right font-semibold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-mono font-bold text-primary">
                          {formatCurrency(selectedFactura.total_preco)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>

           
              <Separator />

              {/* Ações */}
            <div className="flex gap-3 justify-end">
  <PaymentNoteActions
    nota={selectedFactura}
    itens={itens?.data || []}
    showDownload={true}
    showPrint={true}
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
    </div>
  );
}