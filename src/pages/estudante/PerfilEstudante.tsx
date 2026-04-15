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

  if (!Number(matricula)) {
    return <div>Matrícula inválida</div>;
  }

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
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
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
