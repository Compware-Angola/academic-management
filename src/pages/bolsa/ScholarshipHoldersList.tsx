import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Download, Printer, Plus, Eye, Edit, Wallet, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ScholarshipHoldersList() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Mock data específico para bolseiros
  const mockScholarshipsData = [
    { id: "BOL001", numero: "20230001", nome: "João Silva", curso: "Engenharia Informática", ano: "3º Ano", instituicao: "Governo Provincial", tipoBolsa: "Integral", valor: "150.000,00 Kz", dataInicio: "2023-02-01", dataFim: "2024-06-30", estado: "Ativa", mediaAproveitamento: "16.5" },
    { id: "BOL002", numero: "20230002", nome: "Maria Santos", curso: "Gestão de Empresas", ano: "2º Ano", instituicao: "Fundação XYZ", tipoBolsa: "Parcial (50%)", valor: "75.000,00 Kz", dataInicio: "2023-02-01", dataFim: "2024-06-30", estado: "Ativa", mediaAproveitamento: "17.2" },
    { id: "BOL003", numero: "20220015", nome: "Pedro Costa", curso: "Arquitetura", ano: "4º Ano", instituicao: "Governo Central", tipoBolsa: "Integral", valor: "150.000,00 Kz", dataInicio: "2022-02-01", dataFim: "2024-06-30", estado: "Ativa", mediaAproveitamento: "15.8" },
    { id: "BOL004", numero: "20230003", nome: "Ana Ferreira", curso: "Engenharia Informática", ano: "1º Ano", instituicao: "Empresa ABC", tipoBolsa: "Integral", valor: "150.000,00 Kz", dataInicio: "2023-09-01", dataFim: "2024-06-30", estado: "Ativa", mediaAproveitamento: "18.1" },
    { id: "BOL005", numero: "20210045", nome: "Carlos Mendes", curso: "Gestão de Empresas", ano: "5º Ano", instituicao: "Fundação DEF", tipoBolsa: "Parcial (75%)", valor: "112.500,00 Kz", dataInicio: "2021-02-01", dataFim: "2023-12-31", estado: "Suspensa", mediaAproveitamento: "13.5" },
  ];

  const filteredData = mockScholarshipsData.filter(item =>
    item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.instituicao.toLowerCase().includes(searchTerm.toLowerCase())
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
        <span className="font-medium">Bolsa e Desconto</span>
        <span>/</span>
        <span className="text-foreground">Bolseiros</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bolseiros</h1>
          <p className="text-muted-foreground mt-1">Gestão de estudantes com bolsas de estudo</p>
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
            Nova bolsa
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Bolseiros</p>
          <p className="text-3xl font-bold">{mockScholarshipsData.length}</p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Bolsas Ativas</p>
          <p className="text-3xl font-bold text-success">{mockScholarshipsData.filter(b => b.estado === "Ativa").length}</p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Bolsas Suspensas</p>
          <p className="text-3xl font-bold text-warning">{mockScholarshipsData.filter(b => b.estado === "Suspensa").length}</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Bolsas Integrais</p>
          <p className="text-3xl font-bold text-primary">{mockScholarshipsData.filter(b => b.tipoBolsa === "Integral").length}</p>
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
              placeholder="Nome, número, instituição..."
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
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instituicao">Instituição</Label>
            <Select defaultValue="all">
              <SelectTrigger id="instituicao">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as instituições</SelectItem>
                <SelectItem value="gov-prov">Governo Provincial</SelectItem>
                <SelectItem value="gov-central">Governo Central</SelectItem>
                <SelectItem value="fundacao">Fundação</SelectItem>
                <SelectItem value="empresa">Empresa Privada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo-bolsa">Tipo de Bolsa</Label>
            <Select defaultValue="all">
              <SelectTrigger id="tipo-bolsa">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="integral">Integral (100%)</SelectItem>
                <SelectItem value="parcial-75">Parcial (75%)</SelectItem>
                <SelectItem value="parcial-50">Parcial (50%)</SelectItem>
                <SelectItem value="parcial-25">Parcial (25%)</SelectItem>
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
                <SelectItem value="ativa">Ativa</SelectItem>
                <SelectItem value="suspensa">Suspensa</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
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
          <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Nenhum registo encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">Não foram encontrados bolseiros com os critérios selecionados</p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Atribuir nova bolsa
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
                    <TableHead>Ano</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Tipo de Bolsa</TableHead>
                    <TableHead>Valor Mensal</TableHead>
                    <TableHead className="text-center">Aproveitamento</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm">{item.numero}</TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-sm">{item.curso}</TableCell>
                      <TableCell>{item.ano}</TableCell>
                      <TableCell className="text-sm">{item.instituicao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipoBolsa}</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{item.valor}</TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant="outline"
                          className={
                            parseFloat(item.mediaAproveitamento) >= 16
                              ? "bg-success/10 text-success border-success/20"
                              : parseFloat(item.mediaAproveitamento) >= 14
                              ? "bg-primary/10 text-primary border-primary/20"
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {item.mediaAproveitamento}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={item.estado === "Ativa" ? "default" : "secondary"}
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
                            <Wallet className="h-4 w-4" />
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
                <SelectTrigger id="items-per-page" className="w-20">
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
