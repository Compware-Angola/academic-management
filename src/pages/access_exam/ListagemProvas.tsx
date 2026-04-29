import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Home, FileCheck, Search, Plus, Eye, Pencil, Trash2, Printer, FileText,
    ChevronLeft, ChevronRight, RefreshCw, Calendar, Clock, MapPin, Users, ListChecks,
    CheckCircle2, XCircle, HelpCircle, BookOpen, Award, Hash, GraduationCap, Building2, AlertCircle
} from "lucide-react";

interface Resposta {
    id: number;
    texto: string;
    correta: boolean;
}

interface Questao {
    id: number;
    numero: number;
    enunciado: string;
    tipo: "Múltipla Escolha" | "Verdadeiro/Falso" | "Dissertativa";
    dificuldade: "Fácil" | "Média" | "Difícil";
    pontuacao: number;
    topico: string;
    respostas: Resposta[];
}

interface Prova {
    id: number;
    codigo: string;
    designacao: string;
    curso: string;
    topico: string;
    anoLetivo: string;
    data: string;
    hora: string;
    duracao: number;
    sala: string;
    totalCandidatos: number;
    totalQuestoes: number;
    pontuacaoMaxima: number;
    estado: "Agendada" | "Em Curso" | "Concluida" | "Cancelada";
    observacoes?: string;
    questoes?: Questao[];
    responsavel?: string;
    dataCriacao?: string;
}

const QUESTOES_MOCK = (count: number, topico: string): Questao[] =>
    Array.from({ length: count }).map((_, i) => {
        const tipos: Questao["tipo"][] = ["Múltipla Escolha", "Verdadeiro/Falso", "Dissertativa"];
        const difs: Questao["dificuldade"][] = ["Fácil", "Média", "Difícil"];
        const tipo = tipos[i % 3];
        const dificuldade = difs[i % 3];
        const respostas: Resposta[] = tipo === "Dissertativa"
            ? []
            : tipo === "Verdadeiro/Falso"
                ? [
                    { id: 1, texto: "Verdadeiro", correta: i % 2 === 0 },
                    { id: 2, texto: "Falso", correta: i % 2 !== 0 },
                ]
                : [
                    { id: 1, texto: `Opção A — exemplo de resposta para ${topico}`, correta: i % 4 === 0 },
                    { id: 2, texto: `Opção B — alternativa relacionada a ${topico}`, correta: i % 4 === 1 },
                    { id: 3, texto: `Opção C — distractor sobre ${topico}`, correta: i % 4 === 2 },
                    { id: 4, texto: `Opção D — possibilidade final em ${topico}`, correta: i % 4 === 3 },
                ];
        return {
            id: i + 1,
            numero: i + 1,
            enunciado: `Questão ${i + 1}: Considere o conceito de ${topico} e identifique a resposta mais adequada de acordo com os princípios estudados na unidade curricular.`,
            tipo,
            dificuldade,
            pontuacao: 1,
            topico,
            respostas,
        };
    });

