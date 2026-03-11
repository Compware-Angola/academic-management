import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Search, Download, Printer, FileText, ChevronLeft, ChevronRight, ArrowUpDown, BarChart3, Filter, CalendarIcon, Calendar, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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



type SortField = "codigo" | "docente" | "data" | "uc" | "estado";

export default function SalarioDocente() {

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroDocente, setFiltroDocente] = useState("todos");
  const [filtroCurso, setFiltroCurso] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("codigo");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
   const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [anoLectivo, setAnoLectivo] = useState("2024-2025");
  const [semestre, setSemestre] = useState("1");
  const [curso, setCurso] = useState("todos");
  const [docente, setDocente] = useState("todos");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [naoCobrarFaltas, setNaoCobrarFaltas] = useState(false);
  const [exigirPresencasConfirmadas, setExigirPresencasConfirmadas] = useState(false);
  const [exigirSumariosInseridos, setExigirSumariosInseridos] = useState(false);
  const [exigirSumariosValidos, setExigirSumariosValidos] = useState(false);

  const mockData: any = [
    { id: 1, nrMec: "1001", nome: "Prof. Dr. João Silva", grauAcademico: "Doutorado", escalao: "A1", aulasSemanais: 12, aulasMensais: 48, totalHorasEfectivas: 46, totalFaltas: 2, ts: 8, tat: 16, ha: 4, pav: 12, totalServico: 40, ap: 8, av: 4, pfPratico: 1, totalPratico: 13, pfGeral: 1, totalGeral: 46 },
    { id: 2, nrMec: "1002", nome: "Prof.ª Dra. Maria Santos", grauAcademico: "Doutorado", escalao: "A2", aulasSemanais: 14, aulasMensais: 56, totalHorasEfectivas: 54, totalFaltas: 2, ts: 10, tat: 20, ha: 6, pav: 14, totalServico: 50, ap: 10, av: 6, pfPratico: 0, totalPratico: 16, pfGeral: 2, totalGeral: 54 },
    { id: 3, nrMec: "1003", nome: "Prof. MSc. Carlos Manuel", grauAcademico: "Mestrado", escalao: "B1", aulasSemanais: 16, aulasMensais: 64, totalHorasEfectivas: 60, totalFaltas: 4, ts: 12, tat: 24, ha: 8, pav: 16, totalServico: 60, ap: 12, av: 8, pfPratico: 2, totalPratico: 22, pfGeral: 2, totalGeral: 60 },
    { id: 4, nrMec: "1004", nome: "Prof.ª MSc. Ana Paula", grauAcademico: "Mestrado", escalao: "B1", aulasSemanais: 10, aulasMensais: 40, totalHorasEfectivas: 38, totalFaltas: 2, ts: 6, tat: 12, ha: 4, pav: 10, totalServico: 32, ap: 6, av: 4, pfPratico: 1, totalPratico: 11, pfGeral: 1, totalGeral: 38 },
    { id: 5, nrMec: "1005", nome: "Prof. Dr. Pedro Costa", grauAcademico: "Doutorado", escalao: "A1", aulasSemanais: 12, aulasMensais: 48, totalHorasEfectivas: 48, totalFaltas: 0, ts: 8, tat: 16, ha: 4, pav: 12, totalServico: 40, ap: 8, av: 4, pfPratico: 0, totalPratico: 12, pfGeral: 0, totalGeral: 48 },
    { id: 6, nrMec: "1006", nome: "Prof. Dr. Fernando Dias", grauAcademico: "Doutorado", escalao: "A2", aulasSemanais: 8, aulasMensais: 32, totalHorasEfectivas: 30, totalFaltas: 2, ts: 6, tat: 10, ha: 2, pav: 8, totalServico: 26, ap: 6, av: 2, pfPratico: 1, totalPratico: 9, pfGeral: 1, totalGeral: 30 },
    { id: 7, nrMec: "1007", nome: "Eng. Luísa Ferreira", grauAcademico: "Mestrado", escalao: "B2", aulasSemanais: 18, aulasMensais: 72, totalHorasEfectivas: 68, totalFaltas: 4, ts: 14, tat: 28, ha: 10, pav: 18, totalServico: 70, ap: 14, av: 10, pfPratico: 2, totalPratico: 26, pfGeral: 2, totalGeral: 68 },
  ];

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
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Salário</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Gestão de Salários</h1>
          <p className="text-muted-foreground mt-1">Controle de horas, assiduidade e cálculo salarial dos docentes</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm"><RefreshCw className="h-4 w-4 mr-2" />Atualizar</Button>

          <Button variant="outline" size="sm"><Printer className="h-4 w-4 mr-2" />Imprimir</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Excel</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />PDF</Button>
        </div>
      </div>
     {/* Filtros */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Ano Lectivo</Label>
            <Select value={anoLectivo} onValueChange={setAnoLectivo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024/2025</SelectItem>
                <SelectItem value="2023-2024">2023/2024</SelectItem>
                <SelectItem value="2022-2023">2022/2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semestre</Label>
            <Select value={semestre} onValueChange={setSemestre}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1º Semestre</SelectItem>
                <SelectItem value="2">2º Semestre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Curso</Label>
            <Select value={curso} onValueChange={setCurso}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Cursos</SelectItem>
                <SelectItem value="eng-info">Engenharia Informática</SelectItem>
                <SelectItem value="gestao">Gestão de Empresas</SelectItem>
                <SelectItem value="direito">Direito</SelectItem>
                <SelectItem value="medicina">Medicina</SelectItem>
                <SelectItem value="arquitetura">Arquitetura</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Docente</Label>
            <Select value={docente} onValueChange={setDocente}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Docentes</SelectItem>
                {mockData.map(d => (
                  <SelectItem key={d.id} value={d.nrMec}>{d.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dataInicio && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single"   className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !dataFim && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single"  className="p-3 pointer-events-auto" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Pesquisar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Nº Mec ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
          </div>
        </div>

        {/* Opções booleanas */}
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">Opções de Cálculo</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Não Cobrar Faltas</Label>
                <p className="text-xs text-muted-foreground">Ignora faltas no cálculo salarial</p>
              </div>
              <Switch checked={naoCobrarFaltas} onCheckedChange={setNaoCobrarFaltas} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Exigir Presenças Confirmadas Pelos Sumaristas</Label>
                <p className="text-xs text-muted-foreground">Só conta presenças confirmadas por sumaristas</p>
              </div>
              <Switch checked={exigirPresencasConfirmadas} onCheckedChange={setExigirPresencasConfirmadas} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Exigir Sumários Inseridos</Label>
                <p className="text-xs text-muted-foreground">Requer sumários inseridos para contabilizar</p>
              </div>
              <Switch checked={exigirSumariosInseridos} onCheckedChange={setExigirSumariosInseridos} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Exigir Sumários Válidos</Label>
                <p className="text-xs text-muted-foreground">Apenas sumários validados são contabilizados</p>
              </div>
              <Switch checked={exigirSumariosValidos} onCheckedChange={setExigirSumariosValidos} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button><Filter className="h-4 w-4 mr-2" />Aplicar Filtros</Button>
        </div>
      </div>

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
                    <TableCell className="border-r">{item.estado}</TableCell>
                    {/* Sumários */}
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10">
                      <span className={90 > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{2}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10">
                      <span className="text-emerald-600 font-semibold">{2}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-blue-50/50 dark:bg-blue-950/10 font-semibold">{2}</TableCell>
                    {/* Assiduidades */}
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className={34 > 0 ? "text-amber-600 font-semibold" : "text-muted-foreground"}>{4}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className="text-emerald-600 font-semibold">{4}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10">
                      <span className="text-red-600 font-semibold">{3}</span>
                    </TableCell>
                    <TableCell className="text-center border-r bg-emerald-50/50 dark:bg-emerald-950/10 font-semibold">{4}</TableCell>
                    {/* Sum c/ Assiduidade */}
                    <TableCell className="text-center bg-purple-50/50 dark:bg-purple-950/10">
                      <span className="font-semibold text-primary">{4}</span>
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
