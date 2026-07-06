// src/pages/UCManagementPlan.tsx
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
import { BookText, Plus, X } from "lucide-react";
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
import { useClasses } from "@/hooks/use-classes";
import { useCursos } from "@/hooks/use-cursos";
import {
  useAddUCToPlan,
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

export default function UCManagementPlan() {
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
  const [formData, setFormData] = useState({
    codigo_disciplina: "",
    codigo_semestre: "",
  });

  const hasActiveFilters =
    !!cursoId ||
    (classeId !== undefined && classeId !== "7") ||
    estado !== undefined;

  const limparFiltros = () => {
    setCursoId("");
    setClasseId("");
    setEstado(undefined);
    setPage(1); // importante: volta à primeira página ao limpar
    // mantém anoLetivoId se for um filtro "base" obrigatório,
    // ou reseta também se fizer sentido no teu fluxo
  };

  const { data: anosLetivos = [], isLoading: loadingAnos } =
    useQueryAnoAcademico();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } = useClasses();
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

  const handleStatusChange = (codigo: number, status: boolean) => {
    update({
      codigo,
      status: status ? 1 : 0,
    });
  };

  console.log("Grade Curricular", gradeResponses);

  const { mutate: createUC, isPending: isCreating } = useAddUCToPlan();

  useEffect(() => {
    setClasseId("");
    setPage(1);
  }, [cursoId, anoLetivoId]);

  const handleOpenModal = () => {
    if (!anoLetivoId || !cursoId || !classeId) {
      toast.error(
        "Selecione o ano letivo, o curso e o ano curricular antes de adicionar uma UC.",
      );
      return;
    }
    setIsModalOpen(true);
  };

  const handleCreateUC = () => {
    if (!formData.codigo_disciplina || !formData.codigo_semestre) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }
    if (classeId == "7") {
      toast.error("Selecione um Ano Curricular válido.");
      setClasseId("");
      setIsModalOpen(false);
      return;
    }
    createUC(
      {
        codigoDisciplina: Number(formData.codigo_disciplina),
        codigoAnoLectivo: Number(anoLetivoId),
        codigoSemestre: Number(formData.codigo_semestre),
        codigoClasse: Number(classeId),
        codigoCurso: Number(cursoId),
      },
      {
        onSuccess: () => {
          toast.success("Unidade curricular adicionada ao plano com sucesso!");
          setIsModalOpen(false);
          setFormData({ codigo_disciplina: "", codigo_semestre: "" });
          refetch();
        },
        onError: (error: any) => {
          const backendMessage =
            error?.response?.data?.message ||
            error?.message ||
            "Erro ao adicionar UC ao plano.";
          toast.error(backendMessage);
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
          <Button onClick={handleOpenModal} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar UC ao Plano
          </Button>
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
          {/* Ano Letivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Ano Letivo
            </label>
            {loadingAnos ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select value={anoLetivoId} onValueChange={setAnoLetivoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o ano letivo..." />
                </SelectTrigger>
                <SelectContent>
                  {anosLetivos.map((ano) => (
                    <SelectItem key={ano.codigo} value={String(ano.codigo)}>
                      {ano.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Curso */}
          <div className="space-y-2">
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
          </div>

          {/* Classe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Ano Curricular
            </label>
            {loadingClasses ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select value={classeId} onValueChange={setClasseId}>
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
                    key={uc.codigo}
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

      {/* Modal de Criação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar UC ao Plano de Estudos</DialogTitle>
            <DialogDescription>
              Insira os dados da unidade curricular para o plano atual.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormCommandSelect
                value={formData.codigo_disciplina}
                label="Unidade Curricular"
                placeholder="Selecione a disciplina..."
                options={disciplines}
                width="full"
                map={(disc) => ({
                  key: disc.codigo.toString(),
                  value: disc.codigo.toString(),
                  label: `${disc.codigo} – ${disc.desginacao}`,
                })}
                onChange={(value) =>
                  setFormData({ ...formData, codigo_disciplina: value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="semestre">Semestre</Label>
              <Select
                value={formData.codigo_semestre}
                onValueChange={(value) =>
                  setFormData({ ...formData, codigo_semestre: value })
                }
              >
                <SelectTrigger>
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
                  ) : semestres.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhum Semestre disponível
                    </SelectItem>
                  ) : (
                    semestres.map((sem) => (
                      <SelectItem key={sem.codigo} value={String(sem.codigo)}>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-sm">
                            {sem.codigo}
                          </span>
                          <span className="text-muted-foreground">–</span>
                          <span>{sem.designacao}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Campos ocultos (pré-preenchidos) */}
            <div className="text-xs text-muted-foreground space-y-1 mt-4 pt-4 border-t">
              <p>
                <strong>Ano Letivo:</strong>{" "}
                {
                  anosLetivos.find((a) => String(a.codigo) === anoLetivoId)
                    ?.designacao
                }
              </p>
              <p>
                <strong>Curso:</strong>{" "}
                {cursos.find((c) => String(c.codigo) === cursoId)?.designacao}
              </p>
              <p>
                <strong>Classe:</strong>{" "}
                {
                  classes.find((cl) => String(cl.codigo) === classeId)
                    ?.designacao
                }
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateUC} disabled={isCreating}>
              {isCreating ? "Adicionando..." : "Adicionar ao Plano"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
