import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Home, Search, Eye, Printer, Download, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useQueryFacturas } from "@/hooks/horario/use-query-invoice";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";


const estados = [
  { id: undefined, label: "Todos" },
  { id: "0", label: "Pendente" },
  { id: "1", label: "Pago" },
  { id: "2", label: "Parcelado" },
  { id: "3", label: "Anulado" },
];

export default function ListarNotasPagamento() {

  const [searchTerm, setSearchTerm] = useState<string>(null);

  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState({
    anoLetivo: "23",
    estado:undefined

  });
  const limit = 10;
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  // React Query hook
  const { data, isLoading, refetch } = useQueryFacturas({
    search: searchTerm,
    anoLectivo:filters.anoLetivo,
    status: filters.estado !== undefined ? Number(filters.estado) : undefined,
    page,
    limit,
  });

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pendente</Badge>;
      case 1:
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Pago</Badge>;
      case 2:
        return <Badge  className="bg-gray-100 text-gray-800 hover:bg-gray-100">Parcelado</Badge>;
      case 3:
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Anulado</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-AO", {
      style: "currency",
      currency: "AOA",
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-AO");
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/"><Home className="h-4 w-4" /></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Finanças</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Notas de Pagamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Notas de Pagamento</h1>
        <p className="text-muted-foreground">Listagem de todas as notas de pagamento emitidas.</p>
      </div>

      {/* Filtros */}
     <Card>
  <CardContent className="pt-6">
    <div className="flex flex-wrap items-center gap-4">
      {/* Ano Letivo */}
      <div className="flex-1 min-w-[200px] md:w-64">
        <FormSelect
          disabled={isLoadingAcademicYear}
          loading={isLoadingAcademicYear}
          label="Ano Letivo"
          value={filters.anoLetivo}
          onChange={(v) => setFilters({ ...filters, anoLetivo: v })}
          options={anosAcademicos}
          map={(a) => ({
            key: a.codigo,
            label: a.designacao,
            value: a.codigo,
          })}
        />
      </div>

      {/* Estado */}
      <div className="flex-1 min-w-[200px] md:w-64">
        <FormSelect
        disabled={isLoadingAcademicYear}
          label="Estado"
          value={filters.estado}
          onChange={(v) => setFilters({ ...filters, estado: v })}
          options={estados}
          map={(a) => ({
            key: a.id,
            label: a.label,
            value: a.id,
          })}
        />
      </div>

      {/* Search */}
      <div className="flex-1 min-w-[250px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por matrícula ou estudante..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Atualizar */}
      <div className="flex-none">
        <Button
          variant="outline"
          className="gap-2 whitespace-nowrap"
          onClick={() => refetch()}
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>
    </div>
  </CardContent>
</Card>


   

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Notas de Pagamento ({data?.total || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ref</TableHead>
                <TableHead>Estudante</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : data?.data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma nota de pagamento encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.map((nota) => (
                  <TableRow key={nota.codigo}>
                    <TableCell className="font-mono font-medium">{nota.referencia}</TableCell>
                    <TableCell>{nota.nome_aluno}</TableCell>
                    <TableCell className="font-mono">{nota.codigo_matricula}</TableCell>
                    <TableCell>{nota.curso}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(nota.total_preco)}</TableCell>
                    <TableCell>{formatDate(nota.data_factura)}</TableCell>
                    <TableCell>{formatDate(nota.data_factura)}</TableCell>
                    <TableCell>{getStatusBadge(nota.estado)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                       
                        <Button size="sm" variant="outline" title="Imprimir">
                          <Printer className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Paginação */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={handlePrevPage} disabled={page === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="flex items-center px-2">
                Página {page} de {data.totalPages}
              </span>
              <Button size="sm" variant="outline" onClick={handleNextPage} disabled={page === data.totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
