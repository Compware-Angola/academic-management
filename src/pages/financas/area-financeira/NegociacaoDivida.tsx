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
import { PagamentoReferenciaModal } from "./components/PagamentoReferenciaModal";
import { ReferenciasPagamentoItem } from "@/services/financas/area-financeira/fetch-pagamento-por-referencia.service";
import { useQueryNegociacoes } from "@/hooks/financas/area-financeira/use-query-negociacao-divida";
import { formatNumber } from "@/util/format-number";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { StatCard } from "@/components/common/StatCard";
import { NegociacaoDividaModal } from "./components/NegociacaoDividaModal";
import { NegociacaoItem } from "@/services/financas/area-financeira/fetch-negociacao-dividas.service";

export default function NegociacaoDivida() {
  // paginação
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeModal = () => {
    setOpenModal(false);
  };
  const [limit, setLimit] = useState(25);
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
  // Estatísticas mockadas
  const estatisticas = {
    totalNegociacoes: 156,
    valorTotalNegociado: "12.450.000",
    negociacoesAtivas: 89,
    taxaRecuperacao: 78.5,
  };

  const tipoNegociacao = [
    {
      key: "all",
      label: "Todos",
    },
    {
      key: "2",
      label: "100%",
    },
    {
      key: "1",
      label: "50%",
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
      page,
      limit,
    },
    {
      enabled: false,
    },
  );
  const tableData = pagamentoResponse?.data || [];
  const total = pagamentoResponse?.total || 0;
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
        <CardHeader>
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
                    <TableHead>Nº Prestações</TableHead>
                    <TableHead>Mês inicial</TableHead>
                    <TableHead>Mês final</TableHead>
                    <TableHead>Valor Divida</TableHead>
                    <TableHead>1ª Prestações a pagar</TableHead>
                    <TableHead>Valor da Prestações</TableHead>
                    <TableHead>Valor Restante</TableHead>
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
                        <Badge>{formatNumber(item.valor_prestacao)} kz</Badge>
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
      <NegociacaoDividaModal
        isModalOpen={openModal}
        setIsModalOpen={() => closeModal()}
        selectedNegociacao={selectedNegociacao}
      />
    </div>
  );
}
