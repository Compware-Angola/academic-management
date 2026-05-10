import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Home,
  User,
  GraduationCap,
  CreditCard,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  RefreshCw,
  Search,
} from "lucide-react";
import {
  useStudentDetail,
  useStudentDisciplinas,
} from "@/hooks/students/use-query-students";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";

import {
  useQueryFacturaItens,
  useQueryFacturas,
} from "@/hooks/horario/use-query-invoice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { PaymentNoteActions } from "@/pages/financas/components/views/uma-payment-invoice";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FacturaItem } from "@/services/finance/listar-facturas.service";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

// Mock data for a complete student profile
const mockEstudante = {
  // Dados Pessoais
  matricula: "20210001",
  nome: "João Manuel Silva Costa",
  nomePai: "Manuel António Costa",
  nomeMae: "Maria Fernanda Silva",
  dataNascimento: "1998-05-15",
  nacionalidade: "Angolana",
  naturalidade: "Luanda",
  genero: "Masculino",
  estadoCivil: "Solteiro",
  bi: "005123456LA042",
  nif: "123456789",
  foto: "/placeholder.svg",

  // Contactos
  telefone: "+244 923 456 789",
  email: "joao.costa@email.com",
  emailInstitucional: "joao.costa@universidade.ao",
  endereco: "Rua da Liberdade, Nº 45, Maianga",
  cidade: "Luanda",
  provincia: "Luanda",

  // Dados Académicos
  curso: "Engenharia Informática",
  faculdade: "Faculdade de Engenharia",
  departamento: "Ciências da Computação",
  grau: "Licenciatura",
  regime: "Diurno",
  turma: "EI-2021-A",
  anoIngresso: 2021,
  anoCurricular: 4,
  semestre: "1º Semestre",
  mediaGeral: 14.5,
  creditosObtidos: 180,
  creditosTotais: 240,
  estado: "Activo",

  // Dados Financeiros
  saldoDevedor: 45000,
  mensalidadesEmDia: false,
  ultimoPagamento: "2025-12-15",
  valorMensalidade: 25000,
  desconto: 10,
  tipoPagamento: "Mensal",
  bolseiro: false,
};

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

