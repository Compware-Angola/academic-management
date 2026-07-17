import { ReactElement, useEffect, useMemo, useState } from "react";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import PDFActions from "@/components/views/pdf/GenericPDFDocument";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useQueryPostGraduationDegrees } from "@/hooks/post-graduation/use-query-degrees";
import { useQueryPostGraduationAttendanceTeachers } from "@/hooks/post-graduation/use-query-attendance-teachers";
import { CalendarMode } from "@/util/types";
import MesContent from "@/pages/assiduidade/components/MesContent";
import SemanaContent from "@/pages/assiduidade/components/SemanaContent";
import DiaContent from "@/pages/assiduidade/components/DiaContent";
import { RotateCcw } from "lucide-react";

function toISODate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

const DEFAULT_POST_GRADUATION_DEGREE_ID = "2";

export default function PostGraduationTeacherAttendance() {
  const todayIso = useMemo(() => toISODate(new Date()), []);
  const [pdfContent, setPdfContent] = useState<ReactElement | null>(null);
  const [excelProps, setExcelProps] = useState<any | null>(null);
  const [baseFileName, setBaseFileName] = useState(
    "controle_geral_docente_pos_graduacao",
  );
  const [filters, setFilters] = useState({
    degreeId: DEFAULT_POST_GRADUATION_DEGREE_ID,
    docenteId: "",
    docenteNome: "",
    modo: "MES" as CalendarMode,
    dataReferencia: todayIso,
  });

  const { data: degreesResponse, isLoading: isLoadingDegrees } =
    useQueryPostGraduationDegrees();
  const degrees = useMemo(
    () =>
      (degreesResponse?.data ?? []).filter(
        (degree) => degree.id === 2 || degree.id === 3,
      ),
    [degreesResponse],
  );

  const { data: teachersData = [], isLoading: isLoadingTeachers } =
    useQueryPostGraduationAttendanceTeachers({
      degreeId: Number(filters.degreeId),
    });

  const docenteSelecionado = useMemo(() => {
    const id = Number(filters.docenteId || 0);
    const found = teachersData.find((teacher) => Number(teacher.codigo) === id);
    return found ? { id: String(found.codigo), nome: found.nome } : null;
  }, [filters.docenteId, teachersData]);

  const canFetch = Boolean(filters.degreeId) && Boolean(filters.docenteId);

  useEffect(() => {
    setPdfContent(null);
    setExcelProps(null);
    setBaseFileName("controle_geral_docente_pos_graduacao");
  }, [filters.modo, filters.docenteId, filters.dataReferencia, filters.degreeId]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Controle Geral de Assiduidade por Docente
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize a assiduidade dos docentes da Pós-Graduação por mês,
            semana ou dia.
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

      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Filtros</h3>

          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              setFilters({
                degreeId: DEFAULT_POST_GRADUATION_DEGREE_ID,
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <FormSelect
            label="Tipo de Candidatura"
            value={filters.degreeId}
            loading={isLoadingDegrees}
            disabled={isLoadingDegrees}
            options={degrees}
            map={(degree) => ({
              key: degree.id,
              value: degree.id,
              label: degree.designation,
            })}
            onChange={(degreeId) =>
              setFilters((previous) => ({
                ...previous,
                degreeId,
                docenteId: "",
                docenteNome: "",
              }))
            }
          />

          <div className="space-y-1.5">
            <Label>Docente</Label>
            <FormCommandSelect
              value={filters.docenteId}
              options={teachersData}
              disabled={isLoadingTeachers || !filters.degreeId}
              map={(teacher) => ({
                key: String(teacher.codigo),
                value: String(teacher.codigo),
                label: teacher.nome,
              })}
              placeholder="Selecionar docente..."
              onChange={(codigo) => {
                const id = String(codigo);
                const teacher = teachersData.find(
                  (item) => String(item.codigo) === id,
                );
                setFilters((previous) => ({
                  ...previous,
                  docenteId: id,
                  docenteNome: teacher?.nome ?? "",
                }));
              }}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data de referência</Label>
            <Input
              type="date"
              value={filters.dataReferencia}
              onChange={(event) =>
                setFilters((previous) => ({
                  ...previous,
                  dataReferencia: event.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label className="opacity-0">Ação</Label>
            <Button
              variant="outline"
              className="w-full"
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  dataReferencia: todayIso,
                }))
              }
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Hoje
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        value={filters.modo}
        onValueChange={(value) =>
          setFilters((previous) => ({
            ...previous,
            modo: value as CalendarMode,
          }))
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
              setFilters((previous) => ({
                ...previous,
                modo: "DIA",
                dataReferencia: isoDay,
              }))
            }
            docenteLabel={docenteSelecionado?.nome ?? ""}
            setPdfContent={setPdfContent}
            setExcelProps={setExcelProps}
            setBaseFileName={setBaseFileName}
            isPostGraduationAttendance
            degreeId={filters.degreeId}
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
              setFilters((previous) => ({
                ...previous,
                modo: "DIA",
                dataReferencia: isoDay,
              }))
            }
            setPdfContent={setPdfContent}
            setExcelProps={setExcelProps}
            setBaseFileName={setBaseFileName}
            isPostGraduationAttendance
            degreeId={filters.degreeId}
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
            isPostGraduationAttendance
            degreeId={filters.degreeId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
