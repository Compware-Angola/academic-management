import { useMemo, useState } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQuerySchedulesByDayOfWeek } from "@/hooks/horario/use-query-schedules-by-week";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";

const DIAS_SEMANA = [
  { id: 1, label: "Domingo" },
  { id: 2, label: "Segunda-feira" },
  { id: 3, label: "Terça-feira" },
  { id: 4, label: "Quarta-feira" },
  { id: 5, label: "Quinta-feira" },
  { id: 6, label: "Sexta-feira" },
  { id: 7, label: "Sábado" },
];

const HorariosSemanais = () => {
  const [page] = useState(1);
  const [limit] = useState(25);

  const [filters, setFilters] = useState({
    anoLetivo: "",
    semestre: "",
    periodo: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    diaSemana: "", // Sem valor padrão → obrigatório selecionar
  });

  // Dados base
  const { data: anosAcademicos } = useQueryAnoAcademico();
  const { data: semestres } = useQuerySemestres();
  const { data: periodos } = useQueryPeriod();
  const { data: cursos } = useCursos();

  const { data: anosCurriculares = [] } = useQueryClassFilterByCurso({
    curso: filters.curso,
  });

  const canLoadUcs = !!filters.curso && !!filters.semestre;

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: filters.curso,
      semestre: filters.semestre,
      classe:
        filters.anoCurricular === "all" ? undefined : filters.anoCurricular,
    });

  // Verifica se todos os filtros necessários estão preenchidos
  const allFiltersFilled =
    !!filters.anoLetivo &&
    !!filters.semestre &&
    !!filters.periodo &&
    !!filters.curso &&
    !!filters.unidadeCurricular &&
    !!filters.diaSemana &&
    !!filters.anoCurricular;

  // Query apenas para o dia selecionado
  const { data: scheduleData, isLoading: isLoadingSchedule } =
    useQuerySchedulesByDayOfWeek(
      {
        anoLectivo: Number(filters.anoLetivo),
        semestre: Number(filters.semestre),
        anoCurricular: Number(filters.anoCurricular),
        diaSemana: Number(filters.diaSemana),
        periodo: Number(filters.periodo),
        curso: Number(filters.curso),
        unidadeCurricular: Number(filters.unidadeCurricular),
        page,
        limit,
      },
      {
        enabled: allFiltersFilled,
      }
    );

  const aulas = scheduleData?.data ?? [];
  const diaSelecionado = DIAS_SEMANA.find(
    (d) => d.id === Number(filters.diaSemana)
  );

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, any> = {
      "Teorico-Prática": "secondary",
      Teórica: "default",
      PL: "secondary",
      Lab: "outline",
    };
    return (
      <Badge variant={variants[tipo] ?? "default"}>{tipo}</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/horarios">Horários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Horários Semanais</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6">Horários Semanais</h1>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Filtros de Pesquisa</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Ano Letivo */}
            <Select
              value={filters.anoLetivo}
              onValueChange={(v) => setFilters({ ...filters, anoLetivo: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano Letivo" />
              </SelectTrigger>
              <SelectContent>
                {anosAcademicos?.map((a) => (
                  <SelectItem key={a.codigo} value={a.codigo.toString()}>
                    {a.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Semestre */}
            <Select
              value={filters.semestre}
              onValueChange={(v) =>
                setFilters({
                  ...filters,
                  semestre: v,
                  anoCurricular: "",
                  unidadeCurricular: "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                {semestres?.map((s) => (
                  <SelectItem key={s.codigo} value={s.codigo.toString()}>
                    {s.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Período */}
            <Select
              value={filters.periodo}
              onValueChange={(v) => setFilters({ ...filters, periodo: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                {periodos?.map((p) => (
                  <SelectItem key={p.codigo} value={p.codigo.toString()}>
                    {p.designacao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Curso */}

                <CourseSelect
                                              
                                            labelMode="inside"
                                              value={filters.curso}
                                              onChangeValue={(v) => {
                                              setFilters({
                                              ...filters,
                                                curso: v,
                                                anoCurricular: "",
                                                unidadeCurricular: "",
                                                });
                                                                        
                                                }}
                                                  />

            

            {/* Ano Curricular */}
            <Select
              value={filters.anoCurricular}
              disabled={!filters.curso}
              onValueChange={(v) =>
                setFilters({
                  ...filters,
                  anoCurricular: v,
                  unidadeCurricular: "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Ano Curricular" />
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

            {/* Unidade Curricular */}
            <Select
              value={filters.unidadeCurricular}
              disabled={!canLoadUcs}
              onValueChange={(v) =>
                setFilters({ ...filters, unidadeCurricular: v })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    isLoadingUC ? "Carregando..." : "Unidade Curricular"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {unidadesCurriculares.map((uc) => (
                  <SelectItem key={uc.pk} value={uc.pk.toString()}>
                    {uc.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Dia da Semana - Obrigatório */}
            <Select
              value={filters.diaSemana}
              onValueChange={(v) => setFilters({ ...filters, diaSemana: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Dia da Semana" />
              </SelectTrigger>
              <SelectContent>
                {DIAS_SEMANA.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      <div className="space-y-6">
        {allFiltersFilled ? (
          isLoadingSchedule ? (
            <Card className="p-8 text-center text-muted-foreground">
              <p>Carregando horários...</p>
            </Card>
          ) : aulas.length > 0 ? (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="h-6 w-6 text-primary" />
                <h3 className="text-2xl font-semibold">
                  {diaSelecionado?.label}
                </h3>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {aulas.map((aula, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-6">
                      <div className="text-lg font-medium min-w-[130px] text-primary">
                        {aula.hora_inicio} - {aula.hora_termino}
                      </div>

                      <div>
                        <div className="font-semibold text-lg">
                          {aula.disciplina}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {aula.docente_nome} • Sala {aula.sala} 
                        
                        </div>
                         <div className="text-sm text-muted-foreground">
                          • Sala  <span className="text-green-400">{aula.sala || 'N/A'}</span>
                        
                        </div>
                         <div className="text-sm text-muted-foreground">
                         • Modalidade:  <span className="text-green-400">{aula.modalidade}</span>
                        </div>
                      </div>
                    </div>

                    {getTipoBadge(aula.tipo_aula)}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-muted-foreground">
              <p>Nenhuma aula encontrada para {diaSelecionado?.label} com os filtros selecionados.</p>
            </Card>
          )
        ) : (
          <Card className="p-8 text-center text-muted-foreground">
            <p>Preencha todos os filtros para visualizar o horário do dia selecionado.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HorariosSemanais;