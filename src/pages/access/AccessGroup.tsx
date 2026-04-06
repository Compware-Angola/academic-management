import PDFActions, {
  GenericPDFDocument,
} from "@/components/views/pdf/GenericPDFDocument";
import ExcelActions from "@/components/views/excel/GenericExcelExport";
import { useMemo } from "react"; 

import { useState } from "react";
import {
  RefreshCw,
  Settings,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGroups } from "@/hooks/acess/use-query-groups";
import { useGroupAccesses } from "@/hooks/acess/use-query-group-accesses";
import { DeleteAccessButton } from "./components/DeleteAccessButton";
import { formatarData } from "@/util/date-formate";
import { CreateGroupAccessModal } from "./components/CreateGroupAccessModal";
import { toast } from "@/components/ui/use-toast"; // opcional: se você usa toast do shadcn
import { FormCommandSelect } from "@/components/common/FormCommandSelect";

export default function AccessGroup() {
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openCreateModal, setOpenCreateModal] = useState(false);

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

  const sortedGroups = [...groups].sort((a, b) =>
    a.descricao?.localeCompare(b?.descricao ?? "")
  );

  const selectedGroup = groups.find(
    (g) => g.codigo === Number(selectedGroupId)
  );

  // Filtrar apenas permissões ativas + remover duplicatas por código (segurança extra)
  const activeAccesses = accesses
    .filter((a) => a.disponibilidade === 1)
    .reduce((unique, access) => {
      if (!unique.some((u) => u.codigo === access.codigo)) {
        unique.push(access);
      }
      return unique;
    }, [] as typeof accesses);

  // Debug temporário (remova depois de testar)
  // console.log("Acessos crus:", accesses.length);
  // console.log("Acessos únicos após filtro:", activeAccesses.length);
  // console.table(activeAccesses);

  // Paginação
  const totalItems = activeAccesses.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedAccesses = activeAccesses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

const pdfData = useMemo(() => {
  if (!selectedGroup || activeAccesses.length === 0) return null;

  return {
    filtros: [
      `Grupo: ${selectedGroup.descricao}`,
    ].join(" | "),

    total: activeAccesses.length,

    rows: activeAccesses.map((a) => ({
      codigo: a.codigo,
      descricao: a.descricao,
      estado: "Ativo",
      atualizadoEm: a["Update at"]
        ? formatarData(a["Update at"])
        : "—",
    })),
  };
}, [selectedGroup, activeAccesses]);

const pdfContent = pdfData ? (
  <GenericPDFDocument
    documentTitle="Permissões por Grupo"
    subtitle="Acessos atribuídos a grupos"
    infoSections={[
      { title: "Grupo", content: selectedGroup?.descricao ?? "—" },
      { title: "Resumo", content: [`Total de permissões: ${pdfData.total}`] },
    ]}
    mainTable={{
      headers: [
        { key: "codigo", label: "Código", width: "15%" },
        { key: "descricao", label: "Funcionalidade", width: "45%" },
        { key: "estado", label: "Estado", width: "15%" },
        { key: "atualizadoEm", label: "Última Atualização", width: "25%" },
      ],
      rows: pdfData.rows,
      headerBackground: "#0D1B48",
    }}
    footerNotice="Documento gerado automaticamente pelo sistema."
  />
) : null;

const excelProps = pdfData
  ? {
      documentTitle: "Permissões por Grupo",
      subtitle: "Acessos atribuídos a grupos",
      infoSections: [
        { title: "Grupo", content: selectedGroup?.descricao ?? "—" },
        { title: "Resumo", content: [`Total de permissões: ${pdfData.total}`] },
      ],
      mainTable: {
        headers: [
          { key: "codigo", label: "Código", width: 15 },
          { key: "descricao", label: "Funcionalidade", width: 45 },
          { key: "estado", label: "Estado", width: 15 },
          { key: "atualizadoEm", label: "Última Atualização", width: 25 },
        ],
        rows: pdfData.rows,
      },
      footerNotice: "Documento gerado automaticamente pelo sistema.",
      primaryColor: "#0D1B48",
    }
  : null;

  const baseFileName = selectedGroup
  ? `Acessos_Grupo_${selectedGroup.codigo}_${new Date()
      .toISOString()
      .slice(0, 10)}`
  : "Acessos_Grupo";


  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex-1 space-y-6 p-8">
      
      {/* Breadcrumb + Título + Ações */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/acessos">Acessos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Acesso por Grupo</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Acesso Funcionalidade por Grupo
            </h1>
            {selectedGroup && (
              <p className="text-muted-foreground mt-1">
                Permissões do grupo:{" "}
                <strong>{selectedGroup.descricao}</strong> (
                {activeAccesses.length} permissões ativas)
              </p>
            )}
          </div>
        </div>

        {/* AÇÕES */}
        {pdfData && excelProps && (
          <div className="flex flex-wrap gap-2">
            {pdfContent && (
              <PDFActions
                document={pdfContent}
                fileName={`${baseFileName}.pdf`}
                showDownload
                showPrint
              />
            )}

            <ExcelActions
              excelProps={excelProps}
              fileName={`${baseFileName}.xlsx`}
              showDownload
            />
          </div>
        )}
      </div>


      {/* Select + Botões */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <FormCommandSelect
  disabled={loadingGroups}
  value={selectedGroupId}
  label="Selecionar Grupo"
  width="md"
  options={sortedGroups}
  map={(group) => ({
    key: String(group.codigo),
    value: String(group.codigo),
    label: `[${group.codigo}] ${group.descricao}`,
  })}
  onChange={handleGroupChange}
/>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={!selectedGroupId || loadingAccesses}
            onClick={() => setOpenCreateModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Atribuir Permissão
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={loadingAccesses || !selectedGroupId}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loadingAccesses ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Tabela */}
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
                <TableRow key={`skeleton-${i}`}>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-full max-w-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : errorAccesses ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-destructive"
                >
                  Erro ao carregar as permissões. Tente atualizar.
                </TableCell>
              </TableRow>
            ) : !selectedGroupId ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Selecione um grupo para visualizar as permissões</p>
                </TableCell>
              </TableRow>
            ) : activeAccesses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  Este grupo não possui permissões ativas configuradas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedAccesses.map((access) => (
                <TableRow key={access.codigo}>
                  <TableCell className="font-mono text-sm">
                    {access.codigo}
                  </TableCell>
                  <TableCell className="max-w-lg truncate">
                    {access.descricao}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">Ativo</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {access["Update at"]
                      ? formatarData(access["Update at"])
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <DeleteAccessButton
                        acessoCodigo={access.codigo}
                        grupoId={Number(selectedGroupId)}
                        nomeAcesso={access.descricao} 
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Paginação */}
        {selectedGroupId && activeAccesses.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between border-t bg-muted/30 px-4 py-3 gap-4">
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
                    <SelectItem value="5">5</SelectItem>
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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <CreateGroupAccessModal
        open={openCreateModal}
        onOpenChange={setOpenCreateModal}
        groupId={Number(selectedGroupId)}
      />
    </div>
  );
}