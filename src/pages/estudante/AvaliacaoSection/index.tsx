import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Contact, FileText, Key } from "lucide-react";
import { Notes } from "./Notes";
type AvaliacaoSectionProps = {
  value?: string;
  codigoMatricula?: number;
};
export function AvaliacaoSection({
  value = "avaliacao",
  codigoMatricula,
}: AvaliacaoSectionProps) {
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue="insert-value-aqui"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52">
          <TabsTrigger className="w-full justify-start gap-2" value="notes">
            <Key className="h-4 w-4" />
            <span className="hidden md:inline">Notas e Avaliações</span>
            <span className="md:hidden">Inserir valor aqui</span>
          </TabsTrigger>
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="insert-value-aqui-1"
          >
            <Contact className="h-4 w-4" />
            <span className="hidden md:inline">Inserir valor aqui</span>
            <span className="md:hidden">Inserir valor aqui</span>
          </TabsTrigger>
        </TabsList>
        <Card className="flex-1 p-6 overflow-x-auto">
          <Notes codigoMatricula={codigoMatricula} value="notes" />
          <TabsContent value="insert-value-aqui-1">outro conteudo</TabsContent>
        </Card>
      </Tabs>
    </TabsContent>
  );
}
