import { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ReactElement, useEffect, useMemo } from "react";
import { MesRow } from "@/util/types";
import AttendanceSummaryCards from "./AttendanceSummaryCards";
import CalendarMesGrid from "./CalendarMesGrid";
import { useQueryGeneralAttendanceCalendar } from "@/hooks/assiduidade/use-query-general-attendance-calendar";
import { useQueryPostGraduationTeacherGeneralAttendanceCalendar } from "@/hooks/post-graduation/use-query-teacher-general-attendance-calendar";

// ✅ teu hook real


type Props = {
  canFetch: boolean;
  docenteId: string;
  docenteNome: string;
  dataReferencia: string;
  docenteLabel: string;
  onPickDay: (isoDay: string) => void;
  setPdfContent: (value: ReactElement | null) => void;
  setExcelProps: (value: any | null) => void;
  setBaseFileName: (value: string) => void;
  isPostGraduationAttendance?: boolean;
  degreeId?: string;
};

export default function MesContent(props: Props) {
  const {
    canFetch,
    docenteId,
    docenteNome,
    dataReferencia,
    docenteLabel,
    onPickDay,
    setPdfContent,
    setExcelProps,
    setBaseFileName,
    isPostGraduationAttendance = false,
    degreeId,
  } = props;

  const docenteIdNum = docenteId ? Number(docenteId) : undefined;
  const params = useMemo(
    () => ({
      modo: "MES" as const,
      dataReferencia: dataReferencia || undefined,
      docenteId: docenteIdNum || undefined,
      docenteNome: docenteNome || undefined,
    }),
    [docenteId, docenteNome, dataReferencia]
  );

  const enabled =
    canFetch &&
    !!params.modo &&
    (!!params.docenteId || !!params.docenteNome);

  const regularQuery = useQueryGeneralAttendanceCalendar(params, {
    enabled: enabled && !isPostGraduationAttendance,
  });
  const postGraduationQuery =
    useQueryPostGraduationTeacherGeneralAttendanceCalendar(
      {
        ...params,
        degreeId: degreeId ? Number(degreeId) : undefined,
      },
      { enabled: enabled && isPostGraduationAttendance },
    );
  const { data, isLoading, error } = isPostGraduationAttendance
    ? postGraduationQuery
    : regularQuery;

  const rows = (data?.data ?? []) as MesRow[];

  const summary = useMemo(() => {
    const total = rows.reduce((a, r) => a + Number(r.total_aulas || 0), 0);
    const pend = rows.reduce((a, r) => a + Number(r.pendentes || 0), 0);
    const falt = rows.reduce((a, r) => a + Number(r.faltas || 0), 0);
    const pres = rows.reduce((a, r) => a + Number(r.presencas || 0), 0);
    return { total, pend, falt, pres };
  }, [rows]);

  const exportRows = useMemo(
    () =>
      rows.map((r: any) => ({
        dia: r.dia ?? "—",
        totalAulas: r.total_aulas ?? 0,
        pendentes: r.pendentes ?? 0,
        faltas: r.faltas ?? 0,
        presencas: r.presencas ?? 0,
      })),
    [rows]
  );

  const pdfContentLocal =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Controle Geral de Assiduidade por Docente"
        subtitle="Visão Mensal"
        infoSections={[
          { title: "Docente", content: docenteLabel || "—" },
          { title: "Data de Referência", content: dataReferencia || "—" },
          { title: "Resumo", content: [`Total de aulas: ${summary.total}`] },
        ]}
        mainTable={{
          headers: [
            { key: "dia", label: "Dia", width: "20%" },
            { key: "totalAulas", label: "Total Aulas", width: "20%" },
            { key: "pendentes", label: "Pendentes", width: "20%" },
            { key: "faltas", label: "Faltas", width: "20%" },
            { key: "presencas", label: "Presenças", width: "20%" },
          ],
          rows: exportRows,
          headerBackground: "#0D1B48",
        }}
        footerNotice="Documento gerado automaticamente pelo sistema."
      />
    ) : null;

  const excelPropsLocal =
    exportRows.length > 0
      ? {
        documentTitle: "Controle Geral de Assiduidade por Docente",
        subtitle: "Visão Mensal",
        infoSections: [
          { title: "Docente", content: docenteLabel || "—" },
          { title: "Data de Referência", content: dataReferencia || "—" },
          { title: "Resumo", content: [`Total de aulas: ${summary.total}`] },
        ],
        mainTable: {
          headers: [
            { key: "dia", label: "Dia", width: 20 },
            { key: "totalAulas", label: "Total Aulas", width: 15 },
            { key: "pendentes", label: "Pendentes", width: 15 },
            { key: "faltas", label: "Faltas", width: 15 },
            { key: "presencas", label: "Presenças", width: 15 },
          ],
          rows: exportRows,
        },
        footerNotice: "Documento gerado automaticamente pelo sistema.",
        primaryColor: "#0D1B48",
      }
      : null;

  useEffect(() => {
    setPdfContent(pdfContentLocal);
    setExcelProps(excelPropsLocal);
    setBaseFileName(
      `controle_docente_mes_${dataReferencia}_${docenteId || "sem_docente"}`
    );

    return () => {
      setPdfContent(null);
      setExcelProps(null);
    };
  }, [
    pdfContentLocal,
    excelPropsLocal,
    dataReferencia,
    docenteId,
    setPdfContent,
    setExcelProps,
    setBaseFileName,
  ]);

  if (!canFetch) {
    return (
      <div className="text-center py-16 bg-muted/40 border rounded-lg">
        <p className="text-muted-foreground text-lg">Selecione um docente</p>
        <p className="text-sm mt-2">Para visualizar o calendário mensal.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-80 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-muted/40 border rounded-lg">
        <p className="text-muted-foreground text-lg">Erro ao carregar</p>
        <p className="text-sm mt-2">Tente novamente.</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Docente: <span className="font-medium text-foreground">{docenteLabel}</span>
          </div>
          <Badge variant="outline">Mês</Badge>
        </div>
        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Sem dados para este mês</p>
          <p className="text-sm mt-2">Escolha outra data de referência.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Docente: <span className="font-medium text-foreground">{docenteLabel}</span>
        </div>
        <Badge variant="outline">Mês</Badge>
      </div>

      <AttendanceSummaryCards
        total={summary.total}
        pendentes={summary.pend}
        faltas={summary.falt}
        presencas={summary.pres}
      />

      <CalendarMesGrid
        dataReferencia={dataReferencia}
        rows={rows}
        onPickDay={onPickDay}
      />
    </div>
  );
}
