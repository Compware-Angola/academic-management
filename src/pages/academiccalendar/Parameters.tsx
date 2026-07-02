
import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doutoramento } from "./components/doutoramento";
import { Licenciatura } from "./components/licenciatura";
import { Mestrado } from "./components/mestrado";

export default function Parameters() {
  return (
    <div className="space-y-8 pb-10">

      <PageHeader
        title="Parâmetros do Calendário Académico"
        subtitle="Home / Calendário Académico / Parâmetros"
      />
      <Tabs defaultValue="licenciatura">
        <TabsList>
          <TabsTrigger value="licenciatura">Licenciatura</TabsTrigger>
          <TabsTrigger value="mestrado">Mestrado</TabsTrigger>
          <TabsTrigger value="doutoramento">Doutoramento</TabsTrigger>
        </TabsList>
        <TabsContent value="licenciatura">
          <Licenciatura />
        </TabsContent>
        <TabsContent value="mestrado">
          <Mestrado />
        </TabsContent>
        <TabsContent value="doutoramento">
          <Doutoramento />
        </TabsContent>
      </Tabs>
    </div>
  );
}
