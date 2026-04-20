import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Plus, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/common/PageHeader";
import { PaginationComponent } from "@/components/common/PaginationComponent";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryColisoesIsentasCursos, useQueryColisoesIsentasMatriculas } from "@/hooks/registrations/use-query-isentar-colisoes";
import { IsentarColisaoForm } from "./components/isentar-colisao-form-dialog";


function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("pt-AO");
}

function parseRefUtilizador(ref?: string) {
  if (!ref) return "-";

  try {
    const parsed = JSON.parse(ref);
    return parsed?.descricao || parsed?.nome || parsed?.label || ref;
  } catch {
    return ref;
  }
}

export default function ListagemColisoesIsentas() {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState("matriculas");
  const [openIsencaoDialog, setOpenIsencaoDialog] = useState(false);

  const [pageMatriculas, setPageMatriculas] = useState(1);
  const [limitMatriculas, setLimitMatriculas] = useState(10);
  const [anoLectivoMatriculas, setAnoLectivoMatriculas] = useState("0");
  const [searchMatriculas, setSearchMatriculas] = useState("");

  const [pageCursos, setPageCursos] = useState(1);
  const [limitCursos, setLimitCursos] = useState(10);
  const [anoLectivoCursos, setAnoLectivoCursos] = useState("0");
  const [cursoFiltro, setCursoFiltro] = useState("0");
  const [turnoFiltro, setTurnoFiltro] = useState("0");

  const { data: anosLectivos = [] } = useQueryAnoAcademico();
  const { data: periodos = [] } = useQueryPeriod();

  const { data: matriculasResponse, isLoading: loadingMatriculas } =
    useQueryColisoesIsentasMatriculas({
      page: pageMatriculas,
      limit: limitMatriculas,
      anoLectivo: Number(anoLectivoMatriculas || 0),
      search: searchMatriculas,
    });

  const { data: cursosResponse, isLoading: loadingCursos } =
    useQueryColisoesIsentasCursos({
      page: pageCursos,
      limit: limitCursos,
      anoLectivo: Number(anoLectivoCursos || 0),
      curso: Number(cursoFiltro || 0),
      turno: Number(turnoFiltro || 0),
    });

  const matriculas = matriculasResponse?.data ?? [];
  const cursos = cursosResponse?.data ?? [];

  const hasNextMatriculas =
    pageMatriculas < (matriculasResponse?.totalPages ?? 1);
  const hasNextCursos = pageCursos < (cursosResponse?.totalPages ?? 1);

  const totalMatriculas = useMemo(
    () => matriculasResponse?.total ?? 0,
    [matriculasResponse]
  );
  const totalCursos = useMemo(() => cursosResponse?.total ?? 0, [cursosResponse]);

  function handleIsencaoSuccess() {
    setOpenIsencaoDialog(false);

    queryClient.invalidateQueries({
      queryKey: ["colisoes-isentas-matriculas"],
    });

    queryClient.invalidateQueries({
      queryKey: ["colisoes-isentas-cursos"],
    });
  }

  return (
    <div className="p-6 space-y-8">
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
          <BreadcrumbItem>Gestão Académica</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Listagem de Isenções de Colisão</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Listagem de Isenções de Colisão"
        subtitle="Consulta das isenções aplicadas por estudante e por curso"
        actions={
          <Dialog open={openIsencaoDialog} onOpenChange={setOpenIsencaoDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Aplicar Isenção
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full sm:max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Aplicar Isenção de Colisão</DialogTitle>
              </DialogHeader>

              <IsentarColisaoForm onSuccess={handleIsencaoSuccess} />
            </DialogContent>
          </Dialog>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="matriculas">Por Estudante</TabsTrigger>
          <TabsTrigger value="cursos">Por Curso</TabsTrigger>
        </TabsList>

        <TabsContent value="matriculas" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano Lectivo</label>
                  <Select
                    value={anoLectivoMatriculas}
                    onValueChange={(value) => {
                      setAnoLectivoMatriculas(value);
                      setPageMatriculas(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos</SelectItem>
                      {anosLectivos.map((ano: any) => (
                        <SelectItem
                          key={ano.codigo ?? ano.CODIGO}
                          value={String(ano.codigo ?? ano.CODIGO)}
                        >
                          {ano.designacao ?? ano.DESIGNACAO}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">
                    Pesquisar por matrícula ou nome
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchMatriculas}
                      onChange={(e) => {
                        setSearchMatriculas(e.target.value);
                        setPageMatriculas(1);
                      }}
                      placeholder="Digite matrícula ou nome"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Isenções por Estudante</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="font-semibold text-primary">
                Total de Registos: {totalMatriculas}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Matrícula</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingMatriculas ? (
                      <TableRow>
                        <TableCell colSpan={6}>Carregando...</TableCell>
                      </TableRow>
                    ) : matriculas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          Nenhuma isenção encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      matriculas.map((item) => (
                        <TableRow key={item.codigo}>
                          <TableCell>{item.numero}</TableCell>
                          <TableCell>{item.matricula}</TableCell>
                          <TableCell>{item.nome}</TableCell>
                          <TableCell>{item.ano_lectivo}</TableCell>
                          <TableCell>{formatDate(item.data)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <PaginationComponent
                hasNext={hasNextMatriculas}
                limit={limitMatriculas}
                page={pageMatriculas}
                setLimit={setLimitMatriculas}
                setPage={setPageMatriculas}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cursos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano Lectivo</label>
                  <Select
                    value={anoLectivoCursos}
                    onValueChange={(value) => {
                      setAnoLectivoCursos(value);
                      setPageCursos(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos</SelectItem>
                      {anosLectivos.map((ano: any) => (
                        <SelectItem
                          key={ano.codigo ?? ano.CODIGO}
                          value={String(ano.codigo ?? ano.CODIGO)}
                        >
                          {ano.designacao ?? ano.DESIGNACAO}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <CourseSelect
                    value={cursoFiltro === "0" ? "" : cursoFiltro}
                    onChangeValue={(value) => {
                      setCursoFiltro(String(value || 0));
                      setPageCursos(1);
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Turno</label>
                  <Select
                    value={turnoFiltro}
                    onValueChange={(value) => {
                      setTurnoFiltro(value);
                      setPageCursos(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos</SelectItem>
                      {periodos.map((item: any) => (
                        <SelectItem
                          key={item.codigo ?? item.CODIGO}
                          value={String(item.codigo ?? item.CODIGO)}
                        >
                          {item.designacao ?? item.DESIGNACAO}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Isenções por Curso</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="font-semibold text-primary">
                Total de Registos: {totalCursos}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Curso</TableHead>
                      <TableHead>Turno</TableHead>
                      <TableHead>Ano Lectivo</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingCursos ? (
                      <TableRow>
                        <TableCell colSpan={6}>Carregando...</TableCell>
                      </TableRow>
                    ) : cursos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6}>
                          Nenhuma isenção encontrada.
                        </TableCell>
                      </TableRow>
                    ) : (
                      cursos.map((item) => (
                        <TableRow key={item.codigo}>
                          <TableCell>{item.numero}</TableCell>
                          <TableCell>{item.curso}</TableCell>
                          <TableCell>{item.turno}</TableCell>
                          <TableCell>{item.ano_lectivo}</TableCell>
                          <TableCell>{formatDate(item.data)}</TableCell>
                          
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <PaginationComponent
                hasNext={hasNextCursos}
                limit={limitCursos}
                page={pageCursos}
                setLimit={setLimitCursos}
                setPage={setPageCursos}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}