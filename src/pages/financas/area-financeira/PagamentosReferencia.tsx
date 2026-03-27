import { useMemo } from "react";

import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

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
import { Home, Search, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryReferenciasPagamento } from "@/hooks/financas/area-financeira/use-query-pagamento-por-referncia";
import { useState } from "react";
import { formatarData } from "@/util/date-formate";
import { Badge } from "@/components/ui/badge";

import { ServiceTypeSelect } from "@/components/common/global-selects/ServiceTypeSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { Label } from "@/components/ui/label";
import { parseDateFilter, parseFilter } from "@/util/parse-filter";
import { PagamentoReferenciaStatus } from "./components/PagamentoReferenciaStastus";
import { PagamentoReferenciaModal } from "./components/PagamentoReferenciaModal";
import { ReferenciasPagamentoItem } from "@/services/financas/area-financeira/fetch-pagamento-por-referencia.service";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";

export default function PagamentosReferencia() {
  // paginação
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeModal = () => {
    setOpenModal(false);
  };
  const [limit, setLimit] = useState(10);
  const [selectedPagamento, setSelectedPagamento] =
    useState<ReferenciasPagamentoItem>(null);
  const [filters, setFilters] = useState({
    anoLectivo: "",
    servico: "",
    estado: "",
    matricula: "",
    referencia: "",
    factura: "",
    dataInicial: "",
    dataFinal: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(filters);

  const pagamentoStatus = [
    {
      key: "all",
      label: "Todos",
    },
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
    isFetching,
  } = useQueryReferenciasPagamento(
    {
      anoLectivo: parseFilter(filtersApplied.anoLectivo),
      codigoFactura: parseFilter(filtersApplied.factura),
      codigoMatricula: parseFilter(filtersApplied.matricula),
      reference: filtersApplied.referencia,
      status:
        filtersApplied.estado == "all" ? undefined : filtersApplied.estado,
      dataInicio: parseDateFilter(filtersApplied.dataInicial),
      dataFinal: parseDateFilter(filtersApplied.dataFinal),
      codigoproduto: parseFilter(filtersApplied.servico),
      page,
      limit,
    },
    {
      enabled: true,
    },
  );
  const tableData = pagamentoResponse?.data || [];
  const total = pagamentoResponse?.total || 0;

  const pdfData = useMemo(() => {
    if (!tableData.length) return null;

    return {
      filtros:
        [
          filtersApplied.anoLectivo &&
            `Ano letivo: ${filtersApplied.anoLectivo}`,
          filtersApplied.servico && `Serviço: ${filtersApplied.servico}`,
          filtersApplied.estado && `Estado: ${filtersApplied.estado}`,
          filtersApplied.matricula && `Matrícula: ${filtersApplied.matricula}`,
          filtersApplied.referencia &&
            `Referência: ${filtersApplied.referencia}`,
          filtersApplied.factura && `Factura: ${filtersApplied.factura}`,
          filtersApplied.dataInicial &&
            `Data inicial: ${filtersApplied.dataInicial}`,
          filtersApplied.dataFinal && `Data final: ${filtersApplied.dataFinal}`,
        ]
          .filter(Boolean)
          .join(" | ") || "Sem filtros",

      total,

      rows: tableData.map((p) => ({
        matricula: p.codigo_matricula,
        aluno: p.nome,
        factura: p.codigo_factura,
        entidade: p.entidade,
        referencia: p.referencia,
        valor: p.preco,
        dataReferencia: formatarData(p.data_inicio),
        dataExpiracao: formatarData(p.data_final),
        dataPagamento: formatarData(p.data_pagamento),
        estado: p.estado,
      })),
    };
  }, [tableData, filtersApplied, total]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Pagamentos por Referência"
      subtitle="Lista de pagamentos realizados por referência bancária"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "matricula", label: "Matrícula", width: "10%" },
          { key: "aluno", label: "Aluno", width: "18%" },
          { key: "factura", label: "Factura", width: "10%" },
          { key: "entidade", label: "Entidade", width: "10%" },
          { key: "referencia", label: "Referência", width: "12%" },
          { key: "valor", label: "Valor", width: "10%" },
          { key: "dataReferencia", label: "Data Ref.", width: "10%" },
          { key: "dataExpiracao", label: "Expiração", width: "10%" },
          { key: "dataPagamento", label: "Pagamento", width: "10%" },
          { key: "estado", label: "Estado", width: "10%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Pagamentos por Referência",
        subtitle: "Lista de pagamentos realizados por referência bancária",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros },
          { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "matricula", label: "Matrícula", width: 18 },
            { key: "aluno", label: "Aluno", width: 30 },
            { key: "factura", label: "Factura", width: 20 },
            { key: "entidade", label: "Entidade", width: 20 },
            { key: "referencia", label: "Referência", width: 22 },
            { key: "valor", label: "Valor", width: 18 },
            { key: "dataReferencia", label: "Data Referência", width: 22 },
            { key: "dataExpiracao", label: "Data Expiração", width: 22 },
            { key: "dataPagamento", label: "Data Pagamento", width: 22 },
            { key: "estado", label: "Estado", width: 15 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Pagamentos_Referencia_${new Date()
    .toISOString()
    .slice(0, 10)}`;

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
              allOption
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
            <div>
              <Label>Data Inicial</Label>
              <div className="relative">
                <Input
                  type="date"
                  placeholder="Data Inicial"
                  onChange={({ target }) =>
                    setFilters({
                      ...filters,
                      dataInicial: target.value,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Data Final</Label>
              <div className="relative">
                <Input
                  type="date"
                  placeholder="Data Final"
                  onChange={({ target }) =>
                    setFilters({
                      ...filters,
                      dataFinal: target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex items-end ">
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
        <CardHeader className="space-y-2">
          {/* Exportações */}
          {pdfData && excelProps && (
            <div className="flex justify-end gap-2">
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
