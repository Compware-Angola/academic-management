import { Link } from "react-router-dom";
import { Home, History, ListChecks } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CaixasDisponiveisTab } from "./components/CaixasDisponiveisTab";
import { MovementsTable } from "./components/moviment/MovementsTable";

export function CaixaPage() {
  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Financeiro</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Caixas</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Gestão de Caixas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Controle de abertura, fechamento e histórico de movimentos
        </p>
      </div>

      <Tabs defaultValue="caixas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="caixas" className="gap-2">
            <ListChecks className="h-4 w-4" />
            Caixas Disponíveis
          </TabsTrigger>
          <TabsTrigger value="movimentos" className="gap-2">
            <History className="h-4 w-4" />
            Histórico de Movimentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="caixas">
          <CaixasDisponiveisTab />
        </TabsContent>

        <TabsContent value="movimentos">
          <MovementsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