const MOCK: Prova[] = [
    { id: 1, codigo: "PRV-2025-001", designacao: "Prova de Matemática Geral", curso: "Eng. Informática", topico: "Álgebra Linear", anoLetivo: "2024/2025", data: "2025-07-15", hora: "09:00", duracao: 120, sala: "LAB-01", totalCandidatos: 45, totalQuestoes: 8, pontuacaoMaxima: 20, estado: "Agendada", observacoes: "Prova com material de apoio.", responsavel: "Prof. João Silva", dataCriacao: "2025-06-01", questoes: QUESTOES_MOCK(8, "Álgebra Linear") },
    { id: 2, codigo: "PRV-2025-002", designacao: "Prova de Biologia", curso: "Medicina", topico: "Anatomia", anoLetivo: "2024/2025", data: "2025-07-15", hora: "14:00", duracao: 120, sala: "SALA-101", totalCandidatos: 80, totalQuestoes: 10, pontuacaoMaxima: 20, estado: "Em Curso", responsavel: "Profª. Maria Costa", dataCriacao: "2025-06-05", questoes: QUESTOES_MOCK(10, "Anatomia") },
    { id: 3, codigo: "PRV-2025-003", designacao: "Prova de Direito Constitucional", curso: "Direito", topico: "Constituição", anoLetivo: "2024/2025", data: "2025-07-10", hora: "09:00", duracao: 90, sala: "SALA-205", totalCandidatos: 60, totalQuestoes: 6, pontuacaoMaxima: 20, estado: "Concluida", responsavel: "Prof. Carlos Mendes", dataCriacao: "2025-05-20", questoes: QUESTOES_MOCK(6, "Constituição") },
    { id: 4, codigo: "PRV-2025-004", designacao: "Prova de Economia", curso: "Economia", topico: "Microeconomia", anoLetivo: "2024/2025", data: "2025-07-20", hora: "10:00", duracao: 120, sala: "SALA-301", totalCandidatos: 55, totalQuestoes: 9, pontuacaoMaxima: 20, estado: "Agendada", responsavel: "Profª. Ana Pereira", dataCriacao: "2025-06-10", questoes: QUESTOES_MOCK(9, "Microeconomia") },
    { id: 5, codigo: "PRV-2025-005", designacao: "Prova de Física Aplicada", curso: "Eng. Civil", topico: "Mecânica", anoLetivo: "2024/2025", data: "2025-06-28", hora: "08:00", duracao: 120, sala: "LAB-02", totalCandidatos: 40, totalQuestoes: 7, pontuacaoMaxima: 20, estado: "Cancelada", observacoes: "Cancelada por motivos logísticos.", responsavel: "Prof. Pedro Lima", dataCriacao: "2025-05-15", questoes: QUESTOES_MOCK(7, "Mecânica") },
    { id: 6, codigo: "PRV-2025-006", designacao: "Prova de Português", curso: "Letras", topico: "Gramática", anoLetivo: "2024/2025", data: "2025-07-22", hora: "14:00", duracao: 90, sala: "SALA-102", totalCandidatos: 70, totalQuestoes: 8, pontuacaoMaxima: 20, estado: "Agendada", responsavel: "Profª. Sofia Rocha", dataCriacao: "2025-06-12", questoes: QUESTOES_MOCK(8, "Gramática") },
];

const ESTADO_VARIANT: Record<Prova["estado"], "default" | "secondary" | "destructive" | "outline"> = {
    Agendada: "secondary",
    "Em Curso": "default",
    Concluida: "outline",
    Cancelada: "destructive",
};

const DIFICULDADE_COLOR: Record<Questao["dificuldade"], string> = {
    Fácil: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    Média: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    Difícil: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
};

