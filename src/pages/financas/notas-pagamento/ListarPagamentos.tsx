import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  Eye,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryListPayments } from "@/hooks/financas/area-financeira/use-query-pagamentos";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { formatNumber } from "@/util/format-number";
import { formatarData } from "@/util/date-formate";
import { FormSelect } from "@/components/common/FormSelect";
import { Label } from "@/components/ui/label";
import { parseFilter } from "@/util/parse-filter";
import { ListaPagamentoModal } from "./components/ListaPagamentoModal";
import { useQueryServicosPagosAluno } from "@/hooks/financas/pagamentos-mensais/use-query-servicos-pagos-aluno";
import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";

const getStatusPagamentoBadge = (status: string) => {
  switch (status) {
    case "concluido":
      return (
        <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
      );
    case "pendente":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>
      );

    default:
      return <Badge>{status}</Badge>;
  }
};
type SearchByType =
  | "codigoMatricula"
  | "nome"
  | "n_operacao_bancaria"
  | "n_operacao_bancaria2";

const searchOptions = [
  { id: "codigoMatricula", label: "Código da Matrícula" },
  { id: "n_operacao_bancaria", label: "Número de Operacão bancária" },
  { id: "n_operacao_bancaria2", label: "Número de Operacão bancária 2" },
  { id: "nome", label: "Nome do Aluno" },
];

