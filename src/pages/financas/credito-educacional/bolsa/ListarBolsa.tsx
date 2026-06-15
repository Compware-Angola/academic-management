import { useEffect, useState } from "react";
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
  FileText,
  Home,
  Loader2,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bolsa,
  FetchBolsaParams,
} from "@/services/financas/bolsa/fetch-bolsa.service";
import { useQueryFetchBolsa } from "@/hooks/financas/bolsa/use-query-fetch-bolsa";
import { CreateBolsaDialog, CreateBolsaFormData } from "./CreateBolsaDialog";
import { useMutationCreateBolsa } from "@/hooks/financas/bolsa/use-mutation-create-bolsa";
import { Switch } from "@/components/ui/switch";
import { useMutationEstadoBolsa } from "@/hooks/financas/bolsa/use-mutation-estado-bolas";
import { cn } from "@/lib/utils";
import { useMutationUpdateBolsa } from "../../../../hooks/financas/bolsa/use-mutation-update-bolsa";
import { CreditoEducacionalTipoSelect } from "@/components/common/global-selects/CreditoEducacionalTipoSelect";
import { CreditoEducacionalTipoDescontoSelect } from "@/components/common/global-selects/CreditoEducacionalTipoDescontoSelect";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";

export default function ListarBolsa() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBolsa, setEditingBolsa] = useState<Bolsa | null>(null);
  const [selectedBolsa, setSelectedBolsa] = useState<Bolsa | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState("10");

  const [filters, setFilters] = useState<FetchBolsaParams>({
    codigoInstituicao: undefined,
    codigoTipoCredito: undefined,
    codigoTipoDesconto: undefined,
    designacao: undefined,
    page: "1",
    limit: "10",
  });
  const debouncedDesignacao = useDebounce(filters.designacao, 500);

  const [formData, setFormData] = useState<CreateBolsaFormData>({
    designacao: "",
    codigoTipoDesconto: "",
    valorDesconto: "",
    codigoTipoCredito: "",
    codigoInstituicao: "",
  });

  const {
    mutateAsync: mutateAsyncCreateBolsa,
    isPending: isPendingCreateBolsa,
  } = useMutationCreateBolsa();
  const {
    mutateAsync: mutateAsyncUpdateBolsa,
    isPending: isPendingUpdateBolsa,
  } = useMutationUpdateBolsa();
  const { mutateAsync: switchEstadoBolsa, isPending: isPendingActiveBolsa } =
    useMutationEstadoBolsa();

  useEffect(() => {
    setFilters({
      designacao: debouncedDesignacao || undefined,
      codigoInstituicao: filters.codigoInstituicao || undefined,
      codigoTipoCredito: filters.codigoTipoCredito || undefined,
      codigoTipoDesconto: filters.codigoTipoDesconto || undefined,
      page: String(page),
      limit,
    });
  }, [
    debouncedDesignacao,
    filters.codigoInstituicao,
    filters.codigoTipoCredito,
    filters.codigoTipoDesconto,
    page,
    limit,
  ]);

  const { data, isLoading: isLoadingBolsa } = useQueryFetchBolsa(filters);
  const bolsas = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.page ?? 1;
  const totalItems = meta?.total ?? 0;

  const resetForm = () => {
    setFormData({
      designacao: "",
      codigoTipoDesconto: "",
      valorDesconto: "",
      codigoTipoCredito: "",
      codigoInstituicao: "",
    });
    setEditingBolsa(null);
  };

  const clearFilters = () => {
    setFilters({
      designacao: "",
      codigoInstituicao: undefined,
      codigoTipoCredito: undefined,
      codigoTipoDesconto: undefined,
    });
    setPage(1);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEditBolsa = (bolsa: Bolsa) => {
    setEditingBolsa(bolsa);
    setFormData({
      designacao: bolsa.designacao || "",
      codigoInstituicao: String(bolsa.codigo_instituicao),
      codigoTipoCredito: String(bolsa.codigo_tipo_credito),
      codigoTipoDesconto: String(bolsa.codigo_tipo_desconto),
      valorDesconto: String(bolsa.valor_desconto),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingBolsa) {
        await mutateAsyncUpdateBolsa({
          codigo: editingBolsa.codigo,
          designacao: formData.designacao,
          codigoInstituicao: Number(formData.codigoInstituicao),
          codigoTipoCredito: Number(formData.codigoTipoCredito),
          codigoTipoDesconto: Number(formData.codigoTipoDesconto),
          valorDesconto: Number(formData.valorDesconto),
        });
        toast({
          title: "Bolsa atualizada com sucesso",
        });
      } else {
        await mutateAsyncCreateBolsa({
          designacao: formData.designacao,
          codigoInstituicao: Number(formData.codigoInstituicao),
          codigoTipoCredito: Number(formData.codigoTipoCredito),
          codigoTipoDesconto: Number(formData.codigoTipoDesconto),
          valorDesconto: Number(formData.valorDesconto),
        });
        toast({
          title: "Bolsa criada com sucesso",
        });
      }
      setIsModalOpen(false);
      resetForm();
    } catch {
      toast({
        title: "Erro ao salvar bolsa",
        variant: "destructive",
      });
    }
  };

  const handleChangeEstado = async (bolsa: Bolsa) => {
    setSelectedBolsa(bolsa);
    await switchEstadoBolsa(bolsa.codigo);
    setSelectedBolsa(null);
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
            <BreadcrumbLink>Gestão de Crédito Educacional</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Crédito Educacional</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Crédito Educacional</h1>
        <p className="text-muted-foreground">
          Lista completa  de Créditos Educacionais cadastrados.
        </p>
      </div>

      {/* Filtros - Layout melhorado */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label htmlFor="designacao">Designação</Label>
              <Input
                id="designacao"
                placeholder="Digite a designação"
                value={filters.designacao || ""}
                onChange={(e) => {
                  setPage(1);
                  setFilters({ ...filters, designacao: e.target.value });
                }}
              />
            </div>

            <InstituicaoSelect
              value={filters.codigoInstituicao?.toString() || ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters({ ...filters, codigoInstituicao: v });
              }}
            />

            <CreditoEducacionalTipoSelect
              value={filters.codigoTipoCredito?.toString() || ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters({ ...filters, codigoTipoCredito: v });
              }}
            />

            <CreditoEducacionalTipoDescontoSelect
              value={filters.codigoTipoDesconto?.toString() || ""}
              onChangeValue={(v) => {
                setPage(1);
                setFilters({ ...filters, codigoTipoDesconto: v });
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button className="gap-2" onClick={handleOpenCreateModal}>
          <Plus className="h-4 w-4" />
          Nova Bolsa
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {isLoadingBolsa ? (
          <div className="space-y-3">
            {Array.from({ length: Number(limit) }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : bolsas.length === 0 ? (
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
                    <TableHead>Código</TableHead>
                    <TableHead>Designação</TableHead>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Tipo Desconto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Tipo Crédito</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bolsas.map((item) => (
                    <TableRow key={item.codigo}>
                      <TableCell>{item.codigo}</TableCell>
                      <TableCell>{item.designacao}</TableCell>
                      <TableCell>{item.instituicao}</TableCell>
                      <TableCell>{item.descricao_tipo_desconto}</TableCell>
                      <TableCell>
                        {item.valor_desconto}
                        {item.descricao_tipo_desconto === "PERCENTUAL"
                          ? "%"
                          : ""}
                      </TableCell>
                      <TableCell>{item.descricao_tipo_credito}</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <Switch
                            checked={item.estado === 1}
                            onCheckedChange={() => handleChangeEstado(item)}
                            disabled={isPendingActiveBolsa}
                          />
                          <Loader2
                            className={cn(
                              "h-4 w-4 animate-spin",
                              selectedBolsa?.codigo === item.codigo &&
                                isPendingActiveBolsa
                                ? "block"
                                : "hidden",
                            )}
                          />
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleEditBolsa(item)}
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

      <CreateBolsaDialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isPendingCreateBolsa || isPendingUpdateBolsa}
        mode={editingBolsa ? "edit" : "create"}
      />
    </div>
  );
}
