import { GenericPDFDocument } from "@/components/views/pdf/GenericPDFDocument";
import { ReactElement, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EventoRow } from "@/util/types";
import { useQueryGeneralAttendanceCalendar } from "@/hooks/assiduidade/use-query-general-attendance-calendar";
import { useQueryPostGraduationTeacherGeneralAttendanceCalendar } from "@/hooks/post-graduation/use-query-teacher-general-attendance-calendar";

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

type Estado = 1 | 2 | 3;

function EstadoCard({
  horaInicio,
  horaFim,
  ordemTempo,
  estado,
}: {
  horaInicio: string;
  horaFim: string;
  ordemTempo?: number | null;
  estado: Estado;
}) {
  const cls =
    estado === 2
      ? "bg-red-500/10 border-red-500/30 text-red-700"
      : estado === 1
        ? "bg-amber-500/10 border-amber-500/30 text-amber-700"
        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-700";

  return (
    <div className={cn("rounded-md border px-2 py-1 text-[11px] shadow-sm", cls)}>
      <div className="font-medium">
        {horaInicio} → {horaFim}
      </div>
      {ordemTempo != null && (
        <div className="opacity-80 text-[10px]">Ordem: {ordemTempo}</div>
      )}
    </div>
  );
}

function getWeekDaysFromReference(dateString: string) {
  const ref = new Date(dateString);
  const day = ref.getDay(); // 0=domingo
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const iso = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("pt-PT", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });

    return { iso, label };
  });
}

function extractHour(value?: string) {
  if (!value) return null;
  const hour = Number(value.split(":")[0]);
  return Number.isNaN(hour) ? null : hour;
}

