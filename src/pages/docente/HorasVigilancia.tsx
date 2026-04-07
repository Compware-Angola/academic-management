import { useId, useState } from "react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { PeriodoSelect } from "@/components/common/global-selects/PeriodoSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { parseFilter } from "@/util/parse-filter";
import { useQueryMarcacaoProvaPrazo } from "@/hooks/prazos/use-query-marcacao-prazo";
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryStatusAgendamento } from "@/hooks/assiduidade/use-fetch-assiduidade-status-agendamentos";
import { useQueryHorariosVigilante } from "@/hooks/docentes/use-query-horarios-vigilantes";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatarData } from "@/util/date-formate";

const HorasVigilancia = () => {
  const [filters, setFilters] = useState({
    anoLectivo: "23",
    estado: "",
    prazoId: "",
    periodoId: "",
    semestreId: "",
  });
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(25);
  const defaultSelectEstadoId = useId();

  const defaultSelectEstadoItem = [
    {
      label: "Todos",
      value: "all",
      key: defaultSelectEstadoId,
    },
  ];

  const { user: userData } = useAuth();
  const userId = userData?.user.pk_utilizador;

  const { data: prazos = [], isLoading: isLoadingPrazos } =
    useQueryMarcacaoProvaPrazo({
      anoLectivo: parseFilter(filters.anoLectivo),
      semestre: parseFilter(filters.semestreId),
    });
  const {
    data: statusAgendamentos = [],
    isLoading: isLoadingStatusAgendamento,
  } = useQueryStatusAgendamento({ enabled: true });

  const {
    data: horariosVigilantesReponse,
    isLoading: isLoadingHorarioVigilantes,
  } = useQueryHorariosVigilante({
    prazoId: parseFilter(filters.prazoId),
    vigilanteId: userId,
    estado: parseFilter(filters.estado),
    periodoId: parseFilter(filters.periodoId),
    limit,
    page,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendente":
        return (
          <Badge className="bg-yellow-300 text-yellow-800 hover:bg-yellow-100">
            Pendente
          </Badge>
        );
      case "Realizada":
        return (
          <Badge className="bg-green-300 text-green-800 hover:bg-green-100">
            Realizada
          </Badge>
        );

      case "Falta":
        return (
          <Badge className="bg-red-300 text-red-800 hover:bg-red-100">
            Falta
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getTableBackgroundColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-600!";
      case "Realizada":
        return "bg-emerald-700! dark:bg-emerald-700!";
      case "Falta":
        return " bg-destructive/70!";
      default:
        return "";
    }
  };
  const vigilancias = horariosVigilantesReponse?.data ?? [];
  const total = horariosVigilantesReponse?.total;
  const totalPages = horariosVigilantesReponse?.totalPages;

  return (
    <div className="min-h-screen bg-background p-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/docente">Docente</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Horas de Vigilância</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-3xl font-bold mb-6 text-foreground">
        Horas de Vigilância
      </h1>

      {/* <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-primary">
              Total de Horas no Mês
            </h3>
            <p className="text-sm text-muted-foreground">
              Vigilância de exames e provas
            </p>
          </div>
        </div>
        <div className="text-3xl font-bold text-primary">{12}h</div>
      </div> */}
      <Card>
        <CardHeader></CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 mb-4">
            <AcademicYearSelect
              onChangeValue={(v) => setFilters({ ...filters, anoLectivo: v })}
              value={filters.anoLectivo}
            />
            <PeriodoSelect
              enabledDefaultSelectItem
              value={filters.periodoId}
              onChangeValue={(v) => setFilters({ ...filters, periodoId: v })}
            />
            <SemestreSelect
              value={filters.semestreId}
              onChangeValue={(v) => setFilters({ ...filters, semestreId: v })}
            />
            <FormSelect
              label="Tipo de Epoca"
              value={filters.prazoId}
              onChange={(v) => setFilters({ ...filters, prazoId: v })}
              options={prazos}
              loading={isLoadingPrazos}
              disabled={isLoadingPrazos}
              map={(u) => ({
                key: u.prazoid,
                label: u.designacao,
                value: u.prazoid,
              })}
            />
            <FormSelect
              label="Estado"
              value={filters.estado}
              defaultSelectItem={defaultSelectEstadoItem}
              onChange={(v) => setFilters({ ...filters, estado: v })}
              options={statusAgendamentos}
              loading={isLoadingStatusAgendamento}
              disabled={isLoadingStatusAgendamento}
              map={(u) => ({
                key: u.codigo,
                label: u.designacao,
                value: u.codigo,
              })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-card rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Docente</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Hora Início</TableHead>
              <TableHead>Hora Fim</TableHead>
              <TableHead>UC</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingHorarioVigilantes ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                </TableRow>
              ))
            ) : vigilancias.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma vigilância registada
                </TableCell>
              </TableRow>
            ) : (
              vigilancias.map((item, i) => (
                <TableRow
                  key={i}
                  className={getTableBackgroundColor(item.estado)}
                >
                  <TableCell>{item.docente}</TableCell>
                  <TableCell className="font-medium">
                    {formatarData(item.dataprova)}
                  </TableCell>
                  <TableCell>{item.horario}</TableCell>
                  <TableCell>{item.horaprova}</TableCell>
                  <TableCell>{item.horatermino}</TableCell>
                  <TableCell>{item.disciplina}</TableCell>
                  <TableCell>{item.sala}</TableCell>
                  <TableCell>{getStatusBadge(item.estado)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          A mostrar {vigilancias.length} de {total} registos
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
    </div>
  );
};

export default HorasVigilancia;
