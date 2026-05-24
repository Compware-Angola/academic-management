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
import {
  Home,
  Search,
  Loader2,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { parseFilter } from "@/util/parse-filter";
import { useQueryNegociacoes } from "@/hooks/financas/area-financeira/use-query-negociacao-divida";
import { formatNumber } from "@/util/format-number";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { StatCard } from "@/components/common/StatCard";
import { NegociacaoDividaModal } from "./components/NegociacaoDividaModal";
import { NegociacaoItem } from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";
import { Input } from "@/components/ui/input";
import { NegociacaoFacturasModal } from "./components/NegociacaoFacturasModal";

export default function NegociacaoDivida() {
  //Options
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
  ];
  // paginação
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeModal = () => {
    setOpenModal(false);
  };
  const [limit, setLimit] = useState(10);
  const [searchBy, setSearchBy] = useState<"codigoMatricula" | "nome">(
    "codigoMatricula",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNegociacao, setSelectedNegociacao] =
    useState<NegociacaoItem>(null);
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    estado: "",
    faculdade: "",
    negociacao: "",
  });
  const [filtersApplied, setFiltersApplied] = useState(filters);
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  const tipoNegociacao = [
    {
      key: "all",
      label: "Todos",
    },

    {
      key: "1",
      label: "50%",
    },
    {
      key: "2",
      label: "100%",
    },
  ];
  const {
    data: pagamentoResponse,
    refetch,
    isFetching,
  } = useQueryNegociacoes(
    {
      codigoAnoLectivo: parseFilter(filtersApplied.anoLectivo),
      codigoCurso: parseFilter(filtersApplied.curso),
      faculdadeId: parseFilter(filtersApplied.faculdade),
      tipoNegociacaoId: parseFilter(filtersApplied.negociacao),
      codigoMatricula:
        searchBy === "codigoMatricula" ? parseFilter(searchTerm) : null,
      nome: searchBy === "nome" ? searchTerm : null,
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
            `Ano Letivo: ${filtersApplied.anoLectivo}`,
          filtersApplied.faculdade && `Faculdade: ${filtersApplied.faculdade}`,
          filtersApplied.curso && `Curso: ${filtersApplied.curso}`,
          filtersApplied.negociacao &&
            `Negociação: ${
              filtersApplied.negociacao === "1"
                ? "50%"
                : filtersApplied.negociacao === "2"
                  ? "100%"
                  : "Todos"
            }`,
          searchTerm &&
            `${searchBy === "codigoMatricula" ? "Matrícula" : "Aluno"}: ${searchTerm}`,
        ]
          .filter(Boolean)
          .join(" | ") || "Sem filtros",

      total,

      rows: tableData.map((n) => ({
        matricula: n.codigo_matricula,
        aluno: n.nome,
        faculdade: n.faculdade,
        curso: n.curso,
        prestacoes: n.prestacoes,
        valorDivida: formatNumber(n.valor_divida),
        primeiraPrestacao: formatNumber(n.primeiro_valor_pagar),
        valorPrestacao: formatNumber(n.valor_prestacao),
        valorRestante: formatNumber(n.valor_restante),
      })),
    };
  }, [tableData, filtersApplied, searchTerm, searchBy, total]);

  const pdfContent = pdfData ? (
    <GenericPDFDocument
      documentTitle="Negociação de Dívida"
      subtitle="Lista de negociações de dívida dos alunos"
      infoSections={[
        { title: "Filtros Aplicados", content: pdfData.filtros },
        { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
      ]}
      mainTable={{
        headers: [
          { key: "matricula", label: "Matrícula", width: "12%" },
          { key: "aluno", label: "Aluno", width: "20%" },
          { key: "faculdade", label: "Faculdade", width: "15%" },
          { key: "curso", label: "Curso", width: "15%" },
          { key: "prestacoes", label: "Prestações", width: "8%" },
          { key: "valorDivida", label: "Valor Dívida", width: "10%" },
          { key: "primeiraPrestacao", label: "1ª Prestação", width: "10%" },
          { key: "valorPrestacao", label: "Valor Prest.", width: "10%" },
          { key: "valorRestante", label: "Restante", width: "10%" },
        ],
        rows: pdfData.rows,
        headerBackground: "#0D1B48",
      }}
      footerNotice="Documento gerado automaticamente pelo sistema."
    />
  ) : null;

  const excelProps = pdfData
    ? {
        documentTitle: "Negociação de Dívida",
        subtitle: "Lista de negociações de dívida dos alunos",
        infoSections: [
          { title: "Filtros Aplicados", content: pdfData.filtros },
          { title: "Resumo", content: [`Total de registos: ${pdfData.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "matricula", label: "Matrícula", width: 18 },
            { key: "aluno", label: "Aluno", width: 30 },
            { key: "faculdade", label: "Faculdade", width: 25 },
            { key: "curso", label: "Curso", width: 25 },
            { key: "prestacoes", label: "Prestações", width: 15 },
            { key: "valorDivida", label: "Valor Dívida", width: 20 },
            { key: "primeiraPrestacao", label: "1ª Prestação", width: 20 },
            { key: "valorPrestacao", label: "Valor Prestação", width: 20 },
            { key: "valorRestante", label: "Valor Restante", width: 20 },
          ],
          rows: pdfData.rows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
    : null;

  const baseFileName = `Negociacao_Divida_${new Date()
    .toISOString()
    .slice(0, 10)}`;

  const totalPages = Math.ceil(total / limit);
  const stats = pagamentoResponse?.stats;
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
            <BreadcrumbPage>Negociação de Divida</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Negociação de Divida</h1>
      <p className="text-muted-foreground">
        Consultar negociações de divida realizados por alunos.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total de Registros"
          value={formatNumber(total)}
          icon={FileText}
          description="Totla Negociações registadas"
        />
        <StatCard
          title="Total Dividas"
          value={`${formatNumber(stats?.totalDividas)} Kz`}
          icon={TrendingUp}
          description="Valor em dívidas negociadas"
        />
        <StatCard
          title="Total Pago"
          value={`${formatNumber(stats?.totalPrimeiroValorApagar)} Kz`}
          icon={Clock}
          description="Total de negociações pagos"
        />
        <StatCard
          title="Total de Restante"
          value={`${formatNumber(stats?.totalRestante)} Kz`}
          icon={CheckCircle}
          description="Total de negociações Restante"
        />
      </div>

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
            <FacultySelect
              allOption
              value={filters.faculdade}
              onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
            />
            <CourseSelect
              params={{
                faculdadeId: parseFilter(filters.faculdade),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              value={filters.curso}
            />
            <FormSelect
              label="% Negociação"
              value={filters.negociacao}
              onChange={(v) => setFilters({ ...filters, negociacao: v })}
              options={tipoNegociacao}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
            {/* Tipo de Pesquisa */}
            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as "codigoMatricula" | "nome");
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
            <div className="flex items-end">
              <div className="flex-1  min-w-[260px] relative">
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
            </div>

            <div className="flex items-end">
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

          <CardTitle>Lista de Negociação de Divida</CardTitle>
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
                    <TableHead>Nº Matrícula</TableHead>
                    <TableHead>Estudante</TableHead>
                    <TableHead>Faculdade</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Nº Prestações Meses</TableHead>
                    <TableHead>Mês inicial</TableHead>
                    <TableHead>Mês final</TableHead>
                    <TableHead>Valor Divida</TableHead>
                    <TableHead>1ª Prestações a pagar</TableHead>

                    <TableHead>Valor Prestação</TableHead>
                    <TableHead>Valor Restante</TableHead>
                    <TableHead>Facturas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">
                        {item.codigo_matricula}
                      </TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.faculdade}</TableCell>
                      <TableCell>{item.curso}</TableCell>
                      <TableCell>{item.prestacoes}</TableCell>
                      <TableCell>{item.mes_inicial}</TableCell>
                      <TableCell>{item.mes_final}</TableCell>
                      <TableCell>
                        <Badge> {formatNumber(item.valor_divida)} kz</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>
                          {formatNumber(item.primeiro_valor_pagar)} kz
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge> {formatNumber(item.valor_prestacao)} kz</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge> {formatNumber(item.valor_restante)} kz</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setOpenModal(true);
                            setSelectedNegociacao(item);
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
      <NegociacaoFacturasModal
        isOpen={openModal}
        onClose={closeModal}
        selectedNegociacao={selectedNegociacao}
      />
    </div>
  );
}
