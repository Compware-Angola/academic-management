import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Settings, Plus, RefreshCw, Download, Printer, Search, ChevronsLeft, ChevronsRight } from "lucide-react";
import { toast } from "sonner";
import { useParametroDocente } from "@/hooks/gestao_docente/use-query-fetch-parametro-docente";
import { useToggleParametroDocente } from "@/hooks/gestao_docente/update-parametro";
import { Card, CardContent } from "@/components/ui/card";
import { ParametrosDocenteItem } from "@/services/gestao_docente/fetch.gestao.docente.parametro.service";

const Parametros = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedParam, setSelectedParam] = useState<ParametrosDocenteItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data: parametrosData, isLoading, refetch } = useParametroDocente({ search: searchTerm, page });
  const parametros = parametrosData?.data || [];
  const totalPages = parametrosData?.totalPages || 1;

  const toggleMutation = useToggleParametroDocente();

  const handleToggle = (param: ParametrosDocenteItem) => {
    const newState = param.args[0].state === "SIM" ? "NAO" : "SIM";
    param.args[0].state = newState;

    toggleMutation.mutate(param.codigo, {
      onSuccess: (res) => {
        toast.success(`Parâmetro ${res.state === "SIM" ? "ativado" : "desativado"} com sucesso`);
        refetch();
      },
      onError: (err: any) => {
        toast.error("Erro ao atualizar o parâmetro");
        console.error(err);
      },
    });
  };

  const handleEdit = (param: ParametrosDocenteItem) => {
    setSelectedParam(param);
    setEditModalOpen(true);
  };

  const goToPreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const goToNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/gestao-docentes">Gestão de Docentes</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Parâmetros</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parâmetros de Gestão de Docentes</h1>
          <p className="text-muted-foreground mt-1">Configure os parâmetros do sistema de gestão docente</p>
        </div>
   
      </div>

      <Card>
        <CardContent className="pt-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[260px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Pesquisar parâmetro"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button variant="outline" onClick={() => refetch()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </CardContent>
      </Card>

      {/* Tabela */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Designação</TableHead>
                <TableHead>Sigla</TableHead>
                <TableHead className="text-center">Ativo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : parametros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Nenhum parâmetro encontrado</TableCell>
                </TableRow>
              ) : (
                parametros.map((param) => (
                  <TableRow key={param.codigo}>
                    <TableCell className="font-mono text-sm">{param.codigo}</TableCell>
                    <TableCell className="font-medium max-w-[200px]">{param.designacao}</TableCell>
                    <TableCell><Badge variant="outline" className="font-mono">{param.sigla}</Badge></TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={param.args[0]?.state === "SIM"}
                        onCheckedChange={() => handleToggle(param)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={goToPreviousPage}>
          <ChevronsLeft className="h-4 w-4 mr-1" /> Anterior
        </Button>
        <span>Página {page} de {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={goToNextPage}>
          Próxima <ChevronsRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      {/* Modal Editar Parâmetro */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Editar Parâmetro
            </DialogTitle>
            <DialogDescription>Editar o parâmetro: {selectedParam?.sigla}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>Cancelar</Button>
            <Button onClick={() => setEditModalOpen(false)}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parametros;