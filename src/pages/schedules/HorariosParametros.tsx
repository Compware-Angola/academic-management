import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil, Search, Save, RotateCcw, Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryScheduleParams } from "@/hooks/horario/use-schedule-params";
import { ScheduleParamItem } from "@/services/horario/schedule-params.service";
import { parseFilter } from "@/util/parse-filter";
import { useUpdateScheduleParam } from "@/hooks/horario/update-params-schedule";
import { useQueryPeriod } from "@/hooks/period/use-query-period";

// ─── Tipos dos args por sigla ─────────────────────────────────────────────────

/** IPP: cada entrada corresponde a um período */
type IppEntry = {
  periodo: number;
  hora_inicio: string;
  qtd_de_tempo: number;
};

/** DTL: duração do tempo lectivo por curso */
type DtlEntry = {
  curso: number;
  duracao: string;
};

/** IETL: intervalo entre tempos por curso */
type IetlSeqEntry = { duracao: string };
type IetlEntry = {
  curso: number;
  seq: IetlSeqEntry[];
};

/** epndh: flags de campos obrigatórios */
type ArgsEpndh = {
  curso: boolean;
  periodo: boolean;
  grade: boolean;
  others: string;
};

/** nbph: quantidade de backups */
type ArgsNbph = {
  quantidadeBackups: number;
};

type SiglaComArgs = "epndh" | "nbph" | "dtl" | "ipp" | "ietl";
const SIGLAS_COM_ARGS: SiglaComArgs[] = ["epndh", "nbph", "dtl", "ipp", "ietl"];

