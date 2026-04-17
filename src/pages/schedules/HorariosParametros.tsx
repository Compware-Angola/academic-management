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
import { Pencil, Search, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type TipoParametro = "Duração" | "Validação" | "Restrição" | "Limite" | "Permissão";

interface ParametroHorario {
  id: number;
  codigo: string;
  nome: string;
  tipo: TipoParametro;
  curso: string;
  valor: string;
  unidade: string;
  ativo: boolean;
  descricao: string;
}

const cursosDisponiveis = [
  "Todos os Cursos",
  "Engenharia Informática",
  "Direito",
  "Medicina",
  "Economia",
  "Arquitectura",
];

const tiposParametro: TipoParametro[] = [
  "Duração",
  "Validação",
  "Restrição",
  "Limite",
  "Permissão",
];

const parametrosIniciais: ParametroHorario[] = [
  {
    id: 1,
    codigo: "DUR_TEO",
    nome: "Duração Aula Teórica",
    tipo: "Duração",
    curso: "Todos os Cursos",
    valor: "90",
    unidade: "minutos",
    ativo: true,
    descricao: "Duração padrão de uma aula teórica.",
  },
  {
    id: 2,
    codigo: "DUR_PRAT",
    nome: "Duração Aula Prática",
    tipo: "Duração",
    curso: "Engenharia Informática",
    valor: "120",
    unidade: "minutos",
    ativo: true,
    descricao: "Duração padrão de uma aula prática para EI.",
  },
  {
    id: 3,
    codigo: "DUR_LAB",
    nome: "Duração Laboratório",
    tipo: "Duração",
    curso: "Engenharia Informática",
    valor: "180",
    unidade: "minutos",
    ativo: true,
    descricao: "Duração padrão de aulas laboratoriais.",
  },
  {
    id: 4,
    codigo: "VAL_COL_SALA",
    nome: "Verificar colisão de sala",
    tipo: "Validação",
    curso: "Todos os Cursos",
    valor: "Sim",
    unidade: "boolean",
    ativo: true,
    descricao: "Bloqueia conflitos automáticos na alocação de salas.",
  },
  {
    id: 5,
    codigo: "VAL_DISP_DOC",
    nome: "Verificar disponibilidade docente",
    tipo: "Validação",
    curso: "Todos os Cursos",
    valor: "Sim",
    unidade: "boolean",
    ativo: true,
    descricao: "Alerta sobre conflitos no horário do docente.",
  },
  {
    id: 6,
    codigo: "RES_SAB",
    nome: "Permitir aulas aos sábados",
    tipo: "Restrição",
    curso: "Todos os Cursos",
    valor: "Não",
    unidade: "boolean",
    ativo: false,
    descricao: "Habilita criação de horários ao sábado.",
  },
  {
    id: 7,
    codigo: "LIM_MAX_TURMA",
    nome: "Máximo de alunos por turma",
    tipo: "Limite",
    curso: "Direito",
    valor: "60",
    unidade: "alunos",
    ativo: true,
    descricao: "Capacidade máxima de uma turma teórica.",
  },
  {
    id: 8,
    codigo: "LIM_MIN_TURMA",
    nome: "Mínimo de alunos por turma",
    tipo: "Limite",
    curso: "Medicina",
    valor: "10",
    unidade: "alunos",
    ativo: true,
    descricao: "Mínimo de alunos para abertura de turma.",
  },
  {
    id: 9,
    codigo: "PERM_EDIT_DOC",
    nome: "Docente pode editar horário",
    tipo: "Permissão",
    curso: "Todos os Cursos",
    valor: "Não",
    unidade: "boolean",
    ativo: false,
    descricao: "Permite que docentes editem o próprio horário.",
  },
  {
    id: 10,
    codigo: "LIM_AULAS_DIA",
    nome: "Máximo de aulas/dia por docente",
    tipo: "Limite",
    curso: "Economia",
    valor: "4",
    unidade: "aulas",
    ativo: true,
    descricao: "Limite diário de aulas atribuídas a um docente.",
  },
];

const tipoBadgeVariant: Record<TipoParametro, string> = {
  Duração: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  Validação: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Restrição: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  Limite: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Permissão: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/30",
};

export default function HorariosParametros() {
  const { toast } = useToast();
  const [parametros, setParametros] = useState<ParametroHorario[]>(parametrosIniciais);
  const [tipoFiltro, setTipoFiltro] = useState<string>("todos");
  const [cursoFiltro, setCursoFiltro] = useState<string>("todos");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<ParametroHorario | null>(null);
  const [open, setOpen] = useState(false);

  const filtrados = useMemo(() => {
    return parametros.filter((p) => {
      const matchTipo = tipoFiltro === "todos" || p.tipo === tipoFiltro;
      const matchCurso = cursoFiltro === "todos" || p.curso === cursoFiltro;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.nome.toLowerCase().includes(q) ||
        p.codigo.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q);
      return matchTipo && matchCurso && matchSearch;
    });
  }, [parametros, tipoFiltro, cursoFiltro, search]);

  const limparFiltros = () => {
    setTipoFiltro("todos");
    setCursoFiltro("todos");
    setSearch("");
  };

  const abrirEdicao = (p: ParametroHorario) => {
    setEditing({ ...p });
    setOpen(true);
  };

  const salvar = () => {
    if (!editing) return;
    setParametros((prev) => prev.map((p) => (p.id === editing.id ? editing : p)));
    setOpen(false);
    toast({
      title: "Parâmetro atualizado",
      description: `${editing.nome} foi atualizado com sucesso.`,
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
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {tiposParametro.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-4">
            <Label>Curso</Label>
            <Select value={cursoFiltro} onValueChange={setCursoFiltro}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o curso" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="todos">Todos os cursos</SelectItem>
                {cursosDisponiveis.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-4">
            <Label>Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nome, código ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="md:col-span-1 flex items-end">
            <Button
              variant="outline"
              size="icon"
              onClick={limparFiltros}
              title="Limpar filtros"
              className="w-full"
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
              {filtrados.length} de {parametros.length} parâmetros
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    Nenhum parâmetro encontrado com os filtros aplicados.
                  </TableCell>
                </TableRow>
              ) : (
                filtrados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.codigo}</TableCell>
                    <TableCell className="font-medium">{p.nome}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={tipoBadgeVariant[p.tipo]}>
                        {p.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{p.curso}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{p.valor}</span>{" "}
                      <span className="text-xs text-muted-foreground">{p.unidade}</span>
                    </TableCell>
                    <TableCell>
                      {p.ativo ? (
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
      </Card>

      {/* Modal de edição */}
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
                  <Label>Código</Label>
                  <Input
                    value={editing.codigo}
                    onChange={(e) => setEditing({ ...editing, codigo: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={editing.tipo}
                    onValueChange={(v) =>
                      setEditing({ ...editing, tipo: v as TipoParametro })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                      {tiposParametro.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={editing.nome}
                  onChange={(e) => setEditing({ ...editing, nome: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Curso</Label>
                <Select
                  value={editing.curso}
                  onValueChange={(v) => setEditing({ ...editing, curso: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {cursosDisponiveis.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Valor</Label>
                  <Input
                    value={editing.valor}
                    onChange={(e) => setEditing({ ...editing, valor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Input
                    value={editing.unidade}
                    onChange={(e) => setEditing({ ...editing, unidade: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={editing.descricao}
                  onChange={(e) => setEditing({ ...editing, descricao: e.target.value })}
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
                  checked={editing.ativo}
                  onCheckedChange={(v) => setEditing({ ...editing, ativo: v })}
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
