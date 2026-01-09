import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { TabContentAll } from "./components/tab-content-all";

export default function RectoratePositions() {
  const [activeTab, setActiveTab] = useState("todos");

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Cargos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Cargos
          </h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="reitoria">Reitoria</TabsTrigger>
          <TabsTrigger value="faculdade">Faculdade</TabsTrigger>
        </TabsList>

        <TabContentAll />

        {/* <TabsContent value="reitoria" className="mt-4">
          {renderTable(getFilteredData())}
        </TabsContent>

        <TabsContent value="faculdade" className="mt-4">
          {renderTable(getFilteredData())}
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
