import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

type SortField = "nrMec" | "nome" | "grauAcademico" | "escalao";

export default function SalarioDocente() {
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroDocente, setFiltroDocente] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState<SortField>("nrMec");
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

  const mockData = [
    { id: 1, nrMec: "1001", nome: "Prof. Dr. João Silva",      grauAcademico: "Doutorado", escalao: "A1", aulasSemanais: 12, aulasMensais: 48, tm: 4, totalHorasEfectivas: 46, totalFaltas: 2, ts: 8,  tat: 16, ha: 4,  pav: 12, totalServico: 40, ap: 7,  apF: 1, apTotal: 8,  av: 3,  avF: 1, avTotal: 4,  totalPratico: 12, pfGeral: 1, totalGeral: 46 },
    { id: 2, nrMec: "1002", nome: "Prof.ª Dra. Maria Santos",  grauAcademico: "Doutorado", escalao: "A2", aulasSemanais: 14, aulasMensais: 56, tm: 4, totalHorasEfectivas: 54, totalFaltas: 2, ts: 10, tat: 20, ha: 6,  pav: 14, totalServico: 50, ap: 9,  apF: 1, apTotal: 10, av: 5,  avF: 1, avTotal: 6,  totalPratico: 16, pfGeral: 2, totalGeral: 54 },
    { id: 3, nrMec: "1003", nome: "Prof. MSc. Carlos Manuel",  grauAcademico: "Mestrado",  escalao: "B1", aulasSemanais: 16, aulasMensais: 64, tm: 6, totalHorasEfectivas: 60, totalFaltas: 4, ts: 12, tat: 24, ha: 8,  pav: 16, totalServico: 60, ap: 10, apF: 2, apTotal: 12, av: 6,  avF: 2, avTotal: 8,  totalPratico: 20, pfGeral: 2, totalGeral: 60 },
    { id: 4, nrMec: "1004", nome: "Prof.ª MSc. Ana Paula",     grauAcademico: "Mestrado",  escalao: "B1", aulasSemanais: 10, aulasMensais: 40, tm: 3, totalHorasEfectivas: 38, totalFaltas: 2, ts: 6,  tat: 12, ha: 4,  pav: 10, totalServico: 32, ap: 5,  apF: 1, apTotal: 6,  av: 3,  avF: 1, avTotal: 4,  totalPratico: 10, pfGeral: 1, totalGeral: 38 },
    { id: 5, nrMec: "1005", nome: "Prof. Dr. Pedro Costa",     grauAcademico: "Doutorado", escalao: "A1", aulasSemanais: 12, aulasMensais: 48, tm: 4, totalHorasEfectivas: 48, totalFaltas: 0, ts: 8,  tat: 16, ha: 4,  pav: 12, totalServico: 40, ap: 8,  apF: 0, apTotal: 8,  av: 4,  avF: 0, avTotal: 4,  totalPratico: 12, pfGeral: 0, totalGeral: 48 },
    { id: 6, nrMec: "1006", nome: "Prof. Dr. Fernando Dias",   grauAcademico: "Doutorado", escalao: "A2", aulasSemanais: 8,  aulasMensais: 32, tm: 2, totalHorasEfectivas: 30, totalFaltas: 2, ts: 6,  tat: 10, ha: 2,  pav: 8,  totalServico: 26, ap: 5,  apF: 1, apTotal: 6,  av: 1,  avF: 1, avTotal: 2,  totalPratico: 8,  pfGeral: 1, totalGeral: 30 },
    { id: 7, nrMec: "1007", nome: "Eng. Luísa Ferreira",       grauAcademico: "Mestrado",  escalao: "B2", aulasSemanais: 18, aulasMensais: 72, tm: 8, totalHorasEfectivas: 68, totalFaltas: 4, ts: 14, tat: 28, ha: 10, pav: 18, totalServico: 70, ap: 12, apF: 2, apTotal: 14, av: 8,  avF: 2, avTotal: 10, totalPratico: 24, pfGeral: 2, totalGeral: 68 },
  ];

  const filteredData = useMemo(() => {
    let data = [...mockData];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(d =>
        d.nrMec.toLowerCase().includes(term) ||
        d.nome.toLowerCase().includes(term)
      );
    }

    if (filtroDocente !== "todos") data = data.filter(d => d.nrMec === filtroDocente);

    data.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      return dir * String(a[sortField]).localeCompare(String(b[sortField]));
    });

    return data;
  }, [searchTerm, filtroDocente, sortField, sortDirection]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDirection("asc"); }
  };

  const resumo = useMemo(() => ({
    totalDocentes: filteredData.length,
    totalHorasEfectivas: filteredData.reduce((s, d) => s + d.totalHorasEfectivas, 0),
    totalFaltas: filteredData.reduce((s, d) => s + d.totalFaltas, 0),
    totalGeral: filteredData.reduce((s, d) => s + d.totalGeral, 0),
  }), [filteredData]);

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
            <Select value={docente} onValueChange={(v) => { setDocente(v); setFiltroDocente(v); }}>
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
                <Calendar mode="single" className="p-3 pointer-events-auto" />
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
                <Calendar mode="single" className="p-3 pointer-events-auto" />
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

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Docentes</p>
          <p className="text-2xl font-bold text-foreground">{resumo.totalDocentes}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Horas Efectivas</p>
          <p className="text-2xl font-bold text-emerald-600">{resumo.totalHorasEfectivas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Faltas</p>
          <p className="text-2xl font-bold text-red-600">{resumo.totalFaltas}</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xs text-muted-foreground">Total Geral</p>
          <p className="text-2xl font-bold text-primary">{resumo.totalGeral}</p>
        </Card>
      </div>

      {/* Tabela Principal */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {/* ── LINHA 1: grupos de topo ── */}
              <TableRow>
                {/* 9 colunas fixas com rowSpan=3 */}
                <TableHead rowSpan={3} className="border border-border align-middle whitespace-nowrap text-xs">
                  <SortHeader field="nrMec">Nº Mec</SortHeader>
                </TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle whitespace-nowrap text-xs">
                  <SortHeader field="nome">Nome</SortHeader>
                </TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle whitespace-nowrap text-xs">
                  <SortHeader field="grauAcademico">Grau Académico</SortHeader>
                </TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs">
                  <SortHeader field="escalao">Escalão</SortHeader>
                </TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs">Aulas Semanais</TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs">Aulas Mensais</TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs">TM</TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs">Total Horas Efectivas</TableHead>
                <TableHead rowSpan={3} className="border border-border align-middle text-center whitespace-nowrap text-xs">Total Faltas</TableHead>

                {/* Serviço: 5 colunas, rowSpan=2 para o título */}
                <TableHead colSpan={5} className="border border-border text-center bg-blue-50 dark:bg-blue-950/30 font-semibold text-xs">
                  Serviço
                </TableHead>

                {/* Aulas Mensais: AP(3) + AV(3) + Total(1) = 7 */}
                <TableHead colSpan={7} className="border border-border text-center bg-emerald-50 dark:bg-emerald-950/30 font-semibold text-xs">
                  Aulas Mensais
                </TableHead>

                {/* Geral: 2 colunas, rowSpan=2 */}
                <TableHead colSpan={2} className="border border-border text-center bg-purple-50 dark:bg-purple-950/30 font-semibold text-xs">
                  Geral
                </TableHead>
              </TableRow>

              {/* ── LINHA 2: sub-grupos ── */}
              <TableRow>
                {/* Serviço sub-colunas (rowSpan=2 cada) */}
                <TableHead rowSpan={2} className="border border-border text-center bg-blue-50 dark:bg-blue-950/30 text-xs whitespace-nowrap">TS</TableHead>
                <TableHead rowSpan={2} className="border border-border text-center bg-blue-50 dark:bg-blue-950/30 text-xs whitespace-nowrap">TAT</TableHead>
                <TableHead rowSpan={2} className="border border-border text-center bg-blue-50 dark:bg-blue-950/30 text-xs whitespace-nowrap">HA</TableHead>
                <TableHead rowSpan={2} className="border border-border text-center bg-blue-50 dark:bg-blue-950/30 text-xs whitespace-nowrap">P.AV.</TableHead>
                <TableHead rowSpan={2} className="border border-border text-center bg-blue-50 dark:bg-blue-950/30 text-xs whitespace-nowrap font-bold">Total</TableHead>

                {/* AP sub-grupo */}
                <TableHead colSpan={3} className="border border-border text-center bg-emerald-100 dark:bg-emerald-900/40 text-xs font-semibold">AP</TableHead>
                {/* AV sub-grupo */}
                <TableHead colSpan={3} className="border border-border text-center bg-teal-100 dark:bg-teal-900/40 text-xs font-semibold">AV</TableHead>
                {/* Total Aulas Mensais */}
                <TableHead rowSpan={2} className="border border-border text-center bg-emerald-50 dark:bg-emerald-950/30 text-xs font-bold whitespace-nowrap">Total</TableHead>

                {/* Geral sub-colunas (rowSpan=2) */}
                <TableHead rowSpan={2} className="border border-border text-center bg-purple-50 dark:bg-purple-950/30 text-xs whitespace-nowrap">PF</TableHead>
                <TableHead rowSpan={2} className="border border-border text-center bg-purple-50 dark:bg-purple-950/30 text-xs whitespace-nowrap font-bold">Total</TableHead>
              </TableRow>

              {/* ── LINHA 3: P, F, Total dentro de AP e AV ── */}
              <TableRow>
                {/* AP: P, F, Total */}
                <TableHead className="border border-border text-center bg-emerald-100/70 dark:bg-emerald-900/30 text-xs">P</TableHead>
                <TableHead className="border border-border text-center bg-emerald-100/70 dark:bg-emerald-900/30 text-xs">F</TableHead>
                <TableHead className="border border-border text-center bg-emerald-100/70 dark:bg-emerald-900/30 text-xs font-semibold">Total</TableHead>

                {/* AV: P, F, Total */}
                <TableHead className="border border-border text-center bg-teal-100/70 dark:bg-teal-900/30 text-xs">P</TableHead>
                <TableHead className="border border-border text-center bg-teal-100/70 dark:bg-teal-900/30 text-xs">F</TableHead>
                <TableHead className="border border-border text-center bg-teal-100/70 dark:bg-teal-900/30 text-xs font-semibold">Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={23} className="text-center py-10 text-muted-foreground">
                    Nenhum registo encontrado
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    {/* Colunas fixas */}
                    <TableCell className="border border-border font-mono text-xs whitespace-nowrap">{item.nrMec}</TableCell>
                    <TableCell className="border border-border text-xs font-medium whitespace-nowrap">{item.nome}</TableCell>
                    <TableCell className="border border-border text-xs whitespace-nowrap">{item.grauAcademico}</TableCell>
                    <TableCell className="border border-border text-xs text-center">{item.escalao}</TableCell>
                    <TableCell className="border border-border text-center text-xs">{item.aulasSemanais}</TableCell>
                    <TableCell className="border border-border text-center text-xs">{item.aulasMensais}</TableCell>
                    <TableCell className="border border-border text-center text-xs">{item.tm}</TableCell>
                    <TableCell className="border border-border text-center text-xs font-semibold text-emerald-600">{item.totalHorasEfectivas}</TableCell>
                    <TableCell className="border border-border text-center text-xs">
                      <span className={item.totalFaltas > 0 ? "text-red-600 font-semibold" : "text-muted-foreground"}>{item.totalFaltas}</span>
                    </TableCell>

                    {/* Serviço: TS, TAT, HA, P.AV., Total */}
                    <TableCell className="border border-border text-center text-xs bg-blue-50/50 dark:bg-blue-950/10">{item.ts}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-blue-50/50 dark:bg-blue-950/10">{item.tat}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-blue-50/50 dark:bg-blue-950/10">{item.ha}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-blue-50/50 dark:bg-blue-950/10">{item.pav}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-blue-50/50 dark:bg-blue-950/10 font-bold">{item.totalServico}</TableCell>

                    {/* AP: P, F, Total */}
                    <TableCell className="border border-border text-center text-xs bg-emerald-50/50 dark:bg-emerald-950/10 text-emerald-700">{item.ap}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-emerald-50/50 dark:bg-emerald-950/10 text-red-600">{item.apF ?? 0}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-emerald-50/50 dark:bg-emerald-950/10 font-semibold">{item.apTotal ?? item.ap}</TableCell>

                    {/* AV: P, F, Total */}
                    <TableCell className="border border-border text-center text-xs bg-teal-50/50 dark:bg-teal-950/10 text-teal-700">{item.av}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-teal-50/50 dark:bg-teal-950/10 text-red-600">{item.avF ?? 0}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-teal-50/50 dark:bg-teal-950/10 font-semibold">{item.avTotal ?? item.av}</TableCell>

                    {/* Total Aulas Mensais */}
                    <TableCell className="border border-border text-center text-xs bg-emerald-50/80 dark:bg-emerald-950/20 font-bold">{item.totalPratico}</TableCell>

                    {/* Geral: PF, Total */}
                    <TableCell className="border border-border text-center text-xs bg-purple-50/50 dark:bg-purple-950/10">{item.pfGeral}</TableCell>
                    <TableCell className="border border-border text-center text-xs bg-purple-50/50 dark:bg-purple-950/10 font-bold text-primary">{item.totalGeral}</TableCell>
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