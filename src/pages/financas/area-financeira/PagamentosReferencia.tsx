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
import { Home, Search, Download, RefreshCw, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryReferenciasPagamento } from "@/hooks/financas/area-financeira/use-query-pagamento-por-referncia";
import { useState } from "react";
import { formatarData } from "@/util/date-formate";
import { Badge } from "@/components/ui/badge";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { ServiceTypeSelect } from "@/components/common/global-selects/ServiceTypeSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { Label } from "@/components/ui/label";
import { parseFilter } from "@/util/parse-filter";
import { PagamentoReferenciaStatus } from "./components/PagamentoReferenciaStastus";
import { PagamentoReferenciaModal } from "./components/PagamentoReferenciaModal";
import { ReferenciasPagamentoItem } from "@/services/financas/area-financeira/fetch-pagamento-por-referencia.service";

export default function PagamentosReferencia() {
  // paginação
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeModal = () => {
    setOpenModal(false);
  };
  const [limit, setLimit] = useState(25);
  const [selectedPagamento, setSelectedPagamento] =
    useState<ReferenciasPagamentoItem>(null);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    servico: "",
    estado: "",
    matricula: "",
    referencia: "",
    factura: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(filters);

  const pagamentoStatus = [
    {
      key: "Pending",
      label: "Pendente",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    {
      key: "Success",
      label: "Sucesso",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    {
      key: "Failed",
      label: "Falhado",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
    {
      key: "Expired",
      label: "Expirado",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  ];

  const {
    data: pagamentoResponse,
    refetch,
    isRefetching,
    isFetching,
  } = useQueryReferenciasPagamento(
    {
      anoLectivo: parseFilter(filtersApplied.anoLectivo),
      codigoFactura: parseFilter(filtersApplied.factura),
      codigoMatricula: parseFilter(filtersApplied.matricula),
      reference: filtersApplied.referencia,
      status: filtersApplied.estado,
      codigoproduto: parseFilter(filtersApplied.servico),
      page,
      limit,
    },
    {
      enabled: true,
    }
  );
  const tableData = pagamentoResponse?.data || [];
  const total = pagamentoResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);
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
            <BreadcrumbLink>Área Financeira</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pagamentos por Referência</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Pagamentos por Referência</h1>
      <p className="text-muted-foreground">
        Consultar pagamentos realizados por referência bancária.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <ServiceTypeSelect
              onChangeValue={(v) => setFilters({ ...filters, servico: v })}
              anoLectivo={filters.anoLectivo}
              value={filters.servico}
            />
            <FormSelect
              label="Estados do Pagamento"
              value={filters.estado}
              onChange={(v) => setFilters({ ...filters, estado: v })}
              options={pagamentoStatus}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
            <div>
              <Label>Matrícula</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Matrícula"
                  onChange={({ target }) =>
                    setFilters({ ...filters, matricula: target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Referência</Label>
              <div className="relative">
                <Input
                  placeholder="Referência"
                  onChange={({ target }) =>
                    setFilters({ ...filters, referencia: target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Factura</Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Factura"
                  onChange={({ target }) =>
                    setFilters({ ...filters, factura: target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center ">
              <Button
                onClick={() => {
                  setFiltersApplied(filters);
                  refetch();
                }}
              >
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Pagamento...</p>
            </div>
          ) : tableData.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Pagamento encontrada.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Entidade</TableHead>
                    <TableHead>Referência</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data da Referência</TableHead>
                    <TableHead>Data de Expiração</TableHead>
                    <TableHead>Data de Pagamento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">
                        {item.codigo_matricula}
                      </TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.codigo_factura}</TableCell>
                      <TableCell>{item.entidade}</TableCell>
                      <TableCell>{item.referencia}</TableCell>
                      <TableCell>
                        <Badge> {item.preco}</Badge>
                      </TableCell>
                      <TableCell>{formatarData(item.data_inicio)}</TableCell>
                      <TableCell>{formatarData(item.data_final)}</TableCell>
                      <TableCell>{formatarData(item.data_pagamento)}</TableCell>
                      <TableCell>
                        <PagamentoReferenciaStatus status={item.estado} />
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedPagamento(item);
                            setOpenModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}

          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              A mostrar {tableData.length} de {total} registos
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
        </CardContent>
      </Card>
      <PagamentoReferenciaModal
        isModalOpen={openModal}
        setIsModalOpen={() => closeModal()}
        selectedPagamento={selectedPagamento}
      />
    </div>
  );
}
