// src/pages/parameters/Parameters.tsx
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Users,
  CreditCard,
  CheckCircle,
  Clock,
  Save,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Pencil,
} from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

// Hooks
import { useQueryAcademicYearParams } from "@/hooks/academiccalendar/use-query-academic-years-params";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryAcademicYearVacancies } from "@/hooks/academiccalendar/use-query-academic-year-vacancies";
import { useQueryAcademicYearMonthlyFees } from "@/hooks/academiccalendar/use-query-academic-year-monthly-fees";
import { ParametersEditModal } from "./components/modals/ParametersEditModal";
import { formatarData } from "@/util/date-formate";
import { Switch } from "@/components/ui/switch";
import { useMutationUpdateAcademicYearState } from "@/hooks/academiccalendar/useMutation-update-academic-year-state";
import { number } from "framer-motion";
import { Vacancy } from "@/services/academiccalendar/fetch-vacancies-per-course";
import { EditVagaModal } from "./components/modals/EditVagaModal";
import { useMutationUpdateVagas } from "@/hooks/academiccalendar/useMutation-update-vagas";
import { useQueryGenerateMesTemp } from "@/hooks/academiccalendar/use-query-generate-mes-temp";

export default function Parameters() {
  const { toast } = useToast();

  

  // Filtros e paginação
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>("");
  const [tipoCandidaturaSelecionado, setTipoCandidaturaSelecionado] =
    useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPageMonthly, setCurrentPageMonthly] = useState(1);
  const [itemsPerPageMonthly, setItemsPerPageMonthly] = useState(6);
  const [openModal, setOpenModal] = useState(false);
  const [vagaSelecionada, setVagaSelecionada] = useState<{
    id: number;
    numeroVagas: number;
  } | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const {
    data: academicYears = [],
    isLoading: isLoadingYears,
    refetch: refetchYears,
  } = useQueryAnoAcademico();

 


  const { data: tiposCandidatura = [], isLoading: isLoadingTipos } =
    useQueryTipoCandidatura();
  const updateEstadoMutation = useMutationUpdateAcademicYearState();

  // Cálculo seguro do código do ano selecionado
  const selectedCodigo = useMemo(() => {
    if (!anoLetivoSelecionado || academicYears.length === 0) return undefined;
    const ano = academicYears.find(
      (a) => a.designacao === anoLetivoSelecionado
    );
    return ano?.codigo ?? undefined;
  }, [anoLetivoSelecionado, academicYears]);


   const {
  data: mesesTemp,
  isLoading: isLoadingMeses,
  isFetching: isFetchingMeses,
} = useQueryGenerateMesTemp(
   { anoLectivoId: selectedCodigo },
  { enabled: !!selectedCodigo }
);


