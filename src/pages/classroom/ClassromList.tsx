import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Plus, Eye, Edit, Trash2, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ClassromList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data específico para salas
  const mockRoomsData = [
    { id: "SALA001", codigo: "LAB-1", nome: "Laboratório de Informática 1", edificio: "Bloco A", andar: "1º Andar", tipo: "Laboratório", capacidade: 30, equipamentos: "Computadores, Projetor", estado: "Disponível" },
    { id: "SALA002", codigo: "SALA-101", nome: "Sala de Aula 101", edificio: "Bloco B", andar: "1º Andar", tipo: "Sala de Aula", capacidade: 50, equipamentos: "Projetor, Quadro Branco", estado: "Disponível" },
    { id: "SALA003", codigo: "AUD-1", nome: "Auditório Principal", edificio: "Bloco C", andar: "Térreo", tipo: "Auditório", capacidade: 200, equipamentos: "Sistema de Som, Projetor, Ar Condicionado", estado: "Ocupada" },
    { id: "SALA004", codigo: "LAB-2", nome: "Laboratório de Química", edificio: "Bloco D", andar: "2º Andar", tipo: "Laboratório", capacidade: 25, equipamentos: "Bancadas, Exaustores", estado: "Manutenção" },
    { id: "SALA005", codigo: "SALA-205", nome: "Sala de Aula 205", edificio: "Bloco B", andar: "2º Andar", tipo: "Sala de Aula", capacidade: 40, equipamentos: "Projetor", estado: "Disponível" },
  ];

  const filteredData = mockRoomsData.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.edificio.toLowerCase().includes(searchTerm.toLowerCase())
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
        <span className="font-medium">Gestão de Salas</span>
        <span>/</span>
        <span className="text-foreground">Listar salas</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listar salas</h1>
          <p className="text-muted-foreground mt-1">Gestão completa de salas e espaços académicos</p>
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
            Nova sala
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total de Salas</p>
          <p className="text-3xl font-bold">{mockRoomsData.length}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Disponíveis</p>
          <p className="text-3xl font-bold text-success">{mockRoomsData.filter(s => s.estado === "Disponível").length}</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Ocupadas</p>
          <p className="text-3xl font-bold text-warning">{mockRoomsData.filter(s => s.estado === "Ocupada").length}</p>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Em Manutenção</p>
          <p className="text-3xl font-bold text-destructive">{mockRoomsData.filter(s => s.estado === "Manutenção").length}</p>
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
              placeholder="Código, nome, edifício..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edificio">Edifício</Label>
            <Select defaultValue="all">
              <SelectTrigger id="edificio">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os edifícios</SelectItem>
                <SelectItem value="bloco-a">Bloco A</SelectItem>
                <SelectItem value="bloco-b">Bloco B</SelectItem>
                <SelectItem value="bloco-c">Bloco C</SelectItem>
                <SelectItem value="bloco-d">Bloco D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo</Label>
            <Select defaultValue="all">
              <SelectTrigger id="tipo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="sala-aula">Sala de Aula</SelectItem>
                <SelectItem value="laboratorio">Laboratório</SelectItem>
                <SelectItem value="auditorio">Auditório</SelectItem>
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
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupada">Ocupada</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
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
          <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Não foram encontradas salas com os critérios selecionados</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Registar nova sala
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
                    <TableHead>Edifício</TableHead>
                    <TableHead>Andar</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Capacidade</TableHead>
                    <TableHead>Equipamentos</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm font-semibold">{item.codigo}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell>{item.edificio}</TableCell>
                      <TableCell>{item.andar}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{item.capacidade}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {item.equipamentos}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            item.estado === "Disponível" 
                              ? "bg-success/10 text-success border-success/20" 
                              : item.estado === "Manutenção"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-warning/10 text-warning border-warning/20"
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
                            <Trash2 className="h-4 w-4" />
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
