import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileText, Eye, Plus, ChevronLeft, ChevronRight, Calendar, Clock, ChevronUp, ChevronDown, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { FormSelect } from "@/components/common/FormSelect";
import { AgendamentoAulaItem } from "@/services/sumario/fetch-sumario-agendamento-aula.service";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutationCreateSumario } from "@/hooks/sumario/use-mutation-create-sumario";
import { useMutationUpdateSumario } from "@/hooks/sumario/use-mutation-update-sumario";
import { useQuerySumario } from "@/hooks/sumario/use-fetch-sumario";
import { SumarioItem } from "@/services/sumario/fetch-sumario.service";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { useToast } from "@/hooks/use-toast";
import { useMutationValidarSumario } from "@/hooks/sumario/use-mutation-validar-sumario";

type EstadoAssiduidade = 1 | 2 | 3 | 4 | 5 | 6;

function EstadoBadge({ estado }: { estado: EstadoAssiduidade }) {
  const map = {
    1: {
      label: "Aguarda Validação do Dir. Curso",
      className: "bg-amber-100 text-amber-800 border-amber-300",     // amarelo suave – aguardando
    },
    2: {
      label: "Aguarda Validação do Decano",
      className: "bg-amber-100 text-amber-800 border-amber-300",     // mesma cor (estágio similar)
      // ou se quiser diferenciar um pouco: bg-orange-100 text-orange-800 border-orange-300
    },
    3: {
      label: "Aguarda Validação da Reitoria",
      className: "bg-blue-100 text-blue-800 border-blue-300",        // azul = nível mais alto, ainda em espera
    },
    4: {
      label: "Validado",
      className: "bg-emerald-100 text-emerald-800 border-emerald-300", // verde = sucesso
    },
    5: {
      label: "Rejeitado",
      className: "bg-red-100 text-red-800 border-red-300",           // vermelho = negativo
    },
    6: {
      label: "Aguarda Validação do Sec. Geral",
      className: "bg-purple-100 text-purple-800 border-purple-300",  // roxo = etapa especial/final administrativa
      // ou mantém amber se for só mais uma espera normal
    },
  };

  const info = map[estado] || { label: "Desconhecido", className: "" };

  return (
    <Badge variant="outline" className={info.className}>
      {info.label}
    </Badge>
  );
}