function isSiglaComArgs(sigla: string): sigla is SiglaComArgs {
  return SIGLAS_COM_ARGS.includes(sigla as SiglaComArgs);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseArgs(args: unknown): unknown {
  if (!args) return null;
  if (typeof args === "object") return args;
  try {
    return JSON.parse(args as string);
  } catch {
    return null;
  }
}

/** Devolve args padrão para cada sigla */
function defaultArgs(sigla: SiglaComArgs): unknown {
  switch (sigla) {
    case "ipp":
      return [{ periodo: 1, hora_inicio: "07:00", qtd_de_tempo: 6 }] satisfies IppEntry[];
    case "dtl":
      return [{ curso: 0, duracao: "01:30" }] satisfies DtlEntry[];
    case "ietl":
      return [{ curso: 0, seq: [{ duracao: "00:10" }] }] satisfies IetlEntry[];
    case "epndh":
      return { curso: false, periodo: false, grade: false, others: "" } satisfies ArgsEpndh;
    case "nbph":
      return { quantidadeBackups: 1 } satisfies ArgsNbph;
  }
}

// ─── Componentes de args ──────────────────────────────────────────────────────

// ── IPP ───────────────────────────────────────────────────────────────────────
function ArgsIppForm({
  args,
  onChange,
}: {
  args: IppEntry[];
  onChange: (next: IppEntry[]) => void;
}) {
  const update = (i: number, field: keyof IppEntry, value: unknown) => {
    const next = args.map((entry, idx) =>
      idx === i ? { ...entry, [field]: value } : entry
    );
    onChange(next);
  };

  const addRow = () =>
    onChange([...args, { periodo: 0, hora_inicio: "07:00", qtd_de_tempo: 6 }]);

  const removeRow = (i: number) =>
    onChange(args.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          IPP — Início por Período
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      {args.map((entry, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Período</Label>
            <Input
              type="number"
              min={0}
              value={entry.periodo}
              onChange={(e) => update(i, "periodo", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Hora início</Label>
            <Input
              type="time"
              value={entry.hora_inicio}
              onChange={(e) => update(i, "hora_inicio", e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Qtd. tempos</Label>
            <Input
              type="number"
              min={1}
              value={entry.qtd_de_tempo}
              onChange={(e) => update(i, "qtd_de_tempo", Number(e.target.value))}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => removeRow(i)}
            disabled={args.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        Período <strong>0</strong> = configuração especial para o sábado.
      </p>
    </div>
  );
}

// ── DTL ───────────────────────────────────────────────────────────────────────
function ArgsDtlForm({
  args,
  onChange,
}: {
  args: DtlEntry[];
  onChange: (next: DtlEntry[]) => void;
}) {
  const update = (i: number, field: keyof DtlEntry, value: unknown) => {
    onChange(args.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)));
  };

  const addRow = () => onChange([...args, { curso: 0, duracao: "01:00" }]);
  const removeRow = (i: number) => onChange(args.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          DTL — Duração do Tempo Lectivo
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      {args.map((entry, i) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
          <div className="space-y-1">
            <Label className="text-xs">Curso</Label>
            <Input
              type="number"
              min={0}
              value={entry.curso}
              onChange={(e) => update(i, "curso", Number(e.target.value))}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Duração (HH:mm)</Label>
            <Input
              type="time"
              value={entry.duracao}
              onChange={(e) => update(i, "duracao", e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive"
            onClick={() => removeRow(i)}
            disabled={args.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        Curso <strong>0</strong> = configuração global (todos os cursos).
      </p>
    </div>
  );
}

// ── IETL ──────────────────────────────────────────────────────────────────────
function ArgsIetlForm({
  args,
  onChange,
}: {
  args: IetlEntry[];
  onChange: (next: IetlEntry[]) => void;
}) {
  const updateCurso = (i: number, value: number) => {
    onChange(args.map((e, idx) => (idx === i ? { ...e, curso: value } : e)));
  };

  const updateSeq = (i: number, si: number, value: string) => {
    onChange(
      args.map((e, idx) =>
        idx === i
          ? {
            ...e,
            seq: e.seq.map((s, sidx) =>
              sidx === si ? { duracao: value } : s
            ),
          }
          : e
      )
    );
  };

  const addSeq = (i: number) => {
    onChange(
      args.map((e, idx) =>
        idx === i ? { ...e, seq: [...e.seq, { duracao: "00:10" }] } : e
      )
    );
  };

  const removeSeq = (i: number, si: number) => {
    onChange(
      args.map((e, idx) =>
        idx === i
          ? { ...e, seq: e.seq.filter((_, sidx) => sidx !== si) }
          : e
      )
    );
  };

  const addRow = () =>
    onChange([...args, { curso: 0, seq: [{ duracao: "00:10" }] }]);

  const removeRow = (i: number) =>
    onChange(args.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          IETL — Intervalo Entre Tempos
        </p>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3 w-3 mr-1" /> Adicionar
        </Button>
      </div>

      {args.map((entry, i) => (
        <div key={i} className="space-y-2 rounded border p-2 bg-background">
          <div className="flex items-center gap-2">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Curso</Label>
              <Input
                type="number"
                min={0}
                value={entry.curso}
                onChange={(e) => updateCurso(i, Number(e.target.value))}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive mt-5"
              onClick={() => removeRow(i)}
              disabled={args.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2 pl-2 border-l">
            <p className="text-xs text-muted-foreground">Sequência de intervalos</p>
            {entry.seq.map((s, si) => (
              <div key={si} className="flex items-center gap-2">
                <Input
                  type="time"
                  value={s.duracao}
                  onChange={(e) => updateSeq(i, si, e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeSeq(i, si)}
                  disabled={entry.seq.length === 1}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addSeq(i)}
            >
              <Plus className="h-3 w-3 mr-1" /> Intervalo
            </Button>
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        Curso <strong>0</strong> = configuração global.
      </p>
    </div>
  );
}

// ── EPNDH ─────────────────────────────────────────────────────────────────────
function ArgsEpndhForm({
  args,
  onChange,
}: {
  args: ArgsEpndh;
  onChange: (next: ArgsEpndh) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        EPNDH — Configuração
      </p>
      {(["curso", "periodo", "grade"] as const).map((field) => (
        <div key={field} className="flex items-center justify-between">
          <Label className="capitalize">
            {field === "periodo" ? "Período" : field.charAt(0).toUpperCase() + field.slice(1)}
          </Label>
          <Switch
            checked={args[field]}
            onCheckedChange={(v) => onChange({ ...args, [field]: v })}
          />
        </div>
      ))}
      <div className="space-y-1">
        <Label>Others</Label>
        <Input
          value={args.others}
          onChange={(e) => onChange({ ...args, others: e.target.value })}
          placeholder="Informação adicional..."
        />
      </div>
    </div>
  );
}

// ── NBPH ──────────────────────────────────────────────────────────────────────
function ArgsNbphForm({
  args,
  onChange,
}: {
  args: ArgsNbph;
  onChange: (next: ArgsNbph) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        NBPH — Backups
      </p>
      <div className="space-y-1">
        <Label>Quantidade de Backups</Label>
        <Input
          type="number"
          min={1}
          value={args.quantidadeBackups}
          onChange={(e) =>
            onChange({ ...args, quantidadeBackups: Number(e.target.value) })
          }
        />
      </div>
    </div>
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
function ArgsField({
  sigla,
  args,
  onArgsChange,
}: {
  sigla: string;
  args: unknown;
  onArgsChange: (next: unknown) => void;
}) {
  if (!isSiglaComArgs(sigla)) return null;

  switch (sigla) {
    case "ipp": {
      const safe = Array.isArray(args)
        ? (args as IppEntry[])
        : (defaultArgs("ipp") as IppEntry[]);
      return <ArgsIppForm args={safe} onChange={onArgsChange} />;
    }
    case "dtl": {
      const safe = Array.isArray(args)
        ? (args as DtlEntry[])
        : (defaultArgs("dtl") as DtlEntry[]);
      return <ArgsDtlForm args={safe} onChange={onArgsChange} />;
    }
    case "ietl": {
      const safe = Array.isArray(args)
        ? (args as IetlEntry[])
        : (defaultArgs("ietl") as IetlEntry[]);
      return <ArgsIetlForm args={safe} onChange={onArgsChange} />;
    }
    case "epndh": {
      const raw = (args ?? {}) as Record<string, unknown>;
      return (
        <ArgsEpndhForm
          args={{
            curso: Boolean(raw.curso ?? false),
            periodo: Boolean(raw.periodo ?? false),
            grade: Boolean(raw.grade ?? false),
            others: String(raw.others ?? ""),
          }}
          onChange={onArgsChange}
        />
      );
    }
    case "nbph": {
      const raw = (args ?? {}) as Record<string, unknown>;
      return (
        <ArgsNbphForm
          args={{ quantidadeBackups: Number(raw.quantidadeBackups ?? 1) }}
          onChange={onArgsChange}
        />
      );
    }
  }
}

// ─── Tipos de filtro ──────────────────────────────────────────────────────────

const TIPOS_OPCOES = [
  { id: null, label: "Todos" },
  { id: 1, label: "Gerais" },
  { id: 2, label: "Tempo/Duração" },
];

interface EditingState extends ScheduleParamItem {
  argsParsed: unknown;
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function HorariosParametros() {
  const { toast } = useToast();

  const [tipoFiltro, setTipoFiltro] = useState<string>("");
  const [cursoFiltro, setCursoFiltro] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  const { data, isLoading, isError, isFetching } = useQueryScheduleParams({
    tipoParametro: parseFilter(tipoFiltro),
    search: search || undefined,
    curso: cursoFiltro ? Number(cursoFiltro) : undefined,
    page,
    limit: LIMIT,
  });

  const parametros = data?.data ?? [];
  const hasNextPage = data?.hasNextPage ?? false;

  const [editing, setEditing] = useState<EditingState | null>(null);
  const [open, setOpen] = useState(false);

  const limparFiltros = () => {
    setTipoFiltro("");
    setCursoFiltro("");
    setSearch("");
    setSearchInput("");
    setPage(1);
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const abrirEdicao = (p: ScheduleParamItem) => {
    const siglaLower = p.sigla?.toLowerCase() ?? "";
    const rawArgs = parseArgs((p as any).args);

    const argsParsed = isSiglaComArgs(siglaLower)
      ? rawArgs ?? defaultArgs(siglaLower)
      : rawArgs;

    setEditing({ ...p, argsParsed });
    setOpen(true);
  };

  const { mutate: atualizarParametro } = useUpdateScheduleParam(
    editing?.pk_parametro as number,
    () => setOpen(false)
  );

  const salvar = () => {
    if (!editing) return;

    atualizarParametro({
      pk_parametro: editing.pk_parametro,
      designacao: editing.designacao,
      descricao: editing.descricao,
      sigla: editing.sigla,
      obs: editing.obs,
      ordem: editing.ordem,
      active_state: editing.active_state,
      args: editing.argsParsed as Record<string, unknown>[] | Record<string, unknown>,
    });

    toast({
      title: "Parâmetro atualizado",
      description: `${editing.designacao} foi atualizado com sucesso.`,
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parâmetros de Horários"
        subtitle="Home / Horários / Parâmetros"
      />

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="space-y-2 md:col-span-3">
            <Label>Tipo de Parâmetro</Label>
            <Select
              value={String(tipoFiltro)}
              onValueChange={(v) => { setTipoFiltro(v); setPage(1); }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {TIPOS_OPCOES.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-7">
            <Label>Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome, sigla ou descrição..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-9"
              />
            </div>
          </div>

          <div className="md:col-span-2 flex items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button variant="outline" size="icon" onClick={limparFiltros} title="Limpar filtros">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabela */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Parâmetros configurados</h2>
            <p className="text-sm text-muted-foreground">
              {isLoading ? "A carregar..." : `${parametros.length} resultado(s) — página ${page}`}
            </p>
          </div>
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sigla</TableHead>
                <TableHead>Designação</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ordem</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-destructive">
                    Erro ao carregar os parâmetros. Tente novamente.
                  </TableCell>
                </TableRow>
              ) : parametros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    Nenhum parâmetro encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                parametros.map((p) => (
                  <TableRow key={p.pk_parametro}>
                    <TableCell className="font-mono text-xs">{p.sigla}</TableCell>
                    <TableCell className="font-medium">{p.designacao}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                      {p.descricao}
                    </TableCell>
                    <TableCell>{p.ordem}</TableCell>
                    <TableCell>
                      {p.active_state === 1 ? (
                        <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/10">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => abrirEdicao(p)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && !isError && (
          <div className="p-4 border-t flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">Página {page}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasNextPage || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        )}
      </Card>

      {/* Modal de edição */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Parâmetro</DialogTitle>
            <DialogDescription>
              Atualize os dados do parâmetro. As alterações terão efeito imediato.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sigla</Label>
                  <Input
                    value={editing.sigla}
                    onChange={(e) => setEditing({ ...editing, sigla: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={editing.ordem}
                    onChange={(e) =>
                      setEditing({ ...editing, ordem: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Designação</Label>
                <Input
                  value={editing.designacao}
                  onChange={(e) => setEditing({ ...editing, designacao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={editing.descricao}
                  onChange={(e) => setEditing({ ...editing, descricao: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Observação</Label>
                <Input
                  value={editing.obs ?? ""}
                  onChange={(e) => setEditing({ ...editing, obs: e.target.value })}
                  placeholder="Sem observações"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>Parâmetro ativo</Label>
                  <p className="text-xs text-muted-foreground">
                    Desative para não aplicar este parâmetro.
                  </p>
                </div>
                <Switch
                  checked={editing.active_state === 1}
                  onCheckedChange={(v) =>
                    setEditing({ ...editing, active_state: v ? 1 : 0 })
                  }
                />
              </div>

              {/* ── Bloco de Args condicional por sigla ── */}
              {isSiglaComArgs(editing.sigla?.toLowerCase() ?? "") && (
                <ArgsField
                  sigla={editing.sigla?.toLowerCase() ?? ""}
                  args={editing.argsParsed}
                  onArgsChange={(next) =>
                    setEditing({ ...editing, argsParsed: next })
                  }
                />
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={salvar}>
              <Save className="h-4 w-4 mr-2" />
              Guardar alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}