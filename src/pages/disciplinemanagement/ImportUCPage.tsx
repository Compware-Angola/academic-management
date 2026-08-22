import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  RefreshCw,
  X,
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
import { parseFilter } from "@/util/parse-filter";

interface ImportUCPageProps {
  onSuccess?: () => void;
}

type ItemOverrides = {
  temOral?: boolean;
  temPratica?: boolean;
};

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

function DisciplinaImportCard({
  item,
  selected,
  onToggle,
  overrides,
  onOverrideChange,
}: {
  item: GradeCurricularItem;
  selected: boolean;
  onToggle: () => void;
  overrides: ItemOverrides;
  onOverrideChange: (field: keyof ItemOverrides, value: boolean) => void;
}) {
  const temOral = overrides.temOral ?? Boolean(item.tem_oral);
  const temPratica = overrides.temPratica ?? Boolean(item.tem_pratica);

  return (
    <Card
      className={cn(
        "p-4 transition-all hover:shadow-md cursor-pointer",
        selected && "border-primary ring-1 ring-primary/30",
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

          <div
            className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <Switch
                id={`tem-oral-${item.codigo_grade_curricular}`}
                checked={temOral}
                onCheckedChange={(checked) =>
                  onOverrideChange("temOral", checked)
                }
              />
              <Label
                htmlFor={`tem-oral-${item.codigo_grade_curricular}`}
                className="text-xs cursor-pointer"
              >
                Ativar Oral
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id={`tem-pratica-${item.codigo_grade_curricular}`}
                checked={temPratica}
                onCheckedChange={(checked) =>
                  onOverrideChange("temPratica", checked)
                }
              />
              <Label
                htmlFor={`tem-pratica-${item.codigo_grade_curricular}`}
                className="text-xs cursor-pointer"
              >
                Ativar Prática
              </Label>
            </div>
          </div>
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
            <p className="text-xs text-muted-foreground">Ja existentes</p>
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
              <p className="text-sm font-semibold">Disciplinas Ja existentes</p>
            </div>
            <div className="space-y-1.5">
              {result.duplicados.map((d) => (
                <div
                  key={d.codigoGradeCurricular}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm transition-colors hover:bg-amber-500/10"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400">
                      #{d.codigoGradeCurricular}
                    </span>
                    {d.nomeDisciplina && (
                      <span className="truncate font-medium text-foreground">
                        {d.nomeDisciplina}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {d.motivo}
                  </span>
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
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-sm transition-colors hover:bg-amber-500/10"
                >
                  <div className="min-w-0 flex items-center gap-2">
                    <span className="shrink-0 rounded-md bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs text-amber-700 dark:text-amber-400">
                      #{e.codigoGradeCurricular}
                    </span>
                    {e.nomeDisciplina && (
                      <span className="truncate font-medium text-foreground">
                        {e.nomeDisciplina}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {e.motivo}
                  </span>
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
              <span className="text-xs text-muted-foreground">
                ({result.adicionados.length})
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {result.adicionados.map((item) => (
                <Badge
                  key={item.codigoGradeCurricular}
                  variant="outline"
                  className="gap-1.5 border-success/20 bg-success/5 font-normal text-success"
                >
                  <span className="font-mono text-xs">
                    #{item.codigoGradeCurricular}
                  </span>
                  {item.nomeDisciplina && (
                    <span className="text-xs">{item.nomeDisciplina}</span>
                  )}
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
  const [anoLectivo, setAnoLectivo] = useState<number | string>();
  const [anoLectivoDestino, setAnoLectivoDestino] = useState<number | string>();
  const [curso, setCurso] = useState<number | string>();
  const [classe, setClasse] = useState<number | string>();
  const [tipoCandidatura, setTipoCandidatura] = useState<number | string>();
  const estado = 1;

  const { data: cursos, isLoading: loadingCursos } = useCursos();


  const filtrosCompletos = !!anoLectivo && !!curso;

  const {
    data: gradeResponse,
    isLoading,
    isError,
    refetch,
  } = useGradeCurricular({
    anoLectivo: parseFilter(anoLectivo?.toString()),
    curso: parseFilter(curso?.toString()),
    classe: parseFilter(classe?.toString()),
    estado,
    page: 1,
    limit: 100,
  });

  const items = filtrosCompletos ? (gradeResponse?.data ?? []) : [];
  const resetState = () => {
    setSelected(new Set());
    setExpandedGroups(new Set());
    setItemOverrides({});
    setImportResult(null);
    setResultDialogOpen(false);
    refetch();
  };
  const clearAllFilters = () => {
    setAnoLectivo('');
    setAnoLectivoDestino('');
    setCurso('');
    setClasse('');
    setTipoCandidatura('');
    setSelected(new Set());
    setExpandedGroups(new Set());
    setItemOverrides({});
    setImportResult(null);
    setResultDialogOpen(false);
  };
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());
  const [itemOverrides, setItemOverrides] = useState<
    Record<number, ItemOverrides>
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
      setItemOverrides({});
    } else {
      setSelected(new Set());
      setItemOverrides({});
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

  const handleOverrideChange = (
    codigo: number,
    field: keyof ItemOverrides,
    value: boolean,
  ) => {
    setItemOverrides((prev) => ({
      ...prev,
      [codigo]: { ...prev[codigo], [field]: value },
    }));
  };

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.codigo_disciplina)),
    [items, selected],
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
    if (anoLectivoDestino === anoLectivo) {
      toast.error("O ano lectivo de destino deve ser diferente do ano lectivo de origem.");
      return;
    }

    try {
      const payload: AddGradeCurricularPlanoMassaPayload = {
        codigoCurso: parseFilter(curso?.toString()),
        codigoAnoLectivo: parseFilter(anoLectivoDestino?.toString()),
        itens: selectedItems.map((item) => {
          const overrides = itemOverrides[item.codigo_disciplina] ?? {};
          return {
            codigoGradeCurricular: item.codigo_grade_curricular,
            temOral: overrides.temOral ?? Boolean(item.tem_oral),
            temPratica: overrides.temPratica ?? Boolean(item.tem_pratica),
          };
        }),
      };

      const result = await addPlanoMassa(payload);
      setImportResult(result);
      setResultDialogOpen(true);
    } catch { }
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
            tipoCandidaturaId={Number(tipoCandidatura)}
            label="Ano Letivo (Origem)"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Curso</label>
          <Select
            disabled={loadingCursos || !anoLectivo || !tipoCandidatura}
            value={curso ? String(curso) : ''}
            onValueChange={(v) => setCurso(Number(v))}

          >
            <SelectTrigger disabled={loadingCursos || !anoLectivo || !tipoCandidatura}>
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

      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={!filtrosCompletos || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              A buscar...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Buscar as UCs
            </>
          )}
        </Button>
        <Button
          size="sm"

          onClick={clearAllFilters}
          className="shrink-0"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary shrink-0">
          <ArrowRight className="h-4 w-4" />
          Destino da importação
        </div>
        <div className="flex-1 max-w-xs">
          <AcademicYearsAvailableForOperationSelect
            onChangeValue={(v) => setAnoLectivoDestino(Number(v))}
            value={anoLectivoDestino?.toString()}
            tipoCandidaturaId={Number(tipoCandidatura)}
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
                                    itemOverrides[item.codigo_disciplina] ?? {}
                                  }
                                  onOverrideChange={(field, value) =>
                                    handleOverrideChange(
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
        onOpenChange={(open) => {
          if (!open) {
            resetState();
          } else {
            setResultDialogOpen(open);
          }
        }}
        result={importResult}
      />
    </div>
  );
}
