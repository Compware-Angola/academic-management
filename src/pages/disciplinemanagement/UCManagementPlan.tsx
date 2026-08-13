import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
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
import { Skeleton } from "@/components/ui/skeleton";
import { BookText, ChevronsUpDown, DownloadCloud, Plus, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

// Componentes da modal
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

// Hooks
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useCursos } from "@/hooks/use-cursos";
import {
  useAddUCsToPlan,
  useGradeCurricular,
} from "@/hooks/use-grade-curricular";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { useAuth } from "@/hooks/use-auth";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { parseFilter } from "@/util/parse-filter";
import { useQueryDropdownDisciplines } from "@/hooks/study_plan/use-query-dropdown-disciplines";
import { useMutationUpdateDiscipline } from "@/hooks/study_plan/use-mutation-update-discipline";
import { Switch } from "@/components/ui/switch";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { TipoCandidaturaSelect } from "@/components/common/global-selects/TipoCandidaturaSelect";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { ImportUCModal } from "./components/ImportModalUC";
import {
  ResultadoAddUCModal,
  ResultadoUC,
} from "./components/ResultadoAddUCModal";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/error";
import { AddUCsToPlanResponse } from "@/services/fetch-gradeCurricularService";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function UCManagementPlan() {
  const [tipoCandidaturaId, setTipoCandidaturaId] = useState<string>("1");
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [cursoId, setCursoId] = useState<string>("");
  const [classeId, setClasseId] = useState<string>("7");
  const [estado, setEstado] = useState<number>();
  const { user: userData } = useAuth();
  // Paginação
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState<boolean>(false);
  // Estado do modal (independente dos filtros da listagem)
  const [modalTipoCandidaturaId, setModalTipoCandidaturaId] =
    useState<string>("1");
  const [modalAnoLetivoId, setModalAnoLetivoId] = useState<string>("");
  const [modalCursoId, setModalCursoId] = useState<string>("");
  const [modalClasseId, setModalClasseId] = useState<string>("");

  const isGraduationModal = modalTipoCandidaturaId === "1";

  const { data: modalClasses = [], isLoading: loadingModalClasses } =
    useQueryClassFilterByCurso({ curso: modalCursoId });

  useEffect(() => {
    setModalCursoId("");
    setModalClasseId("");
  }, [modalTipoCandidaturaId]);

  useEffect(() => {
    setModalClasseId("");
  }, [modalCursoId, modalAnoLetivoId]);

  const onOpenModalImport = () => setIsModalImportOpen(true);
  const onCloseModalImport = () => setIsModalImportOpen(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    codigos_disciplina: [],
    codigo_semestre: "",
  });

  const hasActiveFilters =
    tipoCandidaturaId !== "1" ||
    !!cursoId ||
    (classeId !== undefined && classeId !== "7") ||
    estado !== undefined;

  const hasActiveFiltersMoldal =
    modalTipoCandidaturaId !== "1" ||
    modalAnoLetivoId !== "" ||
    !!modalCursoId ||
    (modalClasseId !== "" && modalClasseId !== "7");

  const limparFiltros = () => {
    setTipoCandidaturaId("1");
    setAnoLetivoId("");
    setCursoId("");
    setClasseId("");
    setEstado(undefined);
    setPage(1);
  };
  const limparFiltrosModal = () => {
    setModalTipoCandidaturaId("1");
    setModalAnoLetivoId("");
    setModalCursoId("");
    setModalClasseId("");
  };

  const { data: anosLetivos = [] } = useQueryAnoAcademico();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } =
    useQueryClassFilterByCurso({ curso: cursoId });
  const { data: disciplines = [], isLoading: loadingDisciplines } =
    useQueryDropdownDisciplines();

  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const {
    data: gradeResponses,
    isLoading: loadingGrade,
    isError,
    refetch,
  } = useGradeCurricular({
    anoLectivo: parseFilter(anoLetivoId),
    curso: parseFilter(cursoId),
    classe: classeId !== "7" ? parseFilter(classeId) : undefined,
    estado: estado,
    page,
    limit,
  });

  const { mutate: update, isPending: updating } = useMutationUpdateDiscipline();
  const isGraduation = tipoCandidaturaId === "1";

  const handleStatusChange = (codigo: number, status: boolean) => {
    update({
      codigo,
      status: status ? 1 : 0,
    });
  };

  useEffect(() => {
    setClasseId("");
    setPage(1);
  }, [cursoId, anoLetivoId, tipoCandidaturaId]);

  const handleOpenModal = () => {
    setModalTipoCandidaturaId("1");
    setModalAnoLetivoId("");
    setModalCursoId("");
    setModalClasseId("");
    setFormData({ codigos_disciplina: [], codigo_semestre: "" });
    setIsModalOpen(true);
  };

  const [isDisciplinesOpen, setIsDisciplinesOpen] = useState(false);

  const [resultadoModalOpen, setResultadoModalOpen] = useState(false);
  const [resultados, setResultados] = useState<ResultadoUC[]>([]);

  const { mutate: createUCs, isPending: isCreating } = useAddUCsToPlan();

  const toggleDisciplina = (codigo: string) => {
    setFormData((prev) => ({
      ...prev,
      codigos_disciplina: prev.codigos_disciplina.includes(codigo)
        ? prev.codigos_disciplina.filter((c) => c !== codigo)
        : [...prev.codigos_disciplina, codigo],
    }));
  };

  const buildResultados = (
    selectedCodigos: string[],
    resposta?: Pick<
      AddUCsToPlanResponse,
      "adicionadas" | "reativadas" | "falhas"
    >,
    motivoFalhaFallback?: string,
  ): ResultadoUC[] => {
    const porCodigo = new Map<
      number,
      { status: ResultadoUC["status"]; motivo?: string }
    >();
    resposta?.adicionadas.forEach((a) =>
      porCodigo.set(a.codigoDisciplina, { status: "adicionada" }),
    );
    resposta?.reativadas.forEach((a) =>
      porCodigo.set(a.codigoDisciplina, { status: "reativada" }),
    );
    resposta?.falhas.forEach((f) =>
      porCodigo.set(
        f.codigoDisciplina,
        f.jaNoPlano
          ? { status: "jaNoPlano" }
          : { status: "falha", motivo: f.motivo },
      ),
    );

    return selectedCodigos.map((codigo) => {
      const num = Number(codigo);
      const disc = disciplines.find((d) => d.codigo === num);
      const designacao = disc
        ? `${disc.codigo} – ${disc.desginacao}`
        : String(num);
      const resultado = porCodigo.get(num);

      return resultado
        ? {
            codigoDisciplina: num,
            designacao,
            status: resultado.status,
            motivo: resultado.motivo,
          }
        : {
            codigoDisciplina: num,
            designacao,
            status: "falha" as const,
            motivo:
              motivoFalhaFallback ??
              "Não foi possível confirmar o resultado da operação.",
          };
    });
  };

  const handleCreateUC = () => {
    if (!modalAnoLetivoId || !modalCursoId || !modalClasseId) {
      toast.error("Selecione o ano letivo, o curso e o ano curricular.");
      return;
    }
    if (
      formData.codigos_disciplina.length === 0 ||
      (isGraduationModal && !formData.codigo_semestre)
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    createUCs(
      {
        codigosDisciplina: formData.codigos_disciplina.map(Number),
        codigoAnoLectivo: Number(modalAnoLetivoId),
        codigoSemestre: isGraduationModal
          ? Number(formData.codigo_semestre)
          : 1,
        codigoClasse: Number(modalClasseId),
        codigoCurso: Number(modalCursoId),
      },
      {
        onSuccess: (data) => {
          setResultados(buildResultados(formData.codigos_disciplina, data));
          setResultadoModalOpen(true);
          setIsModalOpen(false);
          setFormData({ codigos_disciplina: [], codigo_semestre: "" });
          refetch();
        },
        onError: (error: Error) => {
          const apiError = error as ApiError;
          const falhas = apiError.data?.falhas;

          setResultados(
            falhas?.length
              ? buildResultados(formData.codigos_disciplina, {
                  adicionadas: [],
                  reativadas: [],
                  falhas,
                })
              : buildResultados(
                  formData.codigos_disciplina,
                  undefined,
                  apiError.message || "Erro ao comunicar com o servidor.",
                ),
          );
          setResultadoModalOpen(true);
          setFormData({ codigos_disciplina: [], codigo_semestre: "" });
        },
      },
    );
  };

  const grades = gradeResponses?.data ?? [];
  const total = gradeResponses?.total;
  const totalPages = gradeResponses?.totalPages;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Início</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/plano">Plano de Estudo</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Gestão de UC no Plano</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <PageHeader
        title="Gestão de Unidades Curriculares no Plano"
        subtitle="Visualizar e gerir todas as UCs por ano letivo, curso e ano curricular"
        actions={
          <div className="flex space-x-2">
            <Button onClick={handleOpenModal} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar UC
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/plano/import-uc")}
              size="sm"
            >
              <DownloadCloud className="h-4 w-4 mr-2" />
              Importar UC
            </Button>
          </div>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Filtros</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={limparFiltros}
              className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Limpar Filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <TipoCandidaturaSelect
            value={tipoCandidaturaId}
            onChangeValue={(v) => {
              setTipoCandidaturaId(v);
              setAnoLetivoId("");
              setCursoId("");
              setClasseId("");
              setPage(1);
            }}
          />

          {/* Ano Letivo */}
          <div className="space-y-2">
            <AcademicYearsAvailableForOperationSelect
              label="Ano Letivo"
              value={anoLetivoId}
              onChangeValue={(v) => {
                setAnoLetivoId(v);
                setCursoId("");
                setClasseId("");
                setPage(1);
              }}
              tipoCandidaturaId={parseFilter(tipoCandidaturaId) ?? 1}
              onlyConfigurable={false}
              disabled={!tipoCandidaturaId}
            />
          </div>

          {/* Curso */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Curso</label>
            {loadingCursos ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <FormCommandSelect
                value={cursoId}
                options={cursos}
                width="w-full"
                map={(c) => ({
                  key: c.codigo.toString(),
                  value: c.codigo.toString(),
                  label: c.designacao,
                })}
                onChange={(v) => setCursoId(v)}
              />
            )}
          </div> */}

          <CourseSelect
            label="Curso"
            value={cursoId}
            onChangeValue={(v) => setCursoId(v)}
            disabled={!tipoCandidaturaId}
            params={{
              tipoCandidaturaId: parseFilter(tipoCandidaturaId),
            }}
          />

          {/* Classe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Ano Curricular
            </label>
            {loadingClasses ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select
                value={classeId}
                onValueChange={setClasseId}
                disabled={!cursoId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ano curricular..." />
                </SelectTrigger>
                <SelectContent>
                  {classes
                    .filter(
                      (classe) =>
                        !classe.designacao
                          ?.toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .includes("pos-graduacao"),
                    )
                    .map((classe) => (
                      <SelectItem
                        key={classe.codigo}
                        value={String(classe.codigo)}
                      >
                        {classe.designacao}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Estado da UC */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Estado da Unidade Curricular
            </label>
            <Select
              value={estado === undefined ? "all" : String(estado)}
              onValueChange={(v) =>
                setEstado(v === "all" ? undefined : Number(v))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todos os Estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                <SelectItem value="1">Ativas</SelectItem>
                <SelectItem value="0">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-lg border bg-card shadow-sm">
        {loadingGrade ? (
          <div className="p-8 space-y-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center">
            <p className="text-lg font-medium text-destructive mb-4">
              Erro ao carregar as unidades curriculares
            </p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Tentar novamente
            </Button>
          </div>
        ) : grades.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookText className="text-3xl" />
            </div>

            {/* ⬇️ Aqui entra o bloco único, substituindo os 2 <p> antigos */}
            {(() => {
              const filtrosObrigatoriosPreenchidos = !!(
                anoLetivoId &&
                cursoId &&
                classeId
              );

              let mensagem: string;

              if (!filtrosObrigatoriosPreenchidos) {
                const faltantes: string[] = [];
                if (!anoLetivoId) faltantes.push("o ano letivo");
                if (!cursoId) faltantes.push("o curso");
                if (!classeId) faltantes.push("o ano curricular");

                mensagem = `Selecione ${faltantes.join(", ")} para visualizar as unidades curriculares`;
              } else if (estado !== undefined) {
                mensagem = `Nenhuma unidade curricular ${
                  estado === 1 ? "ativa" : "inativa"
                } encontrada para os filtros selecionados`;
              } else {
                mensagem =
                  "Nenhuma unidade curricular encontrada para os filtros selecionados";
              }

              return <p className="text-lg font-medium mb-2">{mensagem}</p>;
            })()}
          </div>
        ) : (
          <>
            {/* resto da tabela */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Código</TableHead>
                  <TableHead>Unidade Curricular</TableHead>
                  <TableHead className="w-64">Curso</TableHead>
                  <TableHead className="w-64">Ano Curricular</TableHead>
                  <TableHead className="w-32">Semestre</TableHead>
                  <TableHead className="w-32">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((uc) => (
                  <TableRow
                    key={uc.codigo_grade_curricular}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-mono font-semibold text-sm">
                      {uc.codigo_disciplina}
                    </TableCell>
                    <TableCell className="font-medium">
                      {uc.descricao_disciplina}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {uc.descricao_curso}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {uc.descricao_classe}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          uc.codigo_semestre === 1 ? "secondary" : "default"
                        }
                      >
                        {uc.designacao_semestre}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      <Switch
                        disabled={updating}
                        checked={uc.status === 1}
                        onCheckedChange={(checked) => {
                          handleStatusChange(uc.codigo_disciplina, checked);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginação */}
            <div className="flex items-center justify-between m-4">
              <p className="text-sm text-muted-foreground">
                A mostrar {grades.length} de {total} registos
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
          </>
        )}
      </div>

      {/* Total geral */}
      {grades.length > 0 && !loadingGrade && (
        <div className="text-sm text-muted-foreground">
          Total de{" "}
          <strong className="font-semibold text-foreground">
            {grades.length}
          </strong>{" "}
          unidade(s) curricular(es) no plano
        </div>
      )}
      <ImportUCModal
        open={isModalImportOpen}
        onOpenChange={(V) => setIsModalImportOpen(false)}
      />

      <ResultadoAddUCModal
        open={resultadoModalOpen}
        onOpenChange={setResultadoModalOpen}
        resultados={resultados}
      />

      {/* Modal de Criação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl! p-0 overflow-hidden shadow-2xl border-border/40">
          {/* Cabeçalho com fundo sutil para melhor hierarquia */}
          <div className="px-6 pt-6 pb-4 border-b bg-muted/20">
            <DialogHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold tracking-tight">
                  Adicionar UC ao Plano de Estudos
                </DialogTitle>
                {hasActiveFiltersMoldal && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={limparFiltrosModal}
                    className="h-8 gap-1.5 text-muted-foreground hover:text-foreground text-xs"
                  >
                    <X className="h-3.5 w-3.5" />
                    Limpar Filtros
                  </Button>
                )}
              </div>
              <DialogDescription className="text-sm text-muted-foreground">
                Insira os dados da unidade curricular para configurar o plano
                atual.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Corpo do Modal com espaçamento e agrupamento refinados */}
          <div className="px-6 py-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {/* Bloco 1: Contexto Acadêmico (Grid de 2 colunas) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <TipoCandidaturaSelect
                  value={modalTipoCandidaturaId}
                  onChangeValue={setModalTipoCandidaturaId}
                />
              </div>

              <div className="space-y-1.5">
                <AcademicYearsAvailableForOperationSelect
                  label="Ano Letivo"
                  value={modalAnoLetivoId}
                  onChangeValue={setModalAnoLetivoId}
                  tipoCandidaturaId={parseFilter(modalTipoCandidaturaId) ?? 1}
                  onlyConfigurable={false}
                  disabled={!modalTipoCandidaturaId}
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <CourseSelect
                  label="Curso"
                  value={modalCursoId}
                  onChangeValue={setModalCursoId}
                  disabled={!modalTipoCandidaturaId}
                  params={{
                    tipoCandidaturaId: parseFilter(modalTipoCandidaturaId),
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="classe"
                  className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Ano Curricular
                </Label>
                {loadingModalClasses ? (
                  <Skeleton className="h-10 w-full rounded-md" />
                ) : (
                  <Select
                    value={modalClasseId}
                    onValueChange={setModalClasseId}
                    disabled={!modalCursoId}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione o ano curricular..." />
                    </SelectTrigger>
                    <SelectContent>
                      {modalClasses
                        .filter(
                          (classe) =>
                            !classe.designacao
                              ?.toLowerCase()
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .includes("pos-graduacao"),
                        )
                        .map((classe) => (
                          <SelectItem
                            key={classe.codigo}
                            value={String(classe.codigo)}
                          >
                            {classe.designacao}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {isGraduationModal && (
                <div className="space-y-1.5">
                  <Label
                    htmlFor="semestre"
                    className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                  >
                    Semestre
                  </Label>
                  <Select
                    value={formData.codigo_semestre}
                    onValueChange={(value) =>
                      setFormData({ ...formData, codigo_semestre: value })
                    }
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Selecione o semestre" />
                    </SelectTrigger>
                    <SelectContent className="max-h-96">
                      {loadingSemestres ? (
                        <SelectItem value="loading" disabled>
                          <span className="flex items-center gap-2">
                            <div className="h-2 w-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            Carregando Semestre...
                          </span>
                        </SelectItem>
                      ) : semestres?.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          Nenhum Semestre disponível
                        </SelectItem>
                      ) : (
                        semestres?.map((sem) => (
                          <SelectItem
                            key={sem.codigo}
                            value={String(sem.codigo)}
                          >
                            <div className="flex items-center gap-3">
                              <span>{sem.designacao}</span>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Divisor sutil para separar o contexto das disciplinas */}
            <div className="border-t border-border/60 pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    Unidades Curriculares
                    {formData.codigos_disciplina.length > 0 && (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                        {formData.codigos_disciplina.length} selecionada(s)
                      </span>
                    )}
                  </Label>
                  {formData.codigos_disciplina.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          codigos_disciplina: [],
                        }))
                      }
                    >
                      Limpar seleção
                    </Button>
                  )}
                </div>

                <Popover
                  open={isDisciplinesOpen}
                  onOpenChange={setIsDisciplinesOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="h-auto min-h-11 w-full justify-between px-3 py-2 bg-background hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {formData.codigos_disciplina.length === 0 ? (
                          <span className="text-muted-foreground font-normal">
                            Selecione as disciplinas...
                          </span>
                        ) : (
                          formData.codigos_disciplina.map((codigo) => {
                            const disc = disciplines.find(
                              (d) => d.codigo.toString() === codigo,
                            );
                            return (
                              <Badge
                                key={codigo}
                                variant="secondary"
                                className="gap-1.5 pl-2.5 pr-1.5 py-1 text-xs font-medium bg-secondary/80 hover:bg-secondary"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {disc
                                  ? `${disc.codigo} – ${disc.desginacao}`
                                  : codigo}
                                <X
                                  className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive rounded-full"
                                  role="button"
                                  aria-label={`Remover ${disc?.desginacao ?? codigo}`}
                                  onPointerDown={(e) => e.stopPropagation()}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleDisciplina(codigo);
                                  }}
                                />
                              </Badge>
                            );
                          })
                        )}
                      </div>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0 shadow-lg"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <Command>
                      <CommandInput placeholder="Pesquisar disciplina..." />
                      <CommandList>
                        <CommandEmpty>
                          Nenhuma disciplina encontrada.
                        </CommandEmpty>
                        <CommandGroup>
                          {disciplines.map((disc) => {
                            const codigo = disc.codigo.toString();
                            const isSelected =
                              formData.codigos_disciplina.includes(codigo);
                            return (
                              <CommandItem
                                key={codigo}
                                value={`${disc.codigo} ${disc.desginacao}`}
                                onSelect={() => toggleDisciplina(codigo)}
                                className={cn(
                                  "flex items-center justify-between cursor-pointer py-2.5 px-3",
                                  isSelected && "bg-accent/60 font-medium",
                                )}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={cn(
                                      "flex h-4 w-4 items-center justify-center rounded transition-colors",
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-input bg-background",
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="h-3 w-3 stroke-[3]" />
                                    )}
                                  </div>
                                  <span className="text-sm">
                                    {disc.codigo} – {disc.desginacao}
                                  </span>
                                </div>

                                {isSelected && (
                                  <X
                                    className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive"
                                    role="button"
                                    aria-label={`Remover ${disc.desginacao}`}
                                    onPointerDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleDisciplina(codigo);
                                    }}
                                  />
                                )}
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Rodapé com separador limpo e alinhamento profissional */}
          <div className="px-6 py-4 bg-muted/20 border-t flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="px-4"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateUC}
              disabled={isCreating}
              className="px-5 shadow-sm"
            >
              {isCreating
                ? "Adicionando..."
                : `Adicionar ${formData.codigos_disciplina.length ? `(${formData.codigos_disciplina.length})` : ""} ao Plano`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