export default function SemanaContent({
  canFetch,
  docenteId,
  docenteNome,
  dataReferencia,
  docenteLabel,
  setPdfContent,
  setExcelProps,
  setBaseFileName,
  isPostGraduationAttendance = false,
  degreeId,
}: Props) {
  const docenteIdNum = docenteId ? Number(docenteId) : undefined;

  const params = {
      modo: "SEMANA",
      dataReferencia,
      docenteId: docenteIdNum,
      docenteNome: docenteIdNum ? undefined : docenteNome || undefined,
  } as const;
  const regularQuery = useQueryGeneralAttendanceCalendar(params, {
    enabled: canFetch && !isPostGraduationAttendance,
  });
  const postGraduationQuery =
    useQueryPostGraduationTeacherGeneralAttendanceCalendar(
      {
        ...params,
        degreeId: degreeId ? Number(degreeId) : undefined,
      },
      { enabled: canFetch && isPostGraduationAttendance },
    );
  const { data, isLoading, isError } = isPostGraduationAttendance
    ? postGraduationQuery
    : regularQuery;

  const eventos = (data && data.modo !== "MES" ? data.data : []) as EventoRow[];

  const weekDays = useMemo(
    () => getWeekDaysFromReference(dataReferencia),
    [dataReferencia]
  );

  const hourRange = useMemo(() => {
    const hours = eventos
      .map((ev) => extractHour(ev.hora_inicio))
      .filter((h): h is number => h !== null);

    if (!hours.length) {
      return Array.from({ length: 8 }, (_, i) => i + 6); // fallback 06–13
    }

    const min = Math.min(...hours);
    const max = Math.max(...hours);
    const start = Math.max(6, min);
    const end = Math.max(start + 1, max + 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [eventos]);

  const eventsByDayAndHour = useMemo(() => {
    const map = new Map<string, EventoRow[]>();

    for (const ev of eventos) {
      const hour = extractHour(ev.hora_inicio);
      if (hour === null) continue;

      const key = `${ev.dia}_${hour}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }

    return map;
  }, [eventos]);

  const exportRows = useMemo(
    () =>
      eventos.map((ev) => ({
        dia: ev.dia,
        horaInicio: ev.hora_inicio,
        horaFim: ev.hora_fim,
        ordemTempo: ev.ordem_tempo ?? "—",
        estado:
          ev.estado === 1
            ? "Pendente"
            : ev.estado === 2
              ? "Falta"
              : ev.estado === 3
                ? "Presença"
                : "—",
      })),
    [eventos]
  );

  const pdfContentLocal =
    exportRows.length > 0 ? (
      <GenericPDFDocument
        documentTitle="Controle Geral de Assiduidade por Docente"
        subtitle="Visão Semanal"
        infoSections={[
          { title: "Docente", content: docenteLabel || "—" },
          { title: "Data de Referência", content: dataReferencia || "—" },
          { title: "Resumo", content: [`Total de eventos: ${exportRows.length}`] },
        ]}
        mainTable={{
          headers: [
            { key: "dia", label: "Dia", width: "20%" },
            { key: "horaInicio", label: "Hora Início", width: "15%" },
            { key: "horaFim", label: "Hora Fim", width: "15%" },
            { key: "ordemTempo", label: "Ordem", width: "15%" },
            { key: "estado", label: "Estado", width: "20%" },
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
        subtitle: "Visão Semanal",
        infoSections: [
          { title: "Docente", content: docenteLabel || "—" },
          { title: "Data de Referência", content: dataReferencia || "—" },
          { title: "Resumo", content: [`Total de eventos: ${exportRows.length}`] },
        ],
        mainTable: {
          headers: [
            { key: "dia", label: "Dia", width: 20 },
            { key: "horaInicio", label: "Hora Início", width: 15 },
            { key: "horaFim", label: "Hora Fim", width: 15 },
            { key: "ordemTempo", label: "Ordem", width: 15 },
            { key: "estado", label: "Estado", width: 20 },
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
      `controle_docente_semana_${dataReferencia}_${docenteId || "sem_docente"}`
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
        <p className="text-sm mt-2">Para visualizar a semana.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-16 bg-muted/40 border rounded-lg">
        <p className="text-muted-foreground text-lg">Erro ao carregar</p>
        <p className="text-sm mt-2">Tente novamente.</p>
      </div>
    );
  }

  if (!eventos.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Docente: <span className="font-medium text-foreground">{docenteLabel}</span>
          </div>
          <Badge variant="outline">Semana</Badge>
        </div>

        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Sem dados para esta semana</p>
          <p className="text-sm mt-2">Escolha outra data de referência.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Docente: <span className="font-medium text-foreground">{docenteLabel}</span>
        </div>
        <Badge variant="outline">Semana</Badge>
      </div>

      <div className="overflow-x-auto rounded-lg border bg-card">
        <div className="min-w-[900px]">
          {/* Cabeçalho */}
          <div className="grid grid-cols-8 border-b bg-muted/30">
            <div className="p-3 text-sm font-medium text-muted-foreground border-r">
              Hora
            </div>

            {weekDays.map((day) => (
              <div key={day.iso} className="p-3 text-center border-r last:border-r-0">
                <div className="text-sm font-semibold">{day.label}</div>
              </div>
            ))}
          </div>

          {/* Corpo */}
          {hourRange.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0 min-h-[84px]">
              <div className="border-r p-3 text-sm text-muted-foreground font-medium">
                {String(hour).padStart(2, "0")}:00
              </div>

              {weekDays.map((day) => {
                const key = `${day.iso}_${hour}`;
                const cellEvents = eventsByDayAndHour.get(key) ?? [];

                return (
                  <div
                    key={key}
                    className="border-r last:border-r-0 p-2 space-y-2 bg-background"
                  >
                    {cellEvents.length > 0 ? (
                      cellEvents.map((ev, idx) => (
                        <EstadoCard
                          key={`${ev.dia}-${ev.hora_inicio}-${idx}`}
                          horaInicio={ev.hora_inicio}
                          horaFim={ev.hora_fim}
                          ordemTempo={ev.ordem_tempo}
                          estado={ev.estado as Estado}
                        />
                      ))
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
