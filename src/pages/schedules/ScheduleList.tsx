

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw, FileSpreadsheet, FileText, Printer, Search, Edit, Trash2, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Schedule {
  id: string;
  curso: string;
  turma: string;
  ucSigla: string;
  ucNome: string;
  docente: string;
  sala: string;
  dia: string;
  inicio: string;
  fim: string;
  tipo: string;
  estado: "Ativo" | "Inativo";
}

export default function ScheduleList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortField, setSortField] = useState<keyof Schedule | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    turma: "",
    docente: "",
    sala: "",
    dia: "",
    search: "",
  });

  // Mock data
  const schedules: Schedule[] = [
    {
      id: "1",
      curso: "Engenharia Informática",
      turma: "Turma A",
      ucSigla: "AED",
      ucNome: "Algoritmos e Estruturas de Dados",
      docente: "Prof. Dr. João Silva",
      sala: "Lab A",
      dia: "Segunda",
      inicio: "08:00",
      fim: "10:00",
      tipo: "Prática Laboratorial",
      estado: "Ativo",
    },
    {
      id: "2",
      curso: "Engenharia Informática",
      turma: "Turma A",
      ucSigla: "BD",
      ucNome: "Base de Dados",
      docente: "Prof. Dra. Maria Santos",
      sala: "Sala 101",
      dia: "Terça",
      inicio: "10:00",
      fim: "12:00",
      tipo: "Teórica",
      estado: "Ativo",
    },
    {
      id: "3",
      curso: "Engenharia Civil",
      turma: "Turma B",
      ucSigla: "EST",
      ucNome: "Estruturas",
      docente: "Prof. Dr. Pedro Gomes",
      sala: "Sala 201",
      dia: "Quarta",
      inicio: "14:00",
      fim: "16:00",
      tipo: "Teórica",
      estado: "Ativo",
    },
    {
      id: "4",
      curso: "Arquitetura",
      turma: "Turma C",
      ucSigla: "PRJ",
      ucNome: "Projeto Arquitetónico",
      docente: "Prof. Dra. Ana Costa",
      sala: "Sala 103",
      dia: "Quinta",
      inicio: "08:00",
      fim: "12:00",
      tipo: "Laboratório",
      estado: "Ativo",
    },
    {
      id: "5",
      curso: "Engenharia Informática",
      turma: "Turma B",
      ucSigla: "SO",
      ucNome: "Sistemas Operativos",
      docente: "Prof. Dr. João Silva",
      sala: "Lab B",
      dia: "Sexta",
      inicio: "14:00",
      fim: "16:00",
      tipo: "Prática Laboratorial",
      estado: "Inativo",
    },
    {
      id: "6",
      curso: "Gestão de Empresas",
      turma: "Turma A",
      ucSigla: "CONT",
      ucNome: "Contabilidade",
      docente: "Prof. Dr. Carlos Mendes",
      sala: "Sala 102",
      dia: "Segunda",
      inicio: "10:00",
      fim: "12:00",
      tipo: "Teórica",
      estado: "Ativo",
    },
  ];

  const anosLetivos = ["Todos", "2024/2025", "2023/2024"];
  const semestres = ["Todos", "1º Semestre", "2º Semestre"];
  const periodos = ["Todos", "Manhã", "Tarde", "Noite"];
  const cursos = ["Todos", "Engenharia Informática", "Engenharia Civil", "Arquitetura", "Gestão de Empresas"];
  const turmas = ["Todos", "Turma A", "Turma B", "Turma C"];
  const docentes = ["Todos", "Prof. Dr. João Silva", "Prof. Dra. Maria Santos", "Prof. Dr. Pedro Gomes"];
  const salas = ["Todos", "Lab A", "Lab B", "Sala 101", "Sala 102"];
  const diasSemana = ["Todos", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const handleSort = (field: keyof Schedule) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Lista atualizada",
        description: "A lista de horários foi atualizada com sucesso.",
      });
    }, 1000);
  };

  const handleExportExcel = () => {
    toast({
      title: "Exportar para Excel",
      description: "A exportação foi iniciada. O ficheiro será descarregado em breve.",
    });
  };

  const handleExportPDF = () => {
    toast({
      title: "Exportar para PDF",
      description: "A exportação foi iniciada. O ficheiro será descarregado em breve.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Editar horário",
      description: `A editar horário com ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    toast({
      variant: "destructive",
      title: "Apagar horário",
      description: `Horário com ID ${id} foi apagado.`,
    });
  };

  const handlePrintSchedule = (id: string) => {
    toast({
      title: "Imprimir horário",
      description: `A imprimir horário com ID: ${id}`,
    });
  };

  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSchedules = schedules.slice(startIndex, endIndex);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Listar Horário</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Listar Horário</h1>
          <p className="text-muted-foreground">Gestão e visualização de horários letivos</p>
        </div>
        <Button onClick={() => navigate("/horarios/criar")}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Horário
        </Button>
      </div>

      {/* Filtros */}
      <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Ano Letivo</label>
            <Select value={filters.anoLetivo} onValueChange={(value) => setFilters(prev => ({ ...prev, anoLetivo: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {anosLetivos.map(ano => (
                  <SelectItem key={ano} value={ano}>{ano}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Semestre</label>
            <Select value={filters.semestre} onValueChange={(value) => setFilters(prev => ({ ...prev, semestre: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {semestres.map(sem => (
                  <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Período</label>
            <Select value={filters.periodo} onValueChange={(value) => setFilters(prev => ({ ...prev, periodo: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {periodos.map(per => (
                  <SelectItem key={per} value={per}>{per}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Curso</label>
            <Select value={filters.curso} onValueChange={(value) => setFilters(prev => ({ ...prev, curso: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {cursos.map(curso => (
                  <SelectItem key={curso} value={curso}>{curso}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Turma</label>
            <Select value={filters.turma} onValueChange={(value) => setFilters(prev => ({ ...prev, turma: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {turmas.map(turma => (
                  <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Docente</label>
            <Select value={filters.docente} onValueChange={(value) => setFilters(prev => ({ ...prev, docente: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {docentes.map(doc => (
                  <SelectItem key={doc} value={doc}>{doc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Sala</label>
            <Select value={filters.sala} onValueChange={(value) => setFilters(prev => ({ ...prev, sala: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {salas.map(sala => (
                  <SelectItem key={sala} value={sala}>{sala}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Dia da Semana</label>
            <Select value={filters.dia} onValueChange={(value) => setFilters(prev => ({ ...prev, dia: value }))}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Selecionar" />
              </SelectTrigger>
              <SelectContent>
                {diasSemana.map(dia => (
                  <SelectItem key={dia} value={dia}>{dia}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Input
            placeholder="Pesquisar por curso, turma, UC, docente ou sala..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="bg-background"
          />
        </div>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Atualizar Lista
        </Button>
        <Button onClick={handleExportExcel} variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Excel
        </Button>
        <Button onClick={handleExportPDF} variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
        <Button onClick={handlePrint} variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-8 space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum registo encontrado</h3>
            <p className="text-muted-foreground mb-4">Não foram encontrados horários com os filtros aplicados.</p>
            <Button onClick={() => navigate("/horarios/criar")}>
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Horário
            </Button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead onClick={() => handleSort("curso")} className="cursor-pointer hover:bg-muted">
                      Curso {sortField === "curso" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("turma")} className="cursor-pointer hover:bg-muted">
                      Turma {sortField === "turma" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("ucNome")} className="cursor-pointer hover:bg-muted">
                      UC {sortField === "ucNome" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("docente")} className="cursor-pointer hover:bg-muted">
                      Docente {sortField === "docente" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("sala")} className="cursor-pointer hover:bg-muted">
                      Sala {sortField === "sala" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("dia")} className="cursor-pointer hover:bg-muted">
                      Dia {sortField === "dia" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead onClick={() => handleSort("tipo")} className="cursor-pointer hover:bg-muted">
                      Tipo {sortField === "tipo" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead onClick={() => handleSort("estado")} className="cursor-pointer hover:bg-muted">
                      Estado {sortField === "estado" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentSchedules.map((schedule) => (
                    <TableRow key={schedule.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{schedule.curso}</TableCell>
                      <TableCell>{schedule.turma}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{schedule.ucSigla}</div>
                          <div className="text-xs text-muted-foreground">{schedule.ucNome}</div>
                        </div>
                      </TableCell>
                      <TableCell>{schedule.docente}</TableCell>
                      <TableCell>{schedule.sala}</TableCell>
                      <TableCell>{schedule.dia}</TableCell>
                      <TableCell>{schedule.inicio}</TableCell>
                      <TableCell>{schedule.fim}</TableCell>
                      <TableCell>
                        <Badge variant={schedule.tipo === "Teórica" ? "default" : "secondary"}>
                          {schedule.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={schedule.estado === "Ativo" ? "default" : "secondary"}>
                          {schedule.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(schedule.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(schedule.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePrintSchedule(schedule.id)}
                          >
                            <File className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between border-t border-border p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Itens por página:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, schedules.length)} de {schedules.length} registos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
