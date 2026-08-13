// sigla-tipo-servicos.tsx
import { useState } from "react";
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
import type { SiglaTipoServico } from "@/services/financas/siglas-services/sigla-servicos.service";
import {
  useDeleteSiglaTipoServico,
  useQueryFetchSiglaTipoServicos,
} from "@/hooks/sigla-tipo-servicos/use-sigla-tipo-servicos";
import { SiglaTipoServicoDialog } from "./components/sigla-tipo-servico-dialog";

const setDefaultValue = (value: string) => (value === "" ? undefined : value);

export default function SiglaTipoServicos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const [selectedSiglaTipoServico, setSelectedSiglaTipoServico] = useState<
    SiglaTipoServico | undefined
  >(undefined);

  const { data: siglaTipoServicos = [], isLoading } =
    useQueryFetchSiglaTipoServicos({
      search: setDefaultValue(debouncedSearch),
    });

  const { mutate: deleteSiglaTipoServico, isPending: isDeleting } =
    useDeleteSiglaTipoServico();

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="search">Sigla ou Descrição</Label>
              <Input
                id="search"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
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

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : siglaTipoServicos.length === 0 ? (
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {siglaTipoServicos.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell className="font-medium">{item.sigla}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
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
