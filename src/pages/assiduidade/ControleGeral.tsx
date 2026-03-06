import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Search, Download, Printer, FileText, ChevronLeft, ChevronRight, ArrowUpDown, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface ControleItem {
  codigo: string;
  aula: string;
  uc: string;
  docente: string;
  data: string;
  horario: string;
  turma: string;
  sala: string;
  estado: "agendada" | "em_curso" | "concluida" | "cancelada";
  sumarios: {
    pendentes: number;
    lancados: number;
    total: number;
  };
  assiduidades: {
    pendentes: number;
    presenca: number;
    falta: number;
    total: number;
  };
  sumariosComAssiduidade: number;
}

const mockData: ControleItem[] = [
  {
    codigo: "AG-001", aula: "Aula 01", uc: "Programação I", docente: "Prof. Manuel Santos",
    data: "2025-03-10", horario: "08:00 - 10:00", turma: "T1-EI", sala: "Sala A101", estado: "concluida",
    sumarios: { pendentes: 0, lancados: 3, total: 3 },
    assiduidades: { pendentes: 0, presenca: 28, falta: 2, total: 30 },
    sumariosComAssiduidade: 3,
  },
  {
    codigo: "AG-002", aula: "Aula 02", uc: "Bases de Dados", docente: "Prof.ª Ana Ferreira",
    data: "2025-03-10", horario: "10:30 - 12:30", turma: "T2-EI", sala: "Lab. Info 1", estado: "concluida",
    sumarios: { pendentes: 1, lancados: 2, total: 3 },
    assiduidades: { pendentes: 2, presenca: 25, falta: 3, total: 30 },
    sumariosComAssiduidade: 2,
  },
  {
    codigo: "AG-003", aula: "Aula 03", uc: "Matemática Discreta", docente: "Prof. João Baptista",
    data: "2025-03-11", horario: "08:00 - 10:00", turma: "T1-EI", sala: "Sala B203", estado: "agendada",
    sumarios: { pendentes: 3, lancados: 0, total: 3 },
    assiduidades: { pendentes: 30, presenca: 0, falta: 0, total: 30 },
    sumariosComAssiduidade: 0,
  },
  {
    codigo: "AG-004", aula: "Aula 04", uc: "Redes de Computadores", docente: "Prof. Carlos Mendes",
    data: "2025-03-11", horario: "10:30 - 12:30", turma: "T1-RC", sala: "Lab. Redes", estado: "em_curso",
    sumarios: { pendentes: 2, lancados: 1, total: 3 },
    assiduidades: { pendentes: 10, presenca: 18, falta: 2, total: 30 },
    sumariosComAssiduidade: 1,
  },
  {
    codigo: "AG-005", aula: "Aula 05", uc: "Engenharia de Software", docente: "Prof.ª Maria Lopes",
    data: "2025-03-12", horario: "14:00 - 16:00", turma: "T2-EI", sala: "Sala C102", estado: "concluida",
    sumarios: { pendentes: 0, lancados: 4, total: 4 },
    assiduidades: { pendentes: 0, presenca: 30, falta: 5, total: 35 },
    sumariosComAssiduidade: 4,
  },
  {
    codigo: "AG-006", aula: "Aula 06", uc: "Sistemas Operativos", docente: "Prof. Manuel Santos",
    data: "2025-03-12", horario: "16:30 - 18:30", turma: "T1-EI", sala: "Sala A101", estado: "cancelada",
    sumarios: { pendentes: 0, lancados: 0, total: 2 },
    assiduidades: { pendentes: 0, presenca: 0, falta: 0, total: 0 },
    sumariosComAssiduidade: 0,
  },
  {
    codigo: "AG-007", aula: "Aula 07", uc: "Inteligência Artificial", docente: "Prof.ª Ana Ferreira",
    data: "2025-03-13", horario: "08:00 - 10:00", turma: "T3-EI", sala: "Lab. Info 2", estado: "concluida",
    sumarios: { pendentes: 0, lancados: 2, total: 2 },
    assiduidades: { pendentes: 0, presenca: 22, falta: 3, total: 25 },
    sumariosComAssiduidade: 2,
  },
  {
    codigo: "AG-008", aula: "Aula 08", uc: "Programação II", docente: "Prof. João Baptista",
    data: "2025-03-13", horario: "10:30 - 12:30", turma: "T1-EI", sala: "Sala A101", estado: "agendada",
    sumarios: { pendentes: 2, lancados: 0, total: 2 },
    assiduidades: { pendentes: 28, presenca: 0, falta: 0, total: 28 },
    sumariosComAssiduidade: 0,
  },
  {
    codigo: "AG-009", aula: "Aula 09", uc: "Estatística", docente: "Prof. Carlos Mendes",
    data: "2025-03-14", horario: "08:00 - 10:00", turma: "T2-RC", sala: "Sala B105", estado: "concluida",
    sumarios: { pendentes: 0, lancados: 3, total: 3 },
    assiduidades: { pendentes: 0, presenca: 26, falta: 4, total: 30 },
    sumariosComAssiduidade: 3,
  },
  {
    codigo: "AG-010", aula: "Aula 10", uc: "Álgebra Linear", docente: "Prof.ª Maria Lopes",
    data: "2025-03-14", horario: "14:00 - 16:00", turma: "T1-EI", sala: "Sala C102", estado: "em_curso",
    sumarios: { pendentes: 1, lancados: 1, total: 2 },
    assiduidades: { pendentes: 5, presenca: 20, falta: 3, total: 28 },
    sumariosComAssiduidade: 1,
  },
  {
    codigo: "AG-011", aula: "Aula 11", uc: "Programação I", docente: "Prof. Manuel Santos",
    data: "2025-03-15", horario: "08:00 - 10:00", turma: "T1-EI", sala: "Sala A101", estado: "concluida",
    sumarios: { pendentes: 0, lancados: 2, total: 2 },
    assiduidades: { pendentes: 0, presenca: 27, falta: 3, total: 30 },
    sumariosComAssiduidade: 2,
  },
  {
    codigo: "AG-012", aula: "Aula 12", uc: "Bases de Dados", docente: "Prof.ª Ana Ferreira",
    data: "2025-03-15", horario: "10:30 - 12:30", turma: "T2-EI", sala: "Lab. Info 1", estado: "agendada",
    sumarios: { pendentes: 3, lancados: 0, total: 3 },
    assiduidades: { pendentes: 30, presenca: 0, falta: 0, total: 30 },
    sumariosComAssiduidade: 0,
  },
];

