import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
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
  ChevronDown,
  ChevronRight,
  BookOpen,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
  Download,
  FilterX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGradeCurricular } from "@/hooks/use-grade-curricular"; // ajusta o path real
import { useCursos } from "@/hooks/use-cursos"; // ajusta o path real
import { useClasses } from "@/hooks/use-classes"; // ajusta o path real
import {
  addUCToPlan,
  AddUCToPlanPayload,
  GradeCurricularItem,
} from "@/services/fetch-gradeCurricularService";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { parseFilter } from "@/util/parse-filter";

interface ImportUCModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

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
}: {
  item: GradeCurricularItem;
  selected: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(false);

  const somaPesos =
    (item.peso_primeira_freq ?? 0) +
    (item.peso_segunda_freq ?? 0) +
    (item.peso_pratica ?? 0);

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
                      somaPesos === 100 ? "text-success" : "text-destructive",
                    )}
                  >
                    Total: {somaPesos}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      1ª Freq.
                    </p>
                    <p className="font-medium">
                      {item.peso_primeira_freq ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      2ª Freq.
                    </p>
                    <p className="font-medium">
                      {item.peso_segunda_freq ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Prática</p>
                    <p className="font-medium">{item.peso_pratica ?? "—"}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-md border p-3">
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Notas mínimas
                </p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      1ª Freq.
                    </p>
                    <p className="font-medium">
                      {item.nota_min_primeira_freq ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      2ª Freq.
                    </p>
                    <p className="font-medium">
                      {item.nota_min_segunda_freq ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Prática</p>
                    <p className="font-medium">
                      {item.nota_min_pratica ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
  );
}

export function ImportUCModal({
  open,
  onOpenChange,
  onSuccess,
}: ImportUCModalProps) {
  const [anoLectivo, setAnoLectivo] = useState<number>();
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
  const [isImporting, setIsImporting] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (items.length > 0) {
      setSelected(new Set(items.map((i) => i.codigo_disciplina)));
      setExpandedGroups(new Set(items.map((i) => i.codigo_classe)));
    } else {
      setSelected(new Set());
    }
  }, [gradeResponse]);

  // Reset ao fechar a modal
  useEffect(() => {
    if (!open) {
      setAnoLectivo(undefined);
      setCurso(undefined);
      setClasse(undefined);
      setSelected(new Set());
    }
  }, [open]);

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

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.codigo_disciplina)),
    [items, selected],
  );

  const buildPayload = (item: GradeCurricularItem): AddUCToPlanPayload => ({
    codigoDisciplina: item.codigo_disciplina,
    codigoAnoLectivo: anoLectivo as number,
    codigoSemestre: item.codigo_semestre,
    codigoClasse: item.codigo_classe,
    codigoCurso: item.codigo_curso,
  });

  const handleImport = async () => {
    if (selectedItems.length === 0) {
      toast.warning("Selecione pelo menos uma disciplina para importar.");
      return;
    }

    setIsImporting(true);
    let sucesso = 0;
    let falhas = 0;

    for (const item of selectedItems) {
      try {
        //await addUCToPlan(buildPayload(item));
        sucesso++;
      } catch {
        falhas++;
      }
    }

    setIsImporting(false);

    if (falhas === 0) {
      toast.success(
        `${sucesso} disciplina${sucesso !== 1 ? "s" : ""} importada${sucesso !== 1 ? "s" : ""} com sucesso!`,
      );
      onSuccess?.();
      onOpenChange(false);
    } else {
      toast.error(
        `${sucesso} importada(s), ${falhas} falharam. Verifique e tente novamente.`,
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl! w-full max-h-[90vh]! overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Importar Unidades Curriculares
          </DialogTitle>
          <DialogDescription>
            Escolha o ano lectivo e o curso para carregar a grade curricular
            disponível para importação.
          </DialogDescription>
        </DialogHeader>

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
              label="Ano Letivo"
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
              Não há disciplinas na grade curricular para os filtros
              selecionados.
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
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {selected.size}
                </span>{" "}
                de {items.length} selecionada{items.length !== 1 ? "s" : ""}
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
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

        <DialogFooter className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isImporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleImport}
            disabled={isImporting || isLoading || items.length === 0}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
