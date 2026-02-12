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
import { ChevronLeft, ChevronRight, FileText, Home, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import { useDebounce } from "@/hooks/use-debounce";
import { useToast } from "@/hooks/use-toast";
import { useCreateCreditoEducacional } from "@/hooks/financas/credito-educacional/use-create-tipo-credito-educacional";

import { Skeleton } from "@/components/ui/skeleton";
import { FetchBolsaParams } from "@/services/financas/bolsa/fetch-bolsa.service";
import { useQueryFetchBolsa } from "@/hooks/financas/bolsa/use-query-fetch-bolsa";
import { CreateCreditoEducacionalDialog } from "../tipo-credito/tipo-credito-dialog";
import { CreateBolsaDialog, CreateBolsaFormData } from "./CreateBolsaDialog";
import { useMutationCreateBolsa } from "@/hooks/financas/bolsa/use-mutation-create-bolsa";
const setDefaultValue = (value: string) =>
  value === "all" ? undefined : value;

export default function ListarBolsa() {
  const { toast } = useToast();
  const { mutateAsync, isPending } = useMutationCreateBolsa();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FetchBolsaParams>({
    designacao: undefined,
    instituicao: undefined,
  });
  const [designacaoInput, setDesignacaoInput] = useState("");
  const [instituicaoInput, setInstituicaoInput] = useState("");
  const debouncedDesignacao = useDebounce(designacaoInput, 500);
  const debouncedInstituicao = useDebounce(instituicaoInput, 500);

  const [pageUrl, setPageUrl] = useState<string | undefined>(undefined);
  const { data, isLoading: isLoadingBolsa } = useQueryFetchBolsa(
    filters,
    pageUrl,
  );
  const bolsas = data?.items ?? [];
  const [formData, setFormData] = useState<CreateBolsaFormData>({
    designacao: "",
    codigoTipoDesconto: "",
    valorDesconto: "",
    codigoTipoCredito: "",
    codigoInstituicao: "",
  });
  useEffect(() => {
    setFilters({
      designacao: debouncedDesignacao || undefined,
      instituicao: debouncedInstituicao || undefined,
    });

    setPageUrl(undefined);
  }, [debouncedDesignacao, debouncedInstituicao]);

  const nextPage = () => {
    if (data?.next?.$ref) {
      setPageUrl(data?.next.$ref);
    }
  };

  const prevPage = () => {
    if (data?.prev?.$ref) {
      setPageUrl(data?.prev.$ref);
    }
  };

  const handleSubmit = async () => {
    await mutateAsync({
      designacao: formData.designacao,
      codigoInstituicao: Number(formData.codigoInstituicao),
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
      codigoInstituicao: "",
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
            <BreadcrumbLink>Gestão de Bolsa</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Listar Bolsa</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Listar Bolsa</h1>
      <p className="text-muted-foreground">Lista completa de Bolsa.</p>

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
                value={designacaoInput}
                onChange={(e) => setDesignacaoInput(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <Label htmlFor="instituicao">Instituição</Label>
              <Input
                id="instituicao"
                placeholder="Pesquisar instituição"
                value={instituicaoInput}
                onChange={(e) => setInstituicaoInput(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova Bolsa
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>
        {isLoadingBolsa ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designação</TableHead>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Tipo Desconto</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Tipo Crédito</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bolsas.map((item) => (
                  <TableRow key={item.codigo}>
                    <TableCell>{item.designacao}</TableCell>
                    <TableCell>{item.instituicao}</TableCell>
                    <TableCell>{item.descricao_tipo_desconto}</TableCell>
                    <TableCell>
                      {item.valor_desconto}
                      {item.descricao_tipo_desconto === "PERCENTUAL" ? "%" : ""}
                    </TableCell>
                    <TableCell>{item.descricao_tipo_credito}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {bolsas.length > 0 && (
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-muted-foreground"></div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data?.prev?.$ref}
                    onClick={prevPage}
                  >
                    <ChevronLeft className="h-4 w-4" /> Anterior
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!data?.next?.$ref}
                    onClick={nextPage}
                  >
                    Próxima <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateBolsaDialog
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
