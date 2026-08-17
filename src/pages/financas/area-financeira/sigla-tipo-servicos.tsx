// sigla-tipo-servicos.tsx
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { FileText, Home, Pencil, Plus, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SiglaTipoServico } from "@/services/financas/siglas-services/sigla-servicos.service";
import {
  useDeleteSiglaTipoServico,
  useQueryFetchSiglaTipoServicos,
} from "@/hooks/sigla-tipo-servicos/use-sigla-tipo-servicos";
import { SiglaTipoServicoDialog } from "./components/sigla-tipo-servico-dialog";

const ITEMS_PER_PAGE = 10;

// Mapeamento dos tipos de candidatura
const TIPO_CANDIDATURA_MAP: Record<number, string> = {
  1: "Licenciatura",
  2: "Mestrado",
  3: "Doutoramento",
};

const TIPO_CANDIDATURA_OPTIONS = [
  { value: "all", label: "Todos" },
  { value: "1", label: "Licenciatura" },
  { value: "2", label: "Mestrado" },
  { value: "3", label: "Doutoramento" },
];

const getTipoCandidaturaLabel = (value: number | string): string => {
  if (typeof value === "string") {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      return TIPO_CANDIDATURA_MAP[numValue] || value;
    }
    return value;
  }
  if (value === null || value === undefined) {
    return "---";
  }
  return TIPO_CANDIDATURA_MAP[value] || String(value);
};

export default function SiglaTipoServicos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [tipoCandidaturaFilter, setTipoCandidaturaFilter] =
    useState<string>("all");
  const debouncedSearch = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSiglaTipoServico, setSelectedSiglaTipoServico] = useState<
    SiglaTipoServico | undefined
  >(undefined);

  const { data: siglaTipoServicos = [], isLoading } =
    useQueryFetchSiglaTipoServicos({
      search: debouncedSearch || undefined,
    });

  const { mutate: deleteSiglaTipoServico, isPending: isDeleting } =
    useDeleteSiglaTipoServico();

  // Filter data by tipo de candidatura and search
  const filteredData = useMemo(() => {
    let data = siglaTipoServicos;

    // Filter by tipo de candidatura
    if (tipoCandidaturaFilter !== "all") {
      data = data.filter(
        (item) => String(item.tipo_candidatura) === tipoCandidaturaFilter,
      );
    }

    // Filter by search (sigla or descricao)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      data = data.filter(
        (item) =>
          item.sigla?.toLowerCase().includes(searchLower) ||
          item.descricao?.toLowerCase().includes(searchLower),
      );
    }

    return data;
  }, [siglaTipoServicos, tipoCandidaturaFilter, debouncedSearch]);

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const currentItems = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const resultsElement = document.getElementById("results-section");
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSelectSiglaTipoServico = (item?: SiglaTipoServico) => {
    if (!item) {
      setSelectedSiglaTipoServico(undefined);
      setIsModalOpen(false);
      return;
    }
    setSelectedSiglaTipoServico(item);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedSiglaTipoServico(undefined);
    setIsModalOpen(true);
  };

  const handleDeleteSiglaTipoServico = (codigo: number) => {
    deleteSiglaTipoServico({ codigo });
  };

  // Reset to first page when filter changes
  const handleFilterChange = (value: string) => {
    setTipoCandidaturaFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Configurações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Siglas de Tipo de Serviço</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Siglas de Tipo de Serviço</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie as siglas e descrições dos tipos de serviço do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Filtros de Pesquisa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search">Sigla ou Descrição</Label>
              <Input
                id="search"
                placeholder="Pesquisar por sigla ou descrição..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tipoCandidatura">Tipo de Candidatura</Label>
              <Select
                value={tipoCandidaturaFilter}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger id="tipoCandidatura">
                  <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                  {TIPO_CANDIDATURA_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Nova Sigla
        </Button>
      </div>

      <div
        id="results-section"
        className="bg-card border rounded-lg p-6 shadow-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Resultados</h3>
          {!isLoading && totalItems > 0 && (
            <span className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} - {endIndex} de {totalItems} registros
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">
              Nenhum registro encontrado
            </p>
            <p className="text-sm text-muted-foreground/70">
              Tente ajustar a tua pesquisa
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sigla</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo de Candidatura</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell className="font-medium">
                        {item.sigla}
                      </TableCell>
                      <TableCell>{item.descricao}</TableCell>
                      <TableCell>
                        {getTipoCandidaturaLabel(item.tipo_candidatura)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          className="h-8 w-8"
                          variant="outline"
                          size="icon"
                          title="Editar"
                          onClick={() => handleSelectSiglaTipoServico(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                          variant="outline"
                          size="icon"
                          disabled={isDeleting || true}
                          title="Eliminar"
                          onClick={() =>
                            handleDeleteSiglaTipoServico(item.codigo)
                          }
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination - Simplified Design */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage >= totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próximo
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <SiglaTipoServicoDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedSiglaTipoServico={selectedSiglaTipoServico}
        onSelectSiglaTipoServico={handleSelectSiglaTipoServico}
      />
    </div>
  );
}
