import { useState } from "react";
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
import { FileText, Home, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useQueryFetchCreditoEducacional } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional";
import { CreditoEducacionalTipoSelect } from "@/components/common/global-selects/CreditoEducacionalTipoSelect";
import { CreditoEducacionalTipoDescontoSelect } from "@/components/common/global-selects/CreditoEducacionalTipoDescontoSelect";
import { FetchCreditoEducacionalParams } from "@/services/financas/credito-educacional/fetch-credito-educacional.service";
import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { useCreateCreditoEducacional } from "@/hooks/financas/credito-educacional/use-create-credito-educacional";
import { CreateCreditoEducacionalDialog } from "./CreateCreditoEducacionalDialog";
import { Skeleton } from "@/components/ui/skeleton";
const setDefaultValue = (value: string) =>
  value === "all" ? undefined : value;

export default function ListarCreditoEducacional() {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useCreateCreditoEducacional();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FetchCreditoEducacionalParams>({
    codigoTipoCredito: "all",
    codigoTipoDesconto: "all",
    designacao: "all",
  });
  const [search, setSearch] = useState<string | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 500);
  const {
    data: creditoEducacionalResponse,
    isLoading: isLoadingCreditoEducational,
  } = useQueryFetchCreditoEducacional({
    codigoTipoCredito: setDefaultValue(filters.codigoTipoCredito),
    codigoTipoDesconto: setDefaultValue(filters.codigoTipoDesconto),
    designacao: setDefaultValue(debouncedSearch),
  });

  const creditoEducacional = creditoEducacionalResponse?.items ?? [];
  const [formData, setFormData] = useState({
    designacao: "",
    codigoTipoDesconto: "",
    valorDesconto: "",
    codigoTipoCredito: "",
  });

  const handleSubmit = async () => {
    await mutateAsync({
      designacao: formData.designacao,
      codigoTipoCredito: Number(formData.codigoTipoCredito),
      codigoTipoDesconto: Number(formData.codigoTipoDesconto),
      valorDesconto: Number(formData.valorDesconto),
    });

    toast({
      title: "Crédito criado com sucesso",
    });

    setIsModalOpen(false);
    setFormData({
      designacao: "",
      codigoTipoCredito: "",
      codigoTipoDesconto: "",
      valorDesconto: "",
    });
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
            <BreadcrumbPage>Listar Crédito Educacional</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Listar Crédito Educacional</h1>
      <p className="text-muted-foreground">
        Lista completa de créditos educacionais atribuídos.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="designacao">Designação</Label>
              <Input
                id="designacao"
                placeholder="Pesquisar designação"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>

            <CreditoEducacionalTipoSelect
              enabledDefaultSelectItem
              value={filters.codigoTipoCredito}
              onChangeValue={(v) => {
                setFilters((f) => ({ ...filters, codigoTipoCredito: v }));
              }}
            />
            <CreditoEducacionalTipoDescontoSelect
              enabledDefaultSelectItem
              value={filters.codigoTipoDesconto}
              onChangeValue={(v) => {
                setFilters((f) => ({ ...filters, codigoTipoDesconto: v }));
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Novo Crédito
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        {isLoadingCreditoEducational ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : creditoEducacional.length === 0 ? (
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
          <div className="overflow-x-auto">
            {" "}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designação</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditoEducacional.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell>{item.designacao}</TableCell>
                    <TableCell>{item.valor_desconto}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <CreateCreditoEducacionalDialog
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </div>
  );
}
