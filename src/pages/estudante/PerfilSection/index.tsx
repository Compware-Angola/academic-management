import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtualizarSenha } from "./atualisar-senha";
import { Contacto } from "./contacto";
import { Book, Contact, GraduationCap, Key } from "lucide-react";
import { DadosPessoais } from "./dados-pessoais";
import { AtivarMatricula } from "./ativar-matricula";
import { InscricoesSection } from "./ver-inscricoes";
import { InscricoesUC } from "./inscricoes-uc";

import { DefinirEspecialidade } from "./definir-especialidade";

import { Diplomar } from "./Diplomar";

import { MudarCurso } from "./mudar-curso";
const TABS_CONFIG = [
  {
    value: "atualizar-senha",
    label: "Atualizar Senha",
    icon: Key,
    component: AtualizarSenha,
  },
  {
    value: "contacto",
    label: "Contacto",
    icon: Contact,
    component: Contacto,
  },
  {
    value: "dados-pessoais",
    label: "Dados Pessoais",
    icon: Contact,
    component: DadosPessoais,
  },
  {
    value: "ativar-matricula",
    label: "Ativar Matricula Cancelada",
    icon: Key,
    component: AtivarMatricula,
  },
  {
    value: "ver-inscricoes",
    label: "Ver Inscrições",
    icon: Book,
    component: InscricoesSection,
  },
  {
    value: "inscricoes-uc",
    label: "Fazer Inscrições em UC",
    icon: Book,
    component: InscricoesUC,
  },
  {

    value: "definir-especialidade",
    label: "Definir Especialidade",
    icon: Book,
    component: DefinirEspecialidade,
  },

  {
    value: "diplomar",
  label: "Diplomar",
  icon: GraduationCap,
  component: Diplomar,
  }


  {
    value: "mudar-curso",
    label: "Mudança do Curso",
    icon: Book,
    component: MudarCurso,
  },
] as const;

type PerfilSectionProps = {
  value?: string;
  codigoMatricula: number;
};
export function PerfilSection({
  value = "perfil",
  codigoMatricula,
}: PerfilSectionProps) {
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

        <Card className="flex-1 p-6">
          {TABS_CONFIG.map((tab) => {
            const Component = tab.component;
            if (!Component) return null;
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
