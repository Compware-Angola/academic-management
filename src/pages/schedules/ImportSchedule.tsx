import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Clock,
  CalendarDays,
  Search,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CalendarX2,
  CheckSquare,
  Square,
  ArrowRightLeft,
  RefreshCw,
  Download,
  CheckCircle2,
  XCircle,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import type {
  Aulas,
  HorarioImportacao,
  ImportScheduleItem,
  ImportSchedulesParams,
} from "@/services/horario/fetch-import-horario";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { useQueryImportSchedules } from "@/hooks/horario/use-query-import-schedules";
import { useCreateImportSchedules } from "@/hooks/horario/use-create-import-schedules";
import { Switch } from "@/components/ui/switch";
import {
  ImportResultResponse,
  ImportResultStatus,
} from "@/services/horario/create-import-horario";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";

// ─────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────

const DIAS_SEMANA: { key: keyof Aulas; label: string }[] = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca", label: "Terça-feira" },
  { key: "quarta", label: "Quarta-feira" },
  { key: "quinta", label: "Quinta-feira" },
  { key: "sexta", label: "Sexta-feira" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const DIA_LABEL_BY_NUMBER: Record<number, string> = {
  1: "Segunda",
  2: "Terça",
  3: "Quarta",
  4: "Quinta",
  5: "Sexta",
  6: "Sábado",
  7: "Domingo",
};

interface ImportFilters {
  fkanoLectivoOrigem?: number;
  fkanoLectivoDestino?: number;
  fkCurso?: number;
  fkClasse?: number;
  fksemestre?: number;
  fkperiodo?: number;
  tipoCandidatura?: number;
}

const STATUS_CONFIG: Record<
  ImportResultStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    badgeClass: string;
    dotClass: string;
  }
> = {
  inserido: {
    label: "Inserido",
    icon: CheckCircle2,
    badgeClass:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
    dotClass: "bg-emerald-500",
  },
  colisao_parcial: {
    label: "Colisão Parcial",
    icon: AlertTriangle,
    badgeClass:
      "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:text-amber-400",
    dotClass: "bg-amber-500",
  },
  colisao_total: {
    label: "Colisão Total",
    icon: XCircle,
    badgeClass:
      "bg-red-500/10 text-red-600 border-red-500/30 dark:text-red-400",
    dotClass: "bg-red-500",
  },
  erro: {
    label: "Erro",
    icon: AlertCircle,
    badgeClass:
      "bg-red-600/10 text-red-700 border-red-600/30 dark:text-red-400",
    dotClass: "bg-red-600",
  },
};

// ─────────────────────────────────────────────────────────────
// Estados visuais
// ─────────────────────────────────────────────────────────────

const ResultsSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            <div className="h-6 bg-muted rounded w-24" />
          </div>
          <div className="space-y-2 pt-3 border-t">
            <div className="h-16 bg-muted/50 rounded" />
            <div className="h-16 bg-muted/50 rounded" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Erro ao carregar horários</AlertTitle>
    <AlertDescription className="mt-2 space-y-3">
      <p>
        Não foi possível carregar os horários disponíveis para importação. Isso
        pode ter ocorrido devido a um problema de conexão ou erro no servidor.
      </p>
      <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </AlertDescription>
  </Alert>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="rounded-full bg-muted p-6 mb-4">
      <CalendarX2 className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">Nenhum horário encontrado</h3>
    <p className="text-sm text-muted-foreground max-w-md">
      Não existem horários disponíveis para importação com os filtros
      seleccionados.
    </p>
  </div>
);

const IdleState = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-muted-foreground">
    <Search className="h-10 w-10 mb-4 opacity-50" />
    <p className="font-medium">Seleccione os filtros e pesquise</p>
    <p className="text-sm max-w-md">
      Escolha o ano lectivo de origem, o ano de destino, o curso, a classe, o
      semestre e o período para carregar os horários disponíveis para
      importação.
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getDiasComTempos(aulas: Aulas) {
  return DIAS_SEMANA.map((dia) => ({
    label: dia.label,
    tempos: aulas[dia.key]?.tempos ?? [],
  })).filter((dia) => dia.tempos.length > 0);
}

