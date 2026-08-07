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
import {
  FileText,
  Home,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryFetchCreditoEducacionalTipo } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional-tipo";
import { Badge } from "@/components/ui/badge";
import { CreditoEducacionalTipo } from "@/services/financas/credito-educacional/fetch-credito-educacional-tipo.service";
import { useDeleteTipoCreditoEducacional } from "@/hooks/financas/credito-educacional/use-delete-tipo-credito";
import { Switch } from "@/components/ui/switch";
import { useRestoreTipoCreditoEducacional } from "@/hooks/financas/credito-educacional/use-restore-tipo-credito";
import { cn } from "@/lib/utils"; // Certifique-se de que o import do cn está presente
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { FormSelect } from "@/components/common/FormSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { FacultySelect } from "@/components/common/global-selects/FacultySelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryConciliacaoDividas } from "@/hooks/financas/dividas/use-query-conciliacao-divida";

const setDefaultValue = (value: string) =>
  value === "all" ? undefined : value;

export default function NegociacaoDividaConciliacao() {
  const searchOptions = [
    { id: "codigoMatricula", label: "Código da Matrícula" },
    { id: "nome", label: "Nome do Aluno" },
  ];
  const tipoNegociacao = [
    {
      key: "all",
      label: "Todos",
    },

    {
      key: "1",
      label: "50%",
    },
    {
      key: "2",
      label: "100%",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState<"codigoMatricula" | "nome">(
    "codigoMatricula",
  );
  const placeholders: Record<string, string> = {
    codigoMatricula: "Pesquisar por código da matrícula...",
    nome: "Nome do Aluno.",
  };
  const placeholderText = placeholders[searchBy] || "Pesquisar...";

  const {
    data: creditoEducacionalTipoResponse,
    isLoading: isLoadingCreditoEducationalTipo,
  } = useQueryFetchCreditoEducacionalTipo();
  const { mutate: restoreTipoCreditoEducacional, isPending: isRestoring } =
    useRestoreTipoCreditoEducacional();
  const creditoEducacional = creditoEducacionalTipoResponse?.data ?? [];

  const [filters, setFilters] = useState({
    anoLectivo: "23",
    curso: "",
    estado: "",
    faculdade: "",
    negociacao: "",
  });

  const handleRestoreTipoCreditoEducacional = (id: number) => {
    restoreTipoCreditoEducacional({ id });
  };
  const {} = useQueryConciliacaoDividas();
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
            <BreadcrumbLink>Área Financeira</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Conciliação de Divida</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Aprovação Conciliação de Divida</h1>
        <p className="text-muted-foreground text-sm">
          Revise e aprove as conciliações de dívida realizadas, verificando os
          valores originais, os valores conciliados e as respectivas diferenças
          antes da aprovação.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <AcademicYearSelect
              value={filters.anoLectivo}
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
            />
            <FacultySelect
              allOption
              value={filters.faculdade}
              onChangeValue={(v) => setFilters({ ...filters, faculdade: v })}
            />
            <CourseSelect
              params={{
                faculdadeId: parseFilter(filters.faculdade),
              }}
              onChangeValue={(v) => setFilters({ ...filters, curso: v })}
              value={filters.curso}
            />
            <FormSelect
              label="% Negociação"
              value={filters.negociacao}
              onChange={(v) => setFilters({ ...filters, negociacao: v })}
              options={tipoNegociacao}
              map={(a) => ({
                key: a.key,
                label: a.label,
                value: a.key,
              })}
            />
            {/* Tipo de Pesquisa */}
            <div className="min-w-[220px]">
              <FormSelect
                label="Pesquisar por"
                value={searchBy}
                onChange={(v) => {
                  setSearchBy(v as "codigoMatricula" | "nome");
                  setSearchTerm("");
                }}
                options={searchOptions}
                map={(o) => ({
                  key: o.id,
                  label: o.label,
                  value: o.id,
                })}
              />
            </div>

            {/* Input Pesquisa */}
            <div className="flex items-end">
              <div className="flex-1  min-w-[260px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder={placeholderText}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={() => {}}>
                <Search className="h-4 w-4" />
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
                {creditoEducacional.map((item) => {
                  const isDeleted = !!item.deleteat;
                  return (
                    <TableRow
                      key={item.codigo}
                      className={cn(
                        "transition-all duration-200",
                        isDeleted &&
                          "bg-destructive/5 opacity-75 hover:bg-destructive/10",
                      )}
                    >
                      <TableCell
                        className={cn(
                          "font-medium",
                          isDeleted &&
                            "line-through text-muted-foreground italic",
                        )}
                      >
                        {item.designacao}
                      </TableCell>
                      <TableCell
                        className={cn(
                          isDeleted &&
                            "line-through text-muted-foreground italic",
                        )}
                      >
                        {item.sigla}
                      </TableCell>
                      <TableCell>
                        {isDeleted ? (
                          <Badge
                            variant="destructive"
                            className="uppercase text-[10px]"
                          >
                            Eliminado
                          </Badge>
                        ) : (
                          <Badge
                            variant={
                              item.status === 1 ? "secondary" : "outline"
                            }
                          >
                            {item.status === 1 ? "Ativo" : "Inativo"}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <>
                          <Button
                            className="h-8 w-8"
                            variant="outline"
                            size="icon"
                            title="Editar"
                            onClick={() => {}}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
