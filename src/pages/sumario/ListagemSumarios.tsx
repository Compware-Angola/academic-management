import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FileText, Download, Printer, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Sumario {
  id: string;
  unidadeCurricular: string;
  curso: string;
  docente: string;
  tema: string;
  conteudo: string;
  dataAula: string;
  horaInicio: string;
  horaFim: string;
  turma: string;
  sala: string;
  tipoAula: string;
  estado: "leccionado" | "pendente" | "cancelado";
  totalPresentes: number;
  totalAlunos: number;
}

const mockSumarios: Sumario[] = [
  {
    id: "SUM-001",
    unidadeCurricular: "Programação I",
    curso: "Engenharia Informática",
    docente: "Prof. Manuel Santos",
    tema: "Introdução às Estruturas de Dados",
    conteudo: "Arrays, Listas Ligadas, Pilhas e Filas. Conceitos fundamentais e implementação em Java.",
    dataAula: "2025-03-01",
    horaInicio: "08:00",
    horaFim: "10:00",
    turma: "T1-EI",
    sala: "Sala A101",
    tipoAula: "Teórica",
    estado: "leccionado",
    totalPresentes: 42,
    totalAlunos: 50,
  },
  {
    id: "SUM-002",
    unidadeCurricular: "Bases de Dados",
    curso: "Engenharia Informática",
    docente: "Prof.ª Ana Ferreira",
    tema: "Normalização de Bases de Dados",
    conteudo: "Formas normais (1FN, 2FN, 3FN, BCNF). Dependências funcionais e decomposição.",
    dataAula: "2025-03-01",
    horaInicio: "10:30",
    horaFim: "12:30",
    turma: "T2-EI",
    sala: "Sala B205",
    tipoAula: "Teórico-Prática",
    estado: "leccionado",
    totalPresentes: 38,
    totalAlunos: 45,
  },
  {
    id: "SUM-003",
    unidadeCurricular: "Cálculo II",
    curso: "Engenharia Civil",
    docente: "Prof. João Mendes",
    tema: "Integrais Duplos",
    conteudo: "Cálculo de integrais duplos em coordenadas cartesianas e polares.",
    dataAula: "2025-03-02",
    horaInicio: "08:00",
    horaFim: "10:00",
    turma: "T1-EC",
    sala: "Sala C102",
    tipoAula: "Teórica",
    estado: "pendente",
    totalPresentes: 0,
    totalAlunos: 55,
  },
  {
    id: "SUM-004",
    unidadeCurricular: "Redes de Computadores",
    curso: "Engenharia Informática",
    docente: "Prof. Carlos Dias",
    tema: "Protocolo TCP/IP",
    conteudo: "Camadas do modelo TCP/IP, endereçamento IP, sub-redes e roteamento básico.",
    dataAula: "2025-03-02",
    horaInicio: "14:00",
    horaFim: "16:00",
    turma: "T1-EI",
    sala: "Lab. Redes",
    tipoAula: "Prática",
    estado: "leccionado",
    totalPresentes: 30,
    totalAlunos: 35,
  },
  {
    id: "SUM-005",
    unidadeCurricular: "Física I",
    curso: "Engenharia Mecânica",
    docente: "Prof.ª Maria Lopes",
    tema: "Dinâmica de Partículas",
    conteudo: "Leis de Newton aplicadas a sistemas de partículas. Forças de atrito e resistência.",
    dataAula: "2025-03-03",
    horaInicio: "08:00",
    horaFim: "10:00",
    turma: "T1-EM",
    sala: "Sala D301",
    tipoAula: "Teórica",
    estado: "cancelado",
    totalPresentes: 0,
    totalAlunos: 60,
  },
  {
    id: "SUM-006",
    unidadeCurricular: "Programação I",
    curso: "Engenharia Informática",
    docente: "Prof. Manuel Santos",
    tema: "Algoritmos de Ordenação",
    conteudo: "Bubble Sort, Selection Sort, Insertion Sort e Merge Sort. Análise de complexidade.",
    dataAula: "2025-03-03",
    horaInicio: "10:30",
    horaFim: "12:30",
    turma: "T1-EI",
    sala: "Lab. Info 2",
    tipoAula: "Prática",
    estado: "leccionado",
    totalPresentes: 47,
    totalAlunos: 50,
  },
];

const estadoBadge = (estado: Sumario["estado"]) => {
  switch (estado) {
    case "leccionado":
      return <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Leccionado</Badge>;
    case "pendente":
      return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pendente</Badge>;
    case "cancelado":
      return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelado</Badge>;
  }
};

