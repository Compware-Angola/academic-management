import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  DollarSign,
  FileText,
  Home,
  Loader2,
  Pencil,
  Printer,
  X,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useQueryFetchBolsaEstudante } from "@/hooks/financas/bolsa/use-query-fetch-bolsa-estudante";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import {
  BolsaEstudante,
  FetchBolsaEstudanteParams,
} from "@/services/financas/bolsa/fetch-bolsa-estudante.service";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import useMutationEstadoCreditoEducacional, { useMutationToggleInstituicaoPagou } from "@/hooks/financas/credito-educacional/useMutationEstadoCreditoEducacional";
import { EditAttributionModal } from "../AtribuirCredito/components/EditAttributionModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  exportBolsaEstudanteExcelService,
  exportBolsaEstudantePdfService,
} from "@/services/financas/bolsa/export-bolsa-estudante.service";
import { toast } from "sonner";

type ExportAction = "pdf" | "print" | "excel";

export default function ListarBolsaEstudante() {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedForToggle, setSelectedForToggle] = useState<BolsaEstudante | null>(null);
  // Estados (adicione junto com os outros)
  const [confirmEstadoDialogOpen, setConfirmEstadoDialogOpen] = useState(false);
  const [selectedForEstadoToggle, setSelectedForEstadoToggle] = useState<BolsaEstudante | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");
  const [filters, setFilters] = useState<FetchBolsaEstudanteParams>({
    page: 1,
    limit: 10,
    codigoInstituicao: undefined,
    codigoBolsa: undefined,
    codigoTipoCredito: undefined,
    nome: undefined,
    codigoAnoLectivo: undefined,
    codigoMatricula: undefined,
    cursoId: undefined,
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<BolsaEstudante | null>(
    null,
  );
  const [exportingAction, setExportingAction] = useState<ExportAction | null>(
    null,
  );

  const debouncedNome = useDebounce(filters.nome, 500);
  const debouncedMatricula = useDebounce(filters.codigoMatricula, 500);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      nome: debouncedNome || undefined,
      codigoMatricula: debouncedMatricula || undefined,
      page,
      limit: Number(limit),
    }));
  }, [debouncedNome, debouncedMatricula, page, limit]);

  const { data, isLoading } = useQueryFetchBolsaEstudante(filters);
  const { data: semestres } = useQuerySemestres();
  const [selectedBolsa, setSelectedBolsa] = useState<BolsaEstudante | null>(
    null,
  );
  const estudantes = useMemo(() => data?.data ?? [], [data]);
  const meta = useMemo(() => data?.meta, [data]);
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? 1;
  const totalItems = meta?.total ?? 0;
  const { mutateAsync: switchEstadoBolsa, isPending: isPendingActiveBolsa } =
    useMutationEstadoCreditoEducacional();
  const { mutateAsync: handleToggleInstituicaoPagou, isPending: isPendingInstituicaoPagou } =
    useMutationToggleInstituicaoPagou();
  const handleOpenConfirmDialog = (estudante: BolsaEstudante) => {
    setSelectedForToggle(estudante);
    setConfirmDialogOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedForToggle) return;

    try {
      await handleToggleInstituicaoPagou({ codigo: selectedForToggle.codigo });

    } catch (error) {
      console.error(error);
    } finally {
      setConfirmDialogOpen(false);
      setSelectedForToggle(null);
    }
  };
  // Funções
  const handleOpenConfirmEstado = (estudante: BolsaEstudante) => {
    setSelectedForEstadoToggle(estudante);
    setConfirmEstadoDialogOpen(true);
  };

  const handleConfirmEstadoToggle = async () => {
    if (!selectedForEstadoToggle) return;

    try {
      await switchEstadoBolsa({ codigo: selectedForEstadoToggle.codigo });

    } catch (error) {
      console.error(error);
    } finally {
      setConfirmEstadoDialogOpen(false);
      setSelectedForEstadoToggle(null);
    }
  };
  const semestreMap = useMemo(
    () => new Map(semestres?.map((s) => [s.codigo, s.designacao]) ?? []),
    [semestres],
  );
  const [searchType, setSearchType] = useState<"nome" | "matricula">("nome");

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: Number(limit),
      codigoInstituicao: undefined,
      codigoBolsa: undefined,
      codigoTipoCredito: undefined,
      nome: undefined,
      codigoAnoLectivo: undefined,
      codigoMatricula: undefined,
      cursoId: undefined,
    });
    setPage(1);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);

  const formatDesconto = useCallback(
    (valor: number, tipo: string) =>
      tipo === "PERCENTUAL" ? `${valor}%` : formatCurrency(valor),
    [],
  );

  const handleExport = async (action: ExportAction) => {
    if (exportingAction || totalItems === 0) return;

    const printWindow = action === "print" ? window.open("", "_blank") : null;

    if (action === "print" && !printWindow) {
      toast.error("O navegador bloqueou a janela de impressão.");
      return;
    }

    setExportingAction(action);

    try {
      const { blob, fileName } =
        action === "excel"
          ? await exportBolsaEstudanteExcelService(filters)
          : await exportBolsaEstudantePdfService(filters);

      const downloadUrl = URL.createObjectURL(blob);

      if (action === "print") {
        printWindow!.location.href = downloadUrl;
        setTimeout(() => {
          printWindow!.print();
          URL.revokeObjectURL(downloadUrl);
        }, 1000);
      } else {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(downloadUrl);
      }

      toast.success("Exportação concluída com sucesso.");
    } catch {
      printWindow?.close();
      toast.error("Não foi possível exportar os estudantes com crédito.");
    } finally {
      setExportingAction(null);
    }
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
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Estudantes com Crédito Educacional</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Estudantes com Crédito Educacional</h1>
        <p className="text-muted-foreground">
          Lista completa de estudantes com Créditos Educacionais aplicados.
        </p>
      </div>

      {/* Filtros - mesmo padrão do ListarBolsa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-1"
          >
            <X className="h-4 w-4" />
            Limpar Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Select de tipo de pesquisa + campo dinâmico */}
            <div className="space-y-2 md:col-span-2 lg:col-span-2 flex gap-2">
              <div className="space-y-2 w-32 shrink-0">
                <Label>Pesquisar por</Label>
                <Select
                  value={searchType}
                  onValueChange={(v: "nome" | "matricula") => {
                    setSearchType(v);
                    setPage(1);
                    setFilters((prev) => ({
                      ...prev,
                      nome: undefined,
                      codigoMatricula: undefined,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome">Nome</SelectItem>
                    <SelectItem value="matricula">Matrícula</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <Label htmlFor="search-input">
                  {searchType === "nome" ? "Nome do Estudante" : "Matrícula"}
                </Label>
                {searchType === "nome" ? (
                  <Input
                    id="search-input"
                    placeholder="Digite o nome"
                    value={filters.nome || ""}
                    onChange={(e) => {
                      setPage(1);
                      setFilters((prev) => ({ ...prev, nome: e.target.value }));
                    }}
                  />
                ) : (
                  <Input
                    id="search-input"
                    placeholder="Código da matrícula"
                    value={filters.codigoMatricula?.toString() || ""}
                    onChange={(e) => {
                      setPage(1);
                      setFilters((prev) => ({
                        ...prev,
                        codigoMatricula: Number(e.target.value),
                      }));
                    }}
                  />
                )}
              </div>
            </div>

            <CourseSelect
              value={filters.cursoId?.toString() || ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  cursoId: v ? Number(v) : undefined,
                }));
              }}
            />

            <AcademicYearSelect
              value={filters.codigoAnoLectivo?.toString() ?? ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  codigoAnoLectivo: v ? Number(v) : undefined,
                }));
              }}
            />

            <InstituicaoSelect
              value={filters.codigoInstituicao?.toString() ?? ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  codigoInstituicao: v ? Number(v) : undefined,
                }));
              }}
            />

            <BolsaSelect
              value={filters.codigoBolsa?.toString() ?? ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters((prev) => ({
                  ...prev,
                  codigoBolsa: v ? Number(v) : undefined,
                }));
              }}
            />
          </div>
        </CardContent>
      </Card>

      {totalItems > 0 && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("pdf")}
            disabled={!!exportingAction}
          >
            <FileText className="mr-2 h-4 w-4" />
            {exportingAction === "pdf" ? "A exportar..." : "Exportar PDF"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("print")}
            disabled={!!exportingAction}
          >
            <Printer className="mr-2 h-4 w-4" />
            {exportingAction === "print" ? "A imprimir..." : "Imprimir"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("excel")}
            disabled={!!exportingAction}
          >
            <Download className="mr-2 h-4 w-4" />
            {exportingAction === "excel"
              ? "A exportar..."
              : "Exportar Excel"}
          </Button>
        </div>
      )}

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: Number(limit) }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : estudantes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Ano Letivo</TableHead>
                    <TableHead>Semestre</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Tipo Crédito</TableHead>
                    <TableHead>Crédito Educacional</TableHead>


                    <TableHead>Estado da Bolsa</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estudantes.map((e) => (
                    <TableRow key={e.codigo}>
                      <TableCell className="whitespace-nowrap">
                        {e.codigo_matricula}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[200px]"
                        title={e.nome_completo}
                      >
                        {e.nome_completo}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[150px]"
                        title={e.curso}
                      >
                        {e.curso}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[150px]"
                        title={e.instituicao}
                      >
                        {e.instituicao}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {e.ano_lectivo}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {semestreMap.get(e.semestre) ?? "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDesconto(e.valor_desconto, e.tipo_desconto)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {e.tipo_credito}
                      </TableCell>
                      <TableCell
                        className="truncate max-w-[150px]"
                        title={e.bolsa}
                      >
                        {e.bolsa}
                      </TableCell>

                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-pointer">
                                  <Switch
                                    checked={e.status_ === 1}
                                    onCheckedChange={() => handleOpenConfirmEstado(e)}
                                    disabled={false}
                                  />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Clique para {e.status_ === 1 ? "desativar" : "ativar"} a bolsa</p>

                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <Loader2
                            className={cn(
                              "h-4 w-4 animate-spin",
                              selectedBolsa?.codigo === e.codigo && isPendingActiveBolsa
                                ? "block"
                                : "hidden"
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label="Editar"
                          onClick={() => {
                            setSelectedStudent(e);
                            setEditModalOpen(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6">
              <div className="text-sm text-muted-foreground">
                Mostrando página <strong>{currentPage}</strong> de{" "}
                <strong>{totalPages}</strong> • Total de{" "}
                <strong>{totalItems}</strong> registos
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <Label>Itens por página</Label>
                  <Select
                    value={limit}
                    onValueChange={(value) => {
                      setLimit(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-sm font-medium px-4">{currentPage}</div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
      <EditAttributionModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialValues={selectedStudent!}
      />
      {/* DIALOG DE CONFIRMAÇÃO */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedForToggle?.instituicao_pagou === 1 ? (
                <>
                  <XCircle className="h-6 w-6 text-red-500" />
                  Desmarcar Pagamento
                </>
              ) : (
                <>
                  <DollarSign className="h-6 w-6 text-green-500" />
                  Marcar como Pago
                </>
              )}
            </DialogTitle>

            <DialogDescription className="pt-2">
              {selectedForToggle?.instituicao_pagou === 1 ? (
                <>
                  Tem certeza que deseja <strong className="text-red-600">desmarcar </strong>
                  como pago pela instituição?
                </>
              ) : (
                <>
                  Tem certeza que deseja <strong className="text-green-600">marcar </strong>
                  como pago pela instituição?
                </>
              )}

              <div className="mt-4 p-3 bg-muted rounded-lg flex items-center gap-3">
                <div className="text-3xl">💰</div>
                <div>
                  <p className="font-medium">Estudante:</p>
                  <p>{selectedForToggle?.nome_completo}</p>
                  <p>Tipo: {selectedForToggle?.tipo_credito}</p>
                  <p>Matrícula: {selectedForToggle?.codigo_matricula}</p>
                  <p>Valor Desconto:  {formatDesconto(selectedForToggle?.valor_desconto, selectedForToggle?.tipo_desconto)}</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setSelectedForToggle(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmToggle}
              disabled={isPendingInstituicaoPagou}
              className={selectedForToggle?.instituicao_pagou === 1
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
              }
            >
              {isPendingInstituicaoPagou && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {selectedForToggle?.instituicao_pagou === 1 ? "Desmarcar Pagamento" : "Confirmar Pagamento"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Dialog Estado da Bolsa */}
      <Dialog open={confirmEstadoDialogOpen} onOpenChange={setConfirmEstadoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Alteração de Estado</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja{" "}
              <strong>
                {selectedForEstadoToggle?.status_ === 1 ? "desativar" : "ativar"}
              </strong>{" "}
              a bolsa do estudante?
              <br />
              <span className="font-medium mt-2 block">
                Estudante: {selectedForEstadoToggle?.nome_completo}
              </span>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmEstadoDialogOpen(false);
                setSelectedForEstadoToggle(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmEstadoToggle}
              disabled={isPendingActiveBolsa}
            >
              {isPendingActiveBolsa && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
