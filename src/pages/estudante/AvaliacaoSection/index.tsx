import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, Key, FileText } from "lucide-react";
import { StudentAcademicHistory } from "./student-academic-history";
import { Notes } from "./Notes";
import { StudentResultPlan } from "./student-result-plan";

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
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="plano-estudo"
          >
            <Contact className="h-4 w-4" />
            <span>Plano de Estudo</span>
          </TabsTrigger>
        </TabsList>

        <Card className="flex-1 min-w-0 overflow-hidden p-6">
          <Notes codigoMatricula={codigoMatricula} value="avaliacao" />
          <StudentAcademicHistory
            value="historico-academico"
            codigoMatricula={codigoMatricula}
          />
          <StudentResultPlan
            value="plano-estudo"
            codigoMatricula={codigoMatricula}
          />
        </Card>
      </Tabs>
    </TabsContent>
  );
}
