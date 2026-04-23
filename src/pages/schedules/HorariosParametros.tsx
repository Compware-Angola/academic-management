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
import { Pencil, Search, Save, RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryScheduleParams } from "@/hooks/horario/use-schedule-params";
import { ScheduleParamItem } from "@/services/horario/schedule-params.service";
import { parseFilter } from "@/util/parse-filter";
import { useUpdateScheduleParam } from "@/hooks/horario/update-params-schedule";
import { useQueryPeriod } from "@/hooks/period/use-query-period";

// ─── Tipos dos args por sigla ────────────────────────────────────────────────

type ArgsBase = Record<string, unknown>;

/** epndh: Curso, Período, Grade + campo livre */
type ArgsEpndh = ArgsBase & {
  curso: boolean;
  periodo: boolean;
  grade: boolean;
  others: string;
};

/** nbph: quantidade de backups */
type ArgsNbph = ArgsBase & {
  quantidadeBackups: number;
};

/** dtl: hora no formato HH:mm */
type ArgsDtl = ArgsBase & {
  hora: string;
};

/** ipp: período selecionado (id) */
type ArgsIpp = ArgsBase & {
  periodoId: string;
};

/** ietl: duração no formato HH:mm */
type ArgsIetl = ArgsBase & {
  duracao: string;
};

type ArgsMap = {
  epndh: ArgsEpndh;
  nbph: ArgsNbph;
  dtl: ArgsDtl;
  ipp: ArgsIpp;
  ietl: ArgsIetl;
};

type SiglaComArgs = keyof ArgsMap;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SIGLAS_COM_ARGS: SiglaComArgs[] = ["epndh", "nbph", "dtl", "ipp", "ietl"];

function isSiglaComArgs(sigla: string): sigla is SiglaComArgs {
  return SIGLAS_COM_ARGS.includes(sigla as SiglaComArgs);
}

/** Parseia o campo `args` (string JSON ou objeto) de forma segura */
function parseArgs(args: unknown): Record<string, unknown> {
  if (!args) return {};
  if (typeof args === "object") return args as Record<string, unknown>;
  try {
    return JSON.parse(args as string);
  } catch {
    return {};
  }
}

/** Retorna args padrão para cada sigla quando não há dados anteriores */
function defaultArgs(sigla: SiglaComArgs): ArgsMap[SiglaComArgs] {
  switch (sigla) {
    case "epndh":
      return { curso: false, periodo: false, grade: false, others: "" } satisfies ArgsEpndh;
    case "nbph":
      return { quantidadeBackups: 1 } satisfies ArgsNbph;
    case "dtl":
      return { hora: "00:00" } satisfies ArgsDtl;
    case "ipp":
      return { periodoId: "" } satisfies ArgsIpp;
    case "ietl":
      return { duracao: "00:00" } satisfies ArgsIetl;
  }
}

// ─── Períodos fictícios para o select de ipp ─────────────────────────────────
// Substitua com os dados reais da sua API

