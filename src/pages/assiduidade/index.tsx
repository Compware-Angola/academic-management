import { ReactElement, useEffect, useMemo, useState } from "react";
import PDFActions from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

// ✅ usa o teu hook real
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { CalendarMode } from "@/util/types";
import MesContent from "./components/MesContent";
import SemanaContent from "./components/SemanaContent";
import DiaContent from "./components/DiaContent";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

function toISODate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function ControleGeralPorDocente() {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data: teachersData = [] } = useQueryTeacther();

  const todayIso = useMemo(() => toISODate(new Date()), []);

  const [filters, setFilters] = useState({
    docenteId: "", // string porque vem do FormCommandSelect
    docenteNome: "", // opcional, mas dá pra preencher quando escolhe
    modo: "MES" as CalendarMode,
    dataReferencia: "",
  });

const [pdfContent, setPdfContent] = useState<ReactElement | null>(null);
const [excelProps, setExcelProps] = useState<any | null>(null);
const [baseFileName, setBaseFileName] = useState("controle_geral_docente");

useEffect(() => {
  setPdfContent(null);
  setExcelProps(null);
  setBaseFileName("controle_geral_docente");
}, [filters.modo, filters.docenteId, filters.dataReferencia]);

  const docenteSelecionado = useMemo(() => {
    const id = Number(filters.docenteId || 0);
    const found = teachersData.find((t: any) => Number(t.codigo) === id);
    return found ? { id: String(found.codigo), nome: found.nome } : null;
  }, [filters.docenteId, teachersData]);

  const canFetch = Boolean(filters.docenteId);

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div>
    <h1 className="text-3xl font-bold tracking-tight">
      Controle Geral de Assiduidade por Docente
    </h1>
    <p className="text-muted-foreground mt-1">
      Visualize por Mês, Semana ou Dia, com resumo e detalhes claros.
    </p>
  </div>

  {(pdfContent || excelProps) && (
    <div className="flex flex-wrap gap-2">
      {pdfContent && (
        <PDFActions
          document={pdfContent}
          fileName={`${baseFileName}.pdf`}
          showDownload
          showPrint
        />
      )}

      {excelProps && (
        <ExcelActions
          excelProps={excelProps}
          fileName={`${baseFileName}.xlsx`}
          showDownload
        />
      )}
    </div>
  )}
</div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters((s) => !s)}
              className="text-muted-foreground hover:text-foreground"
            >
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() =>
                setFilters({
                  docenteId: "",
                  docenteNome: "",
                  modo: "MES",
                  dataReferencia: todayIso,
                })
              }
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label>Docente</Label>
            <FormCommandSelect
              value={filters.docenteId}
              options={teachersData}
              map={(t: any) => ({
                key: String(t.codigo),
                value: String(t.codigo),
                label: t.nome,
              })}
              placeholder="Selecionar docente..."
              onChange={(codigo) => {
                const id = String(codigo);
                const teacher = teachersData.find(
                  (t: any) => String(t.codigo) === id
                );
                setFilters((p) => ({
                  ...p,
                  docenteId: id,
                  docenteNome: teacher?.nome ?? "",
                }));
              }}
            />
          </div>

          <div className="space-y-1.5 md:ml-3">
            <Label>Data de referência</Label>
            <Input
              type="date"
              value={filters.dataReferencia}
              onChange={(e) =>
                setFilters((p) => ({ ...p, dataReferencia: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="opacity-0">Ação</Label>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                setFilters((p) => ({ ...p, dataReferencia: todayIso }))
              }
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Hoje
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={filters.modo}
        onValueChange={(v) =>
          setFilters((p) => ({ ...p, modo: v as CalendarMode }))
        }
        className="w-full"
      >
        <TabsList className="grid w-full max-w-2xl grid-cols-3">
          <TabsTrigger value="MES">Mês</TabsTrigger>
          <TabsTrigger value="SEMANA">Semana</TabsTrigger>
          <TabsTrigger value="DIA">Dia</TabsTrigger>
        </TabsList>

        <TabsContent value="MES" className="space-y-6 pt-5">
          <MesContent
            canFetch={canFetch}
            docenteId={filters.docenteId}
            docenteNome={filters.docenteNome}
            dataReferencia={filters.dataReferencia}
            onPickDay={(isoDay) =>
              setFilters((p) => ({ ...p, modo: "DIA", dataReferencia: isoDay }))
            }
            docenteLabel={docenteSelecionado?.nome ?? ""}
            setPdfContent={setPdfContent}
            setExcelProps={setExcelProps}
            setBaseFileName={setBaseFileName}
          />
        </TabsContent>

        <TabsContent value="SEMANA" className="space-y-6 pt-5">
          <SemanaContent
            canFetch={canFetch}
            docenteId={filters.docenteId}
            docenteNome={filters.docenteNome}
            dataReferencia={filters.dataReferencia}
            docenteLabel={docenteSelecionado?.nome ?? ""}
            onPickDay={(isoDay) =>
              setFilters((p) => ({ ...p, modo: "DIA", dataReferencia: isoDay }))
            }
            setPdfContent={setPdfContent}
            setExcelProps={setExcelProps}
            setBaseFileName={setBaseFileName}
          />
        </TabsContent>

        <TabsContent value="DIA" className="space-y-6 pt-5">
          <DiaContent
            canFetch={canFetch}
            docenteId={filters.docenteId}
            docenteNome={filters.docenteNome}
            dataReferencia={filters.dataReferencia}
            docenteLabel={docenteSelecionado?.nome ?? ""}
            setPdfContent={setPdfContent}
            setExcelProps={setExcelProps}
            setBaseFileName={setBaseFileName}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}