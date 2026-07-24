import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
import { Home, Search, Loader2, Download, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { useId, useState } from "react";
import { FormSelect } from "@/components/common/FormSelect";
import { parseFilter } from "@/util/parse-filter";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { Input } from "@/components/ui/input";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import { useQueryListPagamentosMensais } from "@/hooks/financas/pagamentos-mensais/use-query-pagamentos-mensais";
import { formatNumber } from "@/util/format-number";
import { useQueryMonthlyInstallments } from "@/hooks/avaliacao/use-query-monthly-installments";
import { useDebounce } from "@/hooks/use-debounce"; // ← adicionar este hook
import { exportPagamentosMensaisService } from "@/services/financas/pagamentos-mensais/fetch-pagamentos-mensais";
import { toast } from "sonner";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";

type SearchByType = "codigoMatricula" | "nome" | "pagamentoId";
type ExportAction = "excel" | "pdf" | "print";

export default function PagamentoMensal() {
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
    { id: "pagamentoId", label: "Código Pagamento" },
  ];

  const searchFieldMap: Record<SearchByType, string> = {
    codigoMatricula: "codigoMatricula",
    nome: "nome",
    pagamentoId: "codigoPagamento",
  };

  const [searchBy, setSearchBy] = useState<SearchByType>("codigoMatricula");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 600);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [exportingAction, setExportingAction] =
    useState<ExportAction | null>(null);

  const [filters, setFilters] = useState({
    tipoCandidatura: "1",
    anoLectivo: "23",
    curso: "all",
    faculdade: "all",
    periodo: "all",
    mes: "all",
  });
  const { data: tiposCandidatura, isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  const searchParams = debouncedSearch
    ? {
        [searchFieldMap[searchBy]]:
          searchBy === "nome"
            ? debouncedSearch.trim()
            : parseFilter(debouncedSearch),
      }
    : {};

  const { data: pagamentoResponse, isFetching } = useQueryListPagamentosMensais(
    {
      codigoAnoLectivo: parseFilter(filters.anoLectivo),
      codigoCurso: parseFilter(filters.curso),
      codigoPeriodo: parseFilter(filters.periodo),
      codigoFaculdade: parseFilter(filters.faculdade),
      mesId: parseFilter(filters.mes),
      ...searchParams,
      page,
      limit,
    },
  );

  const { data: monthly, isLoading: isLoadingSemester } =
    useQueryMonthlyInstallments({
      anoLectivo: parseFilter(filters.anoLectivo),
    });

  const tableData = pagamentoResponse?.data || [];
  const total = pagamentoResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const reactId = useId();
  const defaultItemMesParcela = [
    {
      value: "all",
      label: "Todos",
      key: reactId,
    },
  ];

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleExport = async (action: ExportAction) => {
    if (exportingAction || total === 0) return;

    const printWindow = action === "print" ? window.open("", "_blank") : null;

    if (action === "print" && !printWindow) {
      toast.error("O navegador bloqueou a janela de impressão.");
      return;
    }

    setExportingAction(action);

    try {
      const { blob, fileName } = await exportPagamentosMensaisService({
        codigoAnoLectivo: parseFilter(filters.anoLectivo),
        codigoCurso: parseFilter(filters.curso),
        codigoPeriodo: parseFilter(filters.periodo),
        codigoFaculdade: parseFilter(filters.faculdade),
        mesId: parseFilter(filters.mes),
        ...searchParams,
      }, action === "excel" ? "csv" : "pdf");

      const downloadUrl = URL.createObjectURL(blob);

      if (action === "print") {
        printWindow!.location.href = downloadUrl;
        setTimeout(() => {
          printWindow!.print();
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      } else {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }

      toast.success("Exportação concluída com sucesso.");
    } catch {
      printWindow?.close();
      toast.error("Não foi possível exportar as mensalidades pagas.");
    } finally {
      setExportingAction(null);
    }
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
            <BreadcrumbLink>Estudante. Mensalidades Pagas</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Estudante. Mensalidades Pagas</h1>
      <p className="text-muted-foreground">
        Consultar pagamentos mensais pagos.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormSelect
              label="Tipo de Candidatura"
              value={filters.tipoCandidatura}
              loading={isLoadingTiposCandidatura}
              onChange={(v) => {
                setFilters((prev) => ({
                  ...prev,
                  tipoCandidatura: v,
                  anoLectivo: "",
                  curso: "all",
                  mes: "all",
                }));
                setPage(1);
              }}
              options={tiposCandidatura}
              map={(tipo) => ({
                key: tipo.codigo,
                label: tipo.designacao,
                value: tipo.codigo,
              })}
              placeholder="Selecione o tipo..."
            />
            <AcademicYearsAvailableForOperationSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => handleFilterChange("anoLectivo", v)}
              tipoCandidaturaId={parseFilter(filters.tipoCandidatura) ?? 1}
              onlyConfigurable={false}
              disabled={!filters.tipoCandidatura}
            />
            <FacultySelect
              allOption
              value={filters.faculdade}
              onChangeValue={(v) => handleFilterChange("faculdade", v)}
            />
            <CourseSelect
              enableDefaultSelectItem
              params={{
                faculdadeId: parseFilter(filters.faculdade),
                tipoCandidaturaId: parseFilter(filters.tipoCandidatura),
              }}
              onChangeValue={(v) => handleFilterChange("curso", v)}
              value={filters.curso}
            />
            <PeriodoSelect
              enabledDefaultSelectItem
              onChangeValue={(v) => handleFilterChange("periodo", v)}
              value={filters.periodo}
            />
            <FormSelect
              defaultSelectItem={defaultItemMesParcela}
              label="Mes/Parcelado"
              value={filters.mes}
              loading={isLoadingSemester}
              onChange={(v) => handleFilterChange("mes", v)}
              options={monthly}
              map={(o) => ({ key: o.id, label: o.designacao, value: o.id })}
            />

            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as SearchByType);
                  setSearchTerm("");
                  setPage(1);
                }}
                options={searchOptions}
                map={(o) => ({ key: o.id, label: o.label, value: o.id })}
              />
            </div>

            <div className="flex items-end col-span-2">
              <div className="flex-1 relative">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Lista de Pagamentos</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="gap-2"
              disabled={!!exportingAction || isFetching || total === 0}
              onClick={() => handleExport("pdf")}
            >
              {exportingAction === "pdf" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              disabled={!!exportingAction || isFetching || total === 0}
              onClick={() => handleExport("print")}
            >
              {exportingAction === "print" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
              Imprimir
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              disabled={!!exportingAction || isFetching || total === 0}
              onClick={() => handleExport("excel")}
            >
              {exportingAction === "excel" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Exportar Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Pagamento...</p>
            </div>
          ) : tableData.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma Pagamento encontrada.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código Pagamento</TableHead>
                  <TableHead>Matricula</TableHead>
                  <TableHead>Tipo de Estudante</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Faculdade</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Turno</TableHead>
                  <TableHead>Mês/Parcela</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Ano Lectivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((item, index) => (
                  <TableRow
                    key={`${item.codigopagamento}-${item.codigofactura}-${item.mes}-${index}`}
                  >
                    <TableCell>{item.codigopagamento}</TableCell>
                    <TableCell>{item.codigomatricula}</TableCell>
                    <TableCell>{item.tipo}</TableCell>
                    <TableCell>{item.nomecompleto}</TableCell>
                    <TableCell>{item.faculdade}</TableCell>
                    <TableCell>{item.curso}</TableCell>
                    <TableCell>{item.periodo}</TableCell>
                    <TableCell>{item.mes}</TableCell>
                    <TableCell>{formatNumber(item.valormensalidade)}</TableCell>
                    <TableCell>{item.anolectivo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

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
    </div>
  );
}