function truncate(text: string, max = 10) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}
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
  const { hasPermission } = usePermission();
  const [selectedFacturaCodigo, setSelectedFacturaCodigo] = useState<
    number | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openServicesModal, setOpenServicesModal] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string | null>(null);

  function handleOpenServices(services: string) {
    setSelectedServices(services);
    setOpenServicesModal(true);
  }

  const [searchBy, setSearchBy] = useState<"reference" | "codigoFatura">(
    "codigoFatura",
  );
  const [filters, setFilters] = useState({
    anoLetivo: "",
    estado: undefined as string | undefined,
  });

  const {
    data,
    isLoading: LoadingFactura,
    isError: isErrorFacturas,
    error: errorFacturas,
    refetch,
  } = useQueryFacturas(
    {
      anoLectivo: filters.anoLetivo,
      status: filters.estado,
      page,
      limit,
      codigoMatricula: matricula,
      reference:
        searchBy === "reference" && searchTerm ? searchTerm : undefined,
      codigoFatura:
        searchBy === "codigoFatura" && searchTerm ? searchTerm : undefined,
    },
    hasPermission(PermissionTypeDetails.LIQUIDAR_NOTA_PAGAMENTO.sigla),
  );
  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetching: isFetchingItens,
  } = useQueryFacturaItens(selectedFacturaCodigo ?? undefined);

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
            Anulado
          </Badge>
        );
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

  const selectedFactura = data?.data.find(
    (f) => f.codigo === selectedFacturaCodigo,
  );

  const placeholders: Record<string, string> = {
    reference: "Pesquisar por referência da factura...",
    codigoFatura: "Pesquisar por Codigo da factura...",
  };

  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  const {
    data: student,
    isLoading,
    isFetching,
    error,
  } = useStudentDetail(matricula);

  if (!matricula) {
    return <div>Matrícula inválida</div>;
  }

  const estudante = mockEstudante;

  return (
    <TabsContent value={value} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Novo Card - Saldo do Estudante */}
        <Card
          className={
            student?.saldo_atual >= 0 ? "border-green-500" : "border-amber-500"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                student?.saldo_atual > 0
                  ? "text-green-600"
                  : student?.saldo_atual < 0
                    ? "text-destructive"
                    : "text-muted-foreground"
              }`}
            >
              {student?.saldo_atual >= 0 ? "+" : ""}
              {formatCurrency(student?.saldo_atual || 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {student?.saldo_atual > 0
                ? "Crédito disponível"
                : student?.saldo_atual < 0
                  ? "Saldo negativo (ver detalhes)"
                  : "Sem saldo"}
            </p>
          </CardContent>
        </Card>

        {/* Saldo Devedor */}
        <Card
          className={
            estudante.saldoDevedor > 0
              ? "border-destructive"
              : "border-green-500"
          }
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Devedor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${estudante.saldoDevedor > 0 ? "text-destructive" : "text-green-500"}`}
            >
              ---
            </p>
            {estudante.saldoDevedor > 0 && (
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-destructive" />
                Pagamento pendente
              </p>
            )}
          </CardContent>
        </Card>

        {/* Mensalidade */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mensalidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">---</p>
            {estudante.desconto > 0 && (
              <p className="text-xs text-green-500 mt-1">
                Desconto de 0 % aplicado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Último Pagamento */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Último Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {formatDate(estudante.ultimoPagamento)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {estudante.tipoPagamento || "—"}
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
          {/* Filtros mantidos (sem pesquisa por matrícula/referência/código) */}
          <div className="flex flex-wrap gap-4 items-end">
            <div className="min-w-[200px]">
              <AcademicYearSelect
                enableDefaultActiveYear
                value={filters.anoLetivo}
                onChangeValue={(v) => setFilters({ ...filters, anoLetivo: v })}
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

            {/* Tipo de Pesquisa */}
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

            {/* Input Pesquisa */}
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
                          {formatCurrency(nota.total_preco)}
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDate(nota.data_factura)}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(nota.estado)}
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

      {/* Modal de detalhes */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl! max-h-[90vh]! overflow-y-auto p-6 sm:p-8 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md">
          <DialogHeader className="pb-6 border-b border-gray-200 dark:border-gray-800">
            <DialogTitle className="flex items-center justify-between gap-4 text-2xl font-bold">
              <div className="flex items-center gap-3">
                Detalhes da Nota de Pagamento
                {selectedFactura && (
                  <span className="inline-flex px-3 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md font-medium">
                    {selectedFactura.referencia ||
                      selectedFactura.codigo ||
                      "—"}
                  </span>
                )}
              </div>
              {selectedFactura && getStatusBadge(selectedFactura.estado)}
            </DialogTitle>
          </DialogHeader>

          {selectedFactura && (
            <div className="space-y-8 pt-6">
              {/* Valor total destacado, mas sem gradiente */}
              <div className="bg-gray-50 dark:bg-gray-900 px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Valor Total
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {formatCurrency(selectedFactura.total_preco)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Valor a Pagar
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(selectedFactura.valor_pagar)}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Emitida em
                    </p>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formatDate(selectedFactura.data_factura)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dados do Estudante */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Dados do Estudante
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Código da Matrícula
                    </p>
                    <p className="font-medium font-mono">
                      {selectedFactura.codigo_matricula || "—"}
                    </p>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <p className="text-sm text-muted-foreground">
                      Nome do Estudante
                    </p>
                    <p className="font-semibold text-lg">
                      {selectedFactura.nome_aluno || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Curso</p>
                    <p className="font-medium">
                      {selectedFactura.curso || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ano Lectivo</p>
                    <p className="font-medium">
                      {selectedFactura.ano_lectivo || "—"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Informações da Nota */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Informações da Nota
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Nº da Nota</p>
                    <p className="font-medium font-mono">
                      {selectedFactura.referencia ||
                        selectedFactura.codigo ||
                        "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Data de Emissão
                    </p>
                    <p className="font-medium">
                      {formatDate(selectedFactura.data_factura)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Multa</p>
                    <p className="font-medium text-orange-600 dark:text-orange-400">
                      {formatCurrency(selectedFactura.total_multa || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estado</p>
                    {getStatusBadge(selectedFactura.estado)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Itens da Factura */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Itens da Nota de Pagamento
                </h3>

                {isLoadingItens || isFetchingItens ? (
                  <div className="py-10 text-center text-muted-foreground bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    A carregar itens da factura...
                  </div>
                ) : !itens.data?.length ? (
                  <div className="py-10 text-center border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900/30 text-muted-foreground">
                    Nenhum item encontrado para esta nota de pagamento
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-gray-100 dark:bg-gray-800">
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-center">Qtd</TableHead>
                          <TableHead className="text-center">Multa</TableHead>
                          <TableHead className="text-right">
                            Valor Unit.
                          </TableHead>
                          <TableHead className="text-right pr-6">
                            Valor Total
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {itens.data.map((item: FacturaItem, index: number) => (
                          <TableRow
                            key={index}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            <TableCell>
                              {(item.descricaoservico || "—") +
                                (Number(item.mesid) !== 3 &&
                                item.mesid &&
                                item.mesdescricao
                                  ? ` (${item.mesdescricao})`
                                  : "")}
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantidade ?? 1}
                            </TableCell>
                            <TableCell className="text-center text-orange-600 dark:text-orange-400">
                              {item.multa ? formatCurrency(item.multa) : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                              {formatCurrency(item.preco)}
                            </TableCell>
                            <TableCell className="text-right font-mono font-semibold pr-6">
                              {formatCurrency(item.preco + item.multa)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
                          <TableCell colSpan={4} className="text-right">
                            Total Unitário
                          </TableCell>
                          <TableCell className="text-right text-primary pr-6">
                            {formatCurrency(
                              itens.data.reduce((total, item) => {
                                const quantidade = item.quantidade ?? 1;
                                return total + item.preco * quantidade;
                              }, 0),
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-100 dark:bg-gray-800 font-semibold">
                          <TableCell colSpan={4} className="text-right">
                            Total Preço
                          </TableCell>
                          <TableCell className="text-right text-primary pr-6">
                            {formatCurrency(
                              itens.data.reduce((total, item) => {
                                const quantidade = item.quantidade ?? 1;
                                return (
                                  total +
                                  item.preco * quantidade +
                                  (item.multa ?? 0)
                                );
                              }, 0),
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              <Separator />

              {/* Ações */}
              <div className="flex justify-end pt-2">
                <PaymentNoteActions
                  nota={selectedFactura}
                  itens={itens?.data || []}
                  showDownload={true}
                  showPrint={true}
                  showliquidarNota={hasPermission(
                    PermissionTypeDetails.LIQUIDAR_NOTA_PAGAMENTO.sigla,
                  )}
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
