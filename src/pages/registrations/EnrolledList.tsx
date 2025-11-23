import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Plus, Eye, Edit, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnrolledList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data específico para estudantes matriculados
  const mockStudentsData = [
    { id: "EST001", numero: "20230001", nome: "João Silva", curso: "Engenharia Informática", turma: "EI-3A", anoMatricula: "2023", estadoMatricula: "Confirmada", estadoFinanceiro: "Pago", media: "15.2" },
    { id: "EST002", numero: "20230002", nome: "Maria Santos", curso: "Gestão de Empresas", turma: "GE-2B", anoMatricula: "2023", estadoMatricula: "Confirmada", estadoFinanceiro: "Pendente", media: "16.8" },
    { id: "EST003", numero: "20220015", nome: "Pedro Costa", curso: "Arquitetura", turma: "ARQ-4A", anoMatricula: "2022", estadoMatricula: "Confirmada", estadoFinanceiro: "Pago", media: "14.5" },
    { id: "EST004", numero: "20230003", nome: "Ana Ferreira", curso: "Engenharia Informática", turma: "EI-1A", anoMatricula: "2023", estadoMatricula: "Confirmada", estadoFinanceiro: "Pago", media: "17.3" },
    { id: "EST005", numero: "20220020", nome: "Carlos Mendes", curso: "Gestão de Empresas", turma: "GE-3A", anoMatricula: "2022", estadoMatricula: "Pendente", estadoFinanceiro: "Devedor", media: "13.9" },
    { id: "EST006", numero: "20210045", nome: "Sofia Oliveira", curso: "Engenharia Civil", turma: "EC-5A", anoMatricula: "2021", estadoMatricula: "Confirmada", estadoFinanceiro: "Pago", media: "16.1" },
  ];

  const filteredData = mockStudentsData.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.curso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Inscrições e Matrícula</span>
        <span>/</span>
        <span className="text-foreground">Matriculados</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matriculados</h1>
          <p className="text-muted-foreground mt-1">Lista completa de estudantes matriculados</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsLoading(true)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar lista
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova matrícula
          </Button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Matriculados</p>
          <p className="text-3xl font-bold">{mockStudentsData.length}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Matrículas Confirmadas</p>
          <p className="text-3xl font-bold text-success">{mockStudentsData.filter(s => s.estadoMatricula === "Confirmada").length}</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
          <p className="text-3xl font-bold text-warning">{mockStudentsData.filter(s => s.estadoMatricula === "Pendente").length}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Devedores</p>
          <p className="text-3xl font-bold text-destructive">{mockStudentsData.filter(s => s.estadoFinanceiro === "Devedor").length}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Nome, número, curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano-letivo">Ano Letivo</Label>
            <Select defaultValue="2024-2025">
              <SelectTrigger id="ano-letivo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024/2025</SelectItem>
                <SelectItem value="2023-2024">2023/2024</SelectItem>
                <SelectItem value="2022-2023">2022/2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="curso">Curso</Label>
            <Select defaultValue="all">
              <SelectTrigger id="curso">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                <SelectItem value="eng-info">Engenharia Informática</SelectItem>
                <SelectItem value="gestao">Gestão de Empresas</SelectItem>
                <SelectItem value="arquitetura">Arquitetura</SelectItem>
                <SelectItem value="eng-civil">Engenharia Civil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado-matricula">Estado Matrícula</Label>
            <Select defaultValue="all">
              <SelectTrigger id="estado-matricula">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado-financeiro">Estado Financeiro</Label>
            <Select defaultValue="all">
              <SelectTrigger id="estado-financeiro">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="devedor">Devedor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano-matricula">Ano de Matrícula</Label>
            <Select defaultValue="all">
              <SelectTrigger id="ano-matricula">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os anos</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Não foram encontrados estudantes matriculados com os critérios selecionados</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Registar nova matrícula
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Ano Matrícula</TableHead>
                    <TableHead>Estado Matrícula</TableHead>
                    <TableHead>Estado Financeiro</TableHead>
                    <TableHead>Média</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.numero}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-sm">{item.curso}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.turma}</Badge>
                      </TableCell>
                      <TableCell>{item.anoMatricula}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.estadoMatricula === "Confirmada" ? "default" : "secondary"}
                        >
                          {item.estadoMatricula}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            item.estadoFinanceiro === "Pago" 
                              ? "bg-success/10 text-success border-success/20" 
                              : item.estadoFinanceiro === "Devedor"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {item.estadoFinanceiro}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{item.media}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">Itens por página:</Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger id="items-per-page" className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground ml-4">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registos
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
