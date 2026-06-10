import { useMemo, useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
    ArrowUpDown, Building, Download, FileText, Filter, Search,
    TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Users, Wallet,
    PieChart as PieIcon, BarChart3, Percent, Sparkles, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { BolsaSelect } from "@/components/common/global-selects/BolsaSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { useListarPagamentoBolsa } from "@/hooks/financas/bolsa/use-query-listar-pagamento-bolsa";
import { PagamentosBolsasTable } from "./PagamentosBolsasTable";

// ---------- MOCK DATA ----------
interface Estudante {
    id: string;
    nome: string;
    curso: string;
    valorBolsa: number;
}
interface Pagamento {
    data: string;
    referencia: string;
    valor: number;
}
interface RegistroInstituicao {
    id: string;
    instituicao: string;
    anoLetivo: string;
    semestre: string;
    numBolseiros: number;
    valorDepositado: number;
    valorCalculado: number;
    estudantes: Estudante[];
    historico: Pagamento[];
}

const ANOS = ["2023/2024", "2024/2025", "2025/2026"];
const SEMESTRES = ["1º Semestre", "2º Semestre"];

const INSTITUICOES_BASE = [
    "Universidade Agostinho Neto",
    "Universidade Católica de Angola",
    "Universidade Lusíada de Angola",
    "Instituto Superior Politécnico de Luanda",
    "Universidade Metodista de Angola",
    "Universidade Independente de Angola",
    "Universidade Privada de Angola",
    "Universidade Jean Piaget",
    "Universidade Mandume Ya Ndemufayo",
    "Universidade Óscar Ribas",
    "Instituto Superior de Ciências Sociais",
    "Universidade Técnica de Angola",
];

function gerarEstudantes(n: number, valorMedio: number): Estudante[] {
    const cursos = ["Engenharia Informática", "Direito", "Economia", "Medicina", "Arquitetura", "Gestão"];
    return Array.from({ length: n }, (_, i) => ({
        id: `EST${1000 + i}`,
        nome: `Estudante ${i + 1}`,
        curso: cursos[i % cursos.length],
        valorBolsa: Math.round(valorMedio * (0.85 + Math.random() * 0.3)),
    }));
}

function gerarHistorico(total: number): Pagamento[] {
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];
    return meses.map((m, i) => ({
        data: `${m}/2025`,
        referencia: `PAG-2025-${String(i + 1).padStart(4, "0")}`,
        valor: Math.round(total / 6),
    }));
}

const mockDados: RegistroInstituicao[] = INSTITUICOES_BASE.flatMap((nome, idx) =>
    ANOS.flatMap((ano) =>
        SEMESTRES.map((sem, sIdx) => {
            const n = 20 + ((idx * 7) % 60);
            const valorMedio = 45000 + (idx % 4) * 8000;
            const calculado = n * valorMedio;
            const deltaPct = ((idx + sIdx) % 5) - 2; // -2..+2
            const depositado = Math.round(calculado * (1 + deltaPct * 0.04));
            const estudantes = gerarEstudantes(Math.min(n, 8), valorMedio);
            return {
                id: `${idx}-${ano}-${sIdx}`,
                instituicao: nome,
                anoLetivo: ano,
                semestre: sem,
                numBolseiros: n,
                valorDepositado: depositado,
                valorCalculado: calculado,
                estudantes,
                historico: gerarHistorico(depositado),
            };
        })
    )
);

// ---------- HELPERS ----------
const fmt = (v: number) =>
    new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA", maximumFractionDigits: 0 }).format(v);

