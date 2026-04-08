import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtualizarSenha } from "./atualisar-senha";
import { Contacto } from "./contacto";
import { Contact, FileText, Key } from "lucide-react";
import { DadosPessoais } from "./dados-pessoais";
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
        defaultValue="atualizar-senha"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52">
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="atualizar-senha"
          >
            <Key className="h-4 w-4" />
            <span className="hidden md:inline">Atualizar Senha</span>
            <span className="md:hidden">Atualizar Senha</span>
          </TabsTrigger>
          <TabsTrigger className="w-full justify-start gap-2" value="contacto">
            <Contact className="h-4 w-4" />
            <span className="hidden md:inline">Contacto</span>
            <span className="md:hidden">Contacto</span>
          </TabsTrigger>
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="dados-pessoais"
          >
            <Contact className="h-4 w-4" />
            <span className="hidden md:inline">Dados Pessoais</span>
            <span className="md:hidden">Dados Pessoais</span>
          </TabsTrigger>
        </TabsList>
        <Card className="flex-1 p-6">
          <AtualizarSenha codigoMatricula={codigoMatricula} />
          <DadosPessoais codigoMatricula={codigoMatricula} />
        </Card>
      </Tabs>
    </TabsContent>
  );
}
