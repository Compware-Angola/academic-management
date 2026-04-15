import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiltrarPorAvaliacoes } from "./filtrar-por-avaliacoes";
import { FiltrarPorEquivalencia } from "./filtrar-por-equivalencia";

export function StudentAcademicHistory({
  value = "avaliacao",
  codigoMatricula,
}: {
  value?: string;
  codigoMatricula: number;
}) {
  return (
    <TabsContent value={value} className="space-y-4">
      <Tabs defaultValue="filtrar-por-avaliacao">
        <TabsList className="grid w-full grid-cols-3 lg:w-max">
          <TabsTrigger value="filtrar-por-avaliacao">Avaliações</TabsTrigger>
          <TabsTrigger value="filtrar-por-equivalencia">
            Equivalência
          </TabsTrigger>
          <TabsTrigger value="migracao-dados">Migração</TabsTrigger>
        </TabsList>

        <FiltrarPorAvaliacoes
          value="filtrar-por-avaliacao"
          codigoMatricula={codigoMatricula}
        />

        <FiltrarPorEquivalencia
          value="filtrar-por-equivalencia"
          codigoMatricula={codigoMatricula}
        />
        <TabsContent value="migracao-dados">
          <div className="p-4 border rounded-md text-muted-foreground">
            Conteúdo de migração de dados
          </div>
        </TabsContent>
      </Tabs>
    </TabsContent>
  );
}
