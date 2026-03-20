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
  RefreshCw,
  FileDown,
  Printer,
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

export default function ListarPagamentos() {
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
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "n_operacao_bancaria", label: "Número de Operacão bancária" },
    { id: "n_operacao_bancaria2", label: "Número de Operacão bancária 2" },
    { id: "nome", label: "Nome do Aluno" },
  ];
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
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Exportar Excel
        </Button>
        <Button variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Imprimir
        </Button>
      </div>

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
                    colSpan={16}
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
                    colSpan={10}
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

      {/* Modal de Detalhes */}
      <ListaPagamentoModal
        factureId={facturaSelecionado}
        isModalOpen={isModalOpen}
        setIsModalOpen={closeModal}
      />
    </div>
  );
}