const estadoBadge = (estado: ControleItem["estado"]) => {
  const map = {
    agendada: { label: "Agendada", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
    em_curso: { label: "Em Curso", className: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" },
    concluida: { label: "Concluída", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
    cancelada: { label: "Cancelada", className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  };
  const { label, className } = map[estado];
  return <Badge variant="outline" className={className}>{label}</Badge>;
};

type SortField = "codigo" | "docente" | "data" | "uc" | "estado";

export default function ControleGeral() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroDocente, setFiltroDocente] = useState("todos");
  const [filtroCurso, setFiltroCurso] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("codigo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const docentes = useMemo(() => [...new Set(mockData.map(d => d.docente))], []);

  const filteredData = useMemo(() => {
    let data = [...mockData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(d =>
        d.codigo.toLowerCase().includes(term) ||
        d.aula.toLowerCase().includes(term) ||
        d.uc.toLowerCase().includes(term) ||
        d.docente.toLowerCase().includes(term) ||
        d.turma.toLowerCase().includes(term)
      );
    }

    if (filtroEstado !== "todos") data = data.filter(d => d.estado === filtroEstado);
    if (filtroDocente !== "todos") data = data.filter(d => d.docente === filtroDocente);

    data.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortField === "data") return dir * a.data.localeCompare(b.data);
      return dir * String(a[sortField]).localeCompare(String(b[sortField]));
    });

    return data;
  }, [searchTerm, filtroEstado, filtroDocente, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  // Resumo
  const resumo = useMemo(() => {
    const r = {
      totalAulas: filteredData.length,
      agendadas: 0, emCurso: 0, concluidas: 0, canceladas: 0,
      sumPendentes: 0, sumLancados: 0, sumTotal: 0,
      assPendentes: 0, assPresenca: 0, assFalta: 0, assTotal: 0,
      comAssiduidade: 0,
    };
    filteredData.forEach(d => {
      if (d.estado === "agendada") r.agendadas++;
      if (d.estado === "em_curso") r.emCurso++;
      if (d.estado === "concluida") r.concluidas++;
      if (d.estado === "cancelada") r.canceladas++;
      r.sumPendentes += d.sumarios.pendentes;
      r.sumLancados += d.sumarios.lancados;
      r.sumTotal += d.sumarios.total;
      r.assPendentes += d.assiduidades.pendentes;
      r.assPresenca += d.assiduidades.presenca;
      r.assFalta += d.assiduidades.falta;
      r.assTotal += d.assiduidades.total;
      r.comAssiduidade += d.sumariosComAssiduidade;
    });
    return r;
  }, [filteredData]);

  const handleExport = (type: string) => toast.success(`Exportação ${type} iniciada`);

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Início</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/sumario/listagem">Sumário</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Controle Geral</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Controle Geral de Sumário & Assiduidade</h1>
          <p className="text-sm text-muted-foreground">Visão consolidada de sumários e assiduidades por aula agendada</p>
        </div>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Pesquisar por código, aula, UC, docente..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="pl-10" />
          </div>
          <Select value={filtroEstado} onValueChange={v => { setFiltroEstado(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Estados</SelectItem>
              <SelectItem value="agendada">Agendada</SelectItem>
              <SelectItem value="em_curso">Em Curso</SelectItem>
              <SelectItem value="concluida">Concluída</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroDocente} onValueChange={v => { setFiltroDocente(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Docente" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Docentes</SelectItem>
              {docentes.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("Excel")}><Download className="h-4 w-4 mr-1" />Excel</Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}><FileText className="h-4 w-4 mr-1" />PDF</Button>
            <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4 mr-1" /></Button>
          </div>
        </div>
      </Card>

      {/* Resumo Geral */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Aulas</p>
          <p className="text-2xl font-bold text-foreground">{resumo.totalAulas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Concluídas</p>
          <p className="text-2xl font-bold text-emerald-600">{resumo.concluidas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Agendadas</p>
          <p className="text-2xl font-bold text-blue-600">{resumo.agendadas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Em Curso</p>
          <p className="text-2xl font-bold text-amber-600">{resumo.emCurso}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Canceladas</p>
          <p className="text-2xl font-bold text-red-600">{resumo.canceladas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Com Assiduidade</p>
          <p className="text-2xl font-bold text-primary">{resumo.comAssiduidade}</p>
        </Card>
      </div>

      {/* Resumo Sumários vs Assiduidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Resumo de Sumários
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold text-amber-600">{resumo.sumPendentes}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Lançados</p>
              <p className="text-xl font-bold text-emerald-600">{resumo.sumLancados}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">{resumo.sumTotal}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" /> Resumo de Assiduidades
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Pendentes</p>
              <p className="text-xl font-bold text-amber-600">{resumo.assPendentes}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Presença</p>
              <p className="text-xl font-bold text-emerald-600">{resumo.assPresenca}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Falta</p>
              <p className="text-xl font-bold text-red-600">{resumo.assFalta}</p>
            </div>
            <div className="text-center p-2 rounded-md bg-muted/50">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold text-foreground">{resumo.assTotal}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabela Principal */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="border-r align-middle"><SortHeader field="codigo">Código</SortHeader></TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Aula</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle"><SortHeader field="uc">UC</SortHeader></TableHead>
                <TableHead rowSpan={2} className="border-r align-middle"><SortHeader field="docente">Docente</SortHeader></TableHead>
                <TableHead rowSpan={2} className="border-r align-middle"><SortHeader field="data">Data</SortHeader></TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Horário</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Turma</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle">Sala</TableHead>
                <TableHead rowSpan={2} className="border-r align-middle"><SortHeader field="estado">Estado</SortHeader></TableHead>
                <TableHead colSpan={3} className="text-center border-r bg-blue-50 dark:bg-blue-950/30 font-semibold">Controle de Sumários</TableHead>
                <TableHead colSpan={4} className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 font-semibold">Controle de Assiduidades</TableHead>
                <TableHead rowSpan={2} className="text-center align-middle bg-purple-50 dark:bg-purple-950/30 font-semibold">Sum. c/ Assid.</TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center border-r bg-blue-50 dark:bg-blue-950/30 text-xs">Pend.</TableHead>
                <TableHead className="text-center border-r bg-blue-50 dark:bg-blue-950/30 text-xs">Lanç.</TableHead>
                <TableHead className="text-center border-r bg-blue-50 dark:bg-blue-950/30 text-xs">Total</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Pend.</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Pres.</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Falta</TableHead>
                <TableHead className="text-center border-r bg-emerald-50 dark:bg-emerald-950/30 text-xs">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={18} className="text-center py-10 text-muted-foreground">
                    Nenhum registo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell className="border-r font-mono text-xs">{item.codigo}</TableCell>
                    <TableCell className="border-r text-sm">{item.aula}</TableCell>
                    <TableCell className="border-r text-sm font-medium">{item.uc}</TableCell>
                    <TableCell className="border-r text-sm">{item.docente}</TableCell>
                    <TableCell className="border-r text-sm whitespace-nowrap">{new Date(item.data).toLocaleDateString("pt-AO")}</TableCell>
                    <TableCell className="border-r text-sm whitespace-nowrap">{item.horario}</TableCell>
                    <TableCell className="border-r text-sm">{item.turma}</TableCell>
                    <TableCell className="border-r text-sm">{item.sala}</TableCell>
                    <TableCell className="border-r">{estadoBadge(item.estado)}</TableCell>
                    {/* Sumários */}
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10">
                      <span className={item.sumarios.pendentes > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{item.sumarios.pendentes}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10">
                      <span className="text-emerald-600 font-semibold">{item.sumarios.lancados}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10 font-semibold">{item.sumarios.total}</TableCell>
                    {/* Assiduidades */}
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className={item.assiduidades.pendentes > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{item.assiduidades.pendentes}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className="text-emerald-600 font-semibold">{item.assiduidades.presenca}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className="text-red-600 font-semibold">{item.assiduidades.falta}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10 font-semibold">{item.assiduidades.total}</TableCell>
                    {/* Sum c/ Assiduidade */}
                    <TableCell className="text-center bg-purple-50/50 dark:bg-purple-950/10">
                      <span className="font-semibold text-primary">{item.sumariosComAssiduidade}</span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mostrar</span>
            <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                {[10, 25, 50, 100].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
            <span>de {filteredData.length} registos</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">{currentPage} / {totalPages || 1}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
