import { useMemo, useState } from "react";
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





const TIPOS_OPCOES = [
  { id: null, label: "Todos" },
  { id: 1, label: "Gerais" },
  { id: 2, label: "Tempo/Duração" },
];

export default function HorariosParametros() {
  const { toast } = useToast();

  // ---- Filtros ----
  const [tipoFiltro, setTipoFiltro] = useState<string>("");
  const [cursoFiltro, setCursoFiltro] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 25;

  // ---- Query ----
  const { data, isLoading, isError, isFetching } = useQueryScheduleParams({
    tipoParametro: parseFilter(tipoFiltro),
    search: search || undefined,
    curso: cursoFiltro ? Number(cursoFiltro) : undefined,
    page,
    limit: LIMIT,
  });

  const parametros = data?.data ?? [];
  const hasNextPage = data?.hasNextPage ?? false;

  // ---- Estado local do modal (estático por enquanto) ----
  const [editing, setEditing] = useState<ScheduleParamItem | null>(null);
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
    setEditing({ ...p });
    setOpen(true);
  };

  // Salvar ainda estático — rota de edição será integrada depois
  const salvar = () => {
    if (!editing) return;
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
          {/* Tipo de parâmetro */}
          <div className="space-y-2 md:col-span-3">
            <Label>Tipo de Parâmetro</Label>
            <Select
              value={String(tipoFiltro)}
              onValueChange={(v) => {
                setTipoFiltro(v);
                setPage(1);
              }}
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

          {/* Pesquisar */}
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

          {/* Botões */}
          <div className="md:col-span-2 flex items-end gap-2">
            <Button onClick={handleSearch} className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={limparFiltros}
              title="Limpar filtros"
            >
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => abrirEdicao(p)}
                      >
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

        {/* Paginação */}
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

      {/* Modal de edição — estático por enquanto */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[560px]">
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