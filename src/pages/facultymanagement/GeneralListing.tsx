import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  RefreshCw,
  Download,
  Printer,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
// Assumindo que o seu hook está neste caminho
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";

export default function GeneralListing() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [filterCategoria, setFilterCategoria] = useState("all");
  const [filterGrau, setFilterGrau] = useState("all");
  const [filterEscalao, setFilterEscalao] = useState("all");

  // CORREÇÃO 1: Inicializa data com array vazio [] para evitar o erro .map (Uncaught TypeError: Cannot read properties of undefined (reading 'map'))
  const {
    data: teachersData = [],
    isLoading,
    refetch,
    error,
  } = useQueryTeacther();

  // Aplicar filtros
  const filteredData = teachersData.filter((item) => {
    // CORREÇÃO 2: Usa (item.propriedade ?? "").toLowerCase() para evitar o erro .toLowerCase
    // (Uncaught TypeError: Cannot read properties of undefined (reading 'toLowerCase'))
    const matchSearch =
      (item.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.n_mecanografico ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (item.username ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategoria =
      filterCategoria === "all" || item.descricao_categoria === filterCategoria;
    const matchGrau =
      filterGrau === "all" || item.descricao_grau_academico === filterGrau;
    const matchEscalao =
      filterEscalao === "all" || item.descricao_escalao === filterEscalao;

    return matchSearch && matchCategoria && matchGrau && matchEscalao;
  });

  // Extrair valores únicos para os filtros
  const categorias = [
    ...new Set(teachersData.map((t) => t.descricao_categoria)),
  ].sort();
  const grausAcademicos = [
    ...new Set(teachersData.map((t) => t.descricao_grau_academico)),
  ].sort();
  const escaloes = [
    ...new Set(teachersData.map((t) => t.descricao_escalao)),
  ].sort();

  // Calcular estatísticas
  const totalDocentes = teachersData.length;
  const totalMestres = teachersData.filter(
    (t) => t.descricao_grau_academico === "Mestre"
  ).length;
  const totalDoutores = teachersData.filter(
    (t) => t.descricao_grau_academico === "Doutor"
  ).length;
  const totalLicenciados = teachersData.filter(
    (t) => t.descricao_grau_academico === "Licenciado"
  ).length;

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset página quando mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategoria, filterGrau, filterEscalao]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Início
        </Link>
        <span>/</span>
        <span className="font-medium">Gestão de Docentes</span>
        <span>/</span>
        <span className="text-foreground">Listagem geral</span>
      </nav>

      {/* Cabeçalho */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Listagem geral</h1>
          <p className="text-muted-foreground mt-1">
            Gestão completa do corpo docente
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar lista
          </Button>
          {/* <Button variant="outline" size="sm">
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
            Novo docente
          </Button> */}
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Docentes</p>
          <p className="text-3xl font-bold">
            {isLoading ? "..." : totalDocentes}
          </p>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Doutores</p>
          <p className="text-3xl font-bold text-success">
            {isLoading ? "..." : totalDoutores}
          </p>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Mestres</p>
          <p className="text-3xl font-bold text-warning">
            {isLoading ? "..." : totalMestres}
          </p>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Licenciados</p>
          <p className="text-3xl font-bold text-primary">
            {isLoading ? "..." : totalLicenciados}
          </p>
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
              placeholder="Nome, nº mecanográfico, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger id="categoria">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grau">Grau Académico</Label>
            <Select value={filterGrau} onValueChange={setFilterGrau}>
              <SelectTrigger id="grau">
                <SelectValue placeholder="Todos os graus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os graus</SelectItem>
                {grausAcademicos.map((grau) => (
                  <SelectItem key={grau} value={grau}>
                    {grau}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="escalao">Escalão</Label>
            <Select value={filterEscalao} onValueChange={setFilterEscalao}>
              <SelectTrigger id="escalao">
                <SelectValue placeholder="Todos os escalões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os escalões</SelectItem>
                {escaloes.map((esc) => (
                  <SelectItem key={esc} value={esc}>
                    {esc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Botão para limpar filtros */}
        {(searchTerm ||
          filterCategoria !== "all" ||
          filterGrau !== "all" ||
          filterEscalao !== "all") && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setFilterCategoria("all");
                setFilterGrau("all");
                setFilterEscalao("all");
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Tabela */}
      {error ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-destructive font-semibold mb-2">
            Erro ao carregar dados
          </p>
          {/* Exibir a mensagem de erro de forma segura */}
          <p className="text-sm text-muted-foreground mb-4">
            {error.message || "Erro desconhecido"}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : paginatedData.length === 0 ? (
        <div className="text-center py-12 bg-card border rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum registo encontrado
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Não foram encontrados docentes com os critérios selecionados
          </p>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Registar novo docente
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Mecanográfico</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Grau Académico</TableHead>
                    <TableHead>Escalão</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-mono text-sm font-medium">
                        {item.n_mecanografico}
                      </TableCell>
                      <TableCell className="font-medium">{item.nome}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.username}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.descricao_categoria}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.descricao_grau_academico === "Doutor"
                              ? "default"
                              : item.descricao_grau_academico === "Mestre"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {item.descricao_grau_academico}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {item.descricao_escalao}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            title="Ver detalhes"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Editar">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" title="Eliminar">
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="items-per-page" className="text-sm">
                Itens por página:
              </Label>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => {
                  setItemsPerPage(Number(value));
                  setCurrentPage(1);
                }}
              >
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
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, filteredData.length)} de{" "}
                {filteredData.length} registos
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
              <span className="text-sm">
                Página {currentPage} de {totalPages || 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
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
