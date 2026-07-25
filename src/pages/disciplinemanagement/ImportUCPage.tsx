import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PartyPopper,
  Download,
  FilterX,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGradeCurricular } from "@/hooks/use-grade-curricular";
import { useCursos } from "@/hooks/use-cursos";
import { useClasses } from "@/hooks/use-classes";
import { GradeCurricularItem } from "@/services/fetch-gradeCurricularService";
import {
  AddGradeCurricularPlanoMassaPayload,
  AddGradeCurricularPlanoMassaResponse,
} from "@/services/disciplina/add-grade-curricular-plano-massa.service";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { useAddGradeCurricularPlanoMassa } from "@/hooks/discplina/use-add-grade-curricular-plano-massa";

interface ImportUCPageProps {
  onSuccess?: () => void;
}

type EditableField =
  | "peso_primeira_freq"
  | "peso_segunda_freq"
  | "peso_pratica"
  | "nota_min_primeira_freq"
  | "nota_min_segunda_freq"
  | "nota_min_pratica";

type FieldOverrides = Partial<Record<EditableField, number | undefined>>;

const MAX_TOTAL_PESO = 101;
const PESO_FIELDS: EditableField[] = [
  "peso_primeira_freq",
  "peso_segunda_freq",
  "peso_pratica",
];

const statusBadge = (status: number) => {
  const map: Record<number, string> = {
    1: "bg-success/10 text-success border-success/20",
    0: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={map[status] ?? map[0]}>
      {status === 1 ? "Activa" : "Inactiva"}
    </Badge>
  );
};

function getSomaPesos(merged: Partial<GradeCurricularItem>) {
  return (
    (merged.peso_primeira_freq ?? 0) +
    (merged.peso_segunda_freq ?? 0) +
    (merged.peso_pratica ?? 0)
  );
}

// 1ª e 2ª frequência são obrigatórias e a soma dos pesos nunca pode atingir 150%
function getItemValidationError(
  merged: Partial<GradeCurricularItem>,
): string | null {
  if (merged.peso_primeira_freq == null || merged.peso_segunda_freq == null) {
    return "1ª e 2ª frequência são obrigatórias";
  }
  if (getSomaPesos(merged) >= MAX_TOTAL_PESO) {
    return `A soma dos pesos não pode atingir ${MAX_TOTAL_PESO}%`;
  }
  return null;
}

function NumberField({
  label,
  value,
  onChange,
  required,
  invalid,
}: {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  required?: boolean;
  invalid?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </p>
      <Input
        type="number"
        inputMode="decimal"
        placeholder="—"
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? undefined : Number(raw));
        }}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "h-8 mt-0.5",
          invalid && "border-destructive focus-visible:ring-destructive",
        )}
      />
    </div>
  );
}

function DisciplinaImportCard({
  item,
  selected,
  onToggle,
  overrides,
  onFieldChange,
}: {
  item: GradeCurricularItem;
  selected: boolean;
  onToggle: () => void;
  overrides: FieldOverrides;
  onFieldChange: (field: EditableField, value: number | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  // Valores efectivos = item original, sobrepostos pelo que o utilizador editou
  const merged = { ...item, ...overrides };
  const somaPesos = getSomaPesos(merged);
  const validationError = getItemValidationError(merged);

  return (
    <Card
      className={cn(
        "p-4 transition-all hover:shadow-md cursor-pointer",
        selected && "border-primary ring-1 ring-primary/30",
        selected &&
          validationError &&
          "border-destructive ring-1 ring-destructive/30",
      )}
      onClick={onToggle}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={selected}
          onCheckedChange={onToggle}
          onClick={(e) => e.stopPropagation()}
          className="mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <h3 className="text-base font-semibold truncate">
                  {item.descricao_disciplina}
                </h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  Curso:{" "}
                  <span className="text-foreground">
                    {item.descricao_curso}
                  </span>
                </span>
                <span>
                  Classe:{" "}
                  <span className="text-foreground">
                    {item.descricao_classe}
                  </span>
                </span>
                <span>Semestre: {item.designacao_semestre}</span>
                <span>
                  Grade:{" "}
                  <span className="font-mono">
                    {item.codigo_grade_curricular}
                  </span>
                </span>
              </div>
            </div>
            {statusBadge(item.status)}
          </div>

          {selected && validationError && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {validationError}
            </div>
          )}

          <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 -ml-2 text-xs"
                onClick={(e) => e.stopPropagation()}
              >
                {open ? (
                  <ChevronDown className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 mr-1" />
                )}
                {open ? "Ocultar" : "Mostrar"} pesos e notas mínimas
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent
              className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rounded-md border p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Pesos
                  </p>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      somaPesos === 100
                        ? "text-success"
                        : somaPesos >= MAX_TOTAL_PESO
                          ? "text-destructive"
                          : "text-amber-600",
                    )}
                  >
                    Total: {somaPesos}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <NumberField
                    label="1ª Freq."
                    value={merged.peso_primeira_freq}
                    onChange={(v) => onFieldChange("peso_primeira_freq", v)}
                    required
                    invalid={merged.peso_primeira_freq == null}
                  />
                  <NumberField
                    label="2ª Freq."
                    value={merged.peso_segunda_freq}
                    onChange={(v) => onFieldChange("peso_segunda_freq", v)}
                    required
                    invalid={merged.peso_segunda_freq == null}
                  />
                  <NumberField
                    label="Prática"
                    value={merged.peso_pratica}
                    onChange={(v) => onFieldChange("peso_pratica", v)}
                  />
                </div>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Notas mínimas
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <NumberField
                    label="1ª Freq."
                    value={merged.nota_min_primeira_freq}
                    onChange={(v) => onFieldChange("nota_min_primeira_freq", v)}
                  />
                  <NumberField
                    label="2ª Freq."
                    value={merged.nota_min_segunda_freq}
                    onChange={(v) => onFieldChange("nota_min_segunda_freq", v)}
                  />
                  <NumberField
                    label="Prática"
                    value={merged.nota_min_pratica}
                    onChange={(v) => onFieldChange("nota_min_pratica", v)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
  );
}