export default function ListagemSumarios() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { hasPermission } = usePermission();
  const [selectedSumario, setSelectedSumario] = useState<SumarioItem | null>(null);
  const { toast } = useToast();

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();


  const SEMESTRE = [
    { key: "1", label: "1º Semestre", value: "1" },
    { key: "2", label: "2º Semestre", value: "2" },
  ];
  const estados = [
    {
      key: 1,
      label: "Aguarda Validação do Dir. Curso",
      value: "1",
      className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    },
    {
      key: 2,
      label: "Aguarda Validação do Decano",
      value: "2",
      className: "bg-red-500/10 text-red-700 border-red-500/30",
    },
    {
      key: 3,
      label: "Aguarda Validação da Reitoria",
      value: "3",
      className: "",
    },
    {
      key: 4,
      label: "Validado",
      value: "4",
      className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    },
    {
      key: 5,
      label: "Rejeitado",
      value: "5",
      className: "bg-red-500/10 text-red-700 border-red-500/30",
    },
    {
      key: 6,
      label: "Aguarda Validação do Sec. Geral",
      value: "6",
      className: "bg-blue-500/10 text-blue-700 border-blue-500/30",
    },
  ];
  const { data: teachersData = [] } = useQueryTeacther();
  const mutation = useMutationValidarSumario();


  const [filters, setFilters] = useState({
    docente: "",
    anoCurricular: "all",
    unidadeCurricular: "",
    dataInicio: "",
    dataFim: "",
    estado: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    page: 1,
    limit: 10,
  });

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDisciplinaWithFilter({
    curso: filters.curso,
    semestre: filters.semestre,
    classe: filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
  });

  const { data: sumarios, isLoading: isLoadingAulasAgendadas } = useQuerySumario({
    docente: filters.docente ? Number(filters.docente) : undefined,
    unidadeCurricular: filters.unidadeCurricular ? Number(filters.unidadeCurricular) : undefined,
    dataInicial: filters.dataInicio || undefined,
    dataFinal: filters.dataFim || undefined,
    estado_sumario: filters.estado ? Number(filters.estado) : undefined,
    anoLectivo: filters.anoLectivo ? Number(filters.anoLectivo) : undefined,
    semestre: filters.semestre ? Number(filters.semestre) : undefined,
    page: filters.page,
    limit: filters.limit,
  });

  const { data: cursos } = useCursos();
  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  // Dados derivados
  const totalPages = sumarios?.totalPages ?? 1;
  const totalItems = sumarios?.total ?? sumarios?.data?.length ?? 0;
  const currentData = sumarios?.data ?? [];

  // Função auxiliar para atualizar filtros e resetar página
  const updateFilters = (newValues: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newValues,
      page: 1,
    }));
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newLimit = Number(value);
    setItemsPerPage(newLimit);
    updateFilters({ limit: newLimit, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setFilters((prev) => ({ ...prev, page: newPage }));
  };


  const marcar = async (id: number, tipo: "rejeitar" | "aprovar") => {
    const estados = { rejeitar: 5, aprovar: 4 };
    const novoEstado = estados[tipo];

    try {
      await mutation.mutateAsync({ codigo: id, estado: novoEstado });
      toast({
        title: "Sucesso",
        description: `Estado alterado para ${tipo}`,
      });

      setSelectedSumario((prev) =>
        prev && prev.sumario_codigo === id ? { ...prev, sumario_estado: novoEstado } : prev
      );
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível marcar a assiduidade",
      });
    }
  };


  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/">Início</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Sumário</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Listagem de Sumários</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Listagem de Sumários</h1>
          <p className="text-muted-foreground">Consulte todos os sumários leccionados</p>
        </div>

      </div>

      {/* Filtros */}
      <div className="bg-card border rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showMoreFilters ? (
                <>Menos filtros <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>Mais filtros <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </Button>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setFilters({
                  docente: "",
                  anoLectivo: "",
                  semestre: "",
                  estado: "",
                  dataInicio: "",
                  dataFim: "",
                  curso: "",
                  anoCurricular: "all",
                  unidadeCurricular: "",
                  page: 1,
                  limit: itemsPerPage,
                });
                setCurrentPage(1);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Filtros sempre visíveis */}
          <div className="space-y-1.5">
            <Label>Ano Letivo</Label>
            <FormSelect
              disabled={isLoadingAcademicYear}
              value={filters.anoLectivo}
              onChange={(v) => updateFilters({ anoLectivo: v })}
              options={anosAcademicos ?? []}
              map={(a) => ({ key: a.codigo, label: a.designacao, value: String(a.codigo) })}
              placeholder="Selecione o ano..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Estado Sumário</Label>
            <FormSelect
              disabled={isLoadingAcademicYear}
              value={filters.estado ?? ""}
              onChange={(v) => updateFilters({ estado: v === "" ? "" : v })}
              options={[
                { key: "todos", label: "Todos os estados", value: null },
                ...estados,
              ]}
              map={(opt) => opt}
              placeholder="Selecione o estado..."
            />
          </div>
          <div className="space-y-1.5">
            <Label>Semestre</Label>
            <FormSelect
              value={filters.semestre}
              onChange={(v) => updateFilters({ semestre: v })}
              options={SEMESTRE}
              map={(s) => ({ key: s.key, label: s.label, value: s.value })}
              placeholder="Selecione o semestre..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Docente</Label>
            <FormCommandSelect
              width="full"
              value={filters.docente}
              options={teachersData}
              map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
              onChange={(codigo) => updateFilters({ docente: codigo })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data início</Label>
            <Input
              type="date"
              value={filters.dataInicio ?? ""}
              onChange={(e) => updateFilters({ dataInicio: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data fim</Label>
            <Input
              type="date"
              value={filters.dataFim ?? ""}
              onChange={(e) => updateFilters({ dataFim: e.target.value })}
            />
          </div>

          {showMoreFilters && (
            <>
              <div className="space-y-1.5">
                <Label>Curso</Label>
                <FormCommandSelect
                  width="full"
                  value={filters.curso}
                  options={cursos}
                  map={(c) => ({
                    key: c.codigo.toString(),
                    value: c.codigo.toString(),
                    label: c.designacao,
                  })}
                  onChange={(v) => updateFilters({ curso: v, unidadeCurricular: "" })}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Ano Curricular</Label>
                <Select
                  value={filters.anoCurricular}
                  onValueChange={(v) => updateFilters({ anoCurricular: v, unidadeCurricular: "" })}
                  disabled={!filters.curso}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={filters.curso ? "Todos os anos" : "Selecione curso"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os anos</SelectItem>
                    {anosCurriculares.map((ac) => (
                      <SelectItem key={ac.codigo} value={ac.codigo.toString()}>
                        {ac.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label>Unidade Curricular</Label>
                <FormCommandSelect
                  width="full"
                  value={filters.unidadeCurricular}
                  options={unidadesCurriculares}
                  map={(u) => ({ key: u.pk.toString(), value: u.pk.toString(), label: u.descricao })}
                  placeholder={
                    !filters.curso
                      ? "Selecione curso"
                      : !filters.semestre
                        ? "Selecione semestre"
                        : isLoadingUC
                          ? "Carregando UCs..."
                          : "Selecionar UC"
                  }
                  onChange={(u) => updateFilters({ unidadeCurricular: u })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabela + Paginação */}
      {isLoadingAulasAgendadas ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : currentData.length === 0 ? (
        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Nenhum registo encontrado</p>
          <p className="text-sm mt-2">Tente ajustar os filtros</p>
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Ano Curricular</TableHead>
                <TableHead>UC</TableHead>
                <TableHead>Docente</TableHead>

                <TableHead>Sala</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((a) => (
                <TableRow key={a.sumario_codigo}>
                  <TableCell className="font-medium">{a.sumario_codigo}</TableCell>
                  <TableCell>{a.curso}</TableCell>
                  <TableCell>{a.classe}</TableCell>
                  <TableCell>{a.unidade_curricular}</TableCell>
                  <TableCell>{a.docente}</TableCell>

                  <TableCell className="max-w-[150px] truncate">{a.sala}</TableCell>
                  <TableCell>
                    <EstadoBadge estado={a.sumario_estado as EstadoAssiduidade} />
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSumario(a)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>


                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between p-4 border-t flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Itens por página:</span>
              <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
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
              <span className="text-sm text-muted-foreground">{totalItems} resultado(s)</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <Dialog open={!!selectedSumario} onOpenChange={() => setSelectedSumario(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Sumário</DialogTitle>
          </DialogHeader>
          {selectedSumario && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">{selectedSumario.codigo}</span>
                <EstadoBadge estado={selectedSumario.sumario_estado as EstadoAssiduidade} />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-3 text-sm">


                <div>
                  <span className="text-muted-foreground">Horário:</span>
                  <p className="font-medium">{selectedSumario.horario}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sala:</span>
                  <p className="font-medium">{selectedSumario.sala}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span>
                  <p className="font-medium">{selectedSumario.data_aula}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Horário:</span>
                  <p className="font-medium">
                    {selectedSumario.hora_inicio} - {selectedSumario.hora_fim}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Dia da Semana:</span>
                  <p className="font-medium">{selectedSumario.dia_semana}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Criado em:</span>
                  <p className="font-medium">{selectedSumario.sumario_data_criacao}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Atualizado em:</span>
                  <p className="font-medium">{selectedSumario.sumario_data_atualizacao}</p>
                </div>
              </div>
              <Separator />
              <div>
                <span className="text-sm text-muted-foreground">Sumário:</span>
                <p className="text-sm mt-1">
                  {selectedSumario.sumario_descricao || (
                    <span className="italic text-muted-foreground">Sem sumário registado</span>
                  )}
                </p>
              </div>
              <Separator />
              {
                hasPermission(PermissionTypeDetails.SUMARIO_POR_VALIDAR.sigla) && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-600/40 hover:bg-emerald-50"
                      disabled={selectedSumario.sumario_estado === 4}
                      onClick={() => marcar(selectedSumario.sumario_codigo, "aprovar")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                      Aprovar
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 border-red-600/40 hover:bg-red-50"
                      disabled={selectedSumario.sumario_estado === 5}
                      onClick={() => marcar(selectedSumario.sumario_codigo, "rejeitar")}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Rejeitar
                    </Button>


                  </div>


                )}
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}