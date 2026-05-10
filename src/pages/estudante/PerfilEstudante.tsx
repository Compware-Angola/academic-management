import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, User, CreditCard, FileText, Pencil } from "lucide-react";

import { AreaFinanceira } from "./AreaFinanceira";
import { DocumentsSection } from "./DocumentsSection";
import { AvaliacaoSection } from "./AvaliacaoSection";
import { StudentProfileHeader } from "./StudentProfileHeader";
import { PerfilSection } from "./PerfilSection";
import { DisciplinasSection } from "./disciplina";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

// Mock data for a complete student profile

export default function PerfilEstudante() {
  const { matricula } = useParams<{ matricula: string }>();
  const [activeTab, setActiveTab] = useState("perfil");
  const { hasPermission } = usePermission();
  const canViewFinanceiro =
    hasPermission(PermissionTypeDetails.FACTURAS.sigla) ||
    hasPermission(PermissionTypeDetails.GERAR_MENSALIDADES.sigla) ||
    hasPermission(PermissionTypeDetails.GERAR_OUTROS_SERVICOS.sigla);
  const canViewDocuments =
    hasPermission(PermissionTypeDetails.CARTA_CONCLUSAO.sigla) ||
    hasPermission(PermissionTypeDetails.CERTIDOES.sigla) ||
    hasPermission(PermissionTypeDetails.GERAR_DIPLOMA.sigla) ||
    hasPermission(PermissionTypeDetails.CERTIFICADO_COM_NOTAS.sigla);

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

          <TabsTrigger
            disabled={!canViewDocuments}
            value="documentacao"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden md:inline">Documentação</span>
            <span className="md:hidden">Docs</span>
          </TabsTrigger>

          <TabsTrigger
            disabled={!canViewFinanceiro}
            value="area-financeira"
            className="gap-2"
          >
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
        <DocumentsSection
          value="documentacao"
          codigoMatricula={Number(matricula)}
        />
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
