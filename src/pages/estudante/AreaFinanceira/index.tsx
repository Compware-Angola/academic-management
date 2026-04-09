import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Contact, FileText, Key } from "lucide-react";
import { Resumo } from "./resumo";
type AreaFinanceiraProps = {
  value?: string;
  codigoMatricula: number;
};
export function AreaFinanceira({
  value = "area-financeira",
  codigoMatricula,
}: AreaFinanceiraProps) {
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue="resumo"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-52">
          <TabsTrigger className="w-full justify-start gap-2" value="resumo">
            <Key className="h-4 w-4" />
            <span className="hidden md:inline">Resumo</span>
            <span className="md:hidden">Resumo</span>
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
        <Card className="flex-1 p-6">
          <Resumo codigoMatricula={codigoMatricula} value="resumo" />
          <TabsContent value="insert-value-aqui-1">outro conteudo</TabsContent>
        </Card>
      </Tabs>
    </TabsContent>
  );
}
