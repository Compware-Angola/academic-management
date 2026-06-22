import {
    Wallet,
    Users,
    AlertTriangle,
    TrendingUp,
    TrendingDown,
    Percent,
    RefreshCcw,
    BarChart3,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { useListarPagamentoBolsaConciliacaoInsights } from "@/hooks/financas/bolsa/pagamento-bolsa";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
import { useState } from "react";
import { parseFilter } from "@/util/parse-filter";

type Props = {
    fmt: (value: number) => string;
};

function InsightCard({
    icon: Icon,
    title,
    text,
    tone,
}: {
    icon: any;
    title: string;
    text: string;
    tone?: "ok" | "warn" | "high";
}) {
    const cls =
        tone === "ok"
            ? "border-emerald-500/30 bg-emerald-500/5"
            : tone === "warn"
                ? "border-amber-500/30 bg-amber-500/5"
                : tone === "high"
                    ? "border-rose-500/30 bg-rose-500/5"
                    : "";

    return (
        <Card className={cls}>
            <CardContent className="p-4 flex gap-3">
                <div className="p-2 rounded-md bg-background border h-fit">
                    <Icon className="h-4 w-4" />
                </div>
                <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{text}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function StatCard({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

function safe(value: string | null | undefined, fallback = "—"): string {
    if (value === null || value === undefined || value.trim() === "" || value === "null" || value === "undefined") {
        return fallback;
    }
    return value;
}

function safeNum(value: number | null | undefined, fallback = 0): number {
    if (value === null || value === undefined || isNaN(value)) return fallback;
    return value;
}

export function InsightsTab({ fmt }: Props) {
    const [filters, setFilters] = useState({
        anoLectivo: "23",
        semestre: "all",
    });

    const { data, isLoading, refetch, isFetching } = useListarPagamentoBolsaConciliacaoInsights({
        anoLectivo: parseFilter(filters.anoLectivo),
        semestre: parseFilter(filters.semestre),
    });

    const insights = data;
    const crescimento = safeNum(insights?.crescimentoVsPeriodoAnterior?.valor);
    const totais = insights?.totais;

    return (
        <div className="space-y-6">
            <div className="flex justify-end gap-4">
                <Button onClick={() => refetch()}>
                    <RefreshCcw className={cn("h-4 w-4", isFetching && "animate-spin")} />
                    Atualizar
                </Button>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <AcademicYearSelect
                            onChangeValue={(v) => setFilters((f) => ({ ...f, anoLectivo: v }))}
                            value={filters.anoLectivo}
                            enableDefaultSelectItem
                        />
                        <SemestreSelect
                            onChangeValue={(v) => setFilters((f) => ({ ...f, semestre: v }))}
                            value={filters.semestre}
                            enableDefaultSelectItem
                        />
                    </div>
                </CardContent>
            </Card>

            <TabsContent value="insights" className="mt-4 space-y-6">

                {/* Totais */}
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 space-y-2">
                                    <div className="h-3 w-2/3 rounded bg-muted-foreground/20 animate-pulse" />
                                    <div className="h-6 w-1/2 rounded bg-muted-foreground/10 animate-pulse" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : totais ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        <StatCard
                            label="Total depositado"
                            value={fmt(safeNum(totais.totalDepositado))}
                        />
                        <StatCard
                            label="Total esperado"
                            value={fmt(safeNum(totais.totalEsperado))}
                        />
                        <StatCard
                            label="Diferença"
                            value={fmt(safeNum(totais.diferenca))}
                        />
                        <StatCard
                            label="Total bolseiros"
                            value={safeNum(totais.totalBolseiros).toLocaleString("pt-AO")}
                        />
                        <StatCard
                            label="Sem pagamento"
                            value={safeNum(totais.semPagamento).toLocaleString("pt-AO")}
                        />
                        <StatCard
                            label="Instituições"
                            value={safeNum(totais.totalInstituicoes).toLocaleString("pt-AO")}
                        />
                    </div>
                ) : null}

                {/* Insight cards */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Card key={i}>
                                <CardContent className="p-4 flex gap-3">
                                    <div className="p-2 rounded-md bg-muted border h-fit">
                                        <div className="h-4 w-4 rounded bg-muted-foreground/20 animate-pulse" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-1/3 rounded bg-muted-foreground/20 animate-pulse" />
                                        <div className="h-3 w-2/3 rounded bg-muted-foreground/10 animate-pulse" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : !insights ? (
                    <div className="text-center text-muted-foreground py-10 text-sm">
                        Nenhum dado encontrado para os filtros selecionados.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InsightCard
                            icon={Wallet}
                            title="Instituição com maior valor recebido"
                            text={
                                insights.instituicaoMaiorValor
                                    ? `${safe(insights.instituicaoMaiorValor.nome)} recebeu ${fmt(safeNum(insights.instituicaoMaiorValor.valor))}`
                                    : "Sem dados disponíveis para o período selecionado"
                            }
                        />

                        <InsightCard
                            icon={Users}
                            title="Instituição com maior número de bolseiros"
                            text={
                                insights.instituicaoMaisBolseiros
                                    ? `${safe(insights.instituicaoMaisBolseiros.nome)} com ${safeNum(insights.instituicaoMaisBolseiros.qtd)} bolseiros`
                                    : "Sem dados disponíveis para o período selecionado"
                            }
                        />

                        <InsightCard
                            icon={AlertTriangle}
                            title={safe(insights.divergenciasFinanceiras?.label, "Divergências financeiras")}
                            text={safe(insights.divergenciasFinanceiras?.descricao, "Sem dados disponíveis")}
                            tone={safeNum(insights.divergenciasFinanceiras?.valor) > 0 ? "warn" : "ok"}
                        />

                        <InsightCard
                            icon={crescimento >= 0 ? TrendingUp : TrendingDown}
                            title={safe(insights.crescimentoVsPeriodoAnterior?.label, "Crescimento vs período anterior")}
                            text={safe(insights.crescimentoVsPeriodoAnterior?.descricao, "Sem dados disponíveis")}
                            tone={crescimento >= 0 ? "ok" : "warn"}
                        />

                        <InsightCard
                            icon={BarChart3}
                            title={safe(insights.tendenciaCustos?.label, "Tendência dos custos")}
                            text={safe(insights.tendenciaCustos?.descricao, "Sem dados disponíveis")}
                        />

                        <InsightCard
                            icon={Percent}
                            title={safe(insights.saudeConciliacao?.label, "Saúde da conciliação")}
                            text={safe(insights.saudeConciliacao?.descricao, "Sem dados disponíveis")}
                            tone={
                                safeNum(insights.saudeConciliacao?.valor) >= 99
                                    ? "ok"
                                    : safeNum(insights.saudeConciliacao?.valor) >= 95
                                        ? "warn"
                                        : "high"
                            }
                        />
                    </div>
                )}
            </TabsContent>
        </div>
    );
}