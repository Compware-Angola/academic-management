import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  AlertTriangle,
  Eye,
  RefreshCw,
  Search,
  Loader2,
  Wallet,
  Clock,
  CalendarDays,
  Receipt,
} from "lucide-react";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryFacturas } from "@/hooks/horario/use-query-invoice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { useQueryMonthlyFeesValue } from "@/hooks/financas/use-query-monthly-value";
import { parseFilter } from "@/util/parse-filter";
import { useQueryFinanceMonthlyFee } from "@/hooks/financas/isencao-servico/use-query-finance-monthly-fee";
import { FacturaDetalhesModal } from "@/components/financas/factura-detalhes-modal";
import { StatusBadge } from "@/components/financas/status-badge";
import { formatCurrency, formatDate, truncate } from "@/util/finance-format";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";

const estados = [
  { id: undefined, label: "Todos" },
  { id: "0", label: "Pendente" },
  { id: "1", label: "Pago" },
  { id: "2", label: "Parcelado" },
  { id: "3", label: "Anulado" },
];

const searchOptions = [
  { id: "reference", label: "Referência da Factura" },
  { id: "codigoFatura", label: "Codigo da Factura" },
];

type ResumoProps = {
  codigoMatricula: number;
  value?: string;
};

export function Resumo({
  value = "resumo",
  codigoMatricula: matricula,
}: ResumoProps) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"reference" | "codigoFatura">(
    "codigoFatura",
  );
  const [filters, setFilters] = useState({
    anoLetivo: "",
    estado: undefined as string | undefined,
  });

  const [selectedFacturaCodigo, setSelectedFacturaCodigo] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string | null>(null);

  const { data: student } = useStudentDetail(matricula);
  const { data: academicYear } = useQueryAnoAcademico();
  const activeAcademicYear = academicYear?.find(
    (year) => year.estado.toLowerCase() === "activo",
  );

  const {
    data: monthlyFeeData,
    isLoading: isFeesLoading,
    isError: isFeesError,
  } = useQueryFinanceMonthlyFee({
    academicYear: activeAcademicYear?.codigo?.toString(),
    enrollmentCode: matricula.toString(),
    status: "pending",
    page: 1,
    limit: 100,
  });

  const { data: monthValueResponse, isLoading: isMonthValueLoading } =
    useQueryMonthlyFeesValue({
      anoLectivoId: parseFilter(activeAcademicYear?.codigo?.toString()),
      cursoId: student?.curso_codigo,
      poloId: 1,
    });

  const {
    data,
    isLoading: LoadingFactura,
    isError: isErrorFacturas,
    error: errorFacturas,
    refetch,
  } = useQueryFacturas({
    anoLectivo: filters.anoLetivo,
    status: filters.estado,
    page,
    limit,
    codigoMatricula: matricula,
    reference: searchBy === "reference" && searchTerm ? searchTerm : undefined,
    codigoFatura:
      searchBy === "codigoFatura" && searchTerm ? searchTerm : undefined,
  });

  const monthFee = monthValueResponse?.[0];
  const pendingPayments = monthlyFeeData?.data ?? [];
  const totalPending = useMemo(() => {
    return pendingPayments.reduce((sum, item) => sum + (item.total ?? 0), 0);
  }, [pendingPayments]);
  const hasError = isFeesError;
  const hasNoData = !isFeesLoading && pendingPayments.length === 0;
  const yearLabel = activeAcademicYear?.designacao ?? "Ano letivo";

  const selectedFactura = data?.data.find(
    (f) => f.codigo === selectedFacturaCodigo,
  );

  function handleOpenServices(services: string) {
    setSelectedServices(services);
    setOpenServicesModal(true);
  }

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

  const placeholders: Record<string, string> = {
    reference: "Pesquisar por referência da factura...",
    codigoFatura: "Pesquisar por Codigo da factura...",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  if (!matricula) {
    return <div>Matrícula inválida</div>;
  }

  const cardBase =
    "rounded-xl border-l-[3px] border-t-0 border-r-0 border-b-0 shadow-none";

  return (
    <TabsContent value={value} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Saldo Atual */}
        <Card
          className={`${cardBase} ${student?.saldo_atual >= 0 ? "border-l-green-500" : "border-l-destructive"}`}
        >
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5" /> Reserva
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-2xl font-medium ${student?.saldo_atual > 0 ? "text-green-600" : student?.saldo_atual < 0 ? "text-destructive" : "text-muted-foreground"}`}
            >
              {student?.saldo_atual >= 0 ? "+" : ""}
              {formatCurrency(student?.saldo_atual || 0)}
            </p>
            <span
              className={`mt-2 inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md
  ${student?.saldo_atual > 0
                  ? "bg-green-100 text-green-700"
                  : student?.saldo_atual < 0
                    ? "bg-red-100 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {student?.saldo_atual > 0
                ? "Crédito disponível"
                : student?.saldo_atual < 0
                  ? "Saldo negativo"
                  : "Sem saldo"}
            </span>
          </CardContent>
        </Card>

        {/* Mensalidades Pendentes */}
        <Card
          className={`${cardBase} ${totalPending > 0 ? "border-l-destructive" : "border-l-green-500"}`}
        >
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Pendentes · {yearLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isFeesLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : hasError ? (
              <p className="text-2xl font-medium text-destructive">---</p>
            ) : hasNoData ? (
              <p className="text-2xl font-medium text-muted-foreground">---</p>
            ) : (
              <>
                <p className="text-2xl font-medium text-destructive">
                  {formatCurrency(totalPending)}
                </p>
                <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  {pendingPayments.length} pagamento(s) de Mensalidades em
                  atraso
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Mensalidade */}
        <Card className={`${cardBase} border-l-muted`}>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Mensalidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isMonthValueLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <p className="text-2xl font-medium text-primary">
                  {formatCurrency(monthFee?.preco || 0)}
                </p>
                {monthFee?.descricao && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {monthFee.descricao}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Último Pagamento */}
        <Card className={`${cardBase} border-l-muted`}>
          <CardHeader className="pb-1">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Receipt className="h-3.5 w-3.5" /> Último pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-muted-foreground">---</p>
            <p className="mt-2 text-xs text-muted-foreground">
              Nenhum registo encontrado
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Histórico de Notas de Pagamento{" "}
          </CardTitle>
          <CardDescription>
            Registo de todas as notas de pagamento deste estudante
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="min-w-[200px]">
              <AcademicYearsAvailableForOperationSelect
                enableDefaultSelectItem={false}
                onlyConfigurable={false}

                enableDefaultActiveYear={false}
                value={filters.anoLetivo}
                onChangeValue={(v) => setFilters({ ...filters, anoLetivo: v })}
                tipoCandidaturaId={Number(student?.tipo_canditatura_codigo)}

              />
            </div>

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

            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as "reference" | "codigoFatura");
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

          {LoadingFactura ? (
            <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              A carregar facturas...
            </div>
          ) : isErrorFacturas ? (
            <div className="text-center py-10 text-destructive border border-destructive/30 rounded-md bg-destructive/5">
              <AlertTriangle className="h-10 w-10 mx-auto mb-3 text-destructive" />
              <p className="font-medium mb-1">Erro ao carregar as facturas</p>
              <p className="text-sm text-muted-foreground mb-4">
                {errorFacturas?.message ||
                  "Ocorreu um erro inesperado ao tentar obter os dados."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : data?.data?.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground border rounded-md bg-muted/30">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-60" />
              <p className="font-medium">Nenhuma factura encontrada</p>
              <p className="text-sm mt-1">
                {filters.anoLetivo
                  ? `para o ano lectivo seleccionado`
                  : "para este estudante neste momento"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Referência</TableHead>
                      <TableHead>Serviços</TableHead>
                      <TableHead className="text-right">Valor</TableHead>
                      <TableHead className="text-center">Emissão</TableHead>
                      <TableHead className="text-center">Estado</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.map((nota) => (
                      <TableRow key={nota.codigo}>
                        <TableCell className="font-mono">
                          {nota.codigo}
                        </TableCell>
                        <TableCell className="font-mono">
                          {nota.referencia || "—"}
                        </TableCell>
                        <TableCell>
                          {nota.servicos ? (
                            nota.servicos.length > 40 ? (
                              <>
                                {truncate(nota.servicos, 40)}
                                <button
                                  className="ml-2 text-blue-600 hover:underline text-xs"
                                  onClick={() =>
                                    handleOpenServices(nota.servicos)
                                  }
                                >
                                  ver mais
                                </button>
                              </>
                            ) : (
                              nota.servicos
                            )
                          ) : (
                            "—"
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(nota.valor_pagar)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDate(nota.data_factura)}
                        </TableCell>
                        <TableCell className="text-center">
                          <StatusBadge status={nota.estado} />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(nota.codigo)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center flex-wrap gap-4 pt-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {data?.data?.length} de {data?.total}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {page} de {data?.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page >= data?.totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <FacturaDetalhesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        factura={selectedFactura}
      />

      <Dialog open={openServicesModal} onOpenChange={setOpenServicesModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Serviços / Descrição Completa</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-sm whitespace-pre-wrap">
            {selectedServices || "Sem descrição adicional"}
          </div>
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenServicesModal(false)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
}
