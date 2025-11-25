// src/pages/access/AccessGroup.tsx
import { useState } from "react";
import { RefreshCw, FileDown, Printer, Plus, Edit, Trash2, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { format } from "date-fns";
import { useGroups } from "@/hooks/acess/use-query-groups";
import { useGroupAccesses } from "@/hooks/acess/use-query-group-accesses";
import { DeleteAccessButton } from "./components/DeleteAccessButton";
import { formatarData } from "@/util/date-formate";

export default function AccessGroup() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Lista de grupos
  const { data: groups = [], isLoading: loadingGroups } = useGroups();

  // Acessos do grupo selecionado
  const {
    data: accesses = [],
    isLoading: loadingAccesses,
    error: errorAccesses,
    refetch,
  } = useGroupAccesses({
    groupId: Number(selectedGroupId),
    enabled: !!selectedGroupId && selectedGroupId !== "0",
  });

  // Resetar página ao trocar de grupo
  const handleGroupChange = (value: string) => {
    setSelectedGroupId(value);
    setCurrentPage(1);
  };

  const sortedGroups = [...groups].sort((a, b) => a.descricao.localeCompare(b.descricao));
  const selectedGroup = groups.find((g) => g.codigo === Number(selectedGroupId));

  // Filtrar apenas permissões ativas
  const activeAccesses = accesses.filter((a) => a.disponibilidade === 1);

  // Paginação
  const totalItems = activeAccesses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedAccesses = activeAccesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Breadcrumb + Título */}
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Acesso por Grupo</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Acesso Funcionalidade por Grupo
          </h1>
          {selectedGroup && (
            <p className="text-muted-foreground mt-1">
              Permissões do grupo: <strong>{selectedGroup.descricao}</strong> ({totalItems} permissões ativas)
            </p>
          )}
        </div>
      </div>

      {/* Select + Botões */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-md space-y-2">
          <label className="text-sm font-medium">Selecionar Grupo</label>
          <Select value={selectedGroupId} onValueChange={handleGroupChange}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder={loadingGroups ? "Carregando grupos..." : "Escolha um grupo"} />
            </SelectTrigger>
            <SelectContent className="max-h-96">
              {sortedGroups.map((group) => (
                <SelectItem key={group.codigo} value={String(group.codigo)}>
                  [{group.codigo}] {group.descricao}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Atribuir Permissão
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loadingAccesses || !selectedGroupId}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingAccesses ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        
        </div>
      </div>

      {/* Tabela + Paginação */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-24">Código</TableHead>
              <TableHead>Funcionalidade</TableHead>
              <TableHead className="w-32">Status</TableHead>
              <TableHead className="w-40">Última Atualização</TableHead>
              <TableHead className="text-right w-28">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingAccesses ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-full max-w-md" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : errorAccesses ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-destructive">
                  Erro ao carregar as permissões.
                </TableCell>
              </TableRow>
            ) : !selectedGroupId ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um grupo para visualizar as permissões</p>
                </TableCell>
              </TableRow>
            ) : activeAccesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Este grupo não possui permissões configuradas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAccesses.map((access) => (
                <TableRow key={access.codigo}>
                  <TableCell className="font-mono text-sm">{access.codigo}</TableCell>
                  <TableCell className="max-w-lg">{access.descricao}</TableCell>
                  <TableCell><Badge variant="default">Ativo</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {access["Update at"]
                      ? formatarData (access["Update at"])
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {/*
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      */}
                     <DeleteAccessButton acessoCodigo={access.codigo} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Paginação (só aparece se tiver dados e mais de uma página) */}
        {selectedGroupId && activeAccesses.length > 0 && (
          <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Itens por página:</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span>
                Mostrando {startItem}–{endItem} de {totalItems}
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
              </Button>
              <span className="text-sm font-medium">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}