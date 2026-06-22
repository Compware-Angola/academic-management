import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { addDays, endOfMonth, formatISODate, startOfMonth, startOfWeekMonday, toDateOnly } from "@/util/types";
import { useQueryTeacherClassCalendar } from "@/hooks/assiduidade/use-fetch-teacher-lesson-calendar";
import { AttendanceCalendarToolbar } from "./components/AttendanceCalendarToolbar";
import { MesAulasContent } from "./components/MesAulaContent";
import { SemanaAulasContent } from "./components/SemanasAulaContent";
import { DiaAulasContent } from "./components/DiaAulaContent";


type ViewMode = "MES" | "SEMANA" | "DIA";

export default function PosGraduacaoCalendarioAulasDocente() {
  const [modo, setModo] = useState<ViewMode>("MES");
  const [dataReferencia, setDataReferencia] = useState<Date>(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<string>(formatISODate(new Date()));
  const [docente, setDocente] = useState("");

  const { data: teachersData = [] } = useQueryTeacther();

  const intervalo = useMemo(() => {
    if (modo === "MES") {
      return {
        dataInicial: formatISODate(startOfWeekMonday(startOfMonth(dataReferencia))),
        dataFinal: formatISODate(addDays(endOfMonth(dataReferencia), 7)),
      };
    }

    if (modo === "SEMANA") {
      const start = startOfWeekMonday(dataReferencia);
      return {
        dataInicial: formatISODate(start),
        dataFinal: formatISODate(addDays(start, 6)),
      };
    }

    return {
      dataInicial: diaSelecionado,
      dataFinal: diaSelecionado,
    };
  }, [modo, dataReferencia, diaSelecionado]);

  const canFetch = Boolean(docente);

  const { data, isLoading, isError } = useQueryTeacherClassCalendar(
    {
      docente: Number(docente),
      dataInicial: intervalo.dataInicial,
      dataFinal: intervalo.dataFinal,
    },
    { enabled: canFetch }
  );

  const eventos = data?.data ?? [];

  const titulo = useMemo(() => {
    if (modo === "MES") {
      return dataReferencia.toLocaleDateString("pt-PT", {
        month: "long",
        year: "numeric",
      });
    }

    if (modo === "SEMANA") {
      const start = startOfWeekMonday(dataReferencia);
      const end = addDays(start, 6);
      return `${formatISODate(start)} - ${formatISODate(end)}`;
    }

    return diaSelecionado;
  }, [modo, dataReferencia, diaSelecionado]);

  const handlePrev = () => {
    if (modo === "MES") setDataReferencia(new Date(dataReferencia.getFullYear(), dataReferencia.getMonth() - 1, 1));
    else if (modo === "SEMANA") setDataReferencia(addDays(dataReferencia, -7));
    else {
      const prev = addDays(new Date(diaSelecionado), -1);
      setDiaSelecionado(formatISODate(prev));
      setDataReferencia(prev);
    }
  };

  const handleNext = () => {
    if (modo === "MES") setDataReferencia(new Date(dataReferencia.getFullYear(), dataReferencia.getMonth() + 1, 1));
    else if (modo === "SEMANA") setDataReferencia(addDays(dataReferencia, 7));
    else {
      const next = addDays(new Date(diaSelecionado), 1);
      setDiaSelecionado(formatISODate(next));
      setDataReferencia(next);
    }
  };

  const handleToday = () => {
    const today = toDateOnly(new Date());
    setDataReferencia(today);
    setDiaSelecionado(formatISODate(today));
  };

  const handlePickDay = (isoDay: string) => {
    setDiaSelecionado(isoDay);
    setDataReferencia(new Date(isoDay));
    setModo("DIA");
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendário de Aulas</h1>
        <p className="text-muted-foreground mt-1">
          Visualização mensal, semanal e diária das aulas agendadas do docente
        </p>
      </div>

      <div className="bg-card border rounded-lg p-5 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <Label>Docente</Label>
          <FormCommandSelect
            value={docente}
            options={teachersData}
            map={(t) => ({
              key: t.codigo,
              value: String(t.codigo),
              label: t.nome,
            })}
            onChange={setDocente}
          />
        </div>
      </div>

      <AttendanceCalendarToolbar
        modo={modo}
        titulo={titulo}
        onChangeModo={setModo}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
      />

      {!canFetch ? (
        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Selecione um docente</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Erro ao carregar calendário</p>
        </div>
      ) : modo === "MES" ? (
        <MesAulasContent
          dataReferencia={dataReferencia}
          eventos={eventos}
          onPickDay={handlePickDay}
        />
      ) : modo === "SEMANA" ? (
        <SemanaAulasContent
          dataReferencia={dataReferencia}
          eventos={eventos}
          onPickDay={handlePickDay}
        />
      ) : (
        <DiaAulasContent
          dataSelecionada={diaSelecionado}
          eventos={eventos}
        />
      )}
    </div>
  );
}