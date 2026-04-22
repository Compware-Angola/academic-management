import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Contact } from "lucide-react";
import { CertidoesSection } from "./components/CertidoesSection";

import { FileText, ScrollText, BookOpen, GraduationCap } from "lucide-react";
import { GerarDiploma } from "./gerar-diploma";


const DOCUMENTS_TABS_CONFIG = [
  {
    value: "gerar-diploma",
    label: "Gerar Diploma",
    icon: GraduationCap,
    component: GerarDiploma,
  },
] as const;

interface DocumentsSectionProps {
  value?: string;
  codigoMatricula: number;
}

export function DocumentsSection({
  value = "documentacao",
  codigoMatricula,
}: DocumentsSectionProps) {
  return (
    <TabsContent value={value}>
      <Tabs
        defaultValue="carta-de-conclusao"
        orientation="vertical"
        className="flex flex-row gap-6"
      >
        <TabsList className="flex justify-start flex-col h-auto w-56">
          {DOCUMENTS_TABS_CONFIG.map((tab) => {
            const Icon = tab.icon;

            return (
              <TabsTrigger
                key={tab.value}
                className="w-full justify-start gap-2"
                value={tab.value}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline truncate">{tab.label}</span>
                <span className="md:hidden truncate">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <Card className="flex-1 p-6">
          {DOCUMENTS_TABS_CONFIG.map((tab) => {
            const Component = tab.component;

            return (
              <Component
                key={tab.value}
                value={tab.value}
                codigoMatricula={codigoMatricula}
              />
            );
          })}
        </Card>
      </Tabs>
    </TabsContent>
  );
}