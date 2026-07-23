import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  RefreshCw,
  Filter,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { FormSelect } from "@/components/common/FormSelect";

// Hooks
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useCursos } from "@/hooks/use-cursos";
import {
  useLancamentosPauta,
  useLancamentosUcSemPauta,
} from "@/hooks/avaliacao/use-query-lancamento-pauta";
import { useMutationAtualizarEstadoPauta } from "@/hooks/avaliacao/use-mutation-update-estado-lancamento-pauta";
import { useQueryEstadoPauta } from "@/hooks/avaliacao/use-query-estado-pauta";

import { viewFile } from "@/services/upload/upload-single.service";
import { ApiError } from "@/error";
import { useAuth } from "@/hooks/use-auth";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";

export default function ValidationTeacherAgenda() {
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("submetidas");

  // Filtros para pautas submetidas
  const [filtersSubmetidas, setFiltersSubmetidas] = useState({
    tipoCandidatura: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    tipoAvaliacao: "",
    estadoPauta: "",
  });

  // Filtros para unidades sem pauta (apenas os campos que pediste)
  const [filtersPendentes, setFiltersPendentes] = useState({
    tipoCandidatura: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    tipoAvaliacao: "",
  });

  const [currentPageSubmetidas, setCurrentPageSubmetidas] = useState(1);
  const [currentPagePendentes, setCurrentPagePendentes] = useState(1);
  const limit = 10;

  // ─── Queries ───────────────────────────────────────────────────────────────
  const { data: cursos } = useCursos();
  const { data: classes = [] } = useQueryClassFilterByCurso({
    curso: filtersSubmetidas.curso,
  });
  const { data: tipoAvaliacao = [] } = useQueryTipoAvaliacao();
  const { data: semestres } = useQuerySemestres();
  const { data: academicYear } = useQueryAnoAcademico();
  const { data: unidadesCurriculares = [] } = useQueryDisciplinaWithFilter({
    classe: filtersSubmetidas.anoCurricular,
    curso: filtersSubmetidas.curso,
    semestre: filtersSubmetidas.semestre,
  });
  const { data: estadosPauta = [] } = useQueryEstadoPauta();

  // Pautas submetidas
  const {
    data: responseSubmetidas,
    isLoading: isLoadingSubmetidas,
    error: errorSubmetidas,
  } = useLancamentosPauta({
    anoLectivo: filtersSubmetidas.anoLectivo
      ? Number(filtersSubmetidas.anoLectivo)
      : undefined,
    tipoAvaliacao: filtersSubmetidas.tipoAvaliacao
      ? Number(filtersSubmetidas.tipoAvaliacao)
      : undefined,
    codigoGrade: filtersSubmetidas.unidadeCurricular
      ? Number(filtersSubmetidas.unidadeCurricular)
      : undefined,
    curso: filtersSubmetidas.curso
      ? Number(filtersSubmetidas.curso)
      : undefined,
    anoCurricular: filtersSubmetidas.anoCurricular
      ? Number(filtersSubmetidas.anoCurricular)
      : undefined,
    semestre: filtersSubmetidas.semestre
      ? Number(filtersSubmetidas.semestre)
      : undefined,
    estadoPauta: filtersSubmetidas.estadoPauta
      ? Number(filtersSubmetidas.estadoPauta)
      : undefined,
    page: currentPageSubmetidas,
    limit,
  });

  const pautas = responseSubmetidas?.data ?? [];
  const paginationSubmetidas = {
    page: responseSubmetidas?.page ?? 1,
    total: responseSubmetidas?.total ?? 0,
    totalPages: responseSubmetidas?.totalPages ?? 1,
  };

  // Unidades sem pauta
  const { data: responsePendentes, isLoading: isLoadingPendentes } =
    useLancamentosUcSemPauta({
      anoLectivo: filtersPendentes.anoLectivo
        ? Number(filtersPendentes.anoLectivo)
        : undefined,
      semestre: filtersPendentes.semestre
        ? Number(filtersPendentes.semestre)
        : undefined,
      curso: filtersPendentes.curso
        ? Number(filtersPendentes.curso)
        : undefined,
      anoCurricular: filtersPendentes.anoCurricular
        ? Number(filtersPendentes.anoCurricular)
        : undefined,
      tipoAvaliacao: filtersPendentes.tipoAvaliacao
        ? Number(filtersPendentes.tipoAvaliacao)
        : undefined,
      page: currentPagePendentes,
      limit,
    });

  const pendentes = responsePendentes?.data ?? [];
  const paginationPendentes = {
    page: responsePendentes?.page ?? 1,
    total: responsePendentes?.total ?? 0,
    totalPages: responsePendentes?.totalPages ?? 1,
  };

  // ─── Modal de confirmação ─────────────────────────────────────────────────
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [acao, setAcao] = useState<"aprovar" | "rejeitar" | null>(null);
  const [pautaSelecionada, setPautaSelecionada] = useState<any>(null);

  const abrirConfirmacao = (pauta: any, tipo: "aprovar" | "rejeitar") => {
    setPautaSelecionada(pauta);
    setAcao(tipo);
    setConfirmOpen(true);
  };

  const mutationEstado = useMutationAtualizarEstadoPauta();

  const confirmarAcao = () => {
    if (!pautaSelecionada || !acao) return;

    const novoEstado = acao === "aprovar" ? 2 : 3;

    mutationEstado.mutate(
      { codigo: pautaSelecionada.codigo, fkEstadoLancamentoPauta: novoEstado },
      {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: `Pauta ${acao === "aprovar" ? "aprovada" : "rejeitada"} com sucesso.`,
          });
        },
        onError: (err) => {
          toast({
            variant: "destructive",
            title: "Erro",
            description:
              err instanceof ApiError
                ? err.message
                : "Não foi possível atualizar o estado.",
          });
        },
        onSettled: () => setConfirmOpen(false),
      },
    );
  };

  const handleDownload = async (filename: string) => {
    try {
      const blob = await viewFile(filename);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao abrir ficheiro",
        description: err instanceof ApiError ? err.message : "Tente novamente.",
      });
    }
  };

  const getEstadoBadge = (estado: number) => {
    const styles = {
      1: "bg-yellow-100 text-yellow-800 border-yellow-300",
      2: "bg-green-100 text-green-800 border-green-300",
      3: "bg-red-100 text-red-800 border-red-300",
    };
    const labels = { 1: "Pendente", 2: "Aprovado", 3: "Rejeitado" };

    return (
      <Badge
        variant="outline"
        className={styles[estado as keyof typeof styles] || ""}
      >
        {labels[estado as keyof typeof labels] || "Desconhecido"}
      </Badge>
    );
  };

  // Limpar filtros da tab ativa
  const limparFiltros = () => {
    if (activeTab === "submetidas") {
      setFiltersSubmetidas({
        tipoCandidatura: "",
        anoLectivo: "",
        semestre: "",
        curso: "",
        anoCurricular: "",
        unidadeCurricular: "",
        tipoAvaliacao: "",
        estadoPauta: "",
      });
      setCurrentPageSubmetidas(1);
    } else {
      setFiltersPendentes({
        tipoCandidatura: "",
        anoLectivo: "",
        semestre: "",
        curso: "",
        anoCurricular: "",
        tipoAvaliacao: "",
      });
      setCurrentPagePendentes(1);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] space-y-6 p-4 md:p-6 lg:p-8 bg-background">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 pb-6 border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Validação de Pautas
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe, valide e aprove as pautas submetidas pelos docentes
            </p>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
        </div>

        <nav className="flex text-sm text-muted-foreground mt-2">
          <Link to="/" className="hover:text-foreground">
            Início
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground font-medium">
            Validação de Pautas
          </span>
        </nav>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:w-auto lg:inline-flex bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="submetidas" className="px-6 py-3">
            <FileText className="mr-2 h-4 w-4" />
            Pautas Submetidas
          </TabsTrigger>
          <TabsTrigger value="pendentes" className="px-6 py-3">
            <AlertCircle className="mr-2 h-4 w-4" />
            Unidades sem Pauta
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: PAUTAS SUBMETIDAS ─────────────────────────────────────── */}
        <TabsContent value="submetidas" className="space-y-6 mt-2">
          {/* Filtros */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros Avançados
                  </CardTitle>
                  <CardDescription>
                    Refine os resultados da lista
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={limparFiltros}>
                  Limpar tudo
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                <TipoCandidaturaSelect
                  value={filtersSubmetidas.tipoCandidatura}
                  onChangeValue={(v) =>
                    setFiltersSubmetidas((prev) => ({
                      ...prev,
                      tipoCandidatura: v,
                      anoLectivo: "",
                      curso: "",
                      anoCurricular: "",
                      unidadeCurricular: "",
                    }))
                  }
                />

                <AcademicYearsAvailableForOperationSelect
                  label="Ano Lectivo"
                  value={filtersSubmetidas.anoLectivo}
                  onChangeValue={(v) =>
                    setFiltersSubmetidas((prev) => ({ ...prev, anoLectivo: v }))
                  }
                  tipoCandidaturaId={parseFilter(filtersSubmetidas.tipoCandidatura) ?? 1}
                  onlyConfigurable={false}
                  disabled={!filtersSubmetidas.tipoCandidatura}
                />

                <FormSelect
                  label="Semestre"
                  value={filtersSubmetidas.semestre}
                  onChange={(v) =>
                    setFiltersSubmetidas((prev) => ({ ...prev, semestre: v }))
                  }
                  options={semestres}
                  map={(s) => ({
                    value: s.codigo,
                    label: s.designacao,
                    key: s.codigo,
                  })}
                />

                <CourseSelect
                  value={filtersSubmetidas.curso}
                  onChangeValue={(v) =>
                    setFiltersSubmetidas((prev) => ({
                      ...prev,
                      curso: v,
                      anoCurricular: "",
                      unidadeCurricular: "",
                    }))
                  }
                  params={{
                    tipoCandidaturaId: parseFilter(filtersSubmetidas.tipoCandidatura),
                  }}
                  disabled={!filtersSubmetidas.tipoCandidatura}
                />

                <FormSelect
                  label="Ano Curricular"
                  value={filtersSubmetidas.anoCurricular}
                  disabled={!filtersSubmetidas.curso}
                  options={classes}
                  map={(c) => ({
                    value: c.codigo,
                    label: c.designacao,
                    key: c.codigo,
                  })}
                  onChange={(v) =>
                    setFiltersSubmetidas((prev) => ({
                      ...prev,
                      anoCurricular: v,
                      unidadeCurricular: "",
                    }))
                  }
                />

                <FormSelect
                  label="Unidade Curricular"
                  value={filtersSubmetidas.unidadeCurricular}
                  disabled={
                    !filtersSubmetidas.curso ||
                    !filtersSubmetidas.semestre ||
                    !filtersSubmetidas.anoCurricular
                  }
                  options={unidadesCurriculares}
                  map={(u) => ({
                    value: u.pk,
                    label: u.descricao,
                    key: u.codigo,
                  })}
                  onChange={(v) =>
                    setFiltersSubmetidas((prev) => ({
                      ...prev,
                      unidadeCurricular: v,
                    }))
                  }
                />

                <FormSelect
                  label="Tipo de Avaliação"
                  value={filtersSubmetidas.tipoAvaliacao}
                  options={tipoAvaliacao}
                  map={(t) => ({
                    value: t.codigo,
                    label: t.designacao,
                    key: t.codigo,
                  })}
                  onChange={(v) =>
                    setFiltersSubmetidas((prev) => ({
                      ...prev,
                      tipoAvaliacao: v,
                    }))
                  }
                />

                <FormSelect
                  label="Estado"
                  value={filtersSubmetidas.estadoPauta}
                  options={estadosPauta}
                  map={(e) => ({
                    value: e.codigo,
                    label: e.designacao,
                    key: e.codigo,
                  })}
                  onChange={(v) =>
                    setFiltersSubmetidas((prev) => ({
                      ...prev,
                      estadoPauta: v,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Tabela de pautas submetidas */}
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle>Pautas Submetidas</CardTitle>
              <div className="text-sm text-muted-foreground">
                {paginationSubmetidas.total > 0
                  ? `${(currentPageSubmetidas - 1) * limit + 1}–${Math.min(currentPageSubmetidas * limit, paginationSubmetidas.total)} de ${paginationSubmetidas.total}`
                  : "Nenhum registo"}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingSubmetidas ? (
                <div className="p-6 space-y-4">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : errorSubmetidas ? (
                <div className="p-12 text-center text-destructive">
                  <AlertCircle className="mx-auto h-12 w-12 mb-4" />
                  <p>Erro ao carregar as pautas</p>
                  <p className="text-sm mt-2">
                    {(errorSubmetidas as Error).message}
                  </p>
                </div>
              ) : pautas.length === 0 ? (
                <div className="p-16 text-center space-y-4">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">
                    Nenhuma pauta encontrada
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Tente ajustar os filtros ou aguarde que os docentes submetam
                    novas pautas.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-44">Ficheiro</TableHead>
                          <TableHead className="w-32">Data</TableHead>
                          <TableHead>Curso</TableHead>
                          <TableHead>Unidade Curricular</TableHead>
                          <TableHead className="w-24">Ano</TableHead>
                          <TableHead>Docente</TableHead>
                          <TableHead className="w-36">Tipo Avaliação</TableHead>
                          <TableHead className="w-32">Estado</TableHead>
                          <TableHead className="text-right w-40 pr-6">
                            Ações
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pautas.map((pauta) => (
                          <TableRow
                            key={pauta.codigo}
                            className="hover:bg-muted/60 transition-colors"
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="truncate max-w-40">
                                  {pauta.ficheiro_name?.split("/").pop() || "—"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(pauta.created_at).toLocaleDateString(
                                "pt-AO",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </TableCell>
                            <TableCell className="max-w-[180px] truncate">
                              {pauta.curso}
                            </TableCell>
                            <TableCell className="max-w-[220px] truncate">
                              {pauta.unidade_curricular}
                            </TableCell>
                            <TableCell>{pauta.classe || "—"}</TableCell>
                            <TableCell>{pauta.docente_nome || "—"}</TableCell>
                            <TableCell>{pauta.designacao_av || "—"}</TableCell>
                            <TableCell>
                              {getEstadoBadge(pauta.estado_pauta)}
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                {pauta.ficheiro_name && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDownload(pauta.ficheiro_name)
                                    }
                                  >
                                    <Download className="h-4 w-4" />
                                  </Button>
                                )}
                                {pauta.estado_pauta === 1 && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                      onClick={() =>
                                        abrirConfirmacao(pauta, "aprovar")
                                      }
                                    >
                                      <CircleCheck className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                      onClick={() =>
                                        abrirConfirmacao(pauta, "rejeitar")
                                      }
                                    >
                                      <CircleX className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Página {currentPageSubmetidas} de{" "}
                      {paginationSubmetidas.totalPages || 1}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPageSubmetidas === 1 || isLoadingSubmetidas
                        }
                        onClick={() =>
                          setCurrentPageSubmetidas((p) => Math.max(1, p - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPageSubmetidas >=
                            paginationSubmetidas.totalPages ||
                          isLoadingSubmetidas
                        }
                        onClick={() => setCurrentPageSubmetidas((p) => p + 1)}
                      >
                        Seguinte <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 2: UNIDADES SEM PAUTA ─────────────────────────────────────── */}
        <TabsContent value="pendentes" className="space-y-6 mt-2">
          {/* Filtros */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtros – Unidades sem Pauta
                  </CardTitle>
                  <CardDescription>
                    Encontre unidades curriculares pendentes
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={limparFiltros}>
                  Limpar tudo
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <TipoCandidaturaSelect
                  value={filtersPendentes.tipoCandidatura}
                  onChangeValue={(v) =>
                    setFiltersPendentes((prev) => ({
                      ...prev,
                      tipoCandidatura: v,
                      anoLectivo: "",
                      curso: "",
                      anoCurricular: "",
                    }))
                  }
                />

                <AcademicYearsAvailableForOperationSelect
                  label="Ano Lectivo"
                  value={filtersPendentes.anoLectivo}
                  onChangeValue={(v) =>
                    setFiltersPendentes((prev) => ({ ...prev, anoLectivo: v }))
                  }
                  tipoCandidaturaId={parseFilter(filtersPendentes.tipoCandidatura) ?? 1}
                  onlyConfigurable={false}
                  disabled={!filtersPendentes.tipoCandidatura}
                />

                <FormSelect
                  label="Semestre"
                  value={filtersPendentes.semestre}
                  onChange={(v) =>
                    setFiltersPendentes((prev) => ({ ...prev, semestre: v }))
                  }
                  options={semestres}
                  map={(s) => ({
                    value: s.codigo,
                    label: s.designacao,
                    key: s.codigo,
                  })}
                />

                <CourseSelect
                  value={filtersPendentes.curso}
                  onChangeValue={(v) =>
                    setFiltersPendentes((prev) => ({
                      ...prev,
                      curso: v,
                      anoCurricular: "",
                    }))
                  }
                  params={{
                    tipoCandidaturaId: parseFilter(filtersPendentes.tipoCandidatura),
                  }}
                  disabled={!filtersPendentes.tipoCandidatura}
                />

                <FormSelect
                  label="Ano Curricular"
                  value={filtersPendentes.anoCurricular}
                  disabled={!filtersPendentes.curso}
                  options={classes}
                  map={(c) => ({
                    value: c.codigo,
                    label: c.designacao,
                    key: c.codigo,
                  })}
                  onChange={(v) =>
                    setFiltersPendentes((prev) => ({
                      ...prev,
                      anoCurricular: v,
                    }))
                  }
                />
                {/*
                <FormSelect
                  label="Tipo de Avaliação"
                  value={filtersPendentes.tipoAvaliacao}
                  options={tipoAvaliacao}
                  map={(t) => ({ value: t.codigo, label: t.designacao,key:t.codigo })}
                  onChange={(v) => setFiltersPendentes((prev) => ({ ...prev, tipoAvaliacao: v }))}
                />
                */}
              </div>
            </CardContent>
          </Card>

          {/* Tabela de unidades sem pauta */}
          <Card className="border shadow-sm overflow-hidden">
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle>Unidades Curriculares Pendentes</CardTitle>
              <div className="text-sm text-muted-foreground">
                {paginationPendentes.total > 0
                  ? `${(currentPagePendentes - 1) * limit + 1}–${Math.min(currentPagePendentes * limit, paginationPendentes.total)} de ${paginationPendentes.total}`
                  : "Nenhum registo"}
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {isLoadingPendentes ? (
                <div className="p-6 space-y-4">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-md" />
                  ))}
                </div>
              ) : pendentes.length === 0 ? (
                <div className="p-16 text-center space-y-4">
                  <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium">
                    Nenhuma unidade pendente
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Todas as unidades curriculares deste filtro já têm pautas
                    submetidas ou não existem registos.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-40">
                            Unidade Curricular
                          </TableHead>
                          <TableHead className="w-40">Curso</TableHead>
                          <TableHead className="w-24">Ano</TableHead>
                          <TableHead className="w-36">Semestre</TableHead>
                          <TableHead className="w-40">
                            Docente Responsável
                          </TableHead>
                          <TableHead className="w-32 text-center">
                            Estado
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendentes.map((uc) => (
                          <TableRow
                            key={uc.codigo_grade || uc.unidade_curricular}
                            className="hover:bg-muted/60"
                          >
                            <TableCell className="font-medium">
                              {uc.unidade_curricular || "—"}
                            </TableCell>
                            <TableCell>{uc.curso || "—"}</TableCell>
                            <TableCell>{uc.classe || "—"}</TableCell>
                            <TableCell>{uc.semestre || "—"}</TableCell>
                            <TableCell>
                              {uc.docente_nome || "Não atribuído"}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="secondary"
                                className="bg-amber-100 text-amber-800 border-amber-300"
                              >
                                Sem Pauta
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Paginação */}
                  <div className="flex items-center justify-between px-6 py-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Página {currentPagePendentes} de{" "}
                      {paginationPendentes.totalPages || 1}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPagePendentes === 1 || isLoadingPendentes
                        }
                        onClick={() =>
                          setCurrentPagePendentes((p) => Math.max(1, p - 1))
                        }
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPagePendentes >=
                            paginationPendentes.totalPages || isLoadingPendentes
                        }
                        onClick={() => setCurrentPagePendentes((p) => p + 1)}
                      >
                        Seguinte <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de confirmação (apenas para pautas submetidas) */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {acao === "aprovar" ? "Aprovar Pauta" : "Rejeitar Pauta"}
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-2">
              <p>
                Tem a certeza que deseja{" "}
                <strong>{acao === "aprovar" ? "aprovar" : "rejeitar"}</strong>{" "}
                esta pauta?
              </p>
              {pautaSelecionada && (
                <div className="text-sm space-y-1.5 bg-muted/50 p-3 rounded-md">
                  <div>
                    <strong>UC:</strong> {pautaSelecionada.unidade_curricular}
                  </div>
                  <div>
                    <strong>Docente:</strong> {pautaSelecionada.docente_nome}
                  </div>
                  <div>
                    <strong>Curso:</strong> {pautaSelecionada.curso}
                  </div>
                </div>
              )}
              <p className="text-destructive text-sm font-medium">
                Esta ação não pode ser desfeita.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant={acao === "aprovar" ? "default" : "destructive"}
              onClick={confirmarAcao}
              disabled={mutationEstado.isPending}
            >
              {mutationEstado.isPending
                ? "A processar..."
                : acao === "aprovar"
                  ? "Aprovar"
                  : "Rejeitar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
