import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, Key, FileText } from "lucide-react";
import { StudentAcademicHistory } from "./student-academic-history";
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
        defaultValue="avaliacao"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52 shrink-0">
          <TabsTrigger className="w-full justify-start gap-2" value="avaliacao">
            <Key className="h-4 w-4" />
            <span>Notas e Avaliações</span>
          </TabsTrigger>
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="historico-academico"
          >
            <Contact className="h-4 w-4" />
            <span>Historico Academico</span>
          </TabsTrigger>
        </TabsList>

        <Card className="flex-1 p-6 overflow-x-auto">
          <Notes codigoMatricula={codigoMatricula} value="notes" />
          <TabsContent value="insert-value-aqui-1">outro conteudo</TabsContent>
        </Card>

        <Card className="flex-1 min-w-0 overflow-hidden p-6">
          <TabsContent value="avaliacao">outro conteudo</TabsContent>
          <StudentAcademicHistory
            value="historico-academico"
            codigoMatricula={codigoMatricula}
          />
        </Card>
      </Tabs>
    </TabsContent>
  );
}
