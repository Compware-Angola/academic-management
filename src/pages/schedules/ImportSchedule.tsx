import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Clock,
  MapPin,
  CalendarDays,
  User,
  Search,
  Loader2,
  AlertCircle,
  CalendarX2,
  CheckSquare,
  Square,
  ArrowRightLeft,
  RefreshCw,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { useCursos } from "@/hooks/use-cursos"; // ajusta o path real

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface TempoAula {
  diaSemana: string;
  horaInicio: string;
  horaTermino: string;
  sala: string;
  tipoAula: string;
}

export interface HorarioParaImportar {
  codigo: number;
  designacao?: string;
  modalidade: string;
  docente?: string;
  tempos: TempoAula[];
}

export interface DisciplinaComHorarios {
  codigoGradeCurricular: number;
  disciplina: string;
  curso: string;
  semestre: string;
  horarios: HorarioParaImportar[];
}

interface ImportSchedulesFilters {
  anoLectivoOrigem?: number;
  anoLectivoDestino?: number;
  semestre?: number;
  curso?: number;
  periodo?: number;
}

const SEMESTRE_OPTIONS = [
  { value: 1, label: "1º Semestre" },
  { value: 2, label: "2º Semestre" },
];

const PERIODO_OPTIONS = [
  { value: 1, label: "Manhã" },
  { value: 2, label: "Tarde" },
  { value: 3, label: "Noite" },
];

// ─────────────────────────────────────────────────────────────
// Dados mockados — remover quando o endpoint real estiver pronto
// ─────────────────────────────────────────────────────────────

