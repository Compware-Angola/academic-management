import { PageHeader } from "@/components/common/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState, useMemo } from "react";
// Hooks
import { useQueryAcademicYearParams } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { AttendaceList } from "./AttendaceList";
import { LaunchNotesParameter } from "./LaunchNotesParameter";
import { ViewNotesParameter } from "./ViewNotesParameter";

export default function GeneralParametersAvaluation() {
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>("");
  const { data: academicYears = [] } = useQueryAnoAcademico();

  const selectedCodigo = useMemo(() => {
    if (!anoLetivoSelecionado || academicYears.length === 0) return undefined;
    const ano = academicYears.find(
      (a) => a.designacao === anoLetivoSelecionado
    );
    return ano?.codigo ?? undefined;
  }, [anoLetivoSelecionado, academicYears]);

  const { academicYearParams: currentYearParams } = useQueryAcademicYearParams(
    selectedCodigo,
    {
      enabled: !!selectedCodigo,
    }
  );

  useEffect(() => {
    if (academicYears.length > 0 && !anoLetivoSelecionado) {
      const anoAtivo = academicYears.find(
        (a) =>
          a.estado?.toLowerCase().includes("activo") ||
          a.estado?.toLowerCase().includes("ativo")
      );
      if (anoAtivo) setAnoLetivoSelecionado(anoAtivo.designacao);
    }
  }, [academicYears]);

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        title="Parâmetros Gerais"
        subtitle="Home / Avaliações / Parâmetros Gerais"
      />
      {currentYearParams && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            Ano Lectivo — {currentYearParams.designacao}
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            Parâmetros gerais
          </p>
        </div>
      )}
      <Tabs defaultValue="viewNotes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="viewNotes">Visualização de Nota</TabsTrigger>
          <TabsTrigger value="presence">Lista de Presença</TabsTrigger>
          <TabsTrigger value="launch">Lançamentos de Notas</TabsTrigger>
        </TabsList>

        <TabsContent value="viewNotes" className="mt-6 relative">
          <ViewNotesParameter academicYear={currentYearParams?.codigo} />
        </TabsContent>
        <TabsContent value="presence" className="mt-6">
          <AttendaceList academicYear={currentYearParams?.codigo} />
        </TabsContent>
        <TabsContent value="launch" className="mt-6">
          <LaunchNotesParameter />
        </TabsContent>
      </Tabs>
    </div>
  );
}
