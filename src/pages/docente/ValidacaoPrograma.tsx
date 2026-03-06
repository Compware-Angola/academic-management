import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, CircleX } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ValidacaoProgramaComUC } from "./components/ValidacaoProgramaComUC";
import { ValidacaoProgramaSemUC } from "./components/ValidacaoProgramaSemUC";

const ValidacaoPrograma = () => {
  const [activeTab, setActiveTab] = useState<"com-uc" | "sem-uc">("com-uc");

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docente">Docente</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Validação do Programa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Validação de Programas
      </h1>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-3xl grid-cols-3 mb-6">
          <TabsTrigger value="com-uc" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Filtrar uc com programa
          </TabsTrigger>
          <TabsTrigger value="sem-uc" className="gap-2">
            <CircleX className="h-4 w-4" />
            Filtrar sem uc com programa
          </TabsTrigger>
        </TabsList>
        <TabsContent value="com-uc">
          <ValidacaoProgramaComUC />
        </TabsContent>
        <TabsContent value="sem-uc">
          <ValidacaoProgramaSemUC />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidacaoPrograma;