function ImportResultDialog({
  open,
  onOpenChange,
  result,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: AddGradeCurricularPlanoMassaResponse | null;
}) {
  if (!result) return null;
  const allOk = result.totalErros === 0 && result.totalDuplicadas === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {allOk ? (
              <PartyPopper className="h-5 w-5 text-success" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            )}
            Resultado da importação
          </DialogTitle>
          <DialogDescription>{result.message}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-2">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold">{result.totalItens}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success/5 p-3 text-center">
            <p className="text-2xl font-bold text-success">
              {result.totalAdicionadas}
            </p>
            <p className="text-xs text-muted-foreground">Adicionadas</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {result.totalDuplicadas}
            </p>
            <p className="text-xs text-muted-foreground">Duplicadas</p>
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-center">
            <p className="text-2xl font-bold text-destructive">
              {result.totalErros}
            </p>
            <p className="text-xs text-muted-foreground">Erros</p>
          </div>
        </div>

        {result.duplicados.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-semibold">Disciplinas duplicadas</p>
            </div>
            <div className="space-y-1.5">
              {result.duplicados.map((d) => (
                <div
                  key={d.codigoGradeCurricular}
                  className="flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    Grade #{d.codigoGradeCurricular}
                  </span>
                  <span className="text-amber-700">{d.motivo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.erros.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <p className="text-sm font-semibold">Erros</p>
            </div>
            <div className="space-y-1.5">
              {result.erros.map((e) => (
                <div
                  key={e.codigoGradeCurricular}
                  className="flex items-center justify-between rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    Grade #{e.codigoGradeCurricular}
                  </span>
                  <span className="text-destructive">{e.motivo}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.adicionados.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <p className="text-sm font-semibold">Adicionadas com sucesso</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.adicionados.map((item) => (
                <Badge
                  key={item.codigoGradeCurricular}
                  variant="outline"
                  className="bg-success/5 text-success border-success/20 font-mono text-xs"
                >
                  #{item.codigoGradeCurricular}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ImportUCPage() {
  const [anoLectivo, setAnoLectivo] = useState<number>();
  const [anoLectivoDestino, setAnoLectivoDestino] = useState<number>();
  const [curso, setCurso] = useState<number>();
  const [classe, setClasse] = useState<number>();
  const [tipoCandidatura, setTipoCandidatura] = useState<number>();
  const estado = 1;

  const { data: cursos, isLoading: loadingCursos } = useCursos();
  const { data: classes, isLoading: loadingClasses } = useClasses();

  const filtrosCompletos = !!anoLectivo && !!curso;

  const {
    data: gradeResponse,
    isLoading,
    isError,
    refetch,
  } = useGradeCurricular({
    anoLectivo: anoLectivo as number,
    curso: curso as number,
    classe: classe as number,
    estado,
    page: 1,
    limit: 100,
  });

  const items = filtrosCompletos ? (gradeResponse?.data ?? []) : [];

  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [fieldOverrides, setFieldOverrides] = useState<
    Record<number, FieldOverrides>
  >({});
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [importResult, setImportResult] =
    useState<AddGradeCurricularPlanoMassaResponse | null>(null);

  const { mutateAsync: addPlanoMassa, isPending: isImporting } =
    useAddGradeCurricularPlanoMassa();

  useEffect(() => {
    if (items.length > 0) {
      setSelected(new Set(items.map((i) => i.codigo_disciplina)));
      setExpandedGroups(new Set(items.map((i) => i.codigo_classe)));

      const defaults: Record<number, FieldOverrides> = {};
      items.forEach((item) => {
        const overrides: FieldOverrides = {};
        if (item.peso_primeira_freq == null) overrides.peso_primeira_freq = 50;
        if (item.peso_segunda_freq == null) overrides.peso_segunda_freq = 50;
        if (Object.keys(overrides).length > 0) {
          defaults[item.codigo_disciplina] = overrides;
        }
      });
      setFieldOverrides(defaults);
    } else {
      setSelected(new Set());
      setFieldOverrides({});
    }
  }, [gradeResponse]);

  const grouped = useMemo(() => {
    const map = new Map<number, Map<number, GradeCurricularItem[]>>();
    for (const item of items) {
      if (!map.has(item.codigo_classe)) map.set(item.codigo_classe, new Map());
      const sem = map.get(item.codigo_classe)!;
      if (!sem.has(item.codigo_semestre)) sem.set(item.codigo_semestre, []);
      sem.get(item.codigo_semestre)!.push(item);
    }
    return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
  }, [items]);

  const toggleGroup = (codigoClasse: number) => {
    const s = new Set(expandedGroups);
    s.has(codigoClasse) ? s.delete(codigoClasse) : s.add(codigoClasse);
    setExpandedGroups(s);
  };

  const allSelected = items.length > 0 && selected.size === items.length;

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(items.map((i) => i.codigo_disciplina)),
    );

  const toggleOne = (codigo: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(codigo) ? next.delete(codigo) : next.add(codigo);
      return next;
    });

  const handleFieldChange = (
    codigo: number,
    field: EditableField,
    value: number | undefined,
  ) => {
    const item = items.find((i) => i.codigo_disciplina === codigo);

    if (item && (PESO_FIELDS as string[]).includes(field)) {
      const currentOverrides = fieldOverrides[codigo] ?? {};
      const merged = { ...item, ...currentOverrides };
      const others = PESO_FIELDS.filter((f) => f !== field).reduce(
        (sum, f) => sum + (merged[f] ?? 0),
        0,
      );

      if (value !== undefined && others + value >= MAX_TOTAL_PESO) {
        const clamped = Math.max(0, MAX_TOTAL_PESO - 1 - others);
        toast.warning(
          `A soma dos pesos não pode atingir ${MAX_TOTAL_PESO}%. Valor ajustado para ${clamped}%.`,
        );
        value = clamped;
      }
    }

    setFieldOverrides((prev) => ({
      ...prev,
      [codigo]: { ...prev[codigo], [field]: value },
    }));
  };

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.codigo_disciplina)),
    [items, selected],
  );

  const invalidSelectedItems = useMemo(
    () =>
      selectedItems.filter((item) => {
        const overrides = fieldOverrides[item.codigo_disciplina] ?? {};
        const merged = { ...item, ...overrides };
        return !!getItemValidationError(merged);
      }),
    [selectedItems, fieldOverrides],
  );

  const handleImport = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Selecione pelo menos uma disciplina para importar.");
      return;
    }
    if (!anoLectivoDestino) {
      toast.warning("Selecione o ano lectivo de destino.");
      return;
    }
    if (invalidSelectedItems.length > 0) {
      toast.error(
        `${invalidSelectedItems.length} disciplina(s) com pesos inválidos. Verifique a 1ª/2ª frequência e o total de pesos.`,
      );
      return;
    }

    try {
      const payload: AddGradeCurricularPlanoMassaPayload = {
        codigoCurso: curso as number,
        codigoAnoLectivo: anoLectivoDestino,
        itens: selectedItems.map((item) => {
          const overrides = fieldOverrides[item.codigo_disciplina] ?? {};
          const merged = { ...item, ...overrides };
          return {
            codigoGradeCurricular: item.codigo_grade_curricular,
            pesoPrimeiraFreq: merged.peso_primeira_freq as number,
            pesoSegundaFreq: merged.peso_segunda_freq as number,
            pesoPratica: merged.peso_pratica ?? 0,
            notaMinPrimeiraFreq: merged.nota_min_primeira_freq ?? 0,
            notaMinSegundaFreq: merged.nota_min_segunda_freq ?? 0,
            notaMinPratica: merged.nota_min_pratica ?? 0,
          };
        }),
      };

      const result = await addPlanoMassa(payload);
      setImportResult(result);
      setResultDialogOpen(true);
    } catch {}
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-xl font-bold">Importar Unidades Curriculares</h1>
        <p className="text-sm text-muted-foreground">
          Escolha o ano lectivo e o curso para carregar a grade curricular
          disponível para importação.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-lg border bg-card p-3">
        <div className="space-y-2">
          <TipoCandidaturaSelect
            value={tipoCandidatura?.toString()}
            onChangeValue={(v) => setTipoCandidatura(Number(v))}
          />
        </div>
        <div>
          <AcademicYearsAvailableForOperationSelect
            onlyConfigurable={false}
            onChangeValue={(v) => setAnoLectivo(Number(v))}
            value={anoLectivo?.toString()}
            tipoCandidaturaId={tipoCandidatura}
            label="Ano Letivo (Origem)"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Curso</label>
          <Select
            value={curso ? String(curso) : undefined}
            onValueChange={(v) => setCurso(Number(v))}
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
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary shrink-0">
          <ArrowRight className="h-4 w-4" />
          Destino da importação
        </div>
        <div className="flex-1 max-w-xs">
          <AcademicYearsAvailableForOperationSelect
            onlyConfigurable={false}
            onChangeValue={(v) => setAnoLectivoDestino(Number(v))}
            value={anoLectivoDestino?.toString()}
            tipoCandidaturaId={tipoCandidatura}
            label="Ano Lectivo (Destino)"
          />
        </div>
      </div>

      {!filtrosCompletos ? (
        <div className="flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
          <FilterX className="h-8 w-8 opacity-50" />
          <p className="font-medium">Selecione o ano lectivo e o curso</p>
          <p className="text-sm">
            A grade curricular é carregada automaticamente após a seleção.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            A carregar disciplinas...
          </p>
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <p className="text-sm text-muted-foreground">
            Erro ao carregar a grade curricular.
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : items.length === 0 ? (
        <Card className="p-12 text-center text-muted-foreground">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">Nenhuma disciplina encontrada</p>
          <p className="text-sm">
            Não há disciplinas na grade curricular para os filtros selecionados.
          </p>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card p-3">
            <Button variant="outline" size="sm" onClick={toggleAll}>
              {allSelected ? (
                <Square className="h-4 w-4 mr-2" />
              ) : (
                <CheckSquare className="h-4 w-4 mr-2" />
              )}
              {allSelected ? "Desmarcar todas" : "Selecionar todas"}
            </Button>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>
                <span className="font-semibold text-foreground">
                  {selected.size}
                </span>{" "}
                de {items.length} selecionada{items.length !== 1 ? "s" : ""}
              </span>
              {invalidSelectedItems.length > 0 && (
                <span className="flex items-center gap-1 font-medium text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {invalidSelectedItems.length} com pesos inválidos
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {[...grouped.entries()].map(([codigoClasse, semestres]) => {
              const totalClasse = [...semestres.values()].reduce(
                (s, arr) => s + arr.length,
                0,
              );
              const expanded = expandedGroups.has(codigoClasse);
              const nomeClasse =
                [...semestres.values()][0]?.[0]?.descricao_classe ??
                `Classe ${codigoClasse}`;

              return (
                <Card key={codigoClasse} className="overflow-hidden">
                  <button
                    onClick={() => toggleGroup(codigoClasse)}
                    className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {expanded ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <h2 className="text-base font-bold">{nomeClasse}</h2>
                      <Badge variant="secondary">
                        {totalClasse} disciplina{totalClasse !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </button>

                  {expanded && (
                    <div className="p-4 space-y-6">
                      {[...semestres.entries()].map(
                        ([codigoSemestre, list]) => (
                          <div key={codigoSemestre}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-1 w-8 rounded-full bg-primary" />
                              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                {list[0]?.designacao_semestre}
                              </h3>
                              <span className="text-xs text-muted-foreground">
                                ({list.length})
                              </span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                              {list.map((item) => (
                                <DisciplinaImportCard
                                  key={item.codigo_disciplina}
                                  item={item}
                                  selected={selected.has(
                                    item.codigo_disciplina,
                                  )}
                                  onToggle={() =>
                                    toggleOne(item.codigo_disciplina)
                                  }
                                  overrides={
                                    fieldOverrides[item.codigo_disciplina] ?? {}
                                  }
                                  onFieldChange={(field, value) =>
                                    handleFieldChange(
                                      item.codigo_disciplina,
                                      field,
                                      value,
                                    )
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}

      <div className="sticky bottom-0 flex justify-end gap-2 bg-background/95 backdrop-blur border-t pt-4 pb-2">
        <Button
          onClick={handleImport}
          disabled={
            isImporting ||
            isLoading ||
            items.length === 0 ||
            selected.size === 0 ||
            invalidSelectedItems.length > 0 ||
            !anoLectivoDestino
          }
        >
          {isImporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />A importar...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Importar {selected.size > 0 ? `(${selected.size})` : ""}
            </>
          )}
        </Button>
      </div>

      <ImportResultDialog
        open={resultDialogOpen}
        onOpenChange={setResultDialogOpen}
        result={importResult}
      />
    </div>
  );
}