const MOCK_DISCIPLINAS: DisciplinaComHorarios[] = [
  {
    codigoGradeCurricular: 1001,
    disciplina: "Programação II",
    curso: "Engenharia Informática",
    semestre: "1º Semestre",
    horarios: [
      {
        codigo: 5001,
        designacao: "TUR.1.MDS-H1",
        modalidade: "Presencial",
        docente: "Eng. João Kiala",
        tempos: [
          {
            diaSemana: "Segunda-feira",
            horaInicio: "08:00",
            horaTermino: "10:00",
            sala: "Sala 12",
            tipoAula: "Teórica",
          },
          {
            diaSemana: "Quarta-feira",
            horaInicio: "10:00",
            horaTermino: "12:00",
            sala: "Lab 03",
            tipoAula: "Prática",
          },
        ],
      },
      {
        codigo: 5002,
        designacao: "TUR.1.MDS-H3",
        modalidade: "Presencial",
        docente: "Eng.ª Marta Sousa",
        tempos: [
          {
            diaSemana: "Terça-feira",
            horaInicio: "14:00",
            horaTermino: "16:00",
            sala: "Sala 07",
            tipoAula: "Teórica",
          },
        ],
      },
    ],
  },
  {
    codigoGradeCurricular: 1002,
    disciplina: "Base de Dados",
    curso: "Engenharia Informática",
    semestre: "1º Semestre",
    horarios: [
      {
        codigo: 5003,
        designacao: "TUR.1.MDS-H2",
        modalidade: "Presencial",
        docente: "Dr. Paulo Neto",
        tempos: [
          {
            diaSemana: "Quinta-feira",
            horaInicio: "08:00",
            horaTermino: "10:00",
            sala: "Sala 05",
            tipoAula: "Teórica",
          },
          {
            diaSemana: "Sexta-feira",
            horaInicio: "10:00",
            horaTermino: "12:00",
            sala: "Lab 01",
            tipoAula: "Prática",
          },
        ],
      },
    ],
  },
  {
    codigoGradeCurricular: 1003,
    disciplina: "Contabilidade Geral",
    curso: "Gestão de Empresas",
    semestre: "2º Semestre",
    horarios: [
      {
        codigo: 5004,
        designacao: "TUR.1.MDS-H1",
        modalidade: "Presencial",
        docente: "Dra. Alzira Fortes",
        tempos: [
          {
            diaSemana: "Segunda-feira",
            horaInicio: "18:00",
            horaTermino: "20:00",
            sala: "Sala 21",
            tipoAula: "Teórica",
          },
        ],
      },
      {
        codigo: 5005,
        designacao: "TUR.1.MDS-H3",
        modalidade: "À distância",
        docente: "Dr. Manuel Bumba",
        tempos: [
          {
            diaSemana: "Quarta-feira",
            horaInicio: "18:00",
            horaTermino: "20:00",
            sala: "Sala Virtual 2",
            tipoAula: "Teórica",
          },
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Serviço — ajustar para o service real do projecto
// ─────────────────────────────────────────────────────────────

async function getSchedulesToImportService(
  filters: Required<
    Pick<ImportSchedulesFilters, "anoLectivoOrigem" | "curso">
  > &
    ImportSchedulesFilters,
): Promise<DisciplinaComHorarios[]> {
  // Simula latência de rede com dados mockados.
  // Trocar por chamada real assim que o endpoint estiver disponível:
  //
  // const params = new URLSearchParams();
  // Object.entries(filters).forEach(([key, value]) => {
  //   if (value !== undefined) params.append(key, String(value));
  // });
  // const response = await fetch(`/api/schedules/import-candidates?${params}`);
  // if (!response.ok) throw new Error("Falha ao carregar horários");
  // return response.json();

  await new Promise((resolve) => setTimeout(resolve, 600));

  return MOCK_DISCIPLINAS.filter((d) =>
    filters.semestre
      ? d.semestre ===
        SEMESTRE_OPTIONS.find((s) => s.value === filters.semestre)?.label
      : true,
  );
}

async function importSchedulesService(payload: {
  anoLectivoDestino: number;
  codigosHorarios: number[];
}): Promise<void> {
  // Mock: substituir pela chamada real ao endpoint de importação.
  //
  // const response = await fetch("/api/schedules/import", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error("Falha ao importar horários");

  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Importando horários (mock):", payload);
}

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
      Escolha o ano lectivo de origem, o ano de destino e o curso para carregar
      os horários disponíveis para importação.
    </p>
  </div>
);

function DisciplinaHorariosCard({
  disciplina,
  selected,
  onToggleHorario,
  onToggleAll,
}: {
  disciplina: DisciplinaComHorarios;
  selected: Set<number>;
  onToggleHorario: (codigo: number) => void;
  onToggleAll: (horarios: HorarioParaImportar[]) => void;
}) {
  const selecionados = disciplina.horarios.filter((h) =>
    selected.has(h.codigo),
  ).length;
  const todosSelecionados =
    disciplina.horarios.length > 0 &&
    selecionados === disciplina.horarios.length;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        {/* Cabeçalho da disciplina */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg">{disciplina.disciplina}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>
                Grade:{" "}
                <span className="font-mono text-foreground">
                  {disciplina.codigoGradeCurricular}
                </span>
              </span>
              <span>
                Curso:{" "}
                <span className="text-foreground">{disciplina.curso}</span>
              </span>
              <span>
                Semestre:{" "}
                <span className="text-foreground">{disciplina.semestre}</span>
              </span>
            </div>
          </div>
          <Badge variant="outline" className="px-3 py-1.5 text-sm">
            {disciplina.horarios.length} horário
            {disciplina.horarios.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Selecionar todos os horários desta disciplina */}
        <div className="flex items-center justify-between pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 -ml-2 text-xs"
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
            const isSelected = selected.has(horario.codigo);
            return (
              <div
                key={horario.codigo}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border bg-muted/20 cursor-pointer transition-colors",
                  isSelected
                    ? "border-primary ring-1 ring-primary/30 bg-primary/5"
                    : "hover:border-primary/40",
                )}
                onClick={() => onToggleHorario(horario.codigo)}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleHorario(horario.codigo)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold">
                      {horario.designacao || `Horário ${index + 1}`}
                    </p>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        {horario.modalidade}
                      </Badge>
                      {horario.docente && (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="h-3.5 w-3.5" />
                          {horario.docente}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tempos (um horário pode ter mais de um dia/hora/sala) */}
                  <div className="grid gap-1.5 pt-1">
                    {horario.tempos.map((tempo, tempoIndex) => (
                      <div
                        key={tempoIndex}
                        className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs bg-background/60 rounded-md px-2.5 py-1.5"
                      >
                        <div className="flex items-center gap-1.5 min-w-[110px]">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          <span className="font-medium">{tempo.diaSemana}</span>
                        </div>
                        <div className="flex items-center gap-1.5 min-w-[120px]">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          <span>
                            {tempo.horaInicio} às {tempo.horaTermino}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{tempo.sala}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] ml-auto"
                        >
                          {tempo.tipoAula}
                        </Badge>
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

export function ImportSchedules() {
  const [filters, setFilters] = useState<ImportSchedulesFilters>({});
  const [searchedFilters, setSearchedFilters] =
    useState<ImportSchedulesFilters | null>(null);

  const [data, setData] = useState<DisciplinaComHorarios[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isImporting, setIsImporting] = useState(false);

  const { data: cursos, isLoading: loadingCursos } = useCursos();

  const filtrosCompletos =
    !!filters.anoLectivoOrigem &&
    !!filters.anoLectivoDestino &&
    !!filters.curso;

  const runSearch = async () => {
    if (!filtrosCompletos) {
      toast.warning("Seleccione o ano de origem, o ano de destino e o curso.");
      return;
    }
    if (filters.anoLectivoOrigem === filters.anoLectivoDestino) {
      toast.warning("O ano de origem e o ano de destino devem ser diferentes.");
      return;
    }

    setIsLoading(true);
    setIsError(false);
    setSearchedFilters(filters);

    try {
      const result = await getSchedulesToImportService(
        filters as Required<
          Pick<ImportSchedulesFilters, "anoLectivoOrigem" | "curso">
        > &
          ImportSchedulesFilters,
      );
      setData(result);
      setSelected(new Set());
    } catch {
      setIsError(true);
      toast.error("Erro ao carregar horários");
    } finally {
      setIsLoading(false);
    }
  };

  const totalHorarios = useMemo(
    () => data.reduce((total, d) => total + d.horarios.length, 0),
    [data],
  );

  const handleToggleHorario = (codigo: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(codigo) ? next.delete(codigo) : next.add(codigo);
      return next;
    });
  };

  const handleToggleAllDisciplina = (horarios: HorarioParaImportar[]) => {
    setSelected((prev) => {
      const next = new Set(prev);
      const todosSelecionados = horarios.every((h) => next.has(h.codigo));
      horarios.forEach((h) =>
        todosSelecionados ? next.delete(h.codigo) : next.add(h.codigo),
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
    if (!filters.anoLectivoDestino) return;

    setIsImporting(true);
    try {
      await importSchedulesService({
        anoLectivoDestino: filters.anoLectivoDestino,
        codigosHorarios: Array.from(selected),
      });
      toast.success(
        `${selected.size} horário${selected.size !== 1 ? "s" : ""} importado${
          selected.size !== 1 ? "s" : ""
        } com sucesso!`,
      );
      setSelected(new Set());
      runSearch();
    } catch {
      toast.error("Ocorreu um erro ao importar os horários. Tente novamente.");
    } finally {
      setIsImporting(false);
    }
  };

  const mostrarBarraResumo =
    !!searchedFilters && !isLoading && !isError && data.length > 0;

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
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
              <AcademicYearsAvailableForOperationSelect
                onlyConfigurable={false}
                label="Ano Lectivo Origem"
                value={filters.anoLectivoOrigem?.toString()}
                onChangeValue={(v) =>
                  setFilters((f) => ({ ...f, anoLectivoOrigem: Number(v) }))
                }
              />
              <AcademicYearsAvailableForOperationSelect
                onlyConfigurable
                label="Ano Lectivo Destino"
                value={filters.anoLectivoDestino?.toString()}
                onChangeValue={(v) =>
                  setFilters((f) => ({ ...f, anoLectivoDestino: Number(v) }))
                }
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Curso</label>
                <Select
                  value={filters.curso ? String(filters.curso) : undefined}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, curso: Number(v) }))
                  }
                  disabled={loadingCursos}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {cursos?.map((c) => (
                      <SelectItem key={c.codigo} value={String(c.codigo)}>
                        {c.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Semestre
                </label>
                <Select
                  value={
                    filters.semestre ? String(filters.semestre) : undefined
                  }
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, semestre: Number(v) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SEMESTRE_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={String(s.value)}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Período
                </label>
                <Select
                  value={filters.periodo ? String(filters.periodo) : undefined}
                  onValueChange={(v) =>
                    setFilters((f) => ({ ...f, periodo: Number(v) }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODO_OPTIONS.map((p) => (
                      <SelectItem key={p.value} value={String(p.value)}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={runSearch}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
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
        {!searchedFilters ? (
          <IdleState />
        ) : isLoading ? (
          <ResultsSkeleton />
        ) : isError ? (
          <ErrorState onRetry={runSearch} />
        ) : data.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {data.map((disciplina) => (
              <DisciplinaHorariosCard
                key={disciplina.codigoGradeCurricular}
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
              {filters.anoLectivoOrigem && filters.anoLectivoDestino && (
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <ArrowRightLeft className="h-3.5 w-3.5" />
                  {filters.anoLectivoOrigem} → {filters.anoLectivoDestino}
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
    </div>
  );
}
