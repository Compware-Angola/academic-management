import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Plus, Eye, Edit, Trash2, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { CreateDisciplineModal } from "./components/CreateDisciplineModal";

export default function DisciplineManagementList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [naturezaFilter, setNaturezaFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const {
    data: disciplines = [],
    isLoading,
    isError,
    refetch,
  } = useDisciplines();

  // Normaliza os dados
  const normalizedDisciplines = disciplines.map((d) => ({
    codigo: d.codigo,
    designacao: d.desginacao || "Disciplina sem nome",
    tipo: d.tipo_unidade_curricular === "S" ? "Semestral" : "Anual",
    naturezaCodigo: d.natureza_unidade_curricular || "",
    natureza:
      d.natureza_unidade_curricular === "TP"
        ? "Teórico-Prática"
        : d.natureza_unidade_curricular === "T"
          ? "Teórica"
          : d.natureza_unidade_curricular === "P"
            ? "Prática"
            : "Não definida",
  }));

  // Filtros combinados
  const filteredData = normalizedDisciplines.filter((item) => {
    const matchesSearch =
      item.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toString().includes(searchTerm);

    const matchesNatureza =
      naturezaFilter === "all" || item.naturezaCodigo === naturezaFilter;

    return matchesSearch && matchesNatureza;
  });

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

  // Reset página ao mudar filtros
  const handleFilterChange = () => setCurrentPage(1);

  return (
    <div className="space-y-6 p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Início</Link>
        <span>/</span>
        <span className="font-medium">Plano de Estudo</span>
        <span>/</span>
        <span className="text-foreground">Gestão de disciplinas</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de disciplinas</h1>
          <p className="text-muted-foreground mt-1">
            Gestão completa de disciplinas e unidades curriculares
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          
          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova disciplina
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Disciplinas</p>
          <p className="text-3xl font-bold">{normalizedDisciplines.length}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Ativas</p>
          <p className="text-3xl font-bold text-green-600">{normalizedDisciplines.length}</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Semestrais</p>
          <p className="text-3xl font-bold text-blue-600">
            {normalizedDisciplines.filter((d) => d.tipo === "Semestral").length}
          </p>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Teórico-Práticas</p>
          <p className="text-3xl font-bold text-amber-600">
            {normalizedDisciplines.filter((d) => d.natureza === "Teórico-Prática").length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pesquisa */}
          <div className="space-y-2">
            <Label htmlFor="search">Pesquisar</Label>
            <Input
              id="search"
              placeholder="Código ou nome..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
            />
          </div>

          {/* Filtro por Natureza */}
          <div className="space-y-2">
            <Label htmlFor="natureza">Natureza da UC</Label>
            <Select value={naturezaFilter} onValueChange={(v) => {
              setNaturezaFilter(v);
              handleFilterChange();
            }}>
              <SelectTrigger id="natureza">
                <SelectValue placeholder="Todas as naturezas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as naturezas</SelectItem>
                <SelectItem value="TP">Teórico-Prática (TP)</SelectItem>
                <SelectItem value="T">Teórica (T)</SelectItem>
                <SelectItem value="P">Prática (P)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela + Estados */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-card border rounded-lg">
          <BookOpen className="h-16 w-16 mx-auto text-destructive mb-4" />
          <p className="text-lg font-medium text-destructive mb-2">
            Erro ao carregar as disciplinas
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-20 bg-card border rounded-lg">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-2">
            Nenhuma disciplina encontrada
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Tente ajustar os filtros ou criar uma nova disciplina.
          </p>
          <Button size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar nova disciplina
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-24">Código</TableHead>
                    <TableHead className="min-w-96">Nome da Disciplina</TableHead>
                    <TableHead className="w-32">Tipo</TableHead>
                    <TableHead className="w-40">Natureza</TableHead>
                    <TableHead className="text-right w-36">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.codigo} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm font-semibold">
                        {item.codigo}
                      </TableCell>
                      <TableCell className="font-medium">{item.designacao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.tipo}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.natureza === "Teórico-Prática"
                              ? "default"
                              : item.natureza === "Teórica"
                                ? "secondary"
                                : item.natureza === "Prática"
                                  ? "outline"
                                  : "outline"
                          }
                        >
                          {item.natureza}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Label>Itens por página:</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span>
                Mostrando {startItem}–{endItem} de {filteredData.length} disciplinas
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Seguinte
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
      <CreateDisciplineModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}