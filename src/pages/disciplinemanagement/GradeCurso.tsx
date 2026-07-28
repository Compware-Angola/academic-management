import { useState, useEffect } from "react";
import { PageHeader } from "@/components/common/PageHeader";
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
import { Skeleton } from "@/components/ui/skeleton";
import { BookText, DownloadCloud, Plus, Search, X } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

import { useCursos } from "@/hooks/use-cursos";
import {
  useGradeCurricular2,
  useToggleStatusGradeCurricular,
} from "@/hooks/use-grade-curricular";
import { useAuth } from "@/hooks/use-auth";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { parseFilter } from "@/util/parse-filter";
import { Switch } from "@/components/ui/switch";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { ImportUCModal } from "./components/ImportModalUC";
import { useNavigate } from "react-router-dom";
import { FormSelect } from "@/components/common/FormSelect";

export default function GradeCurso() {
  const [tipoCandidaturaId] = useState<string>("1");
  const [cursoId, setCursoId] = useState<string>("");
  const [classeId, setClasseId] = useState<string>("");
  const [estado, setEstado] = useState<number>();
  const [semestre, setSemestre] = useState<string>("all");
  const [searchUC, setSearchUC] = useState<string>("");
  const { user: userData } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalImportOpen, setIsModalImportOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data: semestres, isLoading: isLoadingSemestres } =
    useQuerySemestres();

  const hasActiveFilters =
    !!cursoId ||
    !!classeId ||
    semestre !== "all" ||
    !!searchUC.trim() ||
    estado !== undefined;

  const limparFiltros = () => {
    setCursoId("");
    setClasseId("");
    setEstado(undefined);
    setSemestre("all");
    setSearchUC("");
    setPage(1);
    setLimit(10);
  };

  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: classes = [], isLoading: loadingClasses } =
    useQueryClassFilterByCurso({ curso: cursoId || undefined });

  const {
    data: gradeResponses,
    isLoading: loadingGrade,
    isError,
    refetch,
  } = useGradeCurricular2({
    curso: parseFilter(cursoId),
    semestre: semestre === "all" ? undefined : parseFilter(semestre),
    classe: parseFilter(classeId),
    estado: estado,
    page,
    limit,
  });

  const { mutate: toggleStatus, isPending } = useToggleStatusGradeCurricular();

  useEffect(() => {
    setClasseId("");
    setSearchUC("");
    setPage(1);
  }, [cursoId]);

  const grades = gradeResponses?.data ?? [];
  const total = gradeResponses?.total ?? 0;
  const totalPages = gradeResponses?.totalPages ?? 1;

  // Filtro frontend por texto (código ou descrição da UC)
  const filteredGrades = grades.filter((uc) => {
    if (!searchUC.trim()) return true;
    const term = searchUC.toLowerCase();
    return uc.descricao_disciplina?.toLowerCase().includes(term);
  });

  const semestreOptions = [
    { codigo: "all", designacao: "Todos" },
    ...(semestres || []),
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
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
            <BreadcrumbPage>Gestão de UC na Grade</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <PageHeader
        title="Gestão de Unidades Curriculares na Grade do Curso"
        subtitle="Visualizar e gerir todas as UCs na grade do curso"
      />

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
          <CourseSelect
            label="Curso"
            value={cursoId}
            onChangeValue={(v) => {
              setCursoId(v);
              setSemestre("all");
              setSearchUC("");
            }}
            params={{
              tipoCandidaturaId: parseFilter(tipoCandidaturaId),
            }}
          />

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

          <FormSelect
            disabled={isLoadingSemestres}
            loading={isLoadingSemestres}
            label="Semestre"
            value={semestre}
            onChange={(v) => {
              setSemestre(v);
            }}
            options={semestreOptions}
            map={(s) => ({
              key: s.codigo,
              label: s.designacao,
              value: s.codigo,
            })}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Unidade Curricular
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Pesquisar UC..."
                value={searchUC}
                onChange={(e) => setSearchUC(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

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
        ) : filteredGrades.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookText className="text-3xl" />
            </div>

            {(() => {
              const filtrosObrigatoriosPreenchidos = !!(cursoId && classeId);

              let mensagem: string;

              if (!filtrosObrigatoriosPreenchidos) {
                const faltantes: string[] = [];
                if (!cursoId) faltantes.push("o curso");
                if (!classeId) faltantes.push("o ano curricular");

                mensagem = `Selecione ${faltantes.join(" e ")} para visualizar as unidades curriculares`;
              } else if (searchUC.trim()) {
                mensagem = `Nenhuma unidade curricular encontrada para "${searchUC.trim()}"`;
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">Código Grade</TableHead>
                  <TableHead className="w-24">Código da UC</TableHead>
                  <TableHead>Unidade Curricular</TableHead>
                  <TableHead className="w-64">Curso</TableHead>
                  <TableHead className="w-64">Ano Curricular</TableHead>
                  <TableHead className="w-32">Semestre</TableHead>
                  <TableHead className="w-32">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((uc) => (
                  <TableRow
                    key={uc.codigo}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-mono font-semibold text-sm">
                      {uc.codigo}
                    </TableCell>
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
                        disabled={isPending}
                        checked={uc.status === 1}
                        onCheckedChange={(checked) => {
                          toggleStatus({
                            codigo: Number(uc.codigo),
                            status: checked ? 1 : 0,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between m-4">
              <p className="text-sm text-muted-foreground">
                A mostrar {filteredGrades.length} de {total} registos
                {searchUC.trim() && " (filtrado)"}
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

      {filteredGrades.length > 0 && !loadingGrade && (
        <div className="text-sm text-muted-foreground">
          Total de{" "}
          <strong className="font-semibold text-foreground">{total}</strong>{" "}
          unidade(s) curricular(es) na grade do curso
          {searchUC.trim() && (
            <span>
              {" "}
              (a mostrar {filteredGrades.length} correspondência
              {filteredGrades.length !== 1 ? "s" : ""})
            </span>
          )}
        </div>
      )}
      <ImportUCModal
        open={isModalImportOpen}
        onOpenChange={(v) => setIsModalImportOpen(false)}
      />
    </div>
  );
}