export default function ListagemProvas() {
    const { toast } = useToast();
    const [provas, setProvas] = useState<Prova[]>(MOCK);
    const [search, setSearch] = useState("");
    const [curso, setCurso] = useState("all");
    const [estado, setEstado] = useState("all");
    const [anoLetivo, setAnoLetivo] = useState("all");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const [viewing, setViewing] = useState<Prova | null>(null);
    const [editing, setEditing] = useState<Prova | null>(null);
    const [deleting, setDeleting] = useState<Prova | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<Partial<Prova>>({});

    const cursos = useMemo(() => Array.from(new Set(provas.map(p => p.curso))), [provas]);
    const anos = useMemo(() => Array.from(new Set(provas.map(p => p.anoLetivo))), [provas]);

    const filtered = useMemo(() => provas.filter(p => {
        const s = search.toLowerCase();
        const matchSearch = !s || p.codigo.toLowerCase().includes(s) || p.designacao.toLowerCase().includes(s) || p.topico.toLowerCase().includes(s);
        const matchCurso = curso === "all" || p.curso === curso;
        const matchEstado = estado === "all" || p.estado === estado;
        const matchAno = anoLetivo === "all" || p.anoLetivo === anoLetivo;
        return matchSearch && matchCurso && matchEstado && matchAno;
    }), [provas, search, curso, estado, anoLetivo]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const paginated = filtered.slice((page - 1) * perPage, page * perPage);

    const openEdit = (p: Prova) => { setEditing(p); setForm(p); };
    const openCreate = () => {
        setCreating(true);
        setForm({ codigo: "", designacao: "", curso: "", topico: "", anoLetivo: "2024/2025", data: "", hora: "", duracao: 120, sala: "", totalCandidatos: 0, totalQuestoes: 0, pontuacaoMaxima: 20, estado: "Agendada" });
    };

    const handleSave = () => {
        if (!form.designacao || !form.codigo || !form.curso) {
            toast({ title: "Campos obrigatórios", description: "Código, designação e curso são obrigatórios.", variant: "destructive" });
            return;
        }
        if (editing) {
            setProvas(prev => prev.map(p => p.id === editing.id ? { ...editing, ...form } as Prova : p));
            toast({ title: "Prova actualizada", description: `${form.codigo} foi actualizada.` });
            setEditing(null);
        } else if (creating) {
            const newId = Math.max(0, ...provas.map(p => p.id)) + 1;
            setProvas(prev => [{ ...(form as Prova), id: newId }, ...prev]);
            toast({ title: "Prova criada", description: `${form.codigo} foi adicionada.` });
            setCreating(false);
        }
        setForm({});
    };

    const handleDelete = () => {
        if (!deleting) return;
        setProvas(prev => prev.filter(p => p.id !== deleting.id));
        toast({ title: "Prova eliminada", description: `${deleting.codigo} foi removida.`, variant: "destructive" });
        setDeleting(null);
    };

    const printProva = (p: Prova) => {
        const w = window.open("", "_blank", "width=800,height=900");
        if (!w) return;
        w.document.write(`
      <html><head><title>Prova ${p.codigo}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:40px;color:#222}
        h1{border-bottom:2px solid #333;padding-bottom:8px}
        .meta{margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .meta div{padding:6px 0}
        .questao{border:1px solid #ccc;padding:12px;margin:12px 0;border-radius:4px}
        .footer{margin-top:40px;text-align:center;font-size:12px;color:#666}
      </style></head><body>
      <h1>${p.designacao}</h1>
      <div class="meta">
        <div><b>Código:</b> ${p.codigo}</div>
        <div><b>Curso:</b> ${p.curso}</div>
        <div><b>Data:</b> ${p.data} ${p.hora}</div>
        <div><b>Duração:</b> ${p.duracao} min</div>
        <div><b>Sala:</b> ${p.sala}</div>
        <div><b>Pontuação máxima:</b> ${p.pontuacaoMaxima}</div>
      </div>
      <h2>Questões</h2>
      ${Array.from({ length: p.totalQuestoes }).map((_, i) => `<div class="questao"><b>Questão ${i + 1}.</b> ____________________________________</div>`).join("")}
      <div class="footer">Documento gerado pelo Portal Administrativo</div>
      </body></html>
    `);
        w.document.close();
        w.print();
    };

    const printDetalhe = (p: Prova) => {
        const w = window.open("", "_blank", "width=800,height=900");
        if (!w) return;
        w.document.write(`
      <html><head><title>Detalhe Prova ${p.codigo}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:40px;color:#222}
        h1{border-bottom:2px solid #333;padding-bottom:8px}
        table{width:100%;border-collapse:collapse;margin-top:20px}
        td,th{border:1px solid #ccc;padding:10px;text-align:left}
        th{background:#f3f4f6}
      </style></head><body>
      <h1>Detalhe da Prova</h1>
      <table>
        <tr><th>Código</th><td>${p.codigo}</td></tr>
        <tr><th>Designação</th><td>${p.designacao}</td></tr>
        <tr><th>Curso</th><td>${p.curso}</td></tr>
        <tr><th>Tópico</th><td>${p.topico}</td></tr>
        <tr><th>Ano Letivo</th><td>${p.anoLetivo}</td></tr>
        <tr><th>Data</th><td>${p.data}</td></tr>
        <tr><th>Hora</th><td>${p.hora}</td></tr>
        <tr><th>Duração</th><td>${p.duracao} min</td></tr>
        <tr><th>Sala</th><td>${p.sala}</td></tr>
        <tr><th>Total Candidatos</th><td>${p.totalCandidatos}</td></tr>
        <tr><th>Total Questões</th><td>${p.totalQuestoes}</td></tr>
        <tr><th>Pontuação Máxima</th><td>${p.pontuacaoMaxima}</td></tr>
        <tr><th>Estado</th><td>${p.estado}</td></tr>
        <tr><th>Observações</th><td>${p.observacoes || "—"}</td></tr>
      </table>
      </body></html>
    `);
        w.document.close();
        w.print();
    };

    const stats = useMemo(() => ({
        total: provas.length,
        agendadas: provas.filter(p => p.estado === "Agendada").length,
        emCurso: provas.filter(p => p.estado === "Em Curso").length,
        concluidas: provas.filter(p => p.estado === "Concluida").length,
    }), [provas]);

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink asChild><Link to="/"><Home className="h-4 w-4" /></Link></BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink>Portal Administrativo</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbPage>Listagem de Provas</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Listagem de Provas</h1>
                    <p className="text-muted-foreground mt-1">Gestão completa das provas de exame de acesso.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setProvas(MOCK); toast({ title: "Lista actualizada" }); }}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
                    </Button>
                    <Button size="sm" onClick={openCreate}>
                        <Plus className="h-4 w-4 mr-2" /> Nova Prova
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Total</p><p className="text-2xl font-bold">{stats.total}</p></div><FileCheck className="h-8 w-8 text-primary opacity-70" /></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Agendadas</p><p className="text-2xl font-bold">{stats.agendadas}</p></div><Calendar className="h-8 w-8 text-blue-500 opacity-70" /></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Em Curso</p><p className="text-2xl font-bold">{stats.emCurso}</p></div><Clock className="h-8 w-8 text-amber-500 opacity-70" /></div></CardContent></Card>
                <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Concluídas</p><p className="text-2xl font-bold">{stats.concluidas}</p></div><ListChecks className="h-8 w-8 text-emerald-500 opacity-70" /></div></CardContent></Card>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <Label>Pesquisar</Label>
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input className="pl-9" placeholder="Código, designação ou tópico..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Curso</Label>
                        <Select value={curso} onValueChange={v => { setCurso(v); setPage(1); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos os cursos</SelectItem>
                                {cursos.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Ano Letivo</Label>
                        <Select value={anoLetivo} onValueChange={v => { setAnoLetivo(v); setPage(1); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {anos.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Estado</Label>
                        <Select value={estado} onValueChange={v => { setEstado(v); setPage(1); }}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Agendada">Agendada</SelectItem>
                                <SelectItem value="Em Curso">Em Curso</SelectItem>
                                <SelectItem value="Concluida">Concluída</SelectItem>
                                <SelectItem value="Cancelada">Cancelada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="bg-card border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Designação</TableHead>
                            <TableHead>Curso</TableHead>
                            <TableHead>Data / Hora</TableHead>
                            <TableHead>Sala</TableHead>
                            <TableHead className="text-center">Candidatos</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">Nenhuma prova encontrada.</TableCell></TableRow>
                        ) : paginated.map(p => (
                            <TableRow key={p.id}>
                                <TableCell className="font-mono font-semibold">{p.codigo}</TableCell>
                                <TableCell>
                                    <div className="font-medium">{p.designacao}</div>
                                    <div className="text-xs text-muted-foreground">{p.topico}</div>
                                </TableCell>
                                <TableCell>{p.curso}</TableCell>
                                <TableCell>
                                    <div className="text-sm">{p.data}</div>
                                    <div className="text-xs text-muted-foreground">{p.hora} • {p.duracao}min</div>
                                </TableCell>
                                <TableCell><Badge variant="outline">{p.sala}</Badge></TableCell>
                                <TableCell className="text-center font-medium">{p.totalCandidatos}</TableCell>
                                <TableCell><Badge variant={ESTADO_VARIANT[p.estado]}>{p.estado}</Badge></TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" title="Ver detalhes" onClick={() => setViewing(p)}><Eye className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" title="Editar" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" title="Imprimir prova" onClick={() => printProva(p)}><Printer className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" title="Imprimir detalhe" onClick={() => printDetalhe(p)}><FileText className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" title="Eliminar" onClick={() => setDeleting(p)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Mostrar</span>
                    <Select value={perPage.toString()} onValueChange={v => { setPerPage(Number(v)); setPage(1); }}>
                        <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {[10, 25, 50, 100].map(n => <SelectItem key={n} value={n.toString()}>{n}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">por página — Total: {filtered.length}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm">Página {page} de {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
            </div>

            {/* Ver detalhes */}
            <Dialog open={!!viewing} onOpenChange={o => !o && setViewing(null)}>
                <DialogContent className="max-w-4xl! max-h-[92vh]! flex flex-col p-0 gap-0">
                    {viewing && (
                        <>
                            <DialogHeader className="px-6 pt-6 pb-4 border-b">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <DialogTitle className="text-2xl">{viewing.designacao}</DialogTitle>
                                        <DialogDescription className="flex items-center gap-2 font-mono">
                                            <Hash className="h-3.5 w-3.5" /> {viewing.codigo}
                                        </DialogDescription>
                                    </div>
                                    <Badge variant={ESTADO_VARIANT[viewing.estado]} className="text-sm">{viewing.estado}</Badge>
                                </div>
                            </DialogHeader>

                            <Tabs defaultValue="resumo" className="flex-1 flex flex-col overflow-hidden">
                                <TabsList className="mx-6 mt-4 w-fit">
                                    <TabsTrigger value="resumo"><FileText className="h-4 w-4 mr-2" /> Resumo</TabsTrigger>
                                    <TabsTrigger value="questoes">
                                        <ListChecks className="h-4 w-4 mr-2" /> Questões
                                        <Badge variant="secondary" className="ml-2">{viewing.questoes?.length ?? 0}</Badge>
                                    </TabsTrigger>
                                    <TabsTrigger value="estatisticas"><Award className="h-4 w-4 mr-2" /> Estatísticas</TabsTrigger>
                                </TabsList>

                                <ScrollArea className="flex-1 px-6 pb-4">
                                    <TabsContent value="resumo" className="mt-4 space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            <Card className="border-l-4 border-l-primary">
                                                <CardContent className="pt-4 pb-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs"><GraduationCap className="h-3.5 w-3.5" /> Curso</div>
                                                    <p className="font-semibold mt-1">{viewing.curso}</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-l-4 border-l-blue-500">
                                                <CardContent className="pt-4 pb-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs"><BookOpen className="h-3.5 w-3.5" /> Tópico</div>
                                                    <p className="font-semibold mt-1">{viewing.topico}</p>
                                                </CardContent>
                                            </Card>
                                            <Card className="border-l-4 border-l-emerald-500">
                                                <CardContent className="pt-4 pb-4">
                                                    <div className="flex items-center gap-2 text-muted-foreground text-xs"><Calendar className="h-3.5 w-3.5" /> Ano Letivo</div>
                                                    <p className="font-semibold mt-1">{viewing.anoLetivo}</p>
                                                </CardContent>
                                            </Card>
                                        </div>

                                        <Card>
                                            <CardContent className="pt-5 pb-5">
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> Agendamento</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="h-3 w-3" /> Data</p>
                                                        <p className="font-medium mt-1">{viewing.data}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Hora</p>
                                                        <p className="font-medium mt-1">{viewing.hora}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="h-3 w-3" /> Duração</p>
                                                        <p className="font-medium mt-1">{viewing.duracao} min</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="h-3 w-3" /> Sala</p>
                                                        <p className="font-medium mt-1">{viewing.sala}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardContent className="pt-5 pb-5">
                                                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Configuração</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Candidatos</p>
                                                        <p className="font-medium mt-1 flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {viewing.totalCandidatos}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Total Questões</p>
                                                        <p className="font-medium mt-1">{viewing.questoes?.length ?? viewing.totalQuestoes}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Pontuação Máxima</p>
                                                        <p className="font-medium mt-1">{viewing.pontuacaoMaxima} pts</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Responsável</p>
                                                        <p className="font-medium mt-1 truncate">{viewing.responsavel || "—"}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {viewing.observacoes && (
                                            <Card className="bg-amber-500/5 border-amber-500/20">
                                                <CardContent className="pt-4 pb-4">
                                                    <div className="flex gap-3">
                                                        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">Observações</p>
                                                            <p className="text-sm">{viewing.observacoes}</p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="questoes" className="mt-4 space-y-3">
                                        {(viewing.questoes ?? []).length === 0 ? (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <HelpCircle className="h-10 w-10 mx-auto mb-2 opacity-40" />
                                                <p>Sem questões registadas para esta prova.</p>
                                            </div>
                                        ) : (
                                            (viewing.questoes ?? []).map(q => (
                                                <Card key={q.id} className="overflow-hidden">
                                                    <CardContent className="pt-4 pb-4">
                                                        <div className="flex items-start justify-between gap-3 mb-3">
                                                            <div className="flex items-start gap-3 flex-1">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                                                    {q.numero}
                                                                </div>
                                                                <div className="flex-1 space-y-2">
                                                                    <p className="text-sm font-medium leading-relaxed">{q.enunciado}</p>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        <Badge variant="outline" className="text-xs">{q.tipo}</Badge>
                                                                        <Badge variant="outline" className={`text-xs ${DIFICULDADE_COLOR[q.dificuldade]}`}>{q.dificuldade}</Badge>
                                                                        <Badge variant="secondary" className="text-xs">{q.pontuacao} pt{q.pontuacao !== 1 ? "s" : ""}</Badge>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {q.respostas.length > 0 && (
                                                            <>
                                                                <Separator className="my-3" />
                                                                <div className="pl-11 space-y-1.5">
                                                                    {q.respostas.map(r => (
                                                                        <div key={r.id} className={`flex items-start gap-2 p-2 rounded-md text-sm ${r.correta ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-muted/30"}`}>
                                                                            {r.correta ? (
                                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                                                                            ) : (
                                                                                <XCircle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                                                                            )}
                                                                            <span className={r.correta ? "font-medium" : ""}>{r.texto}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </>
                                                        )}
                                                        {q.respostas.length === 0 && (
                                                            <>
                                                                <Separator className="my-3" />
                                                                <div className="pl-11 text-xs text-muted-foreground italic">Resposta dissertativa — avaliação manual.</div>
                                                            </>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </TabsContent>

                                    <TabsContent value="estatisticas" className="mt-4 space-y-3">
                                        {(() => {
                                            const qs = viewing.questoes ?? [];
                                            const tipos = qs.reduce<Record<string, number>>((a, q) => { a[q.tipo] = (a[q.tipo] || 0) + 1; return a; }, {});
                                            const difs = qs.reduce<Record<string, number>>((a, q) => { a[q.dificuldade] = (a[q.dificuldade] || 0) + 1; return a; }, {});
                                            const totalPts = qs.reduce((a, q) => a + q.pontuacao, 0);
                                            return (
                                                <>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">Total Questões</p><p className="text-2xl font-bold mt-1">{qs.length}</p></CardContent></Card>
                                                        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">Total Pontos</p><p className="text-2xl font-bold mt-1">{totalPts}</p></CardContent></Card>
                                                        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">Candidatos</p><p className="text-2xl font-bold mt-1">{viewing.totalCandidatos}</p></CardContent></Card>
                                                        <Card><CardContent className="pt-4 pb-4 text-center"><p className="text-xs text-muted-foreground">Duração</p><p className="text-2xl font-bold mt-1">{viewing.duracao}<span className="text-sm font-normal text-muted-foreground">min</span></p></CardContent></Card>
                                                    </div>
                                                    <Card>
                                                        <CardContent className="pt-5 pb-5">
                                                            <h4 className="text-sm font-semibold mb-3">Distribuição por Tipo</h4>
                                                            <div className="space-y-2">
                                                                {Object.entries(tipos).map(([k, v]) => (
                                                                    <div key={k} className="flex items-center gap-3">
                                                                        <span className="text-sm w-40">{k}</span>
                                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                                            <div className="h-full bg-primary rounded-full" style={{ width: `${(v / qs.length) * 100}%` }} />
                                                                        </div>
                                                                        <span className="text-sm font-medium w-8 text-right">{v}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card>
                                                        <CardContent className="pt-5 pb-5">
                                                            <h4 className="text-sm font-semibold mb-3">Distribuição por Dificuldade</h4>
                                                            <div className="space-y-2">
                                                                {Object.entries(difs).map(([k, v]) => (
                                                                    <div key={k} className="flex items-center gap-3">
                                                                        <Badge variant="outline" className={`text-xs w-20 justify-center ${DIFICULDADE_COLOR[k as Questao["dificuldade"]]}`}>{k}</Badge>
                                                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                                            <div className={`h-full rounded-full ${k === "Fácil" ? "bg-emerald-500" : k === "Média" ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${(v / qs.length) * 100}%` }} />
                                                                        </div>
                                                                        <span className="text-sm font-medium w-8 text-right">{v}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </>
                                            );
                                        })()}
                                    </TabsContent>
                                </ScrollArea>
                            </Tabs>

                            <DialogFooter className="px-6 py-4 border-t bg-muted/30">
                                <Button variant="outline" onClick={() => printProva(viewing)}><Printer className="h-4 w-4 mr-2" /> Imprimir prova</Button>
                                <Button variant="outline" onClick={() => printDetalhe(viewing)}><FileText className="h-4 w-4 mr-2" /> Imprimir detalhe</Button>
                                <Button onClick={() => setViewing(null)}>Fechar</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Editar / Criar */}
            <Dialog open={!!editing || creating} onOpenChange={o => !o && (setEditing(null), setCreating(false))}>
                <DialogContent className="max-w-3xl! max-h-[90vh]! overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editing ? "Editar Prova" : "Nova Prova"}</DialogTitle>
                        <DialogDescription>{editing ? "Actualize os dados da prova." : "Preencha os dados da nova prova."}</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>Código *</Label><Input value={form.codigo || ""} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Curso *</Label><Input value={form.curso || ""} onChange={e => setForm(f => ({ ...f, curso: e.target.value }))} /></div>
                        <div className="space-y-2 col-span-2"><Label>Designação *</Label><Input value={form.designacao || ""} onChange={e => setForm(f => ({ ...f, designacao: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Tópico</Label><Input value={form.topico || ""} onChange={e => setForm(f => ({ ...f, topico: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Ano Letivo</Label><Input value={form.anoLetivo || ""} onChange={e => setForm(f => ({ ...f, anoLetivo: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Data</Label><Input type="date" value={form.data || ""} onChange={e => setForm(f => ({ ...f, data: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Hora</Label><Input type="time" value={form.hora || ""} onChange={e => setForm(f => ({ ...f, hora: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Duração (min)</Label><Input type="number" value={form.duracao ?? ""} onChange={e => setForm(f => ({ ...f, duracao: Number(e.target.value) }))} /></div>
                        <div className="space-y-2"><Label>Sala</Label><Input value={form.sala || ""} onChange={e => setForm(f => ({ ...f, sala: e.target.value }))} /></div>
                        <div className="space-y-2"><Label>Total Candidatos</Label><Input type="number" value={form.totalCandidatos ?? ""} onChange={e => setForm(f => ({ ...f, totalCandidatos: Number(e.target.value) }))} /></div>
                        <div className="space-y-2"><Label>Total Questões</Label><Input type="number" value={form.totalQuestoes ?? ""} onChange={e => setForm(f => ({ ...f, totalQuestoes: Number(e.target.value) }))} /></div>
                        <div className="space-y-2"><Label>Pontuação Máxima</Label><Input type="number" value={form.pontuacaoMaxima ?? ""} onChange={e => setForm(f => ({ ...f, pontuacaoMaxima: Number(e.target.value) }))} /></div>
                        <div className="space-y-2">
                            <Label>Estado</Label>
                            <Select value={form.estado || "Agendada"} onValueChange={v => setForm(f => ({ ...f, estado: v as Prova["estado"] }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Agendada">Agendada</SelectItem>
                                    <SelectItem value="Em Curso">Em Curso</SelectItem>
                                    <SelectItem value="Concluida">Concluída</SelectItem>
                                    <SelectItem value="Cancelada">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2 col-span-2"><Label>Observações</Label><Textarea value={form.observacoes || ""} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} /></div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</Button>
                        <Button onClick={handleSave}>{editing ? "Guardar alterações" : "Criar prova"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Eliminar */}
            <AlertDialog open={!!deleting} onOpenChange={o => !o && setDeleting(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar prova?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acção é irreversível. A prova <b>{deleting?.codigo}</b> — {deleting?.designacao} será removida permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
