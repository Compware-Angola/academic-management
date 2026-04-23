import { useState, useMemo } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, ListChecks, CheckCircle2, XCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Resposta {
  id: number;
  perguntaId: number;
  texto: string;
  correta: boolean;
}

interface Pergunta {
  id: number;
  enunciado: string;
  topicoId: number;
  topico: string;
  dificuldade: "Fácil" | "Médio" | "Difícil";
  tipo: "Escolha Múltipla" | "Desenvolvimento";
  estado: "Activa" | "Inactiva";
  pontuacao: number;
}

const TOPICOS = [
  { id: 1, nome: "Matemática Geral" },
  { id: 2, nome: "Física Mecânica" },
  { id: 3, nome: "Química Orgânica" },
  { id: 4, nome: "Biologia Celular" },
  { id: 5, nome: "Português - Gramática" },
];

const initialPerguntas: Pergunta[] = [
  { id: 1, enunciado: "Qual é a derivada de x²?", topicoId: 1, topico: "Matemática Geral", dificuldade: "Fácil", tipo: "Escolha Múltipla", estado: "Activa", pontuacao: 2 },
  { id: 2, enunciado: "Calcule a força resultante de duas forças perpendiculares de 3N e 4N.", topicoId: 2, topico: "Física Mecânica", dificuldade: "Médio", tipo: "Desenvolvimento", estado: "Activa", pontuacao: 4 },
  { id: 3, enunciado: "Identifique o grupo funcional do composto CH3-CO-CH3.", topicoId: 3, topico: "Química Orgânica", dificuldade: "Difícil", tipo: "Escolha Múltipla", estado: "Inactiva", pontuacao: 5 },
  { id: 4, enunciado: "Descreva as fases da mitose celular.", topicoId: 4, topico: "Biologia Celular", dificuldade: "Médio", tipo: "Desenvolvimento", estado: "Activa", pontuacao: 4 },
  { id: 5, enunciado: "Classifique a oração subordinada substantiva.", topicoId: 5, topico: "Português - Gramática", dificuldade: "Fácil", tipo: "Escolha Múltipla", estado: "Activa", pontuacao: 2 },
];

const initialRespostas: Resposta[] = [
  { id: 1, perguntaId: 1, texto: "2x", correta: true },
  { id: 2, perguntaId: 1, texto: "x", correta: false },
  { id: 3, perguntaId: 1, texto: "x²/2", correta: false },
  { id: 4, perguntaId: 1, texto: "2", correta: false },
  { id: 5, perguntaId: 3, texto: "Cetona", correta: true },
  { id: 6, perguntaId: 3, texto: "Aldeído", correta: false },
  { id: 7, perguntaId: 3, texto: "Éter", correta: false },
  { id: 8, perguntaId: 5, texto: "Objectiva directa", correta: true },
  { id: 9, perguntaId: 5, texto: "Adverbial", correta: false },
];

const dificuldadeBadge = (d: Pergunta["dificuldade"]) =>
  d === "Fácil" ? "default" : d === "Médio" ? "secondary" : "destructive";

