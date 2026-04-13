import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, User, CreditCard, FileText, Pencil, Book } from "lucide-react";
import { useStudentDisciplinas } from "@/hooks/students/use-query-students";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

import {
  useQueryFacturaItens,
  useQueryFacturas,
} from "@/hooks/horario/use-query-invoice";

import { buildImageAssets } from "@/util/build-image-assets";

import { AreaFinanceira } from "./AreaFinanceira";
import { DocumentsSection } from "./DocumentsSection";
import { AvaliacaoSection } from "./AvaliacaoSection";
import { StudentProfileHeader } from "./StudentProfileHeader";
import { PerfilSection } from "./PerfilSection";
import { DisciplinasSection } from "./disciplina";

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

export default function PerfilEstudante() {
  const { matricula } = useParams<{ matricula: string }>();
  const [activeTab, setActiveTab] = useState("perfil");
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

  if (!Number(matricula)) {
    return <div>Matrícula inválida</div>;
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

      <div className="flex flex-col md:flex-row gap-6">
        <StudentProfileHeader matricula={matricula} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="perfil"
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="perfil" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Perfil</span>
            <span className="md:hidden">Perfil</span>
          </TabsTrigger>

          <TabsTrigger value="documentacao" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Documentação</span>
            <span className="md:hidden">Docs</span>
          </TabsTrigger>

          <TabsTrigger value="area-financeira" className="gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Área Financeira</span>
            <span className="md:hidden">Área Financeira</span>
          </TabsTrigger>
          <TabsTrigger value="disciplinas" className="gap-2">
            <Book className="h-4 w-4" />
            <span className="hidden md:inline">Disciplinas</span>
            <span className="md:hidden">Disciplinas</span>
          </TabsTrigger>

          <TabsTrigger value="avaliacao" className="gap-2">
            <Pencil className="h-4 w-4" />
            <span className="hidden md:inline">Notas & avaliações</span>
            <span className="md:hidden">N-Ava.</span>
          </TabsTrigger>
        </TabsList>

        <PerfilSection value="perfil" codigoMatricula={Number(matricula)} />
        <DocumentsSection value="documentacao" />
        <DisciplinasSection
          value="disciplinas"
          codigoMatricula={Number(matricula)}
        />
        <AreaFinanceira
          codigoMatricula={Number(matricula)}
          value="area-financeira"
        />

        <AvaliacaoSection
          value="avaliacao"
          codigoMatricula={Number(matricula)}
        />
      </Tabs>
    </div>
  );
}