export default function ListagemSumarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("todos");
  const [filtroUC, setFiltroUC] = useState("todos");
  const [filtroDocente, setFiltroDocente] = useState("todos");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipoAula, setFiltroTipoAula] = useState("todos");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSumario, setSelectedSumario] = useState<Sumario | null>(null);

  const cursos = [...new Set(mockSumarios.map((s) => s.curso))];
  const ucs = [...new Set(mockSumarios.map((s) => s.unidadeCurricular))];
  const docentes = [...new Set(mockSumarios.map((s) => s.docente))];

  const filteredData = mockSumarios.filter((s) => {
    const matchSearch =
      s.tema.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.unidadeCurricular.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.docente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCurso = filtroCurso === "todos" || s.curso === filtroCurso;
    const matchUC = filtroUC === "todos" || s.unidadeCurricular === filtroUC;
    const matchDocente = filtroDocente === "todos" || s.docente === filtroDocente;
    const matchEstado = filtroEstado === "todos" || s.estado === filtroEstado;
    const matchTipo = filtroTipoAula === "todos" || s.tipoAula === filtroTipoAula;
    return matchSearch && matchCurso && matchUC && matchDocente && matchEstado && matchTipo;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalLeccionados = mockSumarios.filter((s) => s.estado === "leccionado").length;
  const totalPendentes = mockSumarios.filter((s) => s.estado === "pendente").length;
  const totalCancelados = mockSumarios.filter((s) => s.estado === "cancelado").length;

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Início</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Sumário</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Listagem de Sumários</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Listagem de Sumários</h1>
          <p className="text-muted-foreground">Consulte todos os sumários leccionados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("A exportar Excel...")}>
            <Download className="h-4 w-4 mr-1" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("A exportar PDF...")}>
            <FileText className="h-4 w-4 mr-1" /> PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-1" /> Imprimir
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground">{mockSumarios.length}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Leccionados</p>
          <p className="text-2xl font-bold text-emerald-600">{totalLeccionados}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Pendentes</p>
          <p className="text-2xl font-bold text-amber-600">{totalPendentes}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-muted-foreground">Cancelados</p>
          <p className="text-2xl font-bold text-red-600">{totalCancelados}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar por tema, UC, docente..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-9" />
            </div>
          </div>
          <Select value={filtroCurso} onValueChange={(v) => { setFiltroCurso(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Curso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Cursos</SelectItem>
              {cursos.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroUC} onValueChange={(v) => { setFiltroUC(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="UC" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as UC</SelectItem>
              {ucs.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroDocente} onValueChange={(v) => { setFiltroDocente(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Docente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Docentes</SelectItem>
              {docentes.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={(v) => { setFiltroEstado(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Estados</SelectItem>
              <SelectItem value="leccionado">Leccionado</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Unidade Curricular</TableHead>
              <TableHead>Tema</TableHead>
              <TableHead>Docente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Presenças</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-10 text-muted-foreground">
                  Nenhum sumário encontrado com os filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.id}</TableCell>
                  <TableCell>{s.unidadeCurricular}</TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate">{s.tema}</div>
                    {s.tema.length > 30 && (
                      <button
                        className="text-xs text-primary hover:underline mt-0.5"
                        onClick={(e) => { e.stopPropagation(); toast(s.tema, { description: s.unidadeCurricular }); }}
                      >
                        ver mais
                      </button>
                    )}
                  </TableCell>
                  <TableCell>{s.docente}</TableCell>
                  <TableCell>{s.dataAula}</TableCell>
                  <TableCell>{s.horaInicio} - {s.horaFim}</TableCell>
                  <TableCell>{s.turma}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{s.tipoAula}</Badge>
                  </TableCell>
                  <TableCell>{estadoBadge(s.estado)}</TableCell>
                  <TableCell>{s.totalPresentes}/{s.totalAlunos}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSumario(s)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Itens por página:</span>
            <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              {filteredData.length} resultado(s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">Página {currentPage} de {totalPages || 1}</span>
            <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedSumario} onOpenChange={() => setSelectedSumario(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Sumário</DialogTitle>
          </DialogHeader>
          {selectedSumario && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">{selectedSumario.id}</span>
                {estadoBadge(selectedSumario.estado)}
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">UC:</span><p className="font-medium">{selectedSumario.unidadeCurricular}</p></div>
                <div><span className="text-muted-foreground">Curso:</span><p className="font-medium">{selectedSumario.curso}</p></div>
                <div><span className="text-muted-foreground">Docente:</span><p className="font-medium">{selectedSumario.docente}</p></div>
                <div><span className="text-muted-foreground">Turma:</span><p className="font-medium">{selectedSumario.turma}</p></div>
                <div><span className="text-muted-foreground">Data:</span><p className="font-medium">{selectedSumario.dataAula}</p></div>
                <div><span className="text-muted-foreground">Horário:</span><p className="font-medium">{selectedSumario.horaInicio} - {selectedSumario.horaFim}</p></div>
                <div><span className="text-muted-foreground">Sala:</span><p className="font-medium">{selectedSumario.sala}</p></div>
                <div><span className="text-muted-foreground">Tipo:</span><p className="font-medium">{selectedSumario.tipoAula}</p></div>
                <div><span className="text-muted-foreground">Presenças:</span><p className="font-medium">{selectedSumario.totalPresentes}/{selectedSumario.totalAlunos}</p></div>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Tema:</span>
                <p className="font-semibold">{selectedSumario.tema}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Conteúdo:</span>
                <p className="text-sm">{selectedSumario.conteudo}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
