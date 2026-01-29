import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { Home, Search, RefreshCw, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";

import { Skeleton } from "@/components/ui/skeleton";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { parseFilter } from "@/util/parse-filter";
import { usePresenceAttendance } from "@/hooks/avaliacao/use-presence-attendance";
import { useQueryAssessmentAttendanceParameters } from "@/hooks/avaliacao/use-query-assessment-attendance-parameters";
import { useQueryMesTemp } from "@/hooks/avaliacao/use-query-mes-temp";

type Filters = {
  anoLetivo: string;
  horarioId: string;
  periodo: string;
  semestre: string;
  anoCurricular: string;
  tiposAvaliacao: string;
  curso: string;
  unidadeCurricular: string;
  situacaoFinanceira: string;
};
export default function PresenceList() {
  const [formData, setFormData] = useState<Filters>({
    anoLetivo: "",
    horarioId: "",
    tiposAvaliacao: "",
    periodo: "",
    semestre: "",
    curso: "",
    anoCurricular: "",
    unidadeCurricular: "",
    situacaoFinanceira: "2",
  });
  const { data: parameterResponse, isLoading: isLoadingParameters } =
    useQueryAssessmentAttendanceParameters();

  const [shouldFetch, setShouldFetch] = useState(false);
  const situationOption = [
    {
      key: 1,
      label: "Situação Regularizada de Pagamento",
    },
    {
      key: 2,
      label: "Situação Irregular (Pagamento Pendente)",
    },
  ];

  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();

  const {
    data: presenceAttendanceList = [],
    isLoading: loadingPresenceAttendanceList,
    error,
  } = usePresenceAttendance(
    {
      anoLectivo: parseFilter(formData.anoLetivo),
      horarioPk: parseFilter(formData.horarioId),
      situacao_financeira: parseFilter(formData.situacaoFinanceira),
      tipo_avaliacao: 1,
    },
    shouldFetch,
  );

  useEffect(() => {
    setShouldFetch(false);
  }, [formData]);
  const getBolseiroBadge = (situacao: string) => {
    switch (situacao) {
      case "0":
        return (
          <Badge variant="default" className="bg-green-600">
            Nao
          </Badge>
        );
      case "1":
        return <Badge variant="destructive">Sim</Badge>;

      default:
        return <Badge variant="outline">n/a</Badge>;
    }
  };
  const handleSearch = () => {
    if (!isValidFilters(formData)) {
      toast({
        title: "Campos obrigatórios",

        variant: "destructive",
      });
      return;
    }

    setShouldFetch(true);
  };

  const { data: unidadesCurriculares = [], isLoading: isLoadingUC } =
    useQueryDisciplinaWithFilter({
      curso: formData.curso,
      semestre: formData.semestre,
      classe: formData.anoCurricular,
    });
  const canLoadUcs = !!formData.curso && !!formData.semestre;

  const { data: scheduleResponse, isLoading: loadingSchedule } =
    useQuerySchedulesByUc({
      anoLectivo: parseInt(formData.anoLetivo),
      semestre: parseInt(formData.semestre),
      periodo: parseInt(formData.periodo),
      curso: parseInt(formData.curso),
      unidadeCurricular: parseInt(formData.unidadeCurricular),
      page: 1,
      limit: 100,
    });
  const schedules = scheduleResponse?.data || [];
  const parameters = parameterResponse?.[0];
  console.log(parameterResponse);
  const { data: mesTemp = [] } = useQueryMesTemp({
    id: parseFilter(parameters?.observacao),
  });

  const mesDescricao = mesTemp[0]?.designacao;

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Avaliações</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Lista de Presença</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Lista de Presença</h1>
      <p className="text-muted-foreground">
        Gestão de presenças em avaliações académicas.
      </p>
      <h2 className="text-base font-bold text-primary">
        {`Mês de referência: ${mesDescricao == undefined ? "*" : mesDescricao}`}{" "}
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Pesquisa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <FormSelect
              disabled={loadingYear}
              loading={loadingYear}
              label="Ano Letivo"
              value={formData.anoLetivo}
              onChange={(v) =>
                setFormData({ ...formData, anoLetivo: v, horarioId: "" })
              }
              options={academicYear}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
            <SemestreSelect
              onChangeValue={(v) => setFormData({ ...formData, semestre: v })}
              value={formData.semestre}
            />
            <PeriodoSelect
              onChangeValue={(v) => setFormData({ ...formData, periodo: v })}
              value={formData.periodo}
            />
            <CourseSelect
              onChangeValue={(v) => setFormData({ ...formData, curso: v })}
              value={formData.curso}
            />
            <AnoCurricularSelect
              curso={formData.curso}
              onChangeValue={(v) =>
                setFormData({ ...formData, anoCurricular: v })
              }
              value={formData.anoCurricular}
            />
            {/* Unidade Curricular */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade Curricular</label>
              <Select
                value={formData.unidadeCurricular}
                onValueChange={(v) =>
                  setFormData({ ...formData, unidadeCurricular: v })
                }
                disabled={!canLoadUcs}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !formData.curso
                        ? "Selecione curso"
                        : !formData.semestre
                          ? "Selecione semestre"
                          : isLoadingUC
                            ? "Carregando UCs..."
                            : "Selecionar UC"
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
            </div>
            <FormSelect
              label="Horario"
              value={formData.horarioId}
              disabled={loadingSchedule}
              onChange={(v) => setFormData({ ...formData, horarioId: v })}
              options={schedules}
              map={(u) => ({
                key: u.codigo,
                value: u.codigo,
                label: `${u.designacao}`,
              })}
              loading={loadingSchedule}
            />
            <FormSelect
              label="Situação Financeira"
              value={formData.situacaoFinanceira}
              disabled={loadingSchedule}
              onChange={(v) =>
                setFormData({ ...formData, situacaoFinanceira: v })
              }
              options={situationOption}
              map={(u) => ({
                key: u.key,
                value: u.key,
                label: `${u.label}`,
              })}
            />

            {/* Botão Listar na mesma linha */}
            <div className="flex items-end">
              <Button
                onClick={handleSearch}
                disabled={loadingPresenceAttendanceList}
              >
                {loadingPresenceAttendanceList ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Pesquisar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {/* <ListaEstudantesPDF estudantes={estudantes2} titulo={titulo} /> */}
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Resultados</h3>

        {loadingPresenceAttendanceList ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : presenceAttendanceList.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              Nenhum registo encontrado
            </p>
            <p className="text-sm text-muted-foreground">
              Utilize os filtros acima para pesquisar
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numero da Matricula</TableHead>
                    <TableHead>Nome Completo</TableHead>
                    <TableHead>Bolseiro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {presenceAttendanceList.map((estudante) => (
                    <TableRow key={estudante.numero_matricula}>
                      <TableCell className="font-mono">
                        {estudante.numero_matricula}
                      </TableCell>
                      <TableCell>{estudante.nome}</TableCell>
                      <TableCell>
                        {getBolseiroBadge(estudante.eh_bolseiro.toString())}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export function isValidFilters(filters?: Filters): filters is Filters {
  return !!(filters && filters.anoLetivo && filters.horarioId);
}