// ─── Componentes de args por sigla ───────────────────────────────────────────

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
        Configuração de Args
      </p>

      {(["curso", "periodo", "grade"] as const).map((field) => (
        <div key={field} className="flex items-center justify-between">
          <Label className="capitalize">{field === "periodo" ? "Período" : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
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
        Configuração de Args
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

function ArgsDtlForm({
  args,
  onChange,
}: {
  args: ArgsDtl;
  onChange: (next: ArgsDtl) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Configuração de Args
      </p>
      <div className="space-y-1">
        <Label>Hora (HH:mm)</Label>
        <Input
          type="time"
          value={args.hora}
          onChange={(e) => onChange({ ...args, hora: e.target.value })}
        />
      </div>
    </div>
  );
}

function ArgsIppForm({
  args,
  onChange,
}: {
  args: ArgsIpp;
  onChange: (next: ArgsIpp) => void;
}) {
  const { data: periodos } = useQueryPeriod();
  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Configuração de Args
      </p>
      <div className="space-y-1">
        <Label>Período</Label>
     

         <Select
                          value={args.periodoId}
          onValueChange={(v) => onChange({ ...args, periodoId: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {periodos?.map((p) => (
                            <SelectItem key={p.codigo} value={p.codigo.toString()}>
                              {p.designacao}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
      </div>
      
    </div>
  );
}

function ArgsIetlForm({
  args,
  onChange,
}: {
  args: ArgsIetl;
  onChange: (next: ArgsIetl) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-3 bg-muted/30">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Configuração de Args
      </p>
      <div className="space-y-1">
        <Label>Duração (HH:mm)</Label>
        <Input
          type="time"
          value={args.duracao}
          onChange={(e) => onChange({ ...args, duracao: e.target.value })}
        />
      </div>
    </div>
  );
}

/** Renderiza o bloco de args correto com base na sigla */
function ArgsField({
  sigla,
  args,
  onArgsChange,
}: {
  sigla: string;
  args: Record<string, unknown>;
  onArgsChange: (next: Record<string, unknown>) => void;
}) {
  if (!isSiglaComArgs(sigla)) return null;

  switch (sigla) {
    case "epndh":
      return (
        <ArgsEpndhForm
          args={{
            curso: Boolean(args.curso ?? false),
            periodo: Boolean(args.periodo ?? false),
            grade: Boolean(args.grade ?? false),
            others: String(args.others ?? ""),
          }}
          onChange={(next) => onArgsChange(next)}
        />
      );
    case "nbph":
      return (
        <ArgsNbphForm
          args={{
            quantidadeBackups: Number(args.quantidadeBackups ?? 1),
          }}
          onChange={(next) => onArgsChange(next)}
        />
      );
    case "dtl":
      return (
        <ArgsDtlForm
          args={{ hora: String(args.hora ?? "00:00") }}
          onChange={(next) => onArgsChange(next)}
        />
      );
    case "ipp":
      return (
        <ArgsIppForm
          args={{ periodoId: String(args.periodoId ?? "") }}
          onChange={(next) => onArgsChange(next)}
        />
      );
    case "ietl":
      return (
        <ArgsIetlForm
          args={{ duracao: String(args.duracao ?? "00:00") }}
          onChange={(next) => onArgsChange(next)}
        />
      );
  }
}

// ─── Tipos de filtro ─────────────────────────────────────────────────────────

const TIPOS_OPCOES = [
  { id: null, label: "Todos" },
  { id: 1, label: "Gerais" },
  { id: 2, label: "Tempo/Duração" },
];

// ─── Estado de edição estendido ───────────────────────────────────────────────

interface EditingState extends ScheduleParamItem {
  /** args parseado como objeto em memória */
  argsParsed: Record<string, unknown>;
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function HorariosParametros() {
  const { toast } = useToast();

  // Filtros
  const [tipoFiltro, setTipoFiltro] = useState<string>("");
  const [cursoFiltro, setCursoFiltro] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  // Query
  const { data, isLoading, isError, isFetching } = useQueryScheduleParams({
    tipoParametro: parseFilter(tipoFiltro),
    search: search || undefined,
    curso: cursoFiltro ? Number(cursoFiltro) : undefined,
    page,
    limit: LIMIT,
  });

  const parametros = data?.data ?? [];
  const hasNextPage = data?.hasNextPage ?? false;

  // Modal
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
    const argsParsed = isSiglaComArgs(siglaLower)
      ? { ...defaultArgs(siglaLower), ...parseArgs((p as any).args) }
      : parseArgs((p as any).args);

    setEditing({ ...p, argsParsed });
    setOpen(true);
  };
const { mutate: atualizarParametro } =
  useUpdateScheduleParam(editing?.pk_parametro as number, () => {
    setOpen(false);
  });
  const salvar = () => {
    if (!editing) return;

    // Aqui você serializa argsParsed de volta para string antes de enviar à API:
  const payload = {
  pk_parametro: editing.pk_parametro,
  designacao: editing.designacao,
  descricao: editing.descricao,
  sigla: editing.sigla,
  obs: editing.obs,
  ordem: editing.ordem,
  active_state: editing.active_state,
  args: editing.argsParsed,
};
   
    atualizarParametro(payload);

    console.log(editing);
    

    setOpen(false);
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