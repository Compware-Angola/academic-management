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

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useClasses } from "@/hooks/use-classes";
import { useCursos } from "@/hooks/use-cursos";
import { useGradeCurricular } from "@/hooks/use-grade-curricular";

export default function UCManagementPlan() {
  const [anoLetivoId, setAnoLetivoId] = useState<string>("");
  const [cursoId, setCursoId] = useState<string>("");
  const [classeId, setClasseId] = useState<string>("");

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { data: anosLetivos = [], isLoading: loadingAnos } = useQueryAnoAcademico();
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } = useClasses();

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

  useEffect(() => {
    setClasseId("");
    setCurrentPage(1); // resetar página ao mudar filtros
  }, [cursoId, anoLetivoId]);

  // Cálculo da paginação
  const totalItems = grade.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = grade.slice(startIndex, endIndex);

  const handleCreate = () => toast.info("Abrir formulário de criação de UC...");
  const handleEdit = (id: number) => toast.info(`Editar disciplina #${id}`);
  const handleDelete = (id: number) => toast.error(`Eliminar disciplina #${id}`);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Início</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/plano">Plano de Estudo</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Gestão de UC no Plano</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Cabeçalho */}
      <PageHeader
        title="Gestão de Unidades Curriculares no Plano"
        subtitle="Visualizar e gerir todas as UCs por ano letivo, curso e classe"
        actions={
          <Button onClick={handleCreate} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar UC ao Plano
          </Button>
        }
      />

      {/* Filtros */}
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Ano Letivo */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Ano Letivo</label>
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
            <label className="text-sm font-medium text-foreground">Classe</label>
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
                    <SelectItem key={classe.codigo} value={String(classe.codigo)}>
                      {classe.designacao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>

      {/* Tabela com dados paginados */}
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
              <span className="text-3xl">📚</span>
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
                  <TableRow key={uc.codigo} className="hover:bg-muted/50 transition-colors">
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
                      <Badge variant={uc.codigo_semestre === 1 ? "secondary" : "default"}>
                        {uc.designacao_semestre}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(uc.codigo_disciplina)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* PAGINAÇÃO */}
            <div className="flex items-center justify-between border-t bg-muted/30 px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Mostrar
                </span>
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
                  {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
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
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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

      {/* Total geral (fora da tabela) */}
      {grade.length > 0 && !loadingGrade && (
        <div className="text-sm text-muted-foreground">
          Total de <strong className="font-semibold text-foreground">{grade.length}</strong> unidade(s) curricular(es) no plano
        </div>
      )}
    </div>
  );
}