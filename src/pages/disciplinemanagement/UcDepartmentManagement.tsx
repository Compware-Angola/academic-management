import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterBar } from "@/components/common/FilterBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Plus, Link2, Shield, Search, Eye } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryDepartamento } from "@/hooks/depatamento/use-query-depardamento";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryDepartamentoUC } from "@/hooks/depatamento/use-query-departamento-uc";
import { DepartmentDiscipline } from "@/services/departamento/fetch-departamento-uc";
import { CreateUcModal } from "./components/CreateUcModal";
import { VincularCursoModal } from "./components/VincularCursoModal";
import { VerVinculosModal } from "./components/VerVinculosModal";
import { Card, CardContent } from "@/components/ui/card";

export default function UcDepartmentManagement() {
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [ucParaVincular, setUcParaVincular] = useState<{
    codigo_grade: number;
    unidade_curricular: string;
  } | null>(null);
  const [ucParaVerVinculos, setUcParaVerVinculos] = useState<{
    codigo_grade: number;
    unidade_curricular: string;
  } | null>(null);

  const { data: departamentos = [], isLoading: isLoadingDepartamento } =
    useQueryDepartamento();

  const { data: departamentoUCResponse, isLoading: isLoadingDepartamentoUC } =
    useQueryDepartamentoUC({
      departamento: Number(departamento),
      search: search || undefined,
      limit,
      page,
    });

  const disciplinas: DepartmentDiscipline[] =
    departamentoUCResponse?.data ?? [];
  const total = departamentoUCResponse?.total;
  const totalPages = departamentoUCResponse?.totalPages;

  const getStatusInfo = (status: number) =>
    status === 1
      ? { label: "Ativa", variant: "default" as const }
      : { label: "Inativa", variant: "destructive" as const };

  return (
    <div className="flex flex-col gap-6 p-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/plano">Plano de Estudo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gestão de UC por Departamento</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Gestão de UC por Departamento"
        subtitle="Gerir unidades curriculares organizadas por departamento académico"
        actions={
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => setOpenModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova UC
          </Button>
        }
      />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            {/* Filtro por Departamento */}
            <div className="w-full sm:max-w-xs">
              <FormCommandSelect
                value={departamento}
                label={undefined}
                placeholder="Selecione Departamento"
                options={departamentos}
                map={(c) => ({
                  key: c.codigo.toString(),
                  value: c.codigo.toString(),
                  label: c.designacao,
                })}
                onChange={(v) => {
                  setDepartamento(v);
                  setPage(1);
                }}
              />
            </div>

            {/* Campo de Pesquisa */}
            <div className="relative flex items-center w-full sm:max-w-xs">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
              <Input
                placeholder="Pesquisar disciplina..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-md border">
        {!departamento ? (
          <div className="text-center py-12 bg-card border rounded-lg">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">
              Selecione um departamento para ver as disciplinas
            </p>
          </div>
        ) : isLoadingDepartamentoUC ? (
          <div className="space-y-3 p-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : disciplinas.length === 0 ? (
          <div className="text-center py-12 bg-card border rounded-lg">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma disciplina encontrada</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código Grade</TableHead>
                <TableHead>Código Disciplina</TableHead>
                <TableHead>Unidade Curricular</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {disciplinas.map((uc) => {
                const status = getStatusInfo(uc.status);
                return (
                  <TableRow key={uc.codigo_grade}>
                    <TableCell className="font-medium">
                      {uc.codigo_grade}
                    </TableCell>
                    <TableCell>{uc.codigo_disciplina}</TableCell>
                    <TableCell>{uc.unidade_curricular}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setUcParaVerVinculos({
                              codigo_grade: uc.codigo_grade,
                              unidade_curricular: uc.unidade_curricular,
                            })
                          }
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Vínculos
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setUcParaVincular({
                              codigo_grade: uc.codigo_grade,
                              unidade_curricular: uc.unidade_curricular,
                            })
                          }
                        >
                          <Link2 className="h-4 w-4 mr-2" />
                          Vincular
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {departamento && !isLoadingDepartamentoUC && disciplinas.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            A mostrar {disciplinas.length} de {total} registos
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <span>
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>

            <Select
              value={String(limit)}
              onValueChange={(v) => {
                setLimit(Number(v));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <CreateUcModal open={openModal} onClose={() => setOpenModal(false)} />
      <VincularCursoModal
        open={!!ucParaVincular}
        onClose={() => setUcParaVincular(null)}
        uc={ucParaVincular}
      />
      <VerVinculosModal
        open={!!ucParaVerVinculos}
        onClose={() => setUcParaVerVinculos(null)}
        uc={ucParaVerVinculos}
      />
    </div>
  );
}