import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, FileText, Key } from "lucide-react";

interface DocumentsSectionProps {
  value?: string;
}

export function DocumentsSection({
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
            <span className="hidden md:inline">Carta de Conclusão</span>
            <span className="md:hidden">Carta de Conclusão</span>
          </TabsTrigger>
          <TabsTrigger className="w-full justify-start gap-2" value="certidoes">
            <Contact className="h-4 w-4" />
            <span className="hidden md:inline">Certidoes</span>
            <span className="md:hidden">Certidoes</span>
          </TabsTrigger>
        </TabsList>
        <Card className="flex-1 p-6">
          <TabsContent value="carta-de-conclusao">
            <h1>
              uma secção de tab de conteudos seguir o legado, de preferencia ser
              um arquivo separa que vais importar aqui m veja conforme esta no
              perfil section
            </h1>
          </TabsContent>
          <TabsContent value="certidoes">
            <h1>outra secção</h1>
          </TabsContent>
        </Card>
      </Tabs>
    </TabsContent>
  );
}
