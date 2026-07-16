import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, Scale, Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// MOCK: histórico de movimentações financeiras de um estudante.
// Este componente já recebe `codigoMatricula` (o estudante vem do perfil
// que o envolve), por isso não há pesquisa de estudante aqui — só filtros
// sobre os movimentos do próprio estudante.
// ---------------------------------------------------------------------------

type Movement = {
  codigo: string;
  referencia: string;
  data: string;
  tipo: "FATURA" | "RECIBO" | "NOTA_CREDITO" | "AJUSTE" | "MULTA";
  motivo: string;
  credito: number;
  debito: number;
  saldoOperacao: number;
  saldoGeral: number;
  estado: "Ativo" | "Anulado" | "Pendente";
  factura: string;
  utilizador: string;
  observacao: string;
};

const TIPO_STYLES: Record<Movement["tipo"], string> = {
  FATURA: "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  RECIBO: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  NOTA_CREDITO: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  AJUSTE: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  MULTA: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
};
const ESTADO_STYLES: Record<Movement["estado"], string> = {
  Ativo: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  Anulado: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  Pendente: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
};

function seededMovements(codigoMatricula: number): Movement[] {
  const seed = String(codigoMatricula).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const rand = (i: number, min: number, max: number) =>
    min + ((seed * (i + 7) * 9301 + 49297) % 233280) / 233280 * (max - min) | 0;
  const motivos = ["Propina Mensal", "Matrícula", "Emolumento", "Certidão de Notas", "Taxa de Exame", "Reposição de Aula"];
  const users = ["tesouraria1", "tesouraria2", "admin", "caixa.geral"];
  const tipos: Movement["tipo"][] = ["FATURA", "RECIBO", "FATURA", "NOTA_CREDITO", "FATURA", "RECIBO", "MULTA", "AJUSTE"];
  const estados: Movement["estado"][] = ["Ativo", "Ativo", "Ativo", "Pendente", "Ativo", "Anulado"];
  const rows: Movement[] = [];
  let saldoGeral = 0;
  for (let i = 0; i < 22; i++) {
    const tipo = tipos[i % tipos.length];
    const isCredit = tipo === "RECIBO" || tipo === "NOTA_CREDITO";
    const valor = rand(i, 25000, 320000);
    const debito = !isCredit ? valor : 0;
    const credito = isCredit ? valor : 0;
    saldoGeral += debito - credito;
    const mes = String((i % 12) + 1).padStart(2, "0");
    const dia = String((i * 3) % 27 + 1).padStart(2, "0");
    const ano = 2025 + (i % 2);
    rows.push({
      codigo: `MV${String(codigoMatricula).slice(-4)}${String(i + 1).padStart(3, "0")}`,
      referencia: `REF-${ano}${mes}-${String(rand(i, 1000, 9999))}`,
      data: `${ano}-${mes}-${dia}`,
      tipo,
      motivo: motivos[i % motivos.length],
      credito,
      debito,
      saldoOperacao: debito - credito,
      saldoGeral,
      estado: estados[i % estados.length],
      factura: tipo === "FATURA" ? `FT ${ano}/${String(i + 1).padStart(4, "0")}` : tipo === "RECIBO" ? `FT ${ano}/${String(Math.max(1, i)).padStart(4, "0")}` : "—",
      utilizador: users[i % users.length],
      observacao: i % 4 === 0 ? "Lançamento automático" : i % 5 === 0 ? "Ajuste manual autorizado" : "—",
    });
  }
  return rows;
}

