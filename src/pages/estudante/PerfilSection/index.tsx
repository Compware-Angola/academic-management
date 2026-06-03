import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtualizarSenha } from "./atualisar-senha";
import { Contacto } from "./contacto";
import { Book, Clock, Contact, GraduationCap, Key, Mail } from "lucide-react";
import { DadosPessoais } from "./dados-pessoais";
import { AtivarMatricula } from "./ativar-matricula";
import { InscricoesSection } from "./ver-inscricoes";
import { InscricoesUC } from "./inscricoes-uc";
import { DefinirEspecialidade } from "./definir-especialidade";

import { Diplomar } from "./Diplomar";
import { MudarCurso } from "./mudar-curso";
import { AtivarConfirmacao } from "./ativar-confirmacao";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { ChangeShiftStudentPage } from "./change-shift";
import { StudentMessages } from "./StudentMessages";

type PerfilSectionProps = {
  value?: string;
  codigoMatricula: number;
};
export function PerfilSection({
  value = "perfil",
  codigoMatricula,
}: PerfilSectionProps) {
  const { hasPermission } = usePermission();

  const TABS_CONFIG = [
    {
      value: "atualizar-senha",
      label: "Atualizar Senha",
      icon: Key,
      permission: hasPermission(
        PermissionTypeDetails.ACTUALIZAR_SENHA_ESTUDANTE.sigla,
      ),
      component: AtualizarSenha,
    },
    {
      value: "contacto",
      label: "Contacto",
      icon: Contact,
      component: Contacto,
      permission: hasPermission(
        PermissionTypeDetails.ACTUALIZAR_CONTACTOS_ESTUDANTE.sigla,
      ),
    },
    {
      value: "dados-pessoais",
      label: "Dados Pessoais",
      icon: Contact,
      permission: hasPermission(
        PermissionTypeDetails.ACTUALIZAR_DADOS_ESTUDANTE.sigla,
      ),
      component: DadosPessoais,
    },
    {
      value: "ativar-matricula",
      label: "Ativar Matricula Cancelada",
      icon: Key,
      permission: hasPermission(
        PermissionTypeDetails.ACTIVAR_MATRICULA_CANCELADA.sigla,
      ),
      component: AtivarMatricula,
    },
    {
      value: "ativar-confirmacao",
      label: "Ativar Confirmação",
      icon: Key,
      permission: hasPermission(
        PermissionTypeDetails.ACTIVAR_CONFIRMACAO.sigla,
      ),
      component: AtivarConfirmacao,
    },
    {
      value: "ver-inscricoes",
      label: "Ver Inscrições",
      icon: Book,
      permission: hasPermission(PermissionTypeDetails.VER_INSCRICOES.sigla),
      component: InscricoesSection,
    },
    {
      value: "inscricoes-uc",
      label: "Fazer Inscrições em UC",
      icon: Book,
      component: InscricoesUC,
      permission: hasPermission(PermissionTypeDetails.INSCRICOES_UC.sigla),
    },
    {
      value: "definir-especialidade",
      label: "Definir Especialidade",
      icon: Book,
      permission: hasPermission(
        PermissionTypeDetails.DEFINIR_ESPECIALIDADE_LICENCIATURA.sigla,
      ),
      component: DefinirEspecialidade,
    },

    {
      value: "diplomar",
      label: "Diplomar",
      icon: GraduationCap,
      permission: hasPermission(PermissionTypeDetails.DIPLOMAR.sigla),
      component: Diplomar,
    },
    {
      value: "mudar-curso",
      label: "Mudança do Curso",
      icon: Book,
      permission: hasPermission(PermissionTypeDetails.MUDAR_CURSO.sigla),
      component: MudarCurso,
    },

    {
      value: "mudar-turno",
      label: "Mudar Turno",
      icon: Clock,
      permission: hasPermission(PermissionTypeDetails.MUDAR_TURNO.sigla),
      component: ChangeShiftStudentPage,
    },
    {
      value: "student-messages",
      label: "Mensagens",
      icon: Mail,
      permission: hasPermission(PermissionTypeDetails.SOLICITACOES_ENCAMINHADAS.sigla),
      component: StudentMessages,
    }
  ] as const;
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue={"atualizar-senha"}
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52">
          {TABS_CONFIG.map((tab) => {
            const Icon = tab.icon;
            if (!tab.permission) return null;
            return (
              <TabsTrigger
                key={tab.value}
                className="w-full justify-start gap-2"
                value={tab.value}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline truncate">{tab.label}</span>
                <span className="md:hidden truncate">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <Card className="flex-1 p-6 flex-1 min-w-0 overflow-hidden">
          {TABS_CONFIG.map((tab) => {
            const Component = tab.component;
            if (!tab.permission || !Component) return null;
            return (
              <Component
                key={tab.value}
                value={tab.value}
                codigoMatricula={codigoMatricula}
              />
            );
          })}
        </Card>
      </Tabs>
    </TabsContent>
  );
}
