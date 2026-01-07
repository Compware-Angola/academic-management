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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  Download,
  RefreshCw,
  Printer,
  Check,
  X,
  Save,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { FormSelect } from "@/components/common/FormSelect";
import { useCursos } from "@/hooks/use-cursos";
import { useQueryDisciplinaWithFilter } from "@/hooks/discplina/use-query-disciplina-with-filter";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { useQueryTipoProva } from "@/hooks/avaliacao/use-query-tipo-prova";
import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelectIsaac } from "@/components/common/FormSelectIsaac";
import { useQuerySchedulesByUc } from "@/hooks/horario/use-query-schedules-by-uc";
import { Estudante, ListaEstudantesPDF } from "@/components/list-student";
import { usePresenceAttendance } from "@/hooks/avaliacao/use-presence-attendance";
import { useScheduleQuery } from "@/hooks/horario/use=query-fetch-schedule";
import { Skeleton } from "@/components/ui/skeleton";

type Filters = {
  anoLetivo: string;
  horarioId: string;
  tiposAvaliacao: string;
};
export default function PresenceList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [formData, setFormData] = useState<Filters>({
    anoLetivo: "",
    horarioId: "",
    tiposAvaliacao: "",
  });

  const [shouldFetch, setShouldFetch] = useState(false);

  const [situacaoFinanceira, setSituacaoFinanceira] = useState(2);
  const { data: tiposAvaliacao = [], isLoading: loadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: academicYear = [], isLoading: loadingYear } =
    useQueryAnoAcademico();
  const { data: schedules, isLoading: loadingSchedules } = useScheduleQuery({
    anoLectivo: Number(formData.anoLetivo),
  });
  const {
    data: presenceAttendanceList = [],
    isLoading: loadingPresenceAttendanceList,
    error,
  } = usePresenceAttendance(
    {
      anoLectivo:
        formData.anoLetivo === "" ? undefined : Number(formData.anoLetivo),
      horarioPk:
        formData.horarioId === "" ? undefined : Number(formData.horarioId),
      situacao_financeira: situacaoFinanceira,
      tipo_avaliacao:
        formData.tiposAvaliacao === ""
          ? undefined
          : Number(formData.tiposAvaliacao),
    },
    shouldFetch
  );
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return presenceAttendanceList.slice(start, end);
  }, [presenceAttendanceList, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(presenceAttendanceList.length / itemsPerPage);

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
            <FormSelect
              label="Horario"
              value={formData.horarioId}
              disabled={loadingSchedules}
              onChange={(v) => setFormData({ ...formData, horarioId: v })}
              options={schedules?.data}
              map={(u) => ({
                key: u.codigo,
                value: u.codigo,
                label: `${u.designacao}`,
              })}
              loading={loadingSchedules}
            />
            <FormSelect
              label="Tipo de Avaliação"
              value={formData.tiposAvaliacao}
              disabled={loadingTipoAvaliacao}
              onChange={(v) =>
                setFormData({
                  ...formData,
                  tiposAvaliacao: v,
                })
              }
              options={tiposAvaliacao}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
              loading={loadingTipoAvaliacao}
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