function statusFromDiff(depositado: number, calculado: number) {
    if (calculado === 0) return { label: "Sem dados", color: "secondary" as const, level: "n/a" };
    const pct = Math.abs((depositado - calculado) / calculado) * 100;
    if (pct < 1) return { label: "Conciliado", color: "default" as const, level: "ok", className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20" };
    if (pct < 5) return { label: "Divergência leve", color: "default" as const, level: "warn", className: "bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/20" };
    return { label: "Divergência significativa", color: "default" as const, level: "high", className: "bg-rose-500/15 text-rose-700 border-rose-500/30 hover:bg-rose-500/20" };
}

const COLORS = ["hsl(221 83% 53%)", "hsl(160 84% 39%)", "hsl(45 93% 47%)", "hsl(0 84% 60%)", "hsl(280 65% 60%)", "hsl(190 75% 45%)", "hsl(25 95% 53%)", "hsl(330 70% 55%)", "hsl(140 60% 45%)", "hsl(210 50% 40%)"];

type SortKey = "instituicao" | "anoLetivo" | "numBolseiros" | "valorDepositado" | "valorCalculado" | "diferenca";

export default function RelPagamentosInstituicoes() {
    const [filters, setFilters] = useState({
        anoLectivo: "all",
        semestre: "all",
        codigoBolsa: "all",
        codigoInstituicao: "all",
        page: 1,
        limit: 10,
    })
    const [tab, setTab] = useState("tabela");
    const [anoFiltro, setAnoFiltro] = useState<string>("todos");
    const [semestreFiltro, setSemestreFiltro] = useState<string>("todos");
    const [instFiltro, setInstFiltro] = useState<string>("todos");
    const [busca, setBusca] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("instituicao");
    const [sortAsc, setSortAsc] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [apenasDivergencias, setApenasDivergencias] = useState(false);
    const [detalhe, setDetalhe] = useState<RegistroInstituicao | null>(null);
    const [evolucaoModo, setEvolucaoModo] = useState<"mes" | "semestre" | "ano">("mes");
    const handleClearFilters = () => {
        setFilters({
            anoLectivo: "all",
            semestre: "all",
            codigoBolsa: "all",
            codigoInstituicao: "all",
            page: 1,
            limit: 10,
        })
    }


    const filtrados = useMemo(() => {
        return mockDados.filter((r) => {
            if (anoFiltro !== "todos" && r.anoLetivo !== anoFiltro) return false;
            if (semestreFiltro !== "todos" && r.semestre !== semestreFiltro) return false;
            if (instFiltro !== "todos" && r.instituicao !== instFiltro) return false;
            if (busca && !r.instituicao.toLowerCase().includes(busca.toLowerCase())) return false;
            return true;
        });
    }, [anoFiltro, semestreFiltro, instFiltro, busca]);
    const handleSetPage = (page: number) => {
        setFilters((f) => ({ ...f, page }));
    }

    const ordenados = useMemo(() => {
        const arr = [...filtrados];
        arr.sort((a, b) => {
            let av: any, bv: any;
            if (sortKey === "diferenca") {
                av = a.valorDepositado - a.valorCalculado;
                bv = b.valorDepositado - b.valorCalculado;
            } else {
                av = (a as any)[sortKey];
                bv = (b as any)[sortKey];
            }
            if (typeof av === "string") return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
            return sortAsc ? av - bv : bv - av;
        });
        return arr;
    }, [filtrados, sortKey, sortAsc]);

    const totalPages = Math.max(1, Math.ceil(ordenados.length / pageSize));
    const pagina = ordenados.slice((page - 1) * pageSize, page * pageSize);

    // ---------- KPIs ----------
    const kpis = useMemo(() => {
        const totalPago = filtrados.reduce((s, r) => s + r.valorDepositado, 0);
        const totalCalc = filtrados.reduce((s, r) => s + r.valorCalculado, 0);
        const totalBolseiros = filtrados.reduce((s, r) => s + r.numBolseiros, 0);
        const instituicoes = new Set(filtrados.map((r) => r.instituicao)).size;
        const conciliacao = totalCalc === 0 ? 0 : Math.max(0, 100 - Math.abs((totalPago - totalCalc) / totalCalc) * 100);
        return {
            totalPago,
            totalCalc,
            diferenca: totalPago - totalCalc,
            instituicoes,
            totalBolseiros,
            mediaPorBolseiro: totalBolseiros ? totalPago / totalBolseiros : 0,
            mediaPorInst: instituicoes ? totalPago / instituicoes : 0,
            conciliacao,
        };
    }, [filtrados]);

    // ---------- Agregados ----------
    const porInstituicao = useMemo(() => {
        const map = new Map<string, { instituicao: string; depositado: number; calculado: number; bolseiros: number }>();
        filtrados.forEach((r) => {
            const cur = map.get(r.instituicao) ?? { instituicao: r.instituicao, depositado: 0, calculado: 0, bolseiros: 0 };
            cur.depositado += r.valorDepositado;
            cur.calculado += r.valorCalculado;
            cur.bolseiros += r.numBolseiros;
            map.set(r.instituicao, cur);
        });
        return Array.from(map.values());
    }, [filtrados]);

    const top10Pagos = useMemo(() =>
        [...porInstituicao].sort((a, b) => b.depositado - a.depositado).slice(0, 10), [porInstituicao]);
    const top10Bolseiros = useMemo(() =>
        [...porInstituicao].sort((a, b) => b.bolseiros - a.bolseiros).slice(0, 10), [porInstituicao]);

    const distribuicao = useMemo(() =>
        porInstituicao.map((p) => ({ name: p.instituicao, value: p.depositado })), [porInstituicao]);

    const evolucao = useMemo(() => {
        if (evolucaoModo === "mes") {
            const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            return meses.map((m, i) => ({
                periodo: m,
                depositado: Math.round(kpis.totalPago / 12 * (0.7 + Math.random() * 0.6)),
                calculado: Math.round(kpis.totalCalc / 12 * (0.7 + Math.random() * 0.6)),
            }));
        }
        if (evolucaoModo === "semestre") {
            return SEMESTRES.map((s) => {
                const sub = filtrados.filter((r) => r.semestre === s);
                return {
                    periodo: s,
                    depositado: sub.reduce((a, r) => a + r.valorDepositado, 0),
                    calculado: sub.reduce((a, r) => a + r.valorCalculado, 0),
                };
            });
        }
        return ANOS.map((a) => {
            const sub = filtrados.filter((r) => r.anoLetivo === a);
            return {
                periodo: a,
                depositado: sub.reduce((acc, r) => acc + r.valorDepositado, 0),
                calculado: sub.reduce((acc, r) => acc + r.valorCalculado, 0),
            };
        });
    }, [evolucaoModo, filtrados, kpis]);

    const conciliacao = useMemo(() => {
        return porInstituicao
            .map((p) => {
                const diff = p.depositado - p.calculado;
                const pct = p.calculado ? (diff / p.calculado) * 100 : 0;
                return { ...p, diferenca: diff, pctDivergencia: pct };
            })
            .filter((p) => (apenasDivergencias ? Math.abs(p.pctDivergencia) >= 1 : true))
            .sort((a, b) => Math.abs(b.pctDivergencia) - Math.abs(a.pctDivergencia));
    }, [porInstituicao, apenasDivergencias]);

    const insights = useMemo(() => {
        const maiorPago = [...porInstituicao].sort((a, b) => b.depositado - a.depositado)[0];
        const maisBolseiros = [...porInstituicao].sort((a, b) => b.bolseiros - a.bolseiros)[0];
        const divergentes = conciliacao.filter((c) => Math.abs(c.pctDivergencia) >= 5).length;
        const crescimento = (Math.random() * 20 - 5).toFixed(1);
        const tendencia = Number(crescimento) >= 0 ? "aumento" : "redução";
        return { maiorPago, maisBolseiros, divergentes, crescimento, tendencia };
    }, [porInstituicao, conciliacao]);

    function toggleSort(k: SortKey) {
        if (sortKey === k) setSortAsc(!sortAsc);
        else { setSortKey(k); setSortAsc(true); }
    }

    function exportCsv() {
        const header = ["Instituição", "Ano Letivo", "Semestre", "Nº Bolseiros", "Valor Depositado", "Valor Calculado", "Diferença", "Status"];
        const rows = ordenados.map((r) => {
            const s = statusFromDiff(r.valorDepositado, r.valorCalculado);
            return [r.instituicao, r.anoLetivo, r.semestre, r.numBolseiros, r.valorDepositado, r.valorCalculado, r.valorDepositado - r.valorCalculado, s.label];
        });
        const csv = [header, ...rows].map((l) => l.map((c) => `"${c}"`).join(";")).join("\n");
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `relatorio-pagamentos-instituicoes-${Date.now()}.csv`;
        a.click();
        toast.success("Exportado para Excel (CSV)");
    }

    function exportPdf() {
        window.print();
        toast.success("A preparar impressão / PDF");
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Relatório de Pagamentos às Instituições"
                subtitle="Acompanhamento e validação dos pagamentos aos bolseiros vs valores devidos"
                actions={
                    <>
                        <Button>Novo</Button>
                        <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Excel</Button>
                        <Button variant="outline" onClick={exportPdf}><FileText className="h-4 w-4 mr-2" />PDF</Button>
                    </>
                }
            />

            {/* KPIs */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCard icon={Wallet} title="Total Pago às Instituições" value={fmt(kpis.totalPago)} />
                <KpiCard icon={BarChart3} title="Total Calculado das Bolsas" value={fmt(kpis.totalCalc)} />
                <KpiCard
                    icon={kpis.diferenca >= 0 ? TrendingUp : TrendingDown}
                    title="Diferença Global"
                    value={fmt(kpis.diferenca)}
                    tone={Math.abs(kpis.diferenca) / Math.max(1, kpis.totalCalc) < 0.01 ? "ok" : "warn"}
                />
                <KpiCard icon={Percent} title="% Conciliação Financeira" value={`${kpis.conciliacao.toFixed(2)}%`} tone={kpis.conciliacao >= 99 ? "ok" : kpis.conciliacao >= 95 ? "warn" : "high"} />
                <KpiCard icon={Building} title="Total de Instituições" value={kpis.instituicoes} />
                <KpiCard icon={Users} title="Total de Bolseiros Ativos" value={kpis.totalBolseiros} />
                <KpiCard icon={Wallet} title="Média por Bolseiro" value={fmt(kpis.mediaPorBolseiro)} />
                <KpiCard icon={Building} title="Média por Instituição" value={fmt(kpis.mediaPorInst)} />
            </div> */}

            {/* Filtros */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <AcademicYearSelect onChangeValue={(v) => { setFilters((f) => ({ ...f, anoLectivo: v })); setPage(1); }} value={filters.anoLectivo} enableDefaultSelectItem />
                        <SemestreSelect onChangeValue={(v) => { setFilters((f) => ({ ...f, semestre: v })); setPage(1); }} value={filters.semestre} enableDefaultSelectItem />
                        <InstituicaoSelect onChangeValue={(v) => { setFilters((f) => ({ ...f, codigoInstituicao: v, codigoBolsa: "all" })); setPage(1); }} value={filters.codigoInstituicao} enableDefaultSelectItem />
                        <BolsaSelect onChangeValue={(v) => { setFilters((f) => ({ ...f, codigoBolsa: v })); setPage(1); }} value={filters.codigoBolsa} enableDefaultSelectItem codigoInstituicao={filters.codigoInstituicao} disabled={!filters.codigoInstituicao} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Button variant="outline" onClick={handleClearFilters}>Limpar Filtros</Button>

                    </div>
                </CardContent>
            </Card>

            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="tabela"><FileText className="h-4 w-4 mr-2" />Relatório em Tabela</TabsTrigger>
                    <TabsTrigger value="dashboard"><BarChart3 className="h-4 w-4 mr-2" />Dashboard Estatístico</TabsTrigger>
                    <TabsTrigger value="conciliacao"><CheckCircle2 className="h-4 w-4 mr-2" />Conciliação</TabsTrigger>
                    <TabsTrigger value="insights"><Sparkles className="h-4 w-4 mr-2" />Insights</TabsTrigger>
                </TabsList>

                {/* TABELA */}
                <TabsContent value="tabela" className="mt-4">
                    <PagamentosBolsasTable filters={filters} onSetPage={handleSetPage} />
                </TabsContent>

                {/* DASHBOARD */}
                <TabsContent value="dashboard" className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" />Comparativo por Instituição</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={porInstituicao.slice(0, 8)}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="instituicao" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={70} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip formatter={(v: number) => fmt(v)} />
                                        <Legend />
                                        <Bar dataKey="depositado" name="Depositado" fill="hsl(221 83% 53%)" />
                                        <Bar dataKey="calculado" name="Calculado" fill="hsl(160 84% 39%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" />Evolução dos Pagamentos</CardTitle>
                                <Select value={evolucaoModo} onValueChange={(v: any) => setEvolucaoModo(v)}>
                                    <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mes">Mensal</SelectItem>
                                        <SelectItem value="semestre">Semestral</SelectItem>
                                        <SelectItem value="ano">Anual</SelectItem>
                                    </SelectContent>
                                </Select>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={evolucao}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis dataKey="periodo" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip formatter={(v: number) => fmt(v)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="depositado" name="Depositado" stroke="hsl(221 83% 53%)" strokeWidth={2} />
                                        <Line type="monotone" dataKey="calculado" name="Calculado" stroke="hsl(160 84% 39%)" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" />Top 10 Instituições — Valor Recebido</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={340}>
                                    <BarChart data={top10Pagos} layout="vertical" margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis type="number" tick={{ fontSize: 11 }} />
                                        <YAxis type="category" dataKey="instituicao" tick={{ fontSize: 10 }} width={180} />
                                        <Tooltip formatter={(v: number) => fmt(v)} />
                                        <Bar dataKey="depositado" name="Depositado" fill="hsl(221 83% 53%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Users className="h-4 w-4" />Top 10 Instituições — Nº Bolseiros</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={340}>
                                    <BarChart data={top10Bolseiros} layout="vertical" margin={{ left: 100 }}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                        <XAxis type="number" tick={{ fontSize: 11 }} />
                                        <YAxis type="category" dataKey="instituicao" tick={{ fontSize: 10 }} width={180} />
                                        <Tooltip />
                                        <Bar dataKey="bolseiros" name="Bolseiros" fill="hsl(160 84% 39%)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-2">
                            <CardHeader><CardTitle className="text-base flex items-center gap-2"><PieIcon className="h-4 w-4" />Distribuição dos Pagamentos</CardTitle></CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={360}>
                                    <PieChart>
                                        <Pie data={distribuicao} dataKey="value" nameKey="name" innerRadius={80} outerRadius={140} paddingAngle={2}>
                                            {distribuicao.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(v: number) => fmt(v)} />
                                        <Legend wrapperStyle={{ fontSize: 11 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* CONCILIAÇÃO */}
                <TabsContent value="conciliacao" className="mt-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base">Auditoria de Conciliação Financeira</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">Compare valores depositados vs valores esperados por instituição</p>
                            </div>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <Checkbox checked={apenasDivergencias} onCheckedChange={(v) => setApenasDivergencias(!!v)} />
                                Apenas com divergências
                            </label>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Instituição</TableHead>
                                        <TableHead>Valor Depositado</TableHead>
                                        <TableHead>Valor Esperado</TableHead>
                                        <TableHead>Diferença</TableHead>
                                        <TableHead>% Divergência</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {conciliacao.map((c) => {
                                        const s = statusFromDiff(c.depositado, c.calculado);
                                        return (
                                            <TableRow key={c.instituicao}>
                                                <TableCell className="font-medium">{c.instituicao}</TableCell>
                                                <TableCell>{fmt(c.depositado)}</TableCell>
                                                <TableCell>{fmt(c.calculado)}</TableCell>
                                                <TableCell className={c.diferenca < 0 ? "text-rose-600" : c.diferenca > 0 ? "text-amber-600" : ""}>{fmt(c.diferenca)}</TableCell>
                                                <TableCell>{c.pctDivergencia.toFixed(2)}%</TableCell>
                                                <TableCell><Badge variant="outline" className={s.className}>{s.label}</Badge></TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* INSIGHTS */}
                <TabsContent value="insights" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InsightCard
                            icon={Wallet}
                            title="Instituição com maior valor recebido"
                            text={insights.maiorPago ? `${insights.maiorPago.instituicao} recebeu ${fmt(insights.maiorPago.depositado)}` : "Sem dados"}
                        />
                        <InsightCard
                            icon={Users}
                            title="Instituição com maior número de bolseiros"
                            text={insights.maisBolseiros ? `${insights.maisBolseiros.instituicao} com ${insights.maisBolseiros.bolseiros} bolseiros activos` : "Sem dados"}
                        />
                        <InsightCard
                            icon={AlertTriangle}
                            title="Instituições com divergências financeiras"
                            text={`${insights.divergentes} instituições com divergência ≥ 5%`}
                            tone={insights.divergentes > 0 ? "warn" : "ok"}
                        />
                        <InsightCard
                            icon={Number(insights.crescimento) >= 0 ? TrendingUp : TrendingDown}
                            title="Crescimento vs período anterior"
                            text={`${insights.crescimento}% de ${insights.tendencia} nos pagamentos`}
                            tone={Number(insights.crescimento) >= 0 ? "ok" : "warn"}
                        />
                        <InsightCard
                            icon={TrendingUp}
                            title="Tendência dos custos das bolsas"
                            text={`Custo total das bolsas em ${insights.tendencia} estimado para o próximo período`}
                        />
                        <InsightCard
                            icon={Percent}
                            title="Saúde da conciliação"
                            text={`${kpis.conciliacao.toFixed(2)}% das verbas conciliadas com as bolsas calculadas`}
                            tone={kpis.conciliacao >= 99 ? "ok" : kpis.conciliacao >= 95 ? "warn" : "high"}
                        />
                    </div>
                </TabsContent>
            </Tabs>

            {/* DRILL DOWN */}
            <Dialog open={!!detalhe} onOpenChange={(o) => !o && setDetalhe(null)}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    {detalhe && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2"><Building className="h-5 w-5" />{detalhe.instituicao}</DialogTitle>
                                <DialogDescription>{detalhe.anoLetivo} · {detalhe.semestre}</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                                <MiniStat label="Bolseiros" value={String(detalhe.numBolseiros)} />
                                <MiniStat label="Depositado" value={fmt(detalhe.valorDepositado)} />
                                <MiniStat label="Calculado" value={fmt(detalhe.valorCalculado)} />
                                <MiniStat label="Diferença" value={fmt(detalhe.valorDepositado - detalhe.valorCalculado)} tone={detalhe.valorDepositado - detalhe.valorCalculado === 0 ? "ok" : "warn"} />
                            </div>

                            <div className="mt-4">
                                <h4 className="text-sm font-semibold mb-2">Estudantes Bolseiros (amostra)</h4>
                                <Table>
                                    <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Nome</TableHead><TableHead>Curso</TableHead><TableHead>Valor da Bolsa</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {detalhe.estudantes.map((e) => (
                                            <TableRow key={e.id}>
                                                <TableCell>{e.id}</TableCell>
                                                <TableCell>{e.nome}</TableCell>
                                                <TableCell>{e.curso}</TableCell>
                                                <TableCell>{fmt(e.valorBolsa)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <p className="text-sm text-muted-foreground mt-2">Soma total: <span className="font-medium text-foreground">{fmt(detalhe.estudantes.reduce((a, e) => a + e.valorBolsa, 0))}</span></p>
                            </div>

                            <div className="mt-4">
                                <h4 className="text-sm font-semibold mb-2">Histórico de Pagamentos</h4>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Referência</TableHead><TableHead>Valor</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {detalhe.historico.map((p) => (
                                            <TableRow key={p.referencia}>
                                                <TableCell>{p.data}</TableCell>
                                                <TableCell>{p.referencia}</TableCell>
                                                <TableCell>{fmt(p.valor)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}



// function KpiCard({ icon: Icon, title, value, tone }: { icon: any; title: string; value: string | number; tone?: "ok" | "warn" | "high" }) {
//     const toneCls =
//         tone === "ok" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : tone === "high" ? "text-rose-600" : "text-foreground";
//     return (
//         <Card>
//             <CardContent className="p-4">
//                 <div className="flex items-center justify-between mb-2">
//                     <p className="text-xs text-muted-foreground">{title}</p>
//                     <Icon className="h-4 w-4 text-muted-foreground" />
//                 </div>
//                 <p className={`text-xl font-bold ${toneCls}`}>{value}</p>
//             </CardContent>
//         </Card>
//     );
// }

function InsightCard({ icon: Icon, title, text, tone }: { icon: any; title: string; text: string; tone?: "ok" | "warn" | "high" }) {
    const cls =
        tone === "ok" ? "border-emerald-500/30 bg-emerald-500/5" :
            tone === "warn" ? "border-amber-500/30 bg-amber-500/5" :
                tone === "high" ? "border-rose-500/30 bg-rose-500/5" : "";
    return (
        <Card className={cls}>
            <CardContent className="p-4 flex gap-3">
                <div className="p-2 rounded-md bg-background border h-fit"><Icon className="h-4 w-4" /></div>
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{text}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
    const cls = tone === "ok" ? "text-emerald-600" : tone === "warn" ? "text-amber-600" : "";
    return (
        <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className={`text-base font-semibold mt-1 ${cls}`}>{value}</p>
        </div>
    );
}