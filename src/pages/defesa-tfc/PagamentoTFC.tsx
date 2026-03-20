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
import { Home, Search, Loader2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { parseFilter } from "@/util/parse-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { Input } from "@/components/ui/input";
import { useQueryPagamentosTFC } from "@/hooks/defesa-tfc/use-query-pagamentos-tfc";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import { statusFacturaDefesaTFC } from "./data";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { ListaPagamentoModal } from "../financas/notas-pagamento/components/ListaPagamentoModal";

type SearchByType = "codigoMatricula" | "nome" | "facturaId" | "pagamentoId";

export default function PagamentoTFC() {
  //Options
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
    { id: "facturaId", label: "Código Factura" },
    { id: "pagamentoId", label: "Código Pagamento" },
  ];
  const searchFieldMap: Record<SearchByType, string> = {
    codigoMatricula: "matriculaId",
    nome: "nome",
    facturaId: "facturaId",
    pagamentoId: "pagamentoId",
  };
  const [searchBy, setSearchBy] = useState<SearchByType>("codigoMatricula");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchApplied, setSearchApplied] = useState("");

  const searchParams = searchApplied
    ? {
        [searchFieldMap[searchBy]]:
          searchBy === "nome" ? searchApplied : parseFilter(searchApplied),
      }
    : {};

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(10);

  const [facturaSelecionado, setFacturaSelecionado] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const openModal = (facturaId: number) => {
    setIsModalOpen(true);
    setFacturaSelecionado(facturaId);
  };
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    estado: "",
    faculdade: "",
    tipoCandidatura: "",
    periodo: "",
  });

  const [filtersApplied, setFiltersApplied] = useState(filters);
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

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
            Rejeitado
          </Badge>
        );
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const {
    data: pagamentoResponse,
    refetch,
    isFetching,
  } = useQueryPagamentosTFC({
    anoLectivo: parseFilter(filtersApplied.anoLectivo),
    curso: parseFilter(filtersApplied.curso),
    periodoId: parseFilter(filtersApplied.periodo),
    status: parseFilter(filtersApplied.estado),
    ...searchParams,
    page,
    limit,
  });
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
            <BreadcrumbLink> Gestão de Defesa e TFC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Pagamentos TFC</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Pagamentos TFC</h1>
      <p className="text-muted-foreground">
        Consultar pagamentos tfc realizados por alunos.
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
            <FacultySelect
              allOption
              value={filters.faculdade}
              onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
            />
            <TipoCandidaturaSelect
              onChangeValue={(v) =>
                setFilters({ ...filters, tipoCandidatura: v })
              }
              value={filters.tipoCandidatura}
              enableDefaultSelectItem
            />
            <CourseSelect
              params={{
                faculdadeId: parseFilter(filters.faculdade),
                tipoCandidaturaId: parseFilter(filters.tipoCandidatura),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              value={filters.curso}
            />
            <PeriodoSelect
              onChangeValue={(v) => setFilters({ ...filters, periodo: v })}
              value={filters.periodo}
            />
            <FormSelect
              label="Estado"
              value={filters.estado}
              onChange={(v) => setFilters({ ...filters, estado: v })}
              options={statusFacturaDefesaTFC}
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
                  setSearchApplied(searchTerm);
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

          <CardTitle>Lista de Pagamentos TFC</CardTitle>
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
                    <TableHead>Nome</TableHead>
                    <TableHead>Pagamentos</TableHead>
                    <TableHead>Factura</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">
                        {item.matricula}
                      </TableCell>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.pagamento}</TableCell>
                      <TableCell>{item.codigo_factura}</TableCell>
                      <TableCell>{item.curso}</TableCell>
                      <TableCell>{getStatusBadge(item.estado)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          title="Ver Detalhes"
                          onClick={() => openModal(item.codigo_factura)}
                        >
                          <Eye className="h-3 w-3" />
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
      <ListaPagamentoModal
        factureId={facturaSelecionado}
        isModalOpen={isModalOpen}
        setIsModalOpen={closeModal}
      />
    </div>
  );
}
