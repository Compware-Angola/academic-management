import { useMemo, useState, useCallback, useEffect } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/common/FormInput";
import { TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Trash2,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryLaunchMigration } from "@/hooks/students/use-query-launch-migration";
import {
  useDeleteEquivalenceMigrationTFC,
  useMutationCreateEquivalenceMigrationTFC,
} from "@/hooks/students/use-mutation-launch-migration";
import { AnoLectivoConfirmadoSelect } from "@/components/common/global-selects/AnoLectivoConfirmadoSelect";
import { LaunchMigrationItem } from "@/services/students/fetch-launch-migration.service";
type Props = {
  codigoMatricula: number;
  value?: string;
};

type EditState = {
  [codigo: number]: {
    value: string;
    codigoGradeAluno: number;
    anoLectivo: string;
    isDirty: boolean;
  };
};

export function LaunchMigration({
  codigoMatricula,
  value = "migration",
}: Props) {
  const {
    data: planResponse,
    isLoading,
    isError,
  } = useQueryLaunchMigration(codigoMatricula);
  const { mutateAsync } = useMutationCreateEquivalenceMigrationTFC();

  const [search, setSearch] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [editState, setEditState] = useState<EditState>({});
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isEquivalence, setIsEquivalence] = useState<boolean>(false);
  const { mutateAsync: deleteGradeAluno } = useDeleteEquivalenceMigrationTFC();
  const plans = planResponse?.grades ?? [];
  const getAnoLectivo = (plan: (typeof plans)[number]) => {
    return (
      editState[plan.codigo]?.anoLectivo ??
      String(plan?.codigo_ano_lectivo ?? "")
    );
  };
  const handleAnoLectivoChange = useCallback(
    (
      codigo: number,
      novoAno: string,
      codigoGradeAluno: number,
      originalNota: number | null,
    ) => {
      setEditState((prev) => ({
        ...prev,
        [codigo]: {
          value:
            prev[codigo]?.value ??
            (originalNota != null ? String(originalNota) : "0"),
          isDirty: true,
          codigoGradeAluno,
          anoLectivo: novoAno,
        },
      }));
    },
    [],
  );
  const handleDelete = async (plan: LaunchMigrationItem) => {
    try {
      await deleteGradeAluno(plan.codigo_grade_aluno);

      setDeletedIds((prev) => new Set([...prev, plan.codigo]));

      setEditState((prev) => {
        const next = { ...prev };
        delete next[plan.codigo];
        return next;
      });
    } catch (error) {
      console.error(error);
    }
  };
  const filteredPlans = useMemo(() => {
    const term = search.toLowerCase().trim();
    const visible = plans.filter((p) => !deletedIds.has(p.codigo));
    if (!term) return visible;
    return visible.filter((plan) => {
      const resultado = plan.nota ? "concluido" : "";
      const ano = `${plan.codigo_classe} ano`;
      return (
        plan.disciplina.toLowerCase().includes(term) ||
        plan.semestre.toLowerCase().includes(term) ||
        plan.duracao.toLowerCase().includes(term) ||
        String(plan.nota).includes(term) ||
        String(plan.classe).includes(term) ||
        ano.includes(term) ||
        resultado.includes(term)
      );
    });
  }, [plans, search, deletedIds]);

  const dirtyCount = useMemo(
    () => Object.values(editState).filter((s) => s.isDirty).length,
    [editState],
  );

  const getDisplayNota = (plan: (typeof plans)[number]) => {
    const edit = editState[plan.codigo];
    if (edit) return edit.value;
    return plan.nota != null ? String(plan.nota) : "0";
  };

  const isDirty = (codigo: number) => editState[codigo]?.isDirty ?? false;

  const handleNotaChange = useCallback(
    (
      codigo: number,
      originalNota: number | null,
      newValue: string,
      codigoGradeAluno: number,
      codigoAnoLectivo: number,
    ) => {
      // Allow only numbers, dot, and empty string
      if (!/^[\d.]*$/.test(newValue) || Number(newValue) > 20) return;
      const original = originalNota != null ? String(originalNota) : "0";
      setEditState((prev) => ({
        ...prev,
        [codigo]: {
          value: newValue,
          isDirty: newValue !== original,
          codigoGradeAluno: codigoGradeAluno,
          anoLectivo: prev[codigo]?.anoLectivo ?? String(codigoAnoLectivo),
        },
      }));
    },
    [],
  );

  const handleReset = useCallback(
    (codigo: number, originalNota: number | null) => {
      setEditState((prev) => {
        const next = { ...prev };
        delete next[codigo];
        return next;
      });
    },
    [],
  );

  const handleResetAll = () => {
    setEditState({});
  };

  const handleSaveAll = async () => {
    try {
      setIsSaving(true);

      const itens = Object.entries(editState)
        .filter(([, value]) => value.isDirty)
        .map(([codigo, value]) => {
          const plan = plans.find((p) => p.codigo === Number(codigo));
          return {
            anoLectivo: Number(value.anoLectivo),
            nota: Number(value.value || 0),
            codigoGrade: Number(codigo),
            codigoGradeAluno: Number(value.codigoGradeAluno),
            semestreId: Number(plan.semestreid),
          };
        });

      if (itens.length === 0) return;
      console.log("Itens: ", itens);
      await mutateAsync({
        matriculaId: codigoMatricula,
        equivalencia: 1,
        itens,
      });

      setEditState({});
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setEditState({});
    setDeletedIds(new Set());
    setSearch("");
    setSearchValue("");
    setIsEquivalence(false);
  }, [codigoMatricula]);

  const getRowStyle = (plan: (typeof plans)[number]) => {
    if (isDirty(plan.codigo))
      return "bg-amber-50 dark:bg-amber-950/30 border-l-2 border-l-amber-400";
    if (plan.nota)
      return "bg-emerald-50/70 dark:bg-emerald-900/20 border-l-2 border-l-emerald-400";
    return "border-l-2 border-l-transparent";
  };

  return (
    <TabsContent value={value} className="space-y-4">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Lançamento de Notas de Equivalência, TFC e Migração
            </CardTitle>
            <CardDescription className="mt-1">
              Edite as notas directamente na tabela e guarde todas de uma só
              vez.
            </CardDescription>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 text-xs mt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-400/70 border border-emerald-500" />
              Com nota
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-400/70 border border-amber-500" />
              Editado
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-muted border border-border" />
              Sem nota
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FormInput
            placeholder="Pesquisar disciplina, semestre, nota…"
            value={searchValue}
            onValueChange={(v) => setSearchValue(v)}
            onDebounce={(v) => setSearch(v)}
          />

          <div className="flex items-center gap-3 flex-wrap">
            {dirtyCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-700 px-3 py-1.5 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-amber-700 dark:text-amber-300 font-medium">
                  {dirtyCount} alteraç{dirtyCount > 1 ? "ões" : "ão"} por
                  guardar
                </span>
                <button
                  onClick={handleResetAll}
                  className="ml-1 text-amber-500 hover:text-amber-700 transition-colors"
                  title="Descartar todas as alterações"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="text-muted-foreground">Lançar Equivalência</span>
              <Switch
                checked={isEquivalence}
                onCheckedChange={(v) => setIsEquivalence(v)}
              />
            </div>

            <Button
              onClick={handleSaveAll}
              disabled={dirtyCount === 0 || isSaving}
              size="sm"
              className={cn(
                "gap-2 transition-all",
                dirtyCount > 0 && "shadow-md shadow-primary/20",
              )}
            >
              {isSaving ? (
                <>
                  <span className="w-4 h-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                  A guardar…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar tudo
                  {dirtyCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-0.5 h-5 px-1.5 text-xs"
                    >
                      {dirtyCount}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ── Table / States ──────────────────────────────────────── */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-14 text-destructive gap-2">
            <AlertCircle className="w-8 h-8" />
            <p className="font-medium">Erro ao carregar as disciplinas.</p>
            <p className="text-sm text-muted-foreground">
              Tente novamente mais tarde.
            </p>
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-muted-foreground gap-2">
            <CheckCircle2 className="w-8 h-8 opacity-40" />
            <p>Nenhuma disciplina encontrada para este ano.</p>
          </div>
        ) : (
          <div className="rounded-xl border overflow-hidden shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/60 hover:bg-muted/60">
                  <TableHead className="w-16">Ano</TableHead>
                  <TableHead className="w-28">Semestre</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="w-24 text-center">Duração</TableHead>
                  <TableHead className="w-44 text-center">
                    Ano Lectivo
                  </TableHead>
                  <TableHead className="w-36 text-center">Nota</TableHead>
                  <TableHead className="w-24 text-center">Nome</TableHead>
                  <TableHead className="w-28 text-center">Estado</TableHead>
                  <TableHead className="w-24 text-center">Acções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => {
                  const dirty = isDirty(plan.codigo);
                  const displayNota = getDisplayNota(plan);
                  const originalNota =
                    plan.nota != null ? String(plan.nota) : "0";

                  return (
                    <TableRow
                      key={plan.codigo}
                      className={cn(
                        "transition-colors duration-150",
                        getRowStyle(plan),
                      )}
                    >
                      <TableCell className="font-mono text-sm font-semibold text-muted-foreground">
                        {plan.classe}º
                      </TableCell>

                      <TableCell className="text-sm">{plan.semestre}</TableCell>

                      <TableCell className="font-medium text-sm">
                        {plan.disciplina}
                      </TableCell>

                      <TableCell className="text-center text-sm text-muted-foreground">
                        {plan.duracao}
                      </TableCell>
                      <TableCell className="text-center">
                        <AnoLectivoConfirmadoSelect
                          value={getAnoLectivo(plan)}
                          codigoMatricula={codigoMatricula}
                          onChangeValue={(v) =>
                            handleAnoLectivoChange(
                              plan.codigo,
                              v,
                              plan.codigo_grade_aluno,
                              plan.nota,
                            )
                          }
                        />
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Input
                            value={displayNota}
                            onChange={(e) =>
                              handleNotaChange(
                                plan.codigo,
                                plan.nota,
                                e.target.value,
                                plan.codigo_grade_aluno,
                                plan.codigo_ano_lectivo,
                              )
                            }
                            className={cn(
                              "h-8 w-20 text-center font-mono text-sm transition-all",
                              dirty
                                ? "border-amber-400 ring-1 ring-amber-300 bg-white dark:bg-amber-950/30"
                                : "border-transparent bg-transparent hover:border-border focus:border-border",
                            )}
                            placeholder="0.0"
                          />
                        </div>
                      </TableCell>
                      <TableCell>{plan?.nome_utilizador ?? "-"}</TableCell>
                      {/* Estado badge */}
                      <TableCell className="text-center">
                        {dirty ? (
                          <Badge
                            variant="outline"
                            className="text-xs border-amber-400 text-amber-600 bg-amber-50 dark:bg-amber-950/40"
                          >
                            Editado
                          </Badge>
                        ) : plan.nota ? (
                          <Badge
                            variant="outline"
                            className="text-xs border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40"
                          >
                            Concluído
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            Por lançar
                          </Badge>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {dirty && (
                            <button
                              onClick={() =>
                                handleReset(plan.codigo, plan.nota)
                              }
                              title={`Repor para ${originalNota}`}
                              className="text-amber-500 hover:text-amber-700 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            aria-label="Eliminar"
                            onClick={() => handleDelete(plan)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Footer summary */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t bg-muted/30 text-xs text-muted-foreground">
              <span>
                {filteredPlans.length} de {plans.length - deletedIds.size}{" "}
                disciplina(s)
                {deletedIds.size > 0 && (
                  <span className="ml-2 text-destructive/70">
                    · {deletedIds.size} eliminada(s)
                  </span>
                )}
              </span>
              {dirtyCount > 0 && (
                <span className="text-amber-600 font-medium">
                  {dirtyCount} nota(s) editada(s) — lembre-se de guardar
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </TabsContent>
  );
}
