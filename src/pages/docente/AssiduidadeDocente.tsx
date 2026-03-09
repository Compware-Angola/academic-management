import { useState } from "react";

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

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";

import { FormSelect } from "@/components/common/FormSelect";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";
import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { useQueryDocenteCadeiras } from "@/hooks/docentes/use-docentes-cadeiras";
import { parseFilter } from "@/util/parse-filter";
import { useAuth } from "@/hooks/use-auth";
import { useQueryTeacherProfile } from "@/hooks/teacher/use-query-teacher-profile";
import { useQueryDocenteCursos } from "@/hooks/docentes/use-docentes-curso";
import { useAssiduidadeDocente } from "@/hooks/docentes/useAssiduidadeDocente";

export default function AssiduidadeDocente() {
  const { user } = useAuth();
  const userData = user?.user;
  const { data: teacherInfoData, isLoading: teacherInfoDataLoading } =
    useQueryTeacherProfile(userData?.pk_utilizador);

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();
  const { data: statusAgendamentos, isLoading: isLoadingStatusAgendamento } =
    useQueryStatusAgendamento({ enabled: true });

  const [filters, setFilters] = useState({
    anoCurricular: "all",
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

  const { data: assiduidadeAula, isLoading: isLoadingAssiduidade } =
    useAssiduidadeDocente({
      docenteId: parseFilter(teacherInfoData?.codigo_docente?.toString()),
      gradeId: parseFilter(filters.unidadeCurricular),
      dataFim: filters.dataInicio || undefined,
      dataInicio: filters.dataFim || undefined,
      estadoAgendamento: parseFilter(filters.estado),
      anoLectivo: parseFilter(filters.anoLectivo),
      semestre: parseFilter(filters.semestre),
      page: filters.page,
      limit: filters.limit,
    });
  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDocenteCadeiras({
      anoLectivo: parseFilter(filters.anoLectivo),
      classeId: parseFilter(filters.anoCurricular),
      cursoId: parseFilter(filters.curso),
      semestreId: parseFilter(filters.semestre),
      docenteId: parseFilter(teacherInfoData?.codigo_docente?.toString()),
    });
  const { data: cursos } = useQueryDocenteCursos({
    anoLectivo: parseFilter(filters.anoLectivo),
    docenteId: parseFilter(teacherInfoData?.codigo_docente?.toString()),
  });

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  const totalPages = assiduidadeAula?.total ?? 1;
  const currentPage = assiduidadeAula?.page ?? 1;
  const contagem = assiduidadeAula?.data?.reduce(
    (acc, item) => {
      acc[item.estado] = (acc[item.estado] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  return (
    <div className="space-y-6 pb-10 ">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-300" />
          <span>
            Marcações Pendentes ({contagem ? contagem["Pendente"] : 0})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-200" />
          <span>
            Presenças Marcadas ({contagem ? contagem["Realizada"] : 0})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-300" />
          <span>Faltas Marcadas ({contagem ? contagem["Falta"] : 0})</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Assiduidade Docente
          </h1>
          <p className="text-muted-foreground mt-1">Visualizar Assiduidade</p>
        </div>
      </div>
      <div className="space-y-6 pb-10">
        {/* Filtros – mais campos */}
        <div className="bg-card border rounded-lg p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filtros</h3>

            <div className="flex items-center gap-3">
              {/* Botão Limpar filtros - agora ao lado */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  setFilters({
                    anoLectivo: "",
                    semestre: "",
                    estado: "",
                    dataInicio: "",
                    dataFim: "",
                    curso: "",
                    anoCurricular: "all",
                    unidadeCurricular: "",
                    page: 1,
                    limit: 10,
                  })
                }
              >
                Limpar filtros
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Sempre visíveis */}
            <div className="space-y-1.5">
              <Label>Ano Letivo</Label>
              <FormSelect
                disabled={isLoadingAcademicYear}
                value={filters.anoLectivo}
                onChange={(v) =>
                  setFilters({ ...filters, anoLectivo: v, page: 1 })
                }
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
            <SemestreSelect
              onChangeValue={(v) =>
                setFilters({ ...filters, semestre: v, page: 1 })
              }
              value={filters.semestre}
              key={filters.semestre}
            />

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
                    placeholder={
                      filters.curso ? "Todos os anos" : "Selecione curso"
                    }
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
                  key: u.codigo,
                  value: u.codigo,
                  label: u.nome_cadeira,
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
                onChange={(u) =>
                  setFilters({ ...filters, unidadeCurricular: u })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Data início</Label>
              <Input
                type="date"
                value={filters.dataInicio ?? ""}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    dataInicio: e.target.value,
                    page: 1,
                  })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Data fim</Label>
              <Input
                type="date"
                value={filters.dataFim ?? ""}
                onChange={(e) =>
                  setFilters({ ...filters, dataFim: e.target.value, page: 1 })
                }
              />
            </div>
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
            <p className="text-muted-foreground text-lg">
              Nenhum registo encontrado
            </p>
            <p className="text-sm mt-2">Tente ajustar os filtros</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[80px]">Código</TableHead>
                      <TableHead className="min-w-[150px]">Docente</TableHead>
                      <TableHead className="min-w-[120px]">Horário</TableHead>
                      <TableHead className="min-w-[200px]">
                        Unidade Curricular
                      </TableHead>
                      <TableHead className="min-w-[80px]">Tempo</TableHead>
                      <TableHead className="min-w-[120px]">
                        Data da Aula
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Hora Início
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        Hora Término
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        Assiduidade
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assiduidadeAula?.data.map((r) => (
                      <TableRow key={r.codigo} className="hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">
                          {r.codigo}
                        </TableCell>
                        <TableCell className="font-medium">
                          {r.docente ?? "N/A"}
                        </TableCell>
                        <TableCell>{r.curso}</TableCell>
                        <TableCell>{r.unidade_curricular}</TableCell>
                        <TableCell>{r.ordem_tempo}</TableCell>
                        <TableCell>{r["data_aula"]}</TableCell>
                        <TableCell>{r.hora_inicio}</TableCell>
                        <TableCell>{r.hora_termino}</TableCell>
                        <TableCell>{r.estado}</TableCell>
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
      </div>
    </div>
  );
}