function contarTempos(horario: HorarioImportacao) {
  return getDiasComTempos(horario.aulas).reduce(
    (total, dia) => total + dia.tempos.length,
    0,
  );
}

function DisciplinaHorariosCard({
  disciplina,
  selected,
  onToggleHorario,
  onToggleAll,
}: {
  disciplina: ImportScheduleItem;
  selected: Set<number>;
  onToggleHorario: (id: number) => void;
  onToggleAll: (horarios: HorarioImportacao[]) => void;
}) {
  const selecionados = disciplina.horarios.filter((h) =>
    selected.has(h.horarioId),
  ).length;
  const todosSelecionados =
    disciplina.horarios.length > 0 &&
    selecionados === disciplina.horarios.length;

  return (
    <Card
      className={cn("overflow-hidden", !disciplina.encontrado && "opacity-70")}
    >
      <CardContent className="p-6 space-y-4">
        {/* Cabeçalho da disciplina */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg">{disciplina.disciplina}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                Grade:{" "}
                <span className="font-mono text-foreground">
                  {disciplina.gradeCurricularId}
                </span>
              </span>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1.5 text-sm">
            {disciplina.horarios.length} horário
            {disciplina.horarios.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {!disciplina.encontrado && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Esta disciplina não foi encontrada na grade curricular do ano
              lectivo de destino. Os horários abaixo não podem ser
              seleccionados.
            </AlertDescription>
          </Alert>
        )}

        {/* Selecionar todos os horários desta disciplina */}
        <div className="flex items-center justify-between pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 -ml-2 text-xs"
            disabled={!disciplina.encontrado}
            onClick={() => onToggleAll(disciplina.horarios)}
          >
            {todosSelecionados ? (
              <Square className="h-3.5 w-3.5 mr-1.5" />
            ) : (
              <CheckSquare className="h-3.5 w-3.5 mr-1.5" />
            )}
            {todosSelecionados
              ? "Desmarcar todos"
              : "Seleccionar todos os horários"}
          </Button>
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              {selecionados}
            </span>{" "}
            de {disciplina.horarios.length} seleccionado
            {disciplina.horarios.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Lista de horários */}
        <div className="grid gap-3">
          {disciplina.horarios.map((horario, index) => {
            const isSelected = selected.has(horario.horarioId);
            const diasComTempos = getDiasComTempos(horario.aulas);
            const disabled = !disciplina.encontrado;

            return (
              <div
                key={horario.horarioId}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border bg-muted/20 transition-colors",
                  disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                  isSelected
                    ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                    : !disabled && "hover:border-primary/40",
                )}
                onClick={() => !disabled && onToggleHorario(horario.horarioId)}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={disabled}
                  onCheckedChange={() => onToggleHorario(horario.horarioId)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {horario.designacao || `Horário ${index + 1}`}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {contarTempos(horario)} tempo
                      {contarTempos(horario) !== 1 ? "s" : ""}
                    </Badge>
                  </div>

                  {/* Dias/tempos */}
                  <div className="grid gap-1.5 pt-1">
                    {diasComTempos.map((dia) => (
                      <div
                        key={dia.label}
                        className="flex flex-wrap items-center gap-2.5 bg-background/60 rounded-md px-2.5 py-2"
                      >
                        <div className="flex items-center gap-1.5 min-w-[110px] text-xs font-medium">
                          <CalendarDays className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span>{dia.label}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {dia.tempos.map((tempo, tempoIndex) => (
                            <span
                              key={tempoIndex}
                              className="flex items-center gap-1 text-xs bg-muted rounded-full px-2.5 py-1"
                            >
                              <Clock className="h-3 w-3 text-primary" />
                              {tempo.horaInicio} às {tempo.horaTermino}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// Modal de resultado da importação
// ─────────────────────────────────────────────────────────────

function ImportResultSummaryCard({
  label,
  value,
  icon: Icon,
  className,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: typeof CheckCircle2;
  className?: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-colors",
        active ? "border-primary bg-primary/5" : "hover:border-primary/40",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1.5 text-xs font-medium",
          className,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
    </button>
  );
}

function ImportResultDialog({
  result,
  open,
  onOpenChange,
}: {
  result: ImportResultResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<
    "todos" | ImportResultStatus
  >("todos");

  const filteredDetalhes = useMemo(() => {
    if (!result) return [];
    if (statusFilter === "todos") return result.detalhes;
    return result.detalhes.filter((d) => d.status === statusFilter);
  }, [result, statusFilter]);

  if (!result) return null;

  const taxaSucesso =
    result.totalProcessados > 0
      ? Math.round((result.totalInseridos / result.totalProcessados) * 100)
      : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStatusFilter("todos");
      }}
    >
      <DialogContent className="max-w-4xl!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            Resultado da Importação
          </DialogTitle>
          <DialogDescription>
            {result.totalInseridos} de {result.totalProcessados} horário
            {result.totalProcessados !== 1 ? "s" : ""} importado
            {result.totalInseridos !== 1 ? "s" : ""} com sucesso ({taxaSucesso}
            %).
          </DialogDescription>
        </DialogHeader>

        {/* Barra de progresso */}
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              taxaSucesso === 100
                ? "bg-emerald-500"
                : taxaSucesso === 0
                  ? "bg-red-500"
                  : "bg-amber-500",
            )}
            style={{ width: `${taxaSucesso}%` }}
          />
        </div>

        {/* Cards de resumo (clicáveis para filtrar) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <ImportResultSummaryCard
            label="Processados"
            value={result.totalProcessados}
            icon={ClipboardList}
            className="text-foreground"
            active={statusFilter === "todos"}
            onClick={() => setStatusFilter("todos")}
          />
          <ImportResultSummaryCard
            label="Inseridos"
            value={result.totalInseridos}
            icon={CheckCircle2}
            className="text-emerald-600 dark:text-emerald-400"
            active={statusFilter === "inserido"}
            onClick={() => setStatusFilter("inserido")}
          />
          <ImportResultSummaryCard
            label="Colisão Parcial"
            value={result.totalColisaoParcial}
            icon={AlertTriangle}
            className="text-amber-600 dark:text-amber-400"
            active={statusFilter === "colisao_parcial"}
            onClick={() => setStatusFilter("colisao_parcial")}
          />
          <ImportResultSummaryCard
            label="Colisão Total"
            value={result.totalColisaoTotal}
            icon={XCircle}
            className="text-red-600 dark:text-red-400"
            active={statusFilter === "colisao_total"}
            onClick={() => setStatusFilter("colisao_total")}
          />
          <ImportResultSummaryCard
            label="Erros"
            value={result.totalErros}
            icon={AlertCircle}
            className="text-red-700 dark:text-red-400"
            active={statusFilter === "erro"}
            onClick={() => setStatusFilter("erro")}
          />
        </div>

        {/* Lista detalhada */}
        <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 -mr-1">
          {filteredDetalhes.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum item para este filtro.
            </p>
          ) : (
            filteredDetalhes.map((item) => {
              const config = STATUS_CONFIG[item.status];
              const Icon = config.icon;
              return (
                <div
                  key={item.scheduleId}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <span
                    className={cn(
                      "mt-1 h-2 w-2 shrink-0 rounded-full",
                      config.dotClass,
                    )}
                  />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {item.designacaoOrigem}
                        {item.designacaoDestino &&
                          item.designacaoDestino !== item.designacaoOrigem && (
                            <span className="text-muted-foreground">
                              {" "}
                              → {item.designacaoDestino}
                            </span>
                          )}
                      </p>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1 text-xs shrink-0",
                          config.badgeClass,
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </div>

                    {(item.diasInseridos.length > 0 ||
                      item.diasColididos.length > 0) && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.diasInseridos.map((dia) => (
                          <span
                            key={`ins-${dia}`}
                            className="text-xs rounded-full px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          >
                            {DIA_LABEL_BY_NUMBER[dia] ?? dia}
                          </span>
                        ))}
                        {item.diasColididos.map((dia) => (
                          <span
                            key={`col-${dia}`}
                            className="text-xs rounded-full px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400"
                          >
                            {DIA_LABEL_BY_NUMBER[dia] ?? dia}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.mensagem && (
                      <p className="text-xs text-muted-foreground">
                        {item.mensagem}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────

export function ImportSchedules() {
  const [filters, setFilters] = useState<ImportFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);
  const [hasColision, setHasCosilion] = useState<boolean>(false);

  const [importResult, setImportResult] = useState<ImportResultResponse | null>(
    null,
  );
  const [resultDialogOpen, setResultDialogOpen] = useState(false);

  const { mutateAsync: importSchedulesService } = useCreateImportSchedules();
  const filtrosCompletos =
    !!filters.fkanoLectivoOrigem &&
    !!filters.fkanoLectivoDestino &&
    !!filters.fkCurso &&
    !!filters.fkClasse &&
    !!filters.fksemestre &&
    !!filters.fkperiodo;

  const queryParams: ImportSchedulesParams = {
    fkanoLectivoOrigem: filters.fkanoLectivoOrigem ?? 0,
    fkanoLectivoDestino: filters.fkanoLectivoDestino ?? 0,
    fkCurso: filters.fkCurso ?? 0,
    fkClasse: filters.fkClasse ?? 0,
    fksemestre: filters.fksemestre ?? 0,
    fkperiodo: filters.fkperiodo ?? 0,
  };

  const {
    data = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQueryImportSchedules(queryParams, hasSearched);

  const loading = hasSearched && (isLoading || isFetching);

  const runSearch = () => {
    if (!filtrosCompletos) {
      toast.warning(
        "Seleccione o ano de origem, o ano de destino, o curso, a classe, o semestre e o período.",
      );
      return;
    }
    if (filters.fkanoLectivoOrigem === filters.fkanoLectivoDestino) {
      toast.warning("O ano de origem e o ano de destino devem ser diferentes.");
      return;
    }

    setSelected(new Set());
    if (hasSearched) {
      refetch();
    } else {
      setHasSearched(true);
    }
  };

  const totalHorarios = useMemo(
    () => data.reduce((total, d) => total + d.horarios.length, 0),
    [data],
  );

  const handleToggleHorario = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleToggleAllDisciplina = (horarios: HorarioImportacao[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const todosSelecionados = horarios.every((h) => next.has(h.horarioId));
      horarios.forEach((h) =>
        todosSelecionados ? next.delete(h.horarioId) : next.add(h.horarioId),
      );
      return next;
    });
  };

  const handleCancelarSelecao = () => {
    setSelected(new Set());
  };

  const handleImport = async () => {
    if (selected.size === 0) {
      toast.warning("Seleccione pelo menos um horário para importar.");
      return;
    }
    if (!filters.fkanoLectivoDestino) return;

    setIsImporting(true);
    try {
      const schedulesImported = Array.from(selected).map((a) => {
        return {
          scheduleId: a,
        };
      });

      const result = (await importSchedulesService({
        fkanoLectivoDestino: filters.fkanoLectivoDestino,
        schedulesImported: schedulesImported,
        permitiColisao: hasColision,
      })) as ImportResultResponse;

      setImportResult(result);
      setResultDialogOpen(true);
      setSelected(new Set());
      refetch();
    } catch {
      toast.error("Ocorreu um erro ao importar os horários. Tente novamente.");
    } finally {
      setIsImporting(false);
    }
  };

  const mostrarBarraResumo =
    hasSearched && !loading && !isError && data.length > 0;

  return (
    <div className={cn("space-y-6", mostrarBarraResumo && "pb-24")}>
      <div>
        <h1 className="text-2xl font-bold">Importação de Horários</h1>
        <p className="text-sm text-muted-foreground">
          Importe horários de um ano lectivo para outro.
        </p>
      </div>

      <div className="space-y-6">
        {/* Filtros */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex w-full justify-between">
              <CardTitle>Filtros</CardTitle>
              <div className="flex space-x-1">
                <Badge variant="destructive" className="text-sm ">
                  Permitir Colisão
                </Badge>
                <Switch
                  checked={hasColision}
                  onCheckedChange={(v) => setHasCosilion(v)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              <TipoCandidaturaSelect
                value={filters.tipoCandidatura?.toString()}
                onChangeValue={(v) =>
                  setFilters((f) => ({ ...f, fkanoLectivoOrigem: Number(v) }))
                }
              />
              <AcademicYearsAvailableForOperationSelect
                tipoCandidaturaId={filters.tipoCandidatura}
                onlyConfigurable={false}
                label="Ano Lectivo Origem"
                value={filters.fkanoLectivoOrigem?.toString()}
                onChangeValue={(v) =>
                  setFilters((f) => ({ ...f, fkanoLectivoOrigem: Number(v) }))
                }
              />
              <AcademicYearsAvailableForOperationSelect
                onlyConfigurable
                tipoCandidaturaId={filters.tipoCandidatura}
                label="Ano Lectivo Destino"
                value={filters.fkanoLectivoDestino?.toString()}
                onChangeValue={(v) =>
                  setFilters((f) => ({ ...f, fkanoLectivoDestino: Number(v) }))
                }
              />

              <div>
                <CourseSelect
                  value={filters.fkCurso?.toString()}
                  onChangeValue={(v) =>
                    setFilters((f) => ({ ...f, fkCurso: Number(v) }))
                  }
                />
              </div>

              <div>
                <AnoCurricularSelect
                  value={filters.fkClasse?.toString()}
                  onChangeValue={(v) =>
                    setFilters((f) => ({ ...f, fkClasse: Number(v) }))
                  }
                  curso={filters.fkCurso?.toString()}
                />
              </div>

              <div>
                <SemestreSelect
                  value={filters.fksemestre?.toString()}
                  onChangeValue={(v) =>
                    setFilters((f) => ({ ...f, fksemestre: Number(v) }))
                  }
                />
              </div>

              <div>
                <PeriodoSelect
                  value={filters.fkperiodo?.toString()}
                  onChangeValue={(v) =>
                    setFilters((f) => ({ ...f, fkperiodo: Number(v) }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={runSearch} disabled={loading} className="gap-2">
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Pesquisar Horários
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        {!hasSearched ? (
          <IdleState />
        ) : loading ? (
          <ResultsSkeleton />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {data.map((disciplina) => (
              <DisciplinaHorariosCard
                key={disciplina.gradeCurricularId}
                disciplina={disciplina}
                selected={selected}
                onToggleHorario={handleToggleHorario}
                onToggleAll={handleToggleAllDisciplina}
              />
            ))}
          </div>
        )}
      </div>

      {/* Barra de resumo fixa no rodapé */}
      {mostrarBarraResumo && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background/95 backdrop-blur px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-6 text-sm">
              <span className="text-muted-foreground">
                Encontrados: <b className="text-foreground">{totalHorarios}</b>
              </span>
              <span className="text-muted-foreground">
                Seleccionados: <b className="text-primary">{selected.size}</b>
              </span>
              {filters.fkanoLectivoOrigem && filters.fkanoLectivoDestino && (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  {filters.fkanoLectivoOrigem} → {filters.fkanoLectivoDestino}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelarSelecao}
                disabled={selected.size === 0}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleImport}
                disabled={isImporting || selected.size === 0}
                className="gap-2"
              >
                {isImporting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isImporting
                  ? "A importar..."
                  : `Importar Horários${
                      selected.size > 0 ? ` (${selected.size})` : ""
                    }`}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ImportResultDialog
        result={importResult}
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
      />
    </div>
  );
}
