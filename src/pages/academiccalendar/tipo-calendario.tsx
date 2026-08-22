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
import { Badge } from "@/components/ui/badge";
import { FileText, Home, Pencil, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import type { TipoCalendario } from "@/services/tipo-calendario/tipo-calendario.service";
import { useQueryFetchTipoCalendarios } from "@/hooks/tipo-calendario/use-tipo-calendario";
import { TipoCalendarioDialog } from "./components/dialog-calendario";

const setDefaultValue = (value: string) => (value === "" ? undefined : value);

export default function TipoCalendarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500);

  const [selectedTipoCalendario, setSelectedTipoCalendario] = useState<
    TipoCalendario | undefined
  >(undefined);

  const { data, isLoading } = useQueryFetchTipoCalendarios({
    page,
    limit: 10,
    search: setDefaultValue(debouncedSearch),
  });

  const tipoCalendarios = data?.data ?? [];
  const meta = data?.meta;

  const handleSelectTipoCalendario = (item?: TipoCalendario) => {
    if (!item) {
      setSelectedTipoCalendario(undefined);
      setIsModalOpen(false);
      return;
    }
    setSelectedTipoCalendario(item);
    setIsModalOpen(true);
  };

  const handleOpenModal = () => {
    setSelectedTipoCalendario(undefined);
    setIsModalOpen(true);
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
            <BreadcrumbLink>Tipos de Calendário</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Tipos de Calendário</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie os tipos de calendário do sistema.
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
              <Label htmlFor="search">Sigla ou Designação</Label>
              <Input
                id="search"
                placeholder="Pesquisar..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <div className="flex gap-2">
        <Button className="gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Novo Tipo de Calendário
        </Button>
      </div> */}

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : tipoCalendarios.length === 0 ? (
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
                  <TableHead>Designação</TableHead>
                  <TableHead>Ativo p/ Aluno</TableHead>
                  {/* <TableHead className="text-right">Ações</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {tipoCalendarios.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell className="font-medium">{item.sigla}</TableCell>
                    <TableCell>{item.designacao}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.ativoParaAluno === 1 ? "default" : "secondary"
                        }
                      >
                        {item.ativoParaAluno === 1 ? "Sim" : "Não"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="text-right space-x-2">
                      <Button
                        className="h-8 w-8"
                        variant="outline"
                        size="icon"
                        title="Editar"
                        onClick={() => handleSelectTipoCalendario(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Página {meta.page} de {meta.totalPages} ({meta.total}{" "}
                  registos)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Seguinte
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <TipoCalendarioDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedTipoCalendario={selectedTipoCalendario}
        onSelectTipoCalendario={handleSelectTipoCalendario}
      />
    </div>
  );
}
