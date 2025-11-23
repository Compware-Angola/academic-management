import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Plus, Eye, Edit, FileCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CandidateList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data específico para candidatos ao exame de acesso
  const mockCandidatesData = [
    { id: "CAND001", codigo: "EA-2024-001", nome: "João Silva", bi: "004567890LA045", dataNascimento: "2006-05-15", curso: "Engenharia Informática", provincia: "Luanda", municipio: "Luanda", sala: "LAB-1", dataProva: "2024-07-15", horaProva: "09:00", estado: "Inscrito", notaPrep: "16.5", documentosCompletos: true },
    { id: "CAND002", codigo: "EA-2024-002", nome: "Maria Santos", bi: "004567891LA045", dataNascimento: "2006-03-20", curso: "Gestão de Empresas", provincia: "Benguela", municipio: "Benguela", sala: "SALA-101", dataProva: "2024-07-15", horaProva: "09:00", estado: "Inscrito", notaPrep: "17.2", documentosCompletos: true },
    { id: "CAND003", codigo: "EA-2024-003", nome: "Pedro Costa", bi: "004567892LA045", dataNascimento: "2006-08-10", curso: "Arquitetura", provincia: "Huíla", municipio: "Lubango", sala: "SALA-102", dataProva: "2024-07-15", horaProva: "14:00", estado: "Falta Documentos", notaPrep: "15.8", documentosCompletos: false },
    { id: "CAND004", codigo: "EA-2024-004", nome: "Ana Ferreira", bi: "004567893LA045", dataNascimento: "2006-01-25", curso: "Engenharia Informática", provincia: "Luanda", municipio: "Viana", sala: "LAB-1", dataProva: "2024-07-15", horaProva: "09:00", estado: "Admitido", notaPrep: "18.1", documentosCompletos: true },
    { id: "CAND005", codigo: "EA-2024-005", nome: "Carlos Mendes", bi: "004567894LA045", dataNascimento: "2006-11-30", curso: "Engenharia Civil", provincia: "Benguela", municipio: "Lobito", sala: "", dataProva: "", horaProva: "", estado: "Pendente", notaPrep: "14.5", documentosCompletos: false },
  ];

  const filteredData = mockCandidatesData.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.bi.toLowerCase().includes(searchTerm.toLowerCase())
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
        <span className="font-medium">Exame de Acesso</span>
        <span>/</span>
        <span className="text-foreground">Lista de candidatos</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lista de candidatos</h1>
          <p className="text-muted-foreground mt-1">Gestão de candidatos ao exame de acesso</p>
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
            Novo candidato
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Candidatos</p>
          <p className="text-3xl font-bold">{mockCandidatesData.length}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Admitidos</p>
          <p className="text-3xl font-bold text-success">{mockCandidatesData.filter(c => c.estado === "Admitido").length}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Inscritos</p>
          <p className="text-3xl font-bold text-primary">{mockCandidatesData.filter(c => c.estado === "Inscrito").length}</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Falta Docs</p>
          <p className="text-3xl font-bold text-warning">{mockCandidatesData.filter(c => c.estado === "Falta Documentos").length}</p>
        </div>
        <div className="bg-muted border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Pendentes</p>
          <p className="text-3xl font-bold">{mockCandidatesData.filter(c => c.estado === "Pendente").length}</p>
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
              placeholder="Nome, código, BI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ano">Ano</Label>
            <Select defaultValue="2024">
              <SelectTrigger id="ano">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
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
            <Label htmlFor="provincia">Província</Label>
            <Select defaultValue="all">
              <SelectTrigger id="provincia">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as províncias</SelectItem>
                <SelectItem value="luanda">Luanda</SelectItem>
                <SelectItem value="benguela">Benguela</SelectItem>
                <SelectItem value="huila">Huíla</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select defaultValue="all">
              <SelectTrigger id="estado">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                <SelectItem value="admitido">Admitido</SelectItem>
                <SelectItem value="inscrito">Inscrito</SelectItem>
                <SelectItem value="falta-docs">Falta Documentos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sala">Sala</Label>
            <Select defaultValue="all">
              <SelectTrigger id="sala">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as salas</SelectItem>
                <SelectItem value="lab1">LAB-1</SelectItem>
                <SelectItem value="sala101">SALA-101</SelectItem>
                <SelectItem value="sala102">SALA-102</SelectItem>
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
          <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Não foram encontrados candidatos com os critérios selecionados</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Registar novo candidato
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>BI</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Província</TableHead>
                    <TableHead className="text-center">Nota Prep.</TableHead>
                    <TableHead>Sala</TableHead>
                    <TableHead>Data/Hora Prova</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm font-semibold">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="font-mono text-sm">{item.bi}</TableCell>
                      <TableCell className="text-sm">{item.curso}</TableCell>
                      <TableCell>{item.provincia}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline"
                          className={
                            parseFloat(item.notaPrep) >= 16
                              ? "bg-success/10 text-success border-success/20"
                              : parseFloat(item.notaPrep) >= 14
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {item.notaPrep}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {item.sala ? (
                          <Badge variant="outline">{item.sala}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {item.dataProva ? (
                          <div>
                            <div>{new Date(item.dataProva).toLocaleDateString('pt-AO')}</div>
                            <div className="text-muted-foreground">{item.horaProva}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Não atribuído</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            item.estado === "Admitido"
                              ? "bg-success/10 text-success border-success/20"
                              : item.estado === "Inscrito"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : item.estado === "Falta Documentos"
                              ? "bg-warning/10 text-warning border-warning/20"
                              : ""
                          }
                        >
                          {item.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileCheck className="h-4 w-4" />
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