export default function ListarPerguntas() {
  const { toast } = useToast();
  const [perguntas, setPerguntas] = useState<Pergunta[]>(initialPerguntas);
  const [respostas, setRespostas] = useState<Resposta[]>(initialRespostas);

  const [search, setSearch] = useState("");
  const [filtroDificuldade, setFiltroDificuldade] = useState("todos");
  const [filtroTopico, setFiltroTopico] = useState("todos");

  // Pergunta dialog (create/edit)
  const [pDialogOpen, setPDialogOpen] = useState(false);
  const [editingPergunta, setEditingPergunta] = useState<Pergunta | null>(null);
  const [pForm, setPForm] = useState({
    enunciado: "", topicoId: "", dificuldade: "Fácil" as Pergunta["dificuldade"],
    tipo: "Escolha Múltipla" as Pergunta["tipo"], estado: true, pontuacao: 1,
  });

  // Respostas manager dialog
  const [rDialogOpen, setRDialogOpen] = useState(false);
  const [activePergunta, setActivePergunta] = useState<Pergunta | null>(null);
  const [novaResposta, setNovaResposta] = useState({ texto: "", correta: false });
  const [editingRespostaId, setEditingRespostaId] = useState<number | null>(null);
  const [editRespostaForm, setEditRespostaForm] = useState({ texto: "", correta: false });

  const [confirmDeletePergunta, setConfirmDeletePergunta] = useState<number | null>(null);
  const [confirmDeleteResposta, setConfirmDeleteResposta] = useState<number | null>(null);

  const filtered = useMemo(() => perguntas.filter((p) => {
    const matchSearch = p.enunciado.toLowerCase().includes(search.toLowerCase());
    const matchDif = filtroDificuldade === "todos" || p.dificuldade === filtroDificuldade;
    const matchTop = filtroTopico === "todos" || p.topicoId === Number(filtroTopico);
    return matchSearch && matchDif && matchTop;
  }), [perguntas, search, filtroDificuldade, filtroTopico]);

  const respostasDe = (perguntaId: number) => respostas.filter((r) => r.perguntaId === perguntaId);

  const openCreatePergunta = () => {
    setEditingPergunta(null);
    setPForm({ enunciado: "", topicoId: "", dificuldade: "Fácil", tipo: "Escolha Múltipla", estado: true, pontuacao: 1 });
    setPDialogOpen(true);
  };

  const openEditPergunta = (p: Pergunta) => {
    setEditingPergunta(p);
    setPForm({
      enunciado: p.enunciado, topicoId: String(p.topicoId), dificuldade: p.dificuldade,
      tipo: p.tipo, estado: p.estado === "Activa", pontuacao: p.pontuacao,
    });
    setPDialogOpen(true);
  };

  const savePergunta = () => {
    if (!pForm.enunciado.trim() || !pForm.topicoId) {
      toast({ title: "Campos obrigatórios", description: "Preencha o enunciado e o tópico.", variant: "destructive" });
      return;
    }
    const topico = TOPICOS.find((t) => t.id === Number(pForm.topicoId));
    if (editingPergunta) {
      setPerguntas((prev) => prev.map((p) => p.id === editingPergunta.id ? {
        ...p,
        enunciado: pForm.enunciado, topicoId: Number(pForm.topicoId), topico: topico?.nome ?? p.topico,
        dificuldade: pForm.dificuldade, tipo: pForm.tipo, estado: pForm.estado ? "Activa" : "Inactiva",
        pontuacao: pForm.pontuacao,
      } : p));
      toast({ title: "Pergunta atualizada" });
    } else {
      const newId = Math.max(...perguntas.map((p) => p.id), 0) + 1;
      setPerguntas((prev) => [{
        id: newId, enunciado: pForm.enunciado, topicoId: Number(pForm.topicoId), topico: topico?.nome ?? "",
        dificuldade: pForm.dificuldade, tipo: pForm.tipo, estado: pForm.estado ? "Activa" : "Inactiva",
        pontuacao: pForm.pontuacao,
      }, ...prev]);
      toast({ title: "Pergunta criada" });
    }
    setPDialogOpen(false);
  };

  const openRespostas = (p: Pergunta) => {
    setActivePergunta(p);
    setNovaResposta({ texto: "", correta: false });
    setEditingRespostaId(null);
    setRDialogOpen(true);
  };

  const addResposta = () => {
    if (!activePergunta || !novaResposta.texto.trim()) return;
    const newId = Math.max(...respostas.map((r) => r.id), 0) + 1;
    setRespostas((prev) => [...prev, { id: newId, perguntaId: activePergunta.id, texto: novaResposta.texto, correta: novaResposta.correta }]);
    setNovaResposta({ texto: "", correta: false });
    toast({ title: "Resposta adicionada" });
  };

  const startEditResposta = (r: Resposta) => {
    setEditingRespostaId(r.id);
    setEditRespostaForm({ texto: r.texto, correta: r.correta });
  };

  const saveEditResposta = () => {
    if (editingRespostaId == null) return;
    setRespostas((prev) => prev.map((r) => r.id === editingRespostaId ? { ...r, texto: editRespostaForm.texto, correta: editRespostaForm.correta } : r));
    setEditingRespostaId(null);
    toast({ title: "Resposta atualizada" });
  };

  const deleteResposta = () => {
    if (confirmDeleteResposta == null) return;
    setRespostas((prev) => prev.filter((r) => r.id !== confirmDeleteResposta));
    setConfirmDeleteResposta(null);
    toast({ title: "Resposta removida" });
  };

  const deletePergunta = () => {
    if (confirmDeletePergunta == null) return;
    setPerguntas((prev) => prev.filter((p) => p.id !== confirmDeletePergunta));
    setRespostas((prev) => prev.filter((r) => r.perguntaId !== confirmDeletePergunta));
    setConfirmDeletePergunta(null);
    toast({ title: "Pergunta removida" });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Listar Perguntas"
        subtitle="Banco de perguntas e respostas para exames de acesso"
        actions={<Button onClick={openCreatePergunta}><Plus className="h-4 w-4 mr-2" />Nova Pergunta</Button>}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar enunciado..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={filtroTopico} onValueChange={setFiltroTopico}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Tópico" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tópicos</SelectItem>
                {TOPICOS.map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.nome}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filtroDificuldade} onValueChange={setFiltroDificuldade}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Dificuldade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Enunciado</TableHead>
                <TableHead>Tópico</TableHead>
                <TableHead>Dificuldade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Respostas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Nenhuma pergunta encontrada.</TableCell></TableRow>
              )}
              {filtered.map((p) => {
                const total = respostasDe(p.id).length;
                return (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell className="max-w-[320px] truncate" title={p.enunciado}>{p.enunciado}</TableCell>
                    <TableCell>{p.topico}</TableCell>
                    <TableCell><Badge variant={dificuldadeBadge(p.dificuldade)}>{p.dificuldade}</Badge></TableCell>
                    <TableCell>{p.tipo}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{total}</Badge>
                    </TableCell>
                    <TableCell><Badge variant={p.estado === "Activa" ? "default" : "secondary"}>{p.estado}</Badge></TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openRespostas(p)} title="Gerir respostas">
                        <ListChecks className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEditPergunta(p)} title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDeletePergunta(p.id)} title="Remover">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pergunta Create/Edit */}
      <Dialog open={pDialogOpen} onOpenChange={setPDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPergunta ? "Editar Pergunta" : "Nova Pergunta"}</DialogTitle>
            <DialogDescription>Preencha os dados da pergunta.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="enunciado">Enunciado *</Label>
              <Textarea id="enunciado" rows={3} value={pForm.enunciado} onChange={(e) => setPForm((s) => ({ ...s, enunciado: e.target.value }))} placeholder="Escreva o enunciado da pergunta..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tópico *</Label>
                <Select value={pForm.topicoId} onValueChange={(v) => setPForm((s) => ({ ...s, topicoId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccione" /></SelectTrigger>
                  <SelectContent>
                    {TOPICOS.map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.nome}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Dificuldade</Label>
                <Select value={pForm.dificuldade} onValueChange={(v) => setPForm((s) => ({ ...s, dificuldade: v as Pergunta["dificuldade"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fácil">Fácil</SelectItem>
                    <SelectItem value="Médio">Médio</SelectItem>
                    <SelectItem value="Difícil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={pForm.tipo} onValueChange={(v) => setPForm((s) => ({ ...s, tipo: v as Pergunta["tipo"] }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Escolha Múltipla">Escolha Múltipla</SelectItem>
                    <SelectItem value="Desenvolvimento">Desenvolvimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pontuacao">Pontuação</Label>
                <Input id="pontuacao" type="number" min={0} step={0.5} value={pForm.pontuacao} onChange={(e) => setPForm((s) => ({ ...s, pontuacao: Number(e.target.value) }))} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <div>
                <Label htmlFor="estado">Pergunta activa</Label>
                <p className="text-xs text-muted-foreground">Inactivas não entram em provas.</p>
              </div>
              <Switch id="estado" checked={pForm.estado} onCheckedChange={(v) => setPForm((s) => ({ ...s, estado: v }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPDialogOpen(false)}>Cancelar</Button>
            <Button onClick={savePergunta}>{editingPergunta ? "Guardar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Respostas Manager */}
      <Dialog open={rDialogOpen} onOpenChange={setRDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5" />Respostas</DialogTitle>
            <DialogDescription className="line-clamp-2">{activePergunta?.enunciado}</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="lista" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lista">Lista ({activePergunta ? respostasDe(activePergunta.id).length : 0})</TabsTrigger>
              <TabsTrigger value="nova">Nova resposta</TabsTrigger>
            </TabsList>
            <TabsContent value="lista" className="space-y-2 mt-4 max-h-[400px] overflow-y-auto">
              {activePergunta && respostasDe(activePergunta.id).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">Sem respostas. Adicione uma na aba "Nova resposta".</p>
              )}
              {activePergunta && respostasDe(activePergunta.id).map((r) => (
                <div key={r.id} className="rounded-md border p-3">
                  {editingRespostaId === r.id ? (
                    <div className="space-y-3">
                      <Textarea rows={2} value={editRespostaForm.texto} onChange={(e) => setEditRespostaForm((s) => ({ ...s, texto: e.target.value }))} />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={editRespostaForm.correta} onCheckedChange={(v) => setEditRespostaForm((s) => ({ ...s, correta: v }))} />
                          <Label className="text-sm">Correcta</Label>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingRespostaId(null)}>Cancelar</Button>
                          <Button size="sm" onClick={saveEditResposta}><Save className="h-3 w-3 mr-1" />Guardar</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 flex-1">
                        {r.correta ? (
                          <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{r.texto}</p>
                          {r.correta && <Badge variant="default" className="mt-1 text-xs">Resposta correcta</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEditResposta(r)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => setConfirmDeleteResposta(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="nova" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="novoTexto">Texto da resposta</Label>
                <Textarea id="novoTexto" rows={3} value={novaResposta.texto} onChange={(e) => setNovaResposta((s) => ({ ...s, texto: e.target.value }))} placeholder="Escreva a resposta..." />
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <Label htmlFor="correta">Marcar como correcta</Label>
                <Switch id="correta" checked={novaResposta.correta} onCheckedChange={(v) => setNovaResposta((s) => ({ ...s, correta: v }))} />
              </div>
              <Button onClick={addResposta} className="w-full" disabled={!novaResposta.texto.trim()}>
                <Plus className="h-4 w-4 mr-2" />Adicionar resposta
              </Button>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRDialogOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete pergunta */}
      <Dialog open={confirmDeletePergunta !== null} onOpenChange={(o) => !o && setConfirmDeletePergunta(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover pergunta</DialogTitle>
            <DialogDescription>Todas as respostas associadas serão também removidas. Continuar?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeletePergunta(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={deletePergunta}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete resposta */}
      <Dialog open={confirmDeleteResposta !== null} onOpenChange={(o) => !o && setConfirmDeleteResposta(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover resposta</DialogTitle>
            <DialogDescription>Esta acção não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDeleteResposta(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={deleteResposta}>Remover</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
