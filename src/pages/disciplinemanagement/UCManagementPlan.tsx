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
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Hooks
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useClasses } from "@/hooks/use-classes";
import { useCursos } from "@/hooks/use-cursos";
import {
  useGradeCurricular,
  useAddUCToPlan,
} from "@/hooks/use-grade-curricular";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { useAuth } from "@/hooks/use-auth";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";

export default function UCManagementPlan() {
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [cursoId, setCursoId] = useState<string>("");
  const [classeId, setClasseId] = useState<string>("");
  const { user } = useAuth();
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    codigo_disciplina: "",
    codigo_semestre: "",
  });

  const { data: anosLetivos = [], isLoading: loadingAnos } =
    useQueryAnoAcademico();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } = useClasses();
  const { data: disciplines = [], isLoading: loadingDisciplines } =
    useDisciplines();
  const { data: semestres, isLoading: loadingSemestres } = useQuerySemestres();
  const {
    data: grade = [],
    isLoading: loadingGrade,
    isError,
    refetch,
  } = useGradeCurricular({
    anolectivoId: Number(anoLetivoId) || 0,
    cursoId: Number(cursoId) || 0,
    classId: Number(classeId) || 0,
    enabled: !!anoLetivoId && !!cursoId && !!classeId,
  });

  const { mutate: createUC, isPending: isCreating } = useAddUCToPlan();

  useEffect(() => {
    setClasseId("");
    setCurrentPage(1);
  }, [cursoId, anoLetivoId]);

  // Cálculo da paginação
  const totalItems = grade.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = grade.slice(startIndex, endIndex);

  const handleOpenModal = () => {
    if (!anoLetivoId || !cursoId || !classeId) {
      toast.error(
        "Selecione ano letivo, curso e classe antes de adicionar uma UC."
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

    createUC(
      {
        codigo_disciplina: Number(formData.codigo_disciplina),
        codigo_ano_lectivo: Number(anoLetivoId),
        codigo_semestre: Number(formData.codigo_semestre),
        codigo_classe: Number(classeId),
        codigo_curso: Number(cursoId),
        codigo_utilizador: Number(user.user_id),
      },
      {
        onSuccess: () => {
          toast.success("Unidade curricular adicionada ao plano com sucesso!");
          setIsModalOpen(false);
          setFormData({ codigo_disciplina: "", codigo_semestre: "" });
          refetch();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Erro ao adicionar UC ao plano."
          );
        },
      }
    );
  };

  const handleEdit = (id: number) => toast.info(`Editar disciplina #${id}`);

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
        subtitle="Visualizar e gerir todas as UCs por ano letivo, curso e classe"
        // actions={
        //   <Button onClick={handleOpenModal} size="sm">
        //     <Plus className="h-4 w-4 mr-2" />
        //     Adicionar UC ao Plano
        //   </Button>
        // }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <Select value={cursoId} onValueChange={setCursoId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o curso..." />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {cursos.map((curso) => (
                    <SelectItem key={curso.codigo} value={String(curso.codigo)}>
                      {curso.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Classe */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Classe
            </label>
            {loadingClasses ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <Select
                value={classeId}
                onValueChange={setClasseId}
                disabled={!anoLetivoId || !cursoId}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a classe..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((classe) => (
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
        ) : grade.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl">Document</span>
            </div>
            <p className="text-lg font-medium mb-2">
              {anoLetivoId && cursoId && classeId
                ? "Nenhuma unidade curricular encontrada"
                : "Selecione o ano letivo, curso e classe"}
            </p>
            <p className="text-sm">
              Após selecionar os filtros, as UCs aparecerão aqui.
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Código</TableHead>
                  <TableHead>Unidade Curricular</TableHead>
                  <TableHead className="w-64">Curso</TableHead>
                  <TableHead className="w-64">Classe</TableHead>
                  <TableHead className="w-32">Semestre</TableHead>
                  <TableHead className="text-right w-32">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((uc) => (
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(uc.codigo_disciplina)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Paginação */}
            <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">Mostrar</span>
                <Select
                  value={String(itemsPerPage)}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
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
                <span className="text-sm text-muted-foreground">
                  por página
                </span>
              </div>

              <div className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground">
                  {startIndex + 1}-{Math.min(endIndex, totalItems)} de{" "}
                  {totalItems}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    Página {currentPage} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Total geral */}
      {grade.length > 0 && !loadingGrade && (
        <div className="text-sm text-muted-foreground">
          Total de{" "}
          <strong className="font-semibold text-foreground">
            {grade.length}
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
              <Label>Unidade Curricular</Label>
              <Select
                value={formData.codigo_disciplina}
                onValueChange={(value) =>
                  setFormData({ ...formData, codigo_disciplina: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a disciplina..." />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {loadingDisciplines ? (
                    <SelectItem value="loading" disabled>
                      <span className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Carregando disciplinas...
                      </span>
                    </SelectItem>
                  ) : disciplines.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      Nenhuma disciplina disponível
                    </SelectItem>
                  ) : (
                    disciplines.map((disc) => (
                      <SelectItem key={disc.codigo} value={String(disc.codigo)}>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-semibold text-sm">
                            {disc.codigo}
                          </span>
                          <span className="text-muted-foreground">–</span>
                          <span>{disc.desginacao}</span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
