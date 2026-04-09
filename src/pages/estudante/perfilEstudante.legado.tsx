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
} from "@/hooks/tudents/use-query-students";
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
import ScheduleDetailsModal from "../schedules/components/ScheduleDetailsModal";
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
import { PaymentNoteActions } from "../financas/components/views/uma-payment-invoice";
import { buildImageAssets } from "@/util/build-image-assets";
import { PerfilSection } from "./PerfilSection";

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

export  function PerfilEstudanteLegado() {
  const { matricula } = useParams<{ matricula: string }>();
  const [activeTab, setActiveTab] = useState("geral");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [anoLetivo, setAnoLetivo] = useState<string | undefined>("23");
  const [searchTerm, setSearchTerm] = useState("");

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

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

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

  const {
    data: response,
    isLoading: isDisciplinasLoading,
    isError,
  } = useStudentDisciplinas({
    matriculaId: matricula ?? "",
    anoLectivo: Number(anoLetivo),
    page,
    limit,
  });

  const [isModalOpenDisciplina, setIsModalOpenDisciplina] = useState(false);
  const [selectedTurmaId, setSelectedTurmaId] = useState<number | null>(null);

  const openDetails = (turmaId: number) => {
    setSelectedTurmaId(turmaId);
    setIsModalOpenDisciplina(true);
  };

  const disciplinas = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = response?.totalPages ?? 1;

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  if (!matricula) {
    return <div>Matrícula inválida</div>;
  }

  if (isLoading || isFetching) {
    return <div>A carregar dados do estudante...</div>;
  }

  if (error || !student) {
    return <div>Estudante não encontrado</div>;
  }

  const estudante = mockEstudante;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activo":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>
        );
      case "Inactivo":
        return <Badge variant="destructive">Inactivo</Badge>;
      case "Suspenso":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Suspenso</Badge>
        );
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  const getEstadoLabel = (estado: string | undefined) => {
    if (!estado) return "—";
    if (estado === "Fez com Sucesso") return "Aprovado";
    if (estado === "Pendente") return "Pendente";
    return estado;
  };

  const currentPhotoUrl = buildImageAssets(student.foto);
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
            <BreadcrumbLink>Estudantes</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Perfil do Estudante</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with student info */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={currentPhotoUrl}
                  alt={student.nome_completo || "Foto do estudante"}
                  key={currentPhotoUrl}
                />

                <AvatarFallback className="text-3xl font-medium bg-linear-to-br from-gray-100 to-gray-200 text-gray-600">
                  {student?.nome_completo
                    ? student.nome_completo
                        .trim()
                        .split(/\s+/)
                        .map((n) => n[0]?.toUpperCase() ?? "")
                        .join("")
                        .slice(0, 2)
                    : "??"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-2xl font-bold">
                    {student.nome_completo}
                  </h1>
                  {getEstadoBadge(student.estado)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>
                      <strong>Matrícula:</strong> {student.codigo_matricula}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>
                      <strong>Curso:</strong> {student.curso}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      <strong>Ano:</strong> {"-"}º Ano
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{student.contacto || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{student.email || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {student.morada}, {estudante.provincia}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with detailed information */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 h-auto">
          <TabsTrigger value="geral" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Dados Gerais</span>
            <span className="md:hidden">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="academico" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden md:inline">Académico</span>
            <span className="md:hidden">Acad.</span>
          </TabsTrigger>
          <TabsTrigger value="disciplinas" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Disciplinas</span>
            <span className="md:hidden">Disc.</span>
          </TabsTrigger>
          <TabsTrigger value="avaliacao" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Notas & avaliações</span>
            <span className="md:hidden">N-Ava.</span>
          </TabsTrigger>
          <TabsTrigger value="financas" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Finanças</span>
            <span className="md:hidden">Fin.</span>
          </TabsTrigger>
          <TabsTrigger value="documentos" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Documentos</span>
            <span className="md:hidden">Docs</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Layout</span>
            <span className="md:hidden">Layout</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab: Dados Gerais */}
        <TabsContent value="geral" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Nome Completo:</span>
                  <span className="font-medium">{student.nome_completo}</span>

                  <span className="text-muted-foreground">Nome do Pai:</span>
                  <span className="font-medium">{student.pai}</span>

                  <span className="text-muted-foreground">Nome da Mãe:</span>
                  <span className="font-medium">{student.mae}</span>

                  <span className="text-muted-foreground">
                    Data de Nascimento:
                  </span>
                  <span className="font-medium">
                    {new Date(student.data_nascimento).toLocaleDateString(
                      "pt-AO",
                    )}
                  </span>

                  <span className="text-muted-foreground">Nacionalidade:</span>
                  <span className="font-medium">{student.nacionalidade}</span>

                  <span className="text-muted-foreground">Naturalidade:</span>
                  <span className="font-medium">{student.naturalidade}</span>

                  <span className="text-muted-foreground">Género:</span>
                  <span className="font-medium">{student.sexo}</span>

                  <span className="text-muted-foreground">Estado Civil:</span>
                  <span className="font-medium">{student.estado_civil}</span>

                  <span className="text-muted-foreground">BI:</span>
                  <span className="font-medium">{student.bi}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contactos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Telefone:</span>
                  <span className="font-medium">{student.contacto}</span>

                  <span className="text-muted-foreground">Email Pessoal:</span>
                  <span className="font-medium">{student.email}</span>

                  <span className="text-muted-foreground">Endereço:</span>
                  <span className="font-medium">{student.morada}</span>

                  <span className="text-muted-foreground">Cidade:</span>
                  <span className="font-medium">{estudante.cidade}</span>

                  <span className="text-muted-foreground">Província:</span>
                  <span className="font-medium">{estudante.provincia}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Académico */}
        <TabsContent value="academico" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informação do Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Curso:</span>
                  <span className="font-medium">{student.curso}</span>

                  <span className="text-muted-foreground">Faculdade:</span>
                  <span className="font-medium">{student.faculdade}</span>

                  <span className="text-muted-foreground">Grau:</span>
                  <span className="font-medium">{student.grau}</span>

                  <span className="text-muted-foreground">Regime:</span>
                  <span className="font-medium">{student.regime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progresso Académico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center text-muted-foreground py-10">
                  A funcionalidade estará disponível em breve.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Disciplinas */}
        <TabsContent value="disciplinas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Histórico de Disciplinas
              </CardTitle>
              <CardDescription>
                Lista de todas as disciplinas cursadas e em curso
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[200px] max-w-[300px] w-full sm:w-auto">
                  <FormSelect
                    label="Ano Letivo"
                    disabled={isLoadingAcademicYear}
                    loading={isLoadingAcademicYear}
                    value={anoLetivo ?? ""}
                    onChange={(v) => setAnoLetivo(v)}
                    options={anosAcademicos}
                    map={(a) => ({
                      key: a.codigo,
                      label: a.designacao,
                      value: a.codigo,
                    })}
                  />
                </div>
              </div>

              {isDisciplinasLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded" />
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center text-destructive py-10">
                  Erro ao carregar as disciplinas. Tente novamente.
                </div>
              ) : disciplinas.length === 0 ? (
                <div className="text-center text-muted-foreground py-10">
                  Nenhuma disciplina encontrada Para Este ano .
                </div>
              ) : (
                <>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Disciplina</TableHead>
                          <TableHead className="text-center">
                            Ano / Classe
                          </TableHead>
                          <TableHead className="text-center">
                            Semestre
                          </TableHead>
                          <TableHead className="text-center">
                            Sala / Horário
                          </TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {disciplinas.map((disc) => (
                          <TableRow key={disc.codigo_disciplina}>
                            <TableCell className="font-mono text-sm">
                              {disc.codigo_disciplina}
                            </TableCell>
                            <TableCell className="font-medium">
                              {disc.disciplina}
                            </TableCell>
                            <TableCell className="text-center">
                              {disc.classe}
                            </TableCell>
                            <TableCell className="text-center">
                              {disc.semestre}
                            </TableCell>
                            <TableCell className="text-center text-sm text-muted-foreground">
                              {disc.sala} • {disc.horario}
                              {disc.codigo_horario && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="ml-2"
                                  onClick={() =>
                                    openDetails(disc.codigo_horario!)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant={
                                  disc.estado === "Aprovado"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {getEstadoLabel(disc.estado)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                    <div className="text-sm text-muted-foreground order-2 sm:order-1">
                      Mostrando {disciplinas.length} de {total} disciplinas
                    </div>

                    <div className="flex items-center gap-6 order-1 sm:order-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap">
                          Por página:
                        </span>
                        <Select
                          value={String(limit)}
                          onValueChange={(val) => {
                            setLimit(Number(val));
                            setPage(1);
                          }}
                        >
                          <SelectTrigger className="w-[70px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handlePrevious}
                          disabled={page === 1 || isDisciplinasLoading}
                        >
                          Anterior
                        </Button>
                        <span className="text-sm min-w-[90px] text-center">
                          Página {page} de {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleNext}
                          disabled={page === totalPages || isDisciplinasLoading}
                        >
                          Próximo
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <ScheduleDetailsModal
            horarioId={selectedTurmaId}
            isOpen={isModalOpenDisciplina}
            onClose={() => {
              setIsModalOpenDisciplina(false);
              setSelectedTurmaId(null);
            }}
          />
        </TabsContent>
        {/* Tab: Avaliacao */}
        <TabsContent value="avaliacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Avaliações</CardTitle>
              <CardDescription>
                Esta funcionalidade será desenvolvida em breve.
              </CardDescription>
            </CardHeader>

            <CardContent className="py-16">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="text-muted-foreground text-sm">
                  🚧 Estamos a trabalhar nesta funcionalidade.
                </div>

                <div className="text-xs text-muted-foreground">
                  Em breve poderá visualizar aqui o histórico completo das suas
                  avaliações.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Finanças - Aqui está a parte substituída */}
        <TabsContent value="financas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Novo Card - Saldo do Estudante */}
            <Card
              className={
                student.saldo_atual >= 0
                  ? "border-green-500"
                  : "border-amber-500"
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
                    student.saldo_atual > 0
                      ? "text-green-600"
                      : student.saldo_atual < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {student.saldo_atual >= 0 ? "+" : ""}
                  {formatCurrency(student.saldo_atual || 0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {student.saldo_atual > 0
                    ? "Crédito disponível"
                    : student.saldo_atual < 0
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
                  <FormSelect
                    label="Ano Letivo"
                    disabled={isLoadingAcademicYear}
                    loading={isLoadingAcademicYear}
                    value={filters.anoLetivo ?? ""}
                    onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
                    options={anosAcademicos}
                    map={(a) => ({
                      key: a.codigo,
                      label: a.designacao,
                      value: a.codigo,
                    })}
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
                  <p className="font-medium mb-1">
                    Erro ao carregar as facturas
                  </p>
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
            <DialogContent className="max-w-4xl! max-h-[90vh]! overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Detalhes da Nota de Pagamento</DialogTitle>
              </DialogHeader>

              {selectedFactura && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      {getStatusBadge(selectedFactura.estado)}
                      <span className="text-sm text-muted-foreground">
                        Referência:{" "}
                        {selectedFactura.referencia || selectedFactura.codigo}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(selectedFactura.total_preco)}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Estudante</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Matrícula</p>
                        <p className="font-medium">
                          {selectedFactura.codigo_matricula}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Nome</p>
                        <p className="font-medium">
                          {selectedFactura.nome_aluno}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-semibold mb-3">Itens</h3>
                    {isLoadingItens ? (
                      <p className="text-center py-8">A carregar itens...</p>
                    ) : !itens?.data?.length ? (
                      <p className="text-center py-8 text-muted-foreground">
                        Nenhum item encontrado
                      </p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-center">Qtd</TableHead>
                            <TableHead className="text-right">
                              Valor Unit.
                            </TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {itens.data.map((item, idx) => (
                            <TableRow key={idx}>
                              <TableCell>
                                {item.descricaoservico || "—"}
                                {item.mesdescricao
                                  ? ` (${item.mesdescricao})`
                                  : ""}
                              </TableCell>
                              <TableCell className="text-center">
                                {item.quantidade ?? 1}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(item.preco)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(item.total)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-muted/50">
                            <TableCell
                              colSpan={3}
                              className="text-right font-semibold"
                            >
                              Total
                            </TableCell>
                            <TableCell className="text-right font-bold">
                              {formatCurrency(selectedFactura.total_preco)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    )}
                  </div>
                  <Separator />

                  {/* Ações */}
                  <div className="flex gap-3 justify-end">
                    <PaymentNoteActions
                      nota={selectedFactura}
                      itens={itens?.data || []}
                      showDownload={true}
                      showPrint={true}
                    />
                  </div>
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

        {/* Tab: Documentos */}
        <TabsContent value="documentos" className="space-y-4">
          <div className="text-center text-muted-foreground py-10">
            A funcionalidade de documentos estará disponível em breve.
          </div>
        </TabsContent>
        <TabsContent value="layout" className="space-y-4"></TabsContent>
      </Tabs>
    </div>
  );
}
