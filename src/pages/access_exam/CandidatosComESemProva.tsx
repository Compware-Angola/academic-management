import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { CandidatosComProvaTab } from "./components/CandidatosComProvaTab";
import { CandidatosSemProvaTab } from "./components/CandidatosSemProvaTab";

export default function CandidatosComESemProva() {
  return (
    <div className="space-y-6 pb-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink>Exame de Acesso</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Candidatos — Prova</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Candidatos — Prova</h1>
        <p className="text-muted-foreground">
          Consulte candidatos com prova marcada e candidatos ainda sem prova atribuída.
        </p>
      </div>

      <Tabs defaultValue="com-prova" className="w-full">
        <TabsList className="grid w-full max-w-sm grid-cols-2">
          <TabsTrigger value="com-prova">Com Prova</TabsTrigger>
          <TabsTrigger value="sem-prova">Sem Prova</TabsTrigger>
        </TabsList>

        <TabsContent value="com-prova" className="pt-5">
          <CandidatosComProvaTab />
        </TabsContent>

        <TabsContent value="sem-prova" className="pt-5">
          <CandidatosSemProvaTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}