const mensalidades = useMemo(() => {
  if (!mesesTemp) return [];

  return mesesTemp.map((item) => ({
    designacao: item.designacao,
    prestacao: item.prestacao,
    semestre: item.semestre,
    dataLimite: item.data_limite,
  }));
}, [mesesTemp]);



  // Parâmetros do ano selecionado
  const {
    academicYearParams: currentYearParams,
    isLoading: isLoadingParams,
    isFetching: isFetchingParams,
  } = useQueryAcademicYearParams(selectedCodigo, {
    enabled: !!selectedCodigo,
  });
  const {
    monthlyFees,
    isLoading: isLoadingMonthlyFees,
    isFetching: isFetchingMonthlyFees,
  } = useQueryAcademicYearMonthlyFees({
    codigoAno: selectedCodigo,
    enabled: !!selectedCodigo,
  });

  // Vagas
  const tipoCandidaturaId = Number(tipoCandidaturaSelecionado);
  const {
    vacancies = [],
    isLoading: isLoadingVacancies,
    isFetching: isFetchingVacancies,
  } = useQueryAcademicYearVacancies({
    codigoAno: selectedCodigo,
    tipoCandidatura: tipoCandidaturaId,
    enabled: !!selectedCodigo && !!tipoCandidaturaId,
  });
  const handleEditVaga = (vaga: Vacancy) => {
    setVagaSelecionada({
      id: vaga.codigo,
      numeroVagas: vaga.numeroVagas,
    });

    setOpenModal(true);
  };

  useEffect(() => {
    if (academicYears.length > 0 && !anoLetivoSelecionado) {
      const anoAtivo = academicYears.find(
        (a) =>
          a.estado?.toLowerCase().includes("activo") ||
          a.estado?.toLowerCase().includes("ativo")
      );
      if (anoAtivo) setAnoLetivoSelecionado(anoAtivo.designacao);
    }

    if (tiposCandidatura.length > 0 && !tipoCandidaturaSelecionado) {
      setTipoCandidaturaSelecionado(String(tiposCandidatura[0].codigo));
    }
  }, [
    academicYears,
    tiposCandidatura,
    anoLetivoSelecionado,
    tipoCandidaturaSelecionado,
  ]);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCodigo, tipoCandidaturaSelecionado]);

  // Paginação das vagas
  const filteredVacancies = vacancies;
  const totalPages = Math.ceil(filteredVacancies.length / itemsPerPage);
  const paginatedVacancies = filteredVacancies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  // Paginação das mensalidades

  const totalPagesMonthly = Math.ceil(mensalidades.length / itemsPerPageMonthly);
  const paginatedMensalidades = mensalidades.slice(
  (currentPageMonthly - 1) * itemsPerPageMonthly,
  currentPageMonthly * itemsPerPageMonthly
);


  // Resetar página ao mudar de ano
  useEffect(() => {
    setCurrentPageMonthly(1);
  }, [selectedCodigo]);
  // Helpers

  const calcularDias = (inicio: string, fim: string) => {
    const diff = new Date(fim).getTime() - new Date(inicio).getTime();
    return Math.round(diff / (1000 * 60 * 60 * 24));
  };
  const handleToggleEstado = (ativo: boolean) => {
    if (!selectedCodigo) {
      toast({
        title: "Erro",
        description: "Selecione o ano letivo",
        variant: "destructive",
      });
      return;
    }

    // Atualiza o backend
    updateEstadoMutation.mutate({
      codigoAno: selectedCodigo,
      estado: ativo ? 1 : 0,
    });
  };

  const getEstadoBadge = (estado: string) => {
    const lower = estado.toLowerCase();
    if (!lower.includes("desactiv") || lower.includes("active")) {
      return (
        <Badge className="bg-primary/10 text-primary">
          <Clock className="w-3 h-3 mr-1" />
          Ativo
        </Badge>
      );
    }
    if (lower.includes("pago") || lower.includes("paid")) {
      return (
        <Badge className="bg-green-500/10 text-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Pago
        </Badge>
      );
    }
    return <Badge variant="secondary">{estado}</Badge>;
  };

  const tipoCandidaturaNome =
    tiposCandidatura.find(
      (t) => t.codigo === Number(tipoCandidaturaSelecionado)
    )?.designacao || "Licenciatura";

  const isLoadingGlobal = isLoadingYears || isLoadingTipos;

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <PageHeader
        title="Parâmetros do Calendário Académico"
        subtitle="Home / Calendário Académico / Parâmetros"
        actions={
          <>
            <Button
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              disabled={!currentYearParams}
            >
              <Save className="h-4 w-4 mr-2" />
              Novo Parâmetro
            </Button>
          </>
        }
      />

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Selecione o ano letivo e o tipo de candidatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingGlobal ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ano Letivo */}
              <div className="space-y-2">
                <Label>Ano Letivo</Label>
                <Select
                  value={anoLetivoSelecionado}
                  onValueChange={setAnoLetivoSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano letivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((ano) => (
                      <SelectItem key={ano.codigo} value={ano.designacao}>
                        <div className="flex items-center justify-between w-full">
                          <span>{ano.designacao}</span>
                          {!ano.estado?.toLowerCase().includes("desactiv") && (
                            <span className="text-xs text-green-600 font-medium ml-2">
                              (Ativo)
                            </span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tipo de Candidatura */}
              <div className="space-y-2">
                <Label>Tipo de Candidatura</Label>
                <Select
                  value={tipoCandidaturaSelecionado}
                  onValueChange={setTipoCandidaturaSelecionado}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCandidatura.map((t) => (
                      <SelectItem key={t.codigo} value={String(t.codigo)}>
                        {t.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Título dinâmico */}
      {currentYearParams && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            {tipoCandidaturaNome} — {currentYearParams.designacao}
          </h2>
          <p className="text-muted-foreground text-lg mt-2">
            Parâmetros académicos e financeiros do ano letivo
          </p>
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="anoLetivo" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="anoLetivo">Calendário Académico</TabsTrigger>
          <TabsTrigger value="vagas">Vagas por Curso</TabsTrigger>
          <TabsTrigger value="mensalidade">Mensalidades</TabsTrigger>
        </TabsList>

        {/* ABA 1: Calendário Académico */}
        <TabsContent value="anoLetivo" className="mt-6 relative">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Períodos Letivos —{" "}
                {currentYearParams?.designacao || "Carregando..."}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {isLoadingParams || isFetchingParams ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : !currentYearParams ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">
                    Selecione um ano letivo para visualizar os parâmetros
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-52">Ano Letivo</TableHead>
                      <TableHead>Início 1º Semestre</TableHead>
                      <TableHead>Fim 1º Semestre</TableHead>
                      <TableHead>Início 2º Semestre</TableHead>
                      <TableHead>Fim 2º Semestre</TableHead>
                      <TableHead className="text-center">
                        Duração Total
                      </TableHead>
                      <TableHead className="text-center w-32">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-bold text-lg text-primary">
                        {currentYearParams.designacao}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatarData(
                          currentYearParams.dataInicioPrimeiroSemestre
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatarData(
                          currentYearParams.dataFimPrimeiroSemestre
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatarData(
                          currentYearParams.dataInicioSegundoSemestre
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatarData(currentYearParams.dataFimSegundoSemestre)}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {calcularDias(
                          currentYearParams.dataInicioPrimeiroSemestre,
                          currentYearParams.dataFimSegundoSemestre
                        )}{" "}
                        dias
                      </TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={
                            currentYearParams.estado.toLowerCase() === "activo"
                          }
                          disabled={updateEstadoMutation.isPending}
                          onCheckedChange={handleToggleEstado}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {isFetchingParams && !isLoadingParams && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
              <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}
        </TabsContent>

        {/* ABA 2: Vagas por Curso com Paginação */}

        <TabsContent value="vagas" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Vagas Disponíveis — {tipoCandidaturaNome} (
                {currentYearParams?.designacao})
              </CardTitle>
              <CardDescription>
                Total de vagas:{" "}
                {vacancies
                  .reduce((acc, v) => acc + v.numeroVagas, 0)
                  .toLocaleString()}{" "}
                • Cursos com vagas:{" "}
                {vacancies.filter((v) => v.numeroVagas > 0).length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Enquanto carrega ou está trocando de tipo/ano → mostra loading */}
              {isLoadingVacancies || isFetchingVacancies ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : vacancies.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">
                    Nenhuma vaga encontrada para este ano e tipo de candidatura.
                  </p>
                </div>
              ) : (
                <>
                  {/* Força mostrar a tabela mesmo com poucas vagas */}
                  <div className="space-y-6">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Curso</TableHead>
                            <TableHead>Período</TableHead>
                            <TableHead className="text-right">Vagas</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {paginatedVacancies.length > 0 ? (
                            paginatedVacancies.map((vaga, i) => (
                              <TableRow
                                key={`${vaga.codigoCurso}-${vaga.periodoDescricao}`}
                                className="hover:bg-muted/50"
                              >
                                {/* Curso */}
                                <TableCell className="font-medium">
                                  {vaga.cursoDescricao}
                                </TableCell>

                                {/* Período */}
                                <TableCell>
                                  <Badge
                                    variant={
                                      vaga.periodoDescricao === "Diurno"
                                        ? "default"
                                        : "secondary"
                                    }
                                    className="text-xs"
                                  >
                                    {vaga.periodoDescricao}
                                  </Badge>
                                </TableCell>

                                {/* Vagas */}
                                <TableCell className="text-right">
                                  {vaga.numeroVagas > 0 ? (
                                    <span className="font-bold text-primary">
                                      {vaga.numeroVagas.toLocaleString()}
                                    </span>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Esgotado
                                    </Badge>
                                  )}
                                </TableCell>

                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditVaga(vaga)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={4}
                                className="text-center py-8 text-muted-foreground"
                              >
                                Não há vagas com mais de 0 para exibir nesta
                                página.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Paginação */}
                    {filteredVacancies.length > 0 && (
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Itens por página:</span>
                          <Select
                            value={itemsPerPage.toString()}
                            onValueChange={(v) => setItemsPerPage(Number(v))}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {[10, 20, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Mostrando {(currentPage - 1) * itemsPerPage + 1}–
                          {Math.min(
                            currentPage * itemsPerPage,
                            filteredVacancies.length
                          )}{" "}
                          de {filteredVacancies.length} cursos
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                          >
                            <ChevronsLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Anterior
                          </Button>

                          <span className="px-3 text-sm font-medium">
                            {currentPage} / {totalPages || 1}
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setCurrentPage((p) =>
                                Math.min(totalPages || 1, p + 1)
                              )
                            }
                            disabled={currentPage === totalPages}
                          >
                            Próximo
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(totalPages || 1)}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronsRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA 3: Mensalidades */}
        {/* ABA 3: Calendário de Mensalidades com Paginação */}
        <TabsContent value="mensalidade" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Calendário de Mensalidades — {currentYearParams?.designacao}
              </CardTitle>
              <CardDescription>
                Total de prestações: {mensalidades.length} • Vencidas:{" "}
                {
                  mensalidades.filter((f) => new Date(f.dataLimite) < new Date())
                    .length
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              { isLoadingMeses || isFetchingMeses ? (
                <div className="space-y-3">
                  {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : mensalidades.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">
                    Nenhum calendário de mensalidades encontrado para este ano
                    letivo.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Tabela */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-32">Mês</TableHead>
                          <TableHead>Prestação</TableHead>
                          <TableHead>Semestre</TableHead>
                          <TableHead>Data Limite</TableHead>
                          <TableHead className="text-center w-32">
                            Estado
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedMensalidades.length > 0 ? (
                          paginatedMensalidades.map((fee, i) => {
                            const isOverdue =
                              new Date(fee.dataLimite) < new Date();
                            return (
                              <TableRow
                                key={i}
                                className={`hover:bg-muted/50 transition-colors ${
                                  isOverdue ? "opacity-70" : ""
                                }`}
                              >
                                <TableCell className="font-medium">
                                  {fee.designacao}
                                </TableCell>
                                <TableCell>
                                  {fee.prestacao}ª Prestação
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="text-xs">
                                    {fee.semestre}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                  {formatarData(fee.dataLimite.split("T")[0])}
                                </TableCell>
                                <TableCell className="text-center">
                                  {isOverdue ? (
                                    <Badge variant="destructive">Vencido</Badge>
                                  ) : (
                                    <Badge className="bg-primary/10 text-primary">
                                      Pendente
                                    </Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-10 text-muted-foreground"
                            >
                              Nenhuma prestação nesta página.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Itens por página:</span>
                      <Select
                        value={itemsPerPageMonthly.toString()}
                        onValueChange={(v) => setItemsPerPageMonthly(Number(v))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[6, 12, 24].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Mostrando{" "}
                      {(currentPageMonthly - 1) * itemsPerPageMonthly + 1}–
                      {Math.min(
                        currentPageMonthly * itemsPerPageMonthly,
                        mensalidades.length
                      )}{" "}
                      de {mensalidades.length} prestações
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPageMonthly(1)}
                        disabled={currentPageMonthly === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPageMonthly((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPageMonthly === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Anterior
                      </Button>

                      <span className="px-3 text-sm font-medium">
                        {currentPageMonthly} / {totalPagesMonthly || 1}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPageMonthly((p) =>
                            Math.min(totalPagesMonthly || 1, p + 1)
                          )
                        }
                        disabled={currentPageMonthly === totalPagesMonthly}
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPageMonthly(totalPagesMonthly || 1)
                        }
                        disabled={currentPageMonthly === totalPagesMonthly}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Modal Multi-Step */}
      <ParametersEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        anoLetivo={currentYearParams?.designacao || ""}
         codigoAnoLectivo={selectedCodigo}
      />
      {vagaSelecionada && (
        <EditVagaModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          idVaga={vagaSelecionada.id}
          numeroVagasAtual={vagaSelecionada.numeroVagas}
        />
      )}
    </div>
  );
}
