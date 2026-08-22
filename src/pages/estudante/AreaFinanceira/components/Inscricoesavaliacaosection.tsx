import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  GraduationCap,
  Search,
  XCircle,
} from "lucide-react";

import { useQueryRegistrationForEvaluation } from "@/hooks/students/use-query-registration-for-evaluation";
import { cn } from "@/lib/utils";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { parseFilter } from "@/util/parse-filter";
import { InvoiceStatusBadge } from "@/components/common/Invoice-status-badge";
import { useQueryTipoAvaliacao } from "@/hooks/avaliacao/use-query-tipo-avaliacao";
import { FormSelect } from "@/components/common/FormSelect";
import { AnoCurricularSelect } from "@/components/common/global-selects/AnoCurricularSelect";
import { InvoiceStatusSelect } from "@/components/common/global-selects/InvoiceStatusSelect";
import { useStudentDetail } from "@/hooks/students/use-query-students";
import { GradeCurricularSelect } from "@/components/common/global-selects/GradeCurricularSelect";

type Props = {
  codigoMatricula: number;
  value?: string;
};

type Filters = {
  anoLectivo: string;
  semestre: string;
  tipoAvaliacao: string;
  estadoFactura: string;
  anoCurricular: string;
};

export function InscricoesAvaliacaoSection({
  codigoMatricula: matricula,
  value = "inscricoes-avaliacao",
}: Props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({
    anoLectivo: "",
    semestre: "",
    tipoAvaliacao: "",
    anoCurricular: "",
    estadoFactura: "",
  });

  const {
    data: response,
    isLoading,
    isError,
  } = useQueryRegistrationForEvaluation({
    codigoMatricula: matricula,
    page,
    limit,
    estadoFactura: parseFilter(filters.estadoFactura),
    codigoAnoLectivo: parseFilter(filters.anoLectivo),
    codigoSemestre: parseFilter(filters.semestre),
  });
  const { data: tipoAvaliacao = [], isLoading: isLoadingTipoAvaliacao } =
    useQueryTipoAvaliacao();
  const { data: student } = useStudentDetail(matricula);

  const inscricoes = response?.data ?? [];
  const total = response?.total ?? 0;
  const totalPages = response?.totalPages ?? 1;

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleFilterChange = (key: keyof Filters, v: string) => {
    setFilters((prev) => ({ ...prev, [key]: v }));
    setPage(1);
  };

  if (!matricula) {
    return <div>Matrícula inválida</div>;
  }

  const getEstadoFacturaMeta = (estado: string | number | undefined) => {
    const estadoStr = estado != null ? String(estado) : "";
    const normalized = estadoStr.toLowerCase();

    if (normalized === "pago" || normalized === "1") {
      return {
        label: estadoStr || "Pago",
        icon: CheckCircle2,
        className:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900",
      };
    }

    if (!estadoStr) {
      return {
        label: "—",
        icon: Clock,
        className: "bg-muted text-muted-foreground border-transparent",
      };
    }

    return {
      label: estadoStr,
      icon: XCircle,
      className:
        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900",
    };
  };

  const notaColor = (nota: unknown) => {
    const value = Number(nota);
    if (Number.isNaN(value)) return "text-muted-foreground";
    return value >= 10
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";
  };

  return (
    <TabsContent value={value} className="space-y-5">
      <div className="border-b border-border/60 bg-gradient-to-b from-muted/40 to-transparent px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Inscrições em Avaliações</h2>

            <p className="text-sm text-muted-foreground">
              Lista das inscrições em avaliações do estudante
            </p>
          </div>
        </div>
      </div>
      <div className=" grid grid-cols-3 gap-4">
        <AcademicYearSelect
          value={filters.anoLectivo}
          onChangeValue={(v) => handleFilterChange("anoLectivo", v)}
          enableDefaultSelectItem
        />

        <SemestreSelect
          value={filters.semestre}
          onChangeValue={(v) => handleFilterChange("semestre", v)}
          enableDefaultSelectItem
        />
        <AnoCurricularSelect
          curso={student?.curso_codigo?.toString()}
          onChangeValue={(v) => handleFilterChange("anoCurricular", v)}
          value={filters.anoCurricular}
        />

        <FormSelect
          label="Tipo de Avaliação"
          value={filters.tipoAvaliacao}
          disabled={isLoadingTipoAvaliacao}
          loading={isLoadingTipoAvaliacao}
          onChange={(v) => {
            setFilters({ ...filters, tipoAvaliacao: v });
            setPage(1);
          }}
          options={tipoAvaliacao}
          map={(u) => ({
            key: u.codigo,
            label: u.designacao,
            value: u.codigo,
          })}
        />
        <InvoiceStatusSelect
          value={filters.estadoFactura}
          onChangeValue={(v) => {
            setFilters({ ...filters, estadoFactura: v });
          }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <XCircle className="h-8 w-8 text-destructive/70" />
          <p className="text-sm font-medium text-destructive">
            Erro ao carregar as inscrições
          </p>
          <p className="text-sm text-muted-foreground">
            Tente novamente dentro de instantes.
          </p>
        </div>
      ) : inscricoes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center">
          <BookOpen className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium">
            Nenhuma inscrição em avaliação encontrada
          </p>
          <p className="text-sm text-muted-foreground">
            Ajuste os filtros ou tente outra pesquisa.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ano Lectivo
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Disciplina
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ano Curricular
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Avaliação
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Nota
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Factura
                  </TableHead>
                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Data
                  </TableHead>

                  <TableHead className="text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Estado
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscricoes.map((item) => {
                  return (
                    <TableRow
                      key={item.codigo_inscricao}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell className="font-medium">
                        {item.ano_lectivo ?? "—"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.disciplina ?? "—"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.classe ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.avaliacao ?? "—"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-center font-semibold tabular-nums",
                          notaColor(item.nota),
                        )}
                      >
                        {item.nota ?? "—"}
                      </TableCell>
                      <TableCell className="text-center font-mono text-sm text-muted-foreground">
                        {item.codigo_factura ?? "—"}
                      </TableCell>
                      <TableCell className="text-center text-sm text-muted-foreground">
                        {item.data_factura
                          ? new Date(item.data_factura).toLocaleDateString(
                              "pt-PT",
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <InvoiceStatusBadge status={item.estado_factura} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-1 sm:flex-row">
            <div className="order-2 text-sm text-muted-foreground sm:order-1">
              Mostrando{" "}
              <span className="font-medium text-foreground">
                {inscricoes.length}
              </span>{" "}
              de <span className="font-medium text-foreground">{total}</span>{" "}
              inscrições
            </div>

            <div className="order-1 flex items-center gap-6 sm:order-2">
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap text-muted-foreground">
                  Por página
                </span>
                <Select
                  value={String(limit)}
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handlePrevious}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[90px] text-center text-sm text-muted-foreground">
                  Página <span className="text-foreground">{page}</span> de{" "}
                  {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleNext}
                  disabled={page === totalPages || isLoading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </TabsContent>
  );
}
