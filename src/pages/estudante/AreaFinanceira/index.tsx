import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact, FileText, Key, DollarSign, Package, BanknoteIcon } from "lucide-react";

import { Resumo } from "./components/resumo";
import { MensalidadesSection } from "./components/mensalidade";
import { OutrosServicosSection } from "./components/outros-servicos";

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
            <BanknoteIcon className="h-4 w-4" />
            <span className="hidden md:inline">Notas de Pagamento</span>
          </TabsTrigger>

          <TabsTrigger
            className="w-full justify-start gap-2"
            value="mensalidades"
          >
            <DollarSign className="h-4 w-4" />
            <span className="hidden md:inline">Mensalidades</span>
          </TabsTrigger>

          <TabsTrigger
            className="w-full justify-start gap-2"
            value="outros-servicos"
          >
            <Package className="h-4 w-4" />
            <span className="hidden md:inline">Outros Serviços</span>
          </TabsTrigger>
        </TabsList>

        <Card className="flex-1 p-6">
          <TabsContent value="resumo">
            <Resumo codigoMatricula={codigoMatricula} />
          </TabsContent>

          <TabsContent value="mensalidades">
            <MensalidadesSection codigoMatricula={codigoMatricula} />
          </TabsContent>

          <TabsContent value="outros-servicos">
            <OutrosServicosSection codigoMatricula={codigoMatricula} />

          </TabsContent>
        </Card>
      </Tabs>
    </TabsContent>
  );
}