import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, FileText, GraduationCap } from "lucide-react";
import { CertidoesSection } from "./components/CertidoesSection";
import { GerarDiploma } from "./gerar-diploma";


interface DocumentsSectionProps {
  codigoMatricula:number
  value?: string;
}

export function DocumentsSection({
  codigoMatricula,
  value = "documentos",
}: DocumentsSectionProps) {
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue="carta-de-conclusao"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52">
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="carta-de-conclusao"
          >
            <FileText className="h-4 w-4" />
            <span>Carta de Conclusão</span>
          </TabsTrigger>
          <TabsTrigger className="w-full justify-start gap-2" value="certidoes">
            <Contact className="h-4 w-4" />
            <span>Certidões</span>
          </TabsTrigger>
          <TabsTrigger
            className="w-full justify-start gap-2"
            value="gerar-diploma"
          >
            <GraduationCap className="h-4 w-4" />
            <span>Gerar Diploma</span>
          </TabsTrigger>
        </TabsList>
        <Card className="flex-1 p-6">
          <TabsContent value="carta-de-conclusao">
            <h1>Carta de Conclusão – conteúdo aqui</h1>
          </TabsContent>
          <TabsContent value="certidoes">
            <CertidoesSection codigoMatricula={codigoMatricula}/>
          </TabsContent>
          <TabsContent value="gerar-diploma">
            <GerarDiploma codigoMatricula={codigoMatricula} value="gerar-diploma" />
          </TabsContent>
        </Card>
      </Tabs>
    </TabsContent>
  );
}