import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AulaNormalContent from "./components/AulaNormalContent";
import AulaCampoContent from "./components/AulaCampoContent";
import ProvaContent from "./components/ProvaContent";
import type { ReactNode } from "react";

type MarcarAssiduidadeProps = {
  isPostGraduationAttendance?: boolean;
  degreeId?: string;
  topFiltersSlot?: ReactNode;
};

export default function MarcarAssiduidade({
  isPostGraduationAttendance = false,
  degreeId,
  topFiltersSlot,
}: MarcarAssiduidadeProps) {

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marcar Assiduidade</h1>
          <p className="text-muted-foreground mt-1">
            Registar presenças por tipo: Aulas, Provas e Aulas de Campo
          </p>
        </div>

      </div>

      <Tabs defaultValue="aulas" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="aulas">Aulas</TabsTrigger>
          <TabsTrigger value="campo">Aulas de Campo</TabsTrigger>
          <TabsTrigger value="provas">Provas</TabsTrigger>

        </TabsList>

        <TabsContent value="aulas" className="space-y-6 pt-5">
          {/* Filtros e tabela para aulas normais */}
          <AulaNormalContent
            isPostGraduationAttendance={isPostGraduationAttendance}
            degreeId={degreeId}
            topFiltersSlot={topFiltersSlot}
          />
        </TabsContent>
        <TabsContent value="campo">
               {/* Filtros e tabela para aulas de campo */}
          <AulaCampoContent
            isPostGraduationAttendance={isPostGraduationAttendance}
            degreeId={degreeId}
            topFiltersSlot={topFiltersSlot}
          />
        </TabsContent>
        <TabsContent value="provas">
              {/* Filtros e tabela para provas */}
         <ProvaContent
           isPostGraduationAttendance={isPostGraduationAttendance}
           degreeId={degreeId}
           topFiltersSlot={topFiltersSlot}
         />
        </TabsContent>


      </Tabs>
    </div>
  );
}