function formatKz(value: number) {
  return `${value.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;
}

// Decide quais números de página mostrar, com "…" quando há muitas páginas.
// Ex: 1 2 3 4 5 | 1 2 3 … 9 10 | 1 … 4 5 6 … 10
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

// Cartão compacto com barra de cor à esquerda — mesmas dimensões dos
// cartões já usados em "Notas de Pagamento" / "Mensalidades".
function KpiCard({
  label,
  value,
  icon: Icon,
  accent = "default",
  description,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  accent?: "success" | "danger" | "info" | "warning" | "default";
  description?: string;
}) {
  const accentBar: Record<string, string> = {
    success: "border-l-success",
    danger: "border-l-destructive",
    info: "border-l-primary",
    warning: "border-l-warning",
    default: "border-l-muted-foreground/30",
  };
  const accentText: Record<string, string> = {
    success: "text-success",
    danger: "text-destructive",
    info: "text-primary",
    warning: "text-warning",
    default: "text-foreground",
  };

  return (
    <Card className={cn("border-l-4 min-w-0", accentBar[accent])}>
      <CardContent className="p-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground truncate">{label}</p>
          <p className={cn("text-2xl font-bold mt-1", accentText[accent])}>{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", accentText[accent])} />
      </CardContent>
    </Card>
  );
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

  const allRows = useMemo(() => seededMovements(codigoMatricula), [codigoMatricula]);

  const filtered = useMemo(() => {
    let r = allRows.filter(
      (m) => (tipo === "ALL" || m.tipo === tipo) && (estado === "ALL" || m.estado === estado),
    );
    r = [...r].sort((a, b) =>
      sortDesc ? b.data.localeCompare(a.data) : a.data.localeCompare(b.data),
    );
    return r;
  }, [allRows, tipo, estado, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const totals = useMemo(() => {
    const credito = filtered.reduce((s, r) => s + r.credito, 0);
    const debito = filtered.reduce((s, r) => s + r.debito, 0);
    return { credito, debito, saldo: debito - credito };
  }, [filtered]);

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

      {/* KPIs no formato compacto (borda colorida à esquerda) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0">
        <KpiCard
          label="Total Crédito"
          value={formatKz(totals.credito)}
          icon={TrendingUp}
          accent="success"
          description="Recibos e notas de crédito"
        />
        <KpiCard
          label="Total Débito"
          value={formatKz(totals.debito)}
          icon={TrendingDown}
          accent="danger"
          description="Facturas e multas emitidas"
        />
        <KpiCard
          label="Saldo"
          value={formatKz(totals.saldo)}
          icon={Scale}
          accent={totals.saldo >= 0 ? "warning" : "success"}
          description={totals.saldo >= 0 ? "Valor em aberto" : "Estudante em crédito"}
        />
        <KpiCard
          label="Movimentos"
          value={String(filtered.length)}
          icon={Receipt}
          accent="info"
          description="Registos no período filtrado"
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={tipo} onValueChange={(v) => { setTipo(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="FATURA">Fatura</SelectItem>
                <SelectItem value="RECIBO">Recibo</SelectItem>
                <SelectItem value="NOTA_CREDITO">Nota de Crédito</SelectItem>
                <SelectItem value="AJUSTE">Ajuste</SelectItem>
                <SelectItem value="MULTA">Multa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estado} onValueChange={(v) => { setEstado(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Estado" /></SelectTrigger>
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead className="text-right">Crédito</TableHead>
                  <TableHead className="text-right">Débito</TableHead>
                  <TableHead className="text-right">Saldo Operação</TableHead>
                  <TableHead className="text-right">Saldo Geral</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Factura</TableHead>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={13} className="h-24 text-center text-muted-foreground">
                      Nenhum movimento encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRows.map((r) => (
                    <TableRow key={r.codigo}>
                      <TableCell className="font-mono text-xs">{r.codigo}</TableCell>
                      <TableCell className="font-mono text-xs">{r.referencia}</TableCell>
                      <TableCell>{r.data}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${TIPO_STYLES[r.tipo]}`}>
                          {r.tipo.replace("_", " ")}
                        </Badge>
                      </TableCell>
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
                      <TableCell>
                        <Badge variant="outline" className={`border-0 ${ESTADO_STYLES[r.estado]}`}>
                          {r.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{r.factura}</TableCell>
                      <TableCell className="text-sm">{r.utilizador}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[220px] truncate">{r.observacao}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>

            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages} • {filtered.length} movimentos
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">Anterior</span>
              </Button>

              <div className="flex items-center gap-1 mx-1">
                {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      variant={p === currentPage ? "default" : "outline"}
                      size="sm"
                      className="w-9 px-0"
                      onClick={() => setPage(p as number)}
                    >
                      {p}
                    </Button>
                  ),
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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