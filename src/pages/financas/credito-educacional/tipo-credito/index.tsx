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
import { FileText, Home, Pencil, Plus, RotateCcw, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { TipoCreditoDialog } from "./tipo-credito-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryFetchCreditoEducacionalTipo } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional-tipo";
import { Badge } from "@/components/ui/badge";
import { CreditoEducacionalTipo } from "@/services/financas/credito-educacional/fetch-credito-educacional-tipo.service";
import { useDeleteTipoCreditoEducacional } from "@/hooks/financas/credito-educacional/use-delete-tipo-credito";
import { Switch } from "@/components/ui/switch";
import { useRestoreTipoCreditoEducacional } from "@/hooks/financas/credito-educacional/use-restore-tipo-credito";
import { cn } from "@/lib/utils"; // Certifique-se de que o import do cn está presente

const setDefaultValue = (value: string) =>
  value === "all" ? undefined : value;

export default function TipoCredito() {
  const [showDeleted, setShowDeleted] = useState(false);
  const { mutate: deleteTipoCreditoEducacional, isPending: isDeleting } = useDeleteTipoCreditoEducacional();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 500);

  const { data: creditoEducacionalTipoResponse, isLoading: isLoadingCreditoEducationalTipo } = useQueryFetchCreditoEducacionalTipo({
    search: setDefaultValue(debouncedSearch),
    deleted: showDeleted
  });
  const { mutate: restoreTipoCreditoEducacional, isPending: isRestoring } = useRestoreTipoCreditoEducacional();
  const creditoEducacional = creditoEducacionalTipoResponse?.data ?? [];
  const [selectedTipoCredito, setSelectedTipoCredito] = useState<CreditoEducacionalTipo | undefined>(undefined);

  const handleSelectTipoCredito = (tipoCredito?: CreditoEducacionalTipo) => {
    if (!tipoCredito) {
      setSelectedTipoCredito(undefined);
      setIsModalOpen(false);
      return
    }
    setSelectedTipoCredito(tipoCredito);
    setIsModalOpen(true);
  }

  const handleOpenModal = () => {
    setSelectedTipoCredito(undefined);
    setIsModalOpen(true);
  }
  const handleRestoreTipoCreditoEducacional = (id: number) => {
    restoreTipoCreditoEducacional({ id });
  }
  const handleDeleteTipoCreditoEducacional = (id: number) => {
    deleteTipoCreditoEducacional({ id });
  }

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
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Tipos de Crédito</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Tipos de Crédito</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie as configurações e tipos de crédito educacional do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="designacao">Designação</Label>
              <Input
                id="designacao"
                placeholder="Pesquisar designação..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 pb-3">
              <Switch
                id="deleted-mode"
                checked={showDeleted}
                onCheckedChange={setShowDeleted}
              />
              <Label htmlFor="deleted-mode" className="cursor-pointer text-sm">
                Mostrar eliminados
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2" onClick={handleOpenModal}>
          <Plus className="h-4 w-4" />
          Novo Crédito
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        {isLoadingCreditoEducationalTipo ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : creditoEducacional.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground font-medium">
              Nenhum registro encontrado
            </p>
            <p className="text-sm text-muted-foreground/70">
              Tente ajustar seus filtros ou pesquisar por outro termo
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designação</TableHead>
                  <TableHead>Sigla</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditoEducacional.map(item => {
                  const isDeleted = !!item.deleteat;
                  return (
                    <TableRow
                      key={item.codigo}
                      className={cn(
                        "transition-all duration-200",
                        isDeleted && "bg-destructive/5 opacity-75 hover:bg-destructive/10"
                      )}
                    >
                      <TableCell className={cn("font-medium", isDeleted && "line-through text-muted-foreground italic")}>
                        {item.designacao}
                      </TableCell>
                      <TableCell className={cn(isDeleted && "line-through text-muted-foreground italic")}>
                        {item.sigla}
                      </TableCell>
                      <TableCell>
                        {isDeleted ? (
                          <Badge variant="destructive" className="uppercase text-[10px]">Eliminado</Badge>
                        ) : (
                          <Badge variant={item.status === 1 ? "secondary" : "outline"}>
                            {item.status === 1 ? "Ativo" : "Inativo"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {isDeleted ? (
                          <Button
                            className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            variant="outline"
                            size="icon"
                            disabled={isRestoring}
                            title="Restaurar item"
                            onClick={() => handleRestoreTipoCreditoEducacional(item.codigo)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              className="h-8 w-8"
                              variant="outline"
                              size="icon"
                              title="Editar"
                              onClick={() => handleSelectTipoCredito(item)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              variant="outline"
                              size="icon"
                              disabled={isDeleting}
                              title="Eliminar"
                              onClick={() => handleDeleteTipoCreditoEducacional(item.codigo)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <TipoCreditoDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedTipoCredito={selectedTipoCredito}
        onSelectTipoCredito={handleSelectTipoCredito}
      />
    </div>
  );
}