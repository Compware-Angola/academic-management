import { ReactNode, useState } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {

  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";


import { FormSelect } from "@/components/common/FormSelect";
import { ProvaAssiduidadeItem } from "@/services/assiduidade/fetch-assiduidade.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";

import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryTeacther } from "@/hooks/teacher/use-query-teacher";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";

import { useQueryProvaAssiduidade } from "@/hooks/assiduidade/use-fetch-assiduidade-prova";
import { useMutationMarcarProva } from "@/hooks/assiduidade/use-mutation-marcar-assiduidade-prova";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { usePermission } from "@/auth/permission.helper";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQueryPostGraduationAttendanceTeachers } from "@/hooks/post-graduation/use-query-attendance-teachers";
import { useMutationMarkPostGraduationTestAttendance } from "@/hooks/post-graduation/use-mutation-mark-attendance-test";
import { useQueryPostGraduationAttendanceStatus } from "@/hooks/post-graduation/use-query-attendance-status";
import { useQueryPostGraduationAttendanceTests } from "@/hooks/post-graduation/use-query-attendance-tests";

type EstadoAssiduidade = 1 | 2 | 3;

function EstadoBadge({ estado }: { estado: EstadoAssiduidade }) {
  const map = {
    1: {
      label: "Pendente",
      className: "bg-amber-500/10 text-amber-700 border-amber-500/30",
    },
    2: {
      label: "Ausente",
      className: "bg-red-500/10 text-red-700 border-red-500/30",
    },
    3: {
      label: "Presente",
      className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
    },
  };

  const info = map[estado] || { label: "Desconhecido", className: "" };

  return (
    <Badge variant="outline" className={info.className}>
      {info.label}
    </Badge>
  );
}

type ProvaContentProps = {
  isPostGraduationAttendance?: boolean;
  degreeId?: string;
  topFiltersSlot?: ReactNode;
};

export default function ProvaContent({
  isPostGraduationAttendance = false,
  degreeId,
  topFiltersSlot,
}: ProvaContentProps) {
  const { toast } = useToast();
  const { hasPermission } = usePermission();
  const [selectedRegisto, setSelectedRegisto] = useState<ProvaAssiduidadeItem | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } = useQueryAnoAcademico();
  const {
    data: regularStatusAgendamentos = [],
    isLoading: isLoadingRegularStatusAgendamento,
  } = useQueryStatusAgendamento({ enabled: !isPostGraduationAttendance });
  const {
    data: postGraduationStatusAgendamentos = [],
    isLoading: isLoadingPostGraduationStatusAgendamento,
  } = useQueryPostGraduationAttendanceStatus({
    enabled: isPostGraduationAttendance,
  });
  const statusAgendamentos = isPostGraduationAttendance
    ? postGraduationStatusAgendamentos
    : regularStatusAgendamentos;
  const isLoadingStatusAgendamento = isPostGraduationAttendance
    ? isLoadingPostGraduationStatusAgendamento
    : isLoadingRegularStatusAgendamento;
 const { data: periodos, isLoading: isLoadingPeriodos } = useQueryPeriod();
  const SEMESTRE = [
    { key: "1", label: "1º Semestre", value: "1" },
    { key: "2", label: "2º Semestre", value: "2" },
  ];
  const regularMutation = useMutationMarcarProva();
  const postGraduationMutation = useMutationMarkPostGraduationTestAttendance();
  const mutarion = isPostGraduationAttendance
    ? postGraduationMutation
    : regularMutation;
  const [filters, setFilters] = useState({
    docente: "",
    anoCurricular: "all",
    codigoTurno: "",
    unidadeCurricular: "",
    dataInicio: "",
    dataFim: "",
    estado: "",
    anoLectivo: "",
    semestre: "",
    curso: "",
    page: 1,
    limit: 15,
  });
  const toNumber = (value: string | undefined): number | undefined => {
    if (!value || value === "") return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  };
  const { data: regularTeachersData = [] } = useQueryTeacther({
    enabled: !isPostGraduationAttendance,
  });
  const { data: postGraduationTeachersData = [] } =
    useQueryPostGraduationAttendanceTeachers(
      {
        degreeId: toNumber(degreeId),
        anoLectivo: toNumber(filters.anoLectivo),
        semestre: toNumber(filters.semestre),
      },
      { enabled: isPostGraduationAttendance },
    );
  const teachersData = isPostGraduationAttendance
    ? postGraduationTeachersData
    : regularTeachersData;

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } = useQueryDisciplinaWithFilter({
    curso: filters.curso,
    semestre: filters.semestre,
    classe: filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
  });
  const attendanceTestParams = {
      ...(toNumber(degreeId) && { degreeId: toNumber(degreeId) }),
      ...(toNumber(filters.docente) && { docente: toNumber(filters.docente) }),
      ...(toNumber(filters.unidadeCurricular) && { disciplina: toNumber(filters.unidadeCurricular) }),
      ...(filters.dataInicio && { dataInicio: filters.dataInicio }),
      ...(filters.dataFim && { dataFim: filters.dataFim }),
      ...(toNumber(filters.estado) && { estado: toNumber(filters.estado) }),
      ...(toNumber(filters.anoLectivo) && { anoLectivo: toNumber(filters.anoLectivo) }),
      ...(toNumber(filters.semestre) && { semestre: toNumber(filters.semestre) }),
      ...(toNumber(filters.codigoTurno) && { periodoId: toNumber(filters.codigoTurno) }),
      ...(filters.page && { page: filters.page }),
      ...(filters.limit && { limit: filters.limit }),
    };

  const {
    data: regularAssiduidadeAula,
    isLoading: isLoadingRegularAssiduidade,
  } = useQueryProvaAssiduidade(attendanceTestParams, {
    enabled: !isPostGraduationAttendance,
  });
  const {
    data: postGraduationAssiduidadeAula,
    isLoading: isLoadingPostGraduationAssiduidade,
  } = useQueryPostGraduationAttendanceTests(attendanceTestParams, {
    enabled: isPostGraduationAttendance,
  });
  const assiduidadeAula = isPostGraduationAttendance
    ? postGraduationAssiduidadeAula
    : regularAssiduidadeAula;
  const isLoadingAssiduidade = isPostGraduationAttendance
    ? isLoadingPostGraduationAssiduidade
    : isLoadingRegularAssiduidade;

  const { data: cursos } = useCursos(
    isPostGraduationAttendance
      ? { tipoCandidaturaId: toNumber(degreeId) }
      : undefined,
  );

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });




  const totalPages = assiduidadeAula?.totalPages ?? 1;
  const currentPage = assiduidadeAula?.page ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };





  const marcar = async (id: number, tipo: "presente" | "ausente" | "pendente") => {
    const estados = { presente: 3, ausente: 2, pendente: 1 };
    const novoEstado = estados[tipo];

    try {
      await mutarion.mutateAsync({ codigoAgendamento: id, novoEstado: novoEstado });
      toast({
        title: "Sucesso",
        description: `Estado alterado para ${tipo}`,
      });

      setSelectedRegisto((prev) =>
        prev && prev.codigo === id ? { ...prev, estado_agendamento_aula: novoEstado } : prev
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
    <div className="space-y-6 pb-10">
      {/* Filtros – mais campos */}
      <div className="bg-card border rounded-lg p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>

          <div className="flex items-center gap-3">
            {/* Botão Mais/Menos filtros */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showMoreFilters ? (
                <>
                  Menos filtros <ChevronUp className="ml-1 h-4 w-4" />
                </>
              ) : (
                <>
                  Mais filtros <ChevronDown className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Botão Limpar filtros - agora ao lado */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setFilters({
                docente: "",
                anoLectivo: "",
                semestre: "",
                estado: "",
                dataInicio: "",
                dataFim: "",
                codigoTurno: "",
                curso: "",
                anoCurricular: "all",
                unidadeCurricular: "",
                page: 1,
                limit: 10,
              })}
            >
              Limpar filtros
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topFiltersSlot}

          {/* Sempre visíveis */}
          <div className="space-y-1.5">
            <Label>Ano Letivo</Label>
            <FormSelect
              disabled={isLoadingAcademicYear}
              value={filters.anoLectivo}
              onChange={(v) => setFilters({ ...filters, anoLectivo: v, page: 1 })}
              options={anosAcademicos ?? []}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: String(a.codigo),
              })}
              placeholder="Selecione o ano..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Estado</Label>
            <FormSelect
              disabled={isLoadingStatusAgendamento}
              value={filters.estado ?? ""}
              onChange={(v) => {
                // Se for "", guarda como undefined ou "" (conforme o teu hook espera)
                const novoValor = v === "" ? "" : v;
                setFilters({ ...filters, estado: novoValor, page: 1 });
              }}
              options={[
                // Opção "Todos" sempre no topo
                { key: "todos", label: "Todos os estados", value: null },
                // ... as opções reais vindas da API
                ...(statusAgendamentos ?? []).map((s) => ({
                  key: s.codigo,
                  label: s.designacao,
                  value: String(s.codigo),
                })),
              ]}
              map={(opt) => opt}
              placeholder="Selecione o estado..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Semestre</Label>
            <FormSelect
              value={filters.semestre}
              onChange={(v) => setFilters({ ...filters, semestre: v, page: 1 })}
              options={SEMESTRE}
              map={(s) => ({
                key: s.key,
                label: s.label,
                value: s.value,
              })}
              placeholder="Selecione o semestre..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>Docente</Label>
            <FormCommandSelect
              value={filters.docente}
              options={teachersData}
              map={(t) => ({ key: t.codigo, value: t.codigo, label: t.nome })}
              onChange={(codigo) => setFilters({ ...filters, docente: codigo, page: 1 })}
            />
          </div>
            <div className="space-y-2">
                      <FormSelect
                        disabled={isLoadingPeriodos || isLoadingAcademicYear || filters.anoLectivo === ""}
                        loading={isLoadingPeriodos}
                        label="Período"
                        value={filters.codigoTurno?.toString() ?? "all"}
                        onChange={(v) => setFilters((p) => ({ ...p, codigoTurno: v === "all" ? undefined : v, page: 1 }))}
                        options={[{ codigo: "all", designacao: "Todos" }, ...(periodos ?? [])]}
                        map={(p) => ({ key: p.codigo.toString(), label: p.designacao, value: p.codigo.toString() })}
                      />
                    </div>

          <div className="space-y-1.5">
            <Label>Data início</Label>
            <Input
              type="date"
              value={filters.dataInicio ?? ""}
              onChange={(e) => setFilters({ ...filters, dataInicio: e.target.value, page: 1 })}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Data fim</Label>
            <Input
              type="date"
              value={filters.dataFim ?? ""}
              onChange={(e) => setFilters({ ...filters, dataFim: e.target.value, page: 1 })}
            />
          </div>

          {/* Filtros extras – aparecem na mesma grid, quebram linha automaticamente */}
          {showMoreFilters && (
            <>
              <div className="space-y-1.5">
                <Label>Curso</Label>
                <FormCommandSelect
                  value={filters.curso}
                  options={cursos}
                  map={(c) => ({
                    key: c.codigo.toString(),
                    value: c.codigo.toString(),
                    label: c.designacao,
                  })}
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      curso: v,
                      unidadeCurricular: "",
                    })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Ano Curricular</Label>
                <Select
                  value={filters.anoCurricular}
                  onValueChange={(v) =>
                    setFilters({
                      ...filters,
                      anoCurricular: v,
                      unidadeCurricular: "",
                    })
                  }
                  disabled={!filters.curso}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={filters.curso ? "Todos os anos" : "Selecione curso"}
                    />
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
                  value={filters.unidadeCurricular}
                  options={unidadesCurriculares}
                  map={(u) => ({
                    key: u.pk.toString(),
                    value: u.pk.toString(),
                    label: u.descricao,
                  })}
                  placeholder={
                    !filters.curso
                      ? "Selecione curso"
                      : !filters.semestre
                        ? "Selecione semestre"
                        : isLoadingUC
                          ? "Carregando UCs..."
                          : "Selecionar UC"
                  }
                  onChange={(u) => setFilters({ ...filters, unidadeCurricular: u })}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabela + Paginação */}
      {isLoadingAssiduidade ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : !assiduidadeAula?.data?.length ? (
        <div className="text-center py-16 bg-muted/40 border rounded-lg">
          <p className="text-muted-foreground text-lg">Nenhum registo encontrado</p>
          <p className="text-sm mt-2">Tente ajustar os filtros</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">Código</TableHead>
                    <TableHead>Docente</TableHead>
                    <TableHead>Unidade Curricular</TableHead>
                    <TableHead className="w-32">Data</TableHead>
                    <TableHead>Hora Inicio</TableHead>
                    <TableHead>Hora Fim</TableHead>
                    <TableHead className="w-28">Estado</TableHead>
                    <TableHead className="text-right w-44">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assiduidadeAula?.data.map((r) => (
                    <TableRow key={r.codigo} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{r.codigo}</TableCell>
                      <TableCell className="font-medium">{r.docente_nome}</TableCell>
                      <TableCell>{r.disciplina}</TableCell>
                      <TableCell>{r.data_prova}</TableCell>

                      <TableCell className="text-sm">{r.hora_prova}</TableCell>
                      <TableCell className="text-sm">{r.hora_termino}</TableCell>
                      <TableCell>
                        <EstadoBadge estado={r.estado_agendamentoid as EstadoAssiduidade} />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => setSelectedRegisto(r)}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            Ver
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Paginação simples */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal de detalhes + marcação */}
      <Dialog open={!!selectedRegisto} onOpenChange={(open) => !open && setSelectedRegisto(null)}>
        <DialogContent className="sm:max-w-lg!">
          <DialogHeader>
            <DialogTitle>Detalhes da Prova</DialogTitle>
            <DialogDescription>Informações e alteração de estado</DialogDescription>
          </DialogHeader>

          {selectedRegisto && (
            <div className="space-y-5 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Código</p>
                  <p className="font-medium font-mono">{selectedRegisto.codigo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Docente</p>
                  <p className="font-medium">{selectedRegisto.docente_nome}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-medium">{selectedRegisto.data_prova}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">

                <div>
                  <p className="text-muted-foreground">Início</p>
                  <p className="font-medium">{selectedRegisto.hora_prova}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fim</p>
                  <p className="font-medium">{selectedRegisto.hora_termino}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duração</p>
                  <p className="font-medium">{selectedRegisto.duracao_prova}</p>
                </div>

              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground mb-2">Estado atual</p>
                <EstadoBadge estado={selectedRegisto.estado_agendamentoid as EstadoAssiduidade} />
              </div>

              <Separator />
              {
                hasPermission(PermissionTypeDetails.MARCAR_ASSIDUIDADE_PROVA.sigla) && (

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-emerald-600/40 hover:bg-emerald-50"
                      disabled={selectedRegisto.estado_agendamentoid === 3}
                      onClick={() => marcar(selectedRegisto.codigo, "presente")}
                    >
                      <CheckCircle className="h-4 w-4 mr-2 text-emerald-600" />
                      Presente
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 border-red-600/40 hover:bg-red-50"
                      disabled={selectedRegisto.estado_agendamentoid === 2}
                      onClick={() => marcar(selectedRegisto.codigo, "ausente")}
                    >
                      <XCircle className="h-4 w-4 mr-2 text-red-600" />
                      Ausente
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1"
                      disabled={selectedRegisto.estado_agendamentoid === 1}
                      onClick={() => marcar(selectedRegisto.codigo, "pendente")}
                    >
                      <Clock className="h-4 w-4 mr-2 text-amber-600" />
                      Pendente
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