export default function ListarPagamentos() {

const [tipoServicoPago, setTipoServicoPago] = useState<
  "TODOS" | "MENSALIDADES" | "SERVICOS"
>("TODOS");

const [mostrarServicosPagos, setMostrarServicosPagos] = useState(false);
const [servicosParams, setServicosParams] = useState({
  anoLectivo: 0,
  codigoMatricula: 0,
  tipo: "TODOS" as "TODOS" | "MENSALIDADES" | "SERVICOS",
});

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [facturaSelecionado, setFacturaSelecionado] = useState<number>(0);
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    estado: "",
    factura: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(filters);

  const [searchBy, setSearchBy] = useState<SearchByType>("codigoMatricula");
  const [searchByApplied, setSearchByApplied] =
    useState<SearchByType>("codigoMatricula");
  const [searchApplied, setSearchApplied] = useState("codigoMatricula");

  const [searchTerm, setSearchTerm] = useState("");

  const searchFieldMap: Record<SearchByType, string> = {
    codigoMatricula: "codigoMatricula",
    nome: "nome",
    n_operacao_bancaria: "n_operacao_bancaria",
    n_operacao_bancaria2: "n_operacao_bancaria2",
  };
  const searchParams = searchApplied
    ? {
        [searchFieldMap[searchByApplied]]:
          searchByApplied === "codigoMatricula"
            ? parseFilter(searchApplied)
            : searchApplied,
      }
    : {};
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
    n_operacao_bancaria: "Pesquisar por número de operação bancária ",
    n_operacao_bancaria2: "Pesquisar por segundo número de operação bancária ",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const {
    data: paymentResponse,
    isLoading: loadingPayments,
    refetch,
  } = useQueryListPayments({
    anoLectivo: parseFilter(filtersApplied.anoLectivo),
    codigoFactura: parseFilter(filtersApplied.factura),
    estado: parseFilter(filtersApplied.estado),
    ...searchParams,
    page,
    limit,
  });

  
const {
  data: servicosPagosAluno = [],
  isLoading: loadingServicosPagos,
} = useQueryServicosPagosAluno(servicosParams, {
  enabled:
    mostrarServicosPagos &&
    !!servicosParams.anoLectivo &&
    !!servicosParams.codigoMatricula,
});

  const tipoEstados = [
    {
      key: "all",
      label: "Todos",
    },

    {
      key: "2",
      label: "Pendente",
    },
    {
      key: "1",
      label: "Concluido",
    },
  ];
  const payments = paymentResponse?.data || [];
  const total = paymentResponse?.total;
  const totalPages = paymentResponse?.totalPages;

  const pdfData = useMemo(() => {
    if (!payments.length) return null;

    const searchLabel =
      searchOptions.find((option) => option.id === searchByApplied)?.label ??
      searchByApplied;

    return {
      filtros:
        [
          filtersApplied.anoLectivo &&
            `Ano letivo: ${filtersApplied.anoLectivo}`,
          filtersApplied.factura && `Factura: ${filtersApplied.factura}`,
          filtersApplied.estado &&
            `Estado: ${
              filtersApplied.estado === "all"
                ? "Todos"
                : filtersApplied.estado === "1"
                  ? "Concluido"
                  : "Pendente"
            }`,
          searchApplied && `${searchLabel}: ${searchApplied}`,
        ]
          .filter(Boolean)
          .join(" | ") || "Sem filtros",
      total: total ?? payments.length,
      rows: payments.map((pag) => ({
        codigo: pag?.codigo_pagamento,
        factura: pag?.codigo_factura,
        curso: pag?.curso,
        matricula: pag?.codigo_matricula,
        estudante: pag?.nome_completo,
        operacao: pag?.operacao_bancaria || "-",
        segundaOperacao: pag?.seg_operacao_bancaria || "-",
        formaPagamento: pag?.forma_pagamento || "-",
        caixa: pag?.caixa || "-",
        canal: pag?.canal || "-",
        valorTotal: formatNumber(pag?.totalgeral ?? 0),
        valorDepositado: formatNumber(pag?.valor_depositado ?? 0),
        dataBanco: formatarData(pag?.databanco),
        dataRegistro: formatarData(pag?.data_registro),
        estado: pag?.status_pagamento,
        tipoPagamento: pag?.tipo_pagamento,
      })),
    };
  }, [
    filtersApplied,
    payments,
    searchApplied,
    searchByApplied,
    searchOptions,
    total,
  ]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Listagem de Pagamentos"
      subtitle="Pagamentos registados no sistema"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "codigo", label: "Código", width: "6%" },
          { key: "factura", label: "Factura", width: "7%" },
          { key: "matricula", label: "Matrícula", width: "8%" },
          { key: "estudante", label: "Estudante", width: "16%" },
          { key: "operacao", label: "Operação", width: "10%" },
          { key: "formaPagamento", label: "Forma", width: "9%" },
          { key: "caixa", label: "Caixa", width: "7%" },
          { key: "valorTotal", label: "Total", width: "8%" },
          { key: "valorDepositado", label: "Depositado", width: "8%" },
          { key: "dataBanco", label: "Data Banco", width: "8%" },
          { key: "estado", label: "Estado", width: "7%" },
          { key: "tipoPagamento", label: "Tipo", width: "6%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Listagem de Pagamentos",
        subtitle: "Pagamentos registados no sistema",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros },
          { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "codigo", label: "Código", width: 12 },
            { key: "factura", label: "Factura", width: 12 },
            { key: "curso", label: "Curso", width: 28 },
            { key: "matricula", label: "Código Matrícula", width: 18 },
            { key: "estudante", label: "Estudante", width: 35 },
            { key: "operacao", label: "Nº Operação Bancária", width: 26 },
            { key: "segundaOperacao", label: "Nº 2ª Operação Bancária", width: 28 },
            { key: "formaPagamento", label: "Forma de Pagamento", width: 24 },
            { key: "caixa", label: "Caixa", width: 15 },
            { key: "canal", label: "Canal", width: 15 },
            { key: "valorTotal", label: "Valor Total", width: 18 },
            { key: "valorDepositado", label: "Valor Depositado", width: 20 },
            { key: "dataBanco", label: "Data Banco", width: 22 },
            { key: "dataRegistro", label: "Data Registro", width: 22 },
            { key: "estado", label: "Status Pgto.", width: 18 },
            { key: "tipoPagamento", label: "Tipo de Pagamento", width: 22 },
          ],
          rows: pdfData.rows,
          headerBackground: "#0D1B48",
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Listagem_Pagamentos_${new Date()
    .toISOString()
    .slice(0, 10)}`;

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
            <BreadcrumbPage>Listagem de Pagamentos</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">Listagem de Pagamentos</h1>
        <p className="text-muted-foreground">
          Todos os pagamentos registados no sistema com detalhes de caixa, forma
          de pagamento e estado.
        </p>
      </div>

      <Tabs defaultValue="pagamentos" className="space-y-6">
  <TabsList>
    <TabsTrigger value="pagamentos">Pagamentos</TabsTrigger>
    <TabsTrigger value="servicos">Serviços pagos do aluno</TabsTrigger>
  </TabsList>

  <TabsContent value="pagamentos" className="space-y-6">


      {/* Filtros */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex w-full gap-4 items-center">
            {/* Select Fixo */}
            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as "codigoMatricula" | "nome");
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

            {/* Input que ocupa todo o resto */}

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 w-full" // espaço para o ícone
                placeholder={placeholderText}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Filtros em grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
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
            <FormSelect
              label="Estado Pagamento"
              value={filters.estado}
              onChange={(v) => setFilters({ ...filters, estado: v })}
              options={tipoEstados}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setFiltersApplied(filters);
                  setSearchApplied(searchTerm);
                  setSearchByApplied(searchBy);
                  refetch(); 
                }}
              >
                <Search className="h-4 w-4" size="sm" />
                Pesquisar
              </Button>
            </div>
            
          </div>

        </CardContent>
      </Card>

      {/* Actions */}
      {pdfContent && excelProps && (
        <div className="flex flex-wrap gap-2">
          <PDFActions
            document={pdfContent}
            fileName={`${baseFileName}.pdf`}
            showDownload
            showPrint
          />
          <ExcelActions
            excelProps={excelProps}
            fileName={`${baseFileName}.xlsx`}
            showDownload
          />
        </div>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Código Matricula</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Nº da Operação bancaria</TableHead>
                <TableHead>Nº da 2º Operação bancaria</TableHead>
                <TableHead>Forma de Pagamento</TableHead>
                <TableHead>Caixa</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Valor Depositado</TableHead>
                <TableHead>Data Banco</TableHead>
                <TableHead>Data Registro</TableHead>
                <TableHead>Status Pgto.</TableHead>
                <TableHead>Tipo de Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingPayments ? (
                <TableRow>
                  <TableCell
                    colSpan={17}
                    className="text-center py-8 text-muted-foreground"
                  >
                    <div className="flex justify-center items-center">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={17}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum pagamento encontrado com os filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((pag) => (
                  <TableRow key={pag?.codigo_pagamento}>
                    <TableCell>{pag?.codigo_pagamento}</TableCell>
                    <TableCell>{pag?.codigo_factura}</TableCell>
                    <TableCell>{pag?.curso}</TableCell>
                    <TableCell>{pag?.codigo_matricula}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">
                          {pag?.nome_completo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium text-sm">
                      {pag?.operacao_bancaria}
                    </TableCell>
                    <TableCell className="font-mono font-medium text-sm">
                      {pag?.seg_operacao_bancaria}
                    </TableCell>
                    <TableCell className="text-sm">
                      {pag?.forma_pagamento}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {pag?.caixa}
                    </TableCell>
                    <TableCell className="text-sm">{pag?.canal}</TableCell>
                    <TableCell className="text-sm">
                      {formatNumber(pag?.totalgeral)}
                    </TableCell>

                    <TableCell className="font-medium font-mono text-sm">
                      {formatNumber(pag?.valor_depositado)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatarData(pag?.databanco)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatarData(pag?.data_registro)}
                    </TableCell>

                    <TableCell>
                      {getStatusPagamentoBadge(pag?.status_pagamento)}
                    </TableCell>
                    <TableCell>{pag?.tipo_pagamento}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        title="Ver Detalhes"
                        onClick={() => {
                          setFacturaSelecionado(pag?.codigo_factura);
                          setIsModalOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {/* Paginação */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              A mostrar {payments.length} de {total} registos
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
    
    </TabsContent>


    <TabsContent value="servicos" className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Consulta de serviços pagos do aluno</CardTitle>
    </CardHeader>

    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AcademicYearSelect
          value={String(servicosParams.anoLectivo || filters.anoLectivo)}
          onChangeValue={(v) =>
            setServicosParams((prev) => ({
              ...prev,
              anoLectivo: parseFilter(v),
            }))
          }
        />

        <div>
          <Label>Código da Matrícula</Label>
          <Input
            type="number"
            placeholder="Código da matrícula"
            value={servicosParams.codigoMatricula || ""}
            onChange={(e) =>
              setServicosParams((prev) => ({
                ...prev,
                codigoMatricula: parseFilter(e.target.value),
              }))
            }
          />
        </div>

        <div>
          <Label>Tipo</Label>
          <Select
            value={tipoServicoPago}
            onValueChange={(value) => {
              const tipo = value as "TODOS" | "MENSALIDADES" | "SERVICOS";

              setTipoServicoPago(tipo);
              setServicosParams((prev) => ({
                ...prev,
                tipo,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="MENSALIDADES">Mensalidades</SelectItem>
              <SelectItem value="SERVICOS">Serviços</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={() => {
          setMostrarServicosPagos(true);
        }}
      >
        <Search className="h-4 w-4 mr-2" />
        Consultar Serviços
      </Button>
    </CardContent>
  </Card>

  {mostrarServicosPagos && (
    <Card>
      <CardHeader>
        <CardTitle>Serviços pagos do aluno</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Serviço</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data pag. Banco</TableHead>
              <TableHead>Data de validação</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingServicosPagos ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="animate-spin text-primary mx-auto" />
                </TableCell>
              </TableRow>
            ) : servicosPagosAluno.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum serviço pago encontrado
                </TableCell>
              </TableRow>
            ) : (
              servicosPagosAluno.map((item) => (
                <TableRow key={item.codigo}>
                  <TableCell>{item.codigo}</TableCell>
                  <TableCell>{item.servico}</TableCell>
                  <TableCell>{formatNumber(item.valor)}</TableCell>
                  <TableCell>
                    {formatarData(item.data_pagamento_banco)}
                  </TableCell>
                  <TableCell>{formatarData(item.data_validacao)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )}
</TabsContent>
</Tabs>

    

      {/* Modal de Detalhes */}
      <ListaPagamentoModal
        factureId={facturaSelecionado}
        isModalOpen={isModalOpen}
        setIsModalOpen={closeModal}
      />
    </div>
  );
}
