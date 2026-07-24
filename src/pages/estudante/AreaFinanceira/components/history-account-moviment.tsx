// components/HistoryAccountMovimentSection.tsx

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetStudentMovements } from "@/hooks/financas/movimentos-students/query-movimentos-students";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentMovement } from "@/services/financas/movimentos-students/movimentos-students.service";

// TODO: confirmar os valores reais de `codigotipomovimento` com o backend
const TIPO_MOVIMENTO_MAP: Record<number, string> = {
  1: "FATURA",
  2: "RECIBO",
  3: "NOTA_CREDITO",
  4: "AJUSTE",
  5: "MULTA",
};

// TODO: confirmar os valores reais de `estado` com o backend
const ESTADO_MAP: Record<number, string> = {
  0: "Ativo",
  1: "Anulado",
  2: "Pendente",
};

type Movement = {
  codigo: number;
  referencia: number;
  data: string;
  tipo: string;
  motivo: string;
  credito: number;
  debito: number;
  saldoOperacao: number;
  saldoGeral: number;
  estado: string;
  factura: number;
  utilizador: string | null;
  observacao: string;
  valorExcedente: number;
};

const TIPO_STYLES: Record<string, string> = {
  FATURA: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  RECIBO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  NOTA_CREDITO: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  AJUSTE: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  MULTA: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  DEFAULT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

const ESTADO_STYLES: Record<string, string> = {
  Ativo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Anulado: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  Pendente: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

function formatKz(value: number) {
  return `${value.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  const delta = 1;
  const pages: (number | "...")[] = [];
  const start = Math.max(2, current - delta);
  const end = Math.min(total - 1, current + delta);

  pages.push(1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
}

const PAGE_SIZE = 10;

type Props = {
  codigoMatricula: number;
};

export function HistoryAccountMovimentSection({ codigoMatricula }: Props) {
  const [tipo, setTipo] = useState<string>("ALL");
  const [estado, setEstado] = useState<string>("ALL");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);

  // === API CALL ===
  const { data, isLoading, error } = useGetStudentMovements({
    matricula: codigoMatricula,
    page,
    limit: PAGE_SIZE,
  });

  const movements: Movement[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((m: StudentMovement) => ({
      codigo: m.codigo,
      referencia: m.referencia,
      data: new Date(m.data_movimento).toISOString().split("T")[0],
      tipo: TIPO_MOVIMENTO_MAP[m.codigotipomovimento] ?? `TIPO_${m.codigotipomovimento}`,
      motivo: m.codigomotivo || m.observacao || "—",
      credito: m.credito,
      debito: m.debito,
      saldoOperacao: m.saldo_operacao,
      saldoGeral: m.saldo_geral,
      estado: ESTADO_MAP[m.estado] ?? `Estado ${m.estado}`,
      factura: m.factura,
      utilizador: m.codigoutilizador,
      observacao: m.observacao,
      valorExcedente: m.valor_excedente,
    }));
  }, [data]);

  const filtered = useMemo(() => {
    let r = [...movements];

    if (tipo !== "ALL") {
      r = r.filter((m) => m.tipo === tipo);
    }
    if (estado !== "ALL") {
      r = r.filter((m) => m.estado === estado);
    }

    r.sort((a, b) =>
      sortDesc
        ? b.data.localeCompare(a.data)
        : a.data.localeCompare(b.data)
    );

    return r;
  }, [movements, tipo, estado, sortDesc]);

  const totalPages = data?.totalPages ?? 1;
  const currentPage = page;

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Erro ao carregar movimentações financeiras.
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Histórico de Movimentações
        </h2>
        <p className="text-muted-foreground mt-1">
          Todos os movimentos financeiros do estudante, em ordem cronológica
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            { /* Filter by type of movement 
            <Select value={tipo} onValueChange={(v) => { setTipo(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="FATURA">Fatura</SelectItem>
                <SelectItem value="RECIBO">Recibo</SelectItem>
                <SelectItem value="NOTA_CREDITO">Nota de Crédito</SelectItem>
                <SelectItem value="AJUSTE">Ajuste</SelectItem>
                <SelectItem value="MULTA">Multa</SelectItem>
              </SelectContent>
            </Select>
*/}
            <Select value={estado} onValueChange={(v) => { setEstado(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos estados</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Anulado">Anulado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Referência</TableHead>
                  <TableHead>
                    <button
                      onClick={() => setSortDesc((s) => !s)}
                      className="inline-flex items-center gap-1 hover:text-foreground"
                    >
                      Data <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </TableHead>
                  {/* TODO: Filter by type of movement 
                  <TableHead>Tipo</TableHead>
                  */}
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Crédito</TableHead>
                  <TableHead className="text-right">Débito</TableHead>
                  <TableHead className="text-right">Saldo Operação</TableHead>
                  <TableHead className="text-right">Saldo Geral</TableHead>
                  <TableHead className="text-right">Valor Excedente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 14 }).map((_, j) => (
                        <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="h-24 text-center text-muted-foreground">
                      Nenhum movimento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.codigo}>
                      <TableCell className="font-mono text-xs">{r.codigo}</TableCell>
                      <TableCell className="font-mono text-xs">{r.referencia}</TableCell>
                      <TableCell>{r.data}</TableCell>

                      {/* TODO: Filter by type of movement 
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${TIPO_STYLES[r.tipo] || TIPO_STYLES.DEFAULT}`}>
                          {r.tipo}
                        </Badge>
                      </TableCell>
                      */}
                      <TableCell>{r.motivo}</TableCell>
                      <TableCell className="text-right text-emerald-600 font-medium">
                        {r.credito ? formatKz(r.credito) : "—"}
                      </TableCell>
                      <TableCell className="text-right text-rose-600 font-medium">
                        {r.debito ? formatKz(r.debito) : "—"}
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${r.saldoOperacao >= 0 ? "text-rose-600" : "text-emerald-600"}`}>
                        {formatKz(r.saldoOperacao)}
                      </TableCell>
                      <TableCell className="text-right font-bold">{formatKz(r.saldoGeral)}</TableCell>
                      <TableCell className="text-right">
                        {r.valorExcedente ? formatKz(r.valorExcedente) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${ESTADO_STYLES[r.estado] || ""}`}>
                          {r.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.factura}</TableCell>
                      <TableCell className="text-sm">{r.utilizador || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">
                        {r.observacao}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} • {data?.total ?? 0} movimentos
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 mx-1">
                {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">…</span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === currentPage ? "default" : "outline"}
                      size="sm"
                      className="w-9 px-0"
                      onClick={() => setPage(p as number)}
                      disabled={isLoading}
                    >
                      {p}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || isLoading}
              >
                <span className="hidden sm:inline mr-1">Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}