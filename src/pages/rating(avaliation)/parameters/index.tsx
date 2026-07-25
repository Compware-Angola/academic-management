import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AttendaceList } from "./AttendaceList";
import { LaunchNotesParameter } from "./LaunchNotesParameter";
import { ViewNotesParameter } from "./ViewNotesParameter";

export default function GeneralParametersAvaluation() {





  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Parâmetros Gerais"
        subtitle="Home / Avaliações / Parâmetros Gerais"
      />

      <Tabs defaultValue="viewNotes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="viewNotes">Visualização de Nota</TabsTrigger>
          <TabsTrigger value="presence">Lista de Presença</TabsTrigger>
          <TabsTrigger value="launch">Lançamentos de Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="viewNotes" className="mt-6 relative">
          <ViewNotesParameter />
        </TabsContent>
        <TabsContent value="presence" className="mt-6">
          <AttendaceList />
        </TabsContent>
        <TabsContent value="launch" className="mt-6">
          <LaunchNotesParameter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
