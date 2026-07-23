import { useState } from "react";
import {
    AlertCircle,
    GraduationCap,
    Wrench,
    Eye,
    CheckCircle2,
    Search,
    Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle, CardDescription, Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { useGetDebtsInformation } from "@/hooks/financas/dividas/use-query-fetch-dividas";
import { DebtMensalidade, DebtOutroServico } from "@/services/financas/dividas/get-deividas.service";
import { parseFilter } from "@/util/parse-filter";
import Lottie from "lottie-react";
import Notallowed from "@/assets/Notallowed.json";
import { useStudentDetail } from "@/hooks/students/use-query-students";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    codigoMatricula: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number) =>
    `${value.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;

// ─── Main Component ───────────────────────────────────────────────────────────

export function DividasSection({ codigoMatricula }: Props) {
    const [codigoAnoLectivo, setCodigoAnoLectivo] = useState<string>('all');
    const [searchParams, setSearchParams] = useState<{ matricula: string; anoLectivo?: number } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMensalidade, setSelectedMensalidade] = useState<DebtMensalidade | null>(null);
    const [selectedOutroServico, setSelectedOutroServico] = useState<DebtOutroServico | null>(null);

    const { data: student } = useStudentDetail(codigoMatricula);

    const { data: debtData, isLoading } = useGetDebtsInformation(
        searchParams?.matricula ?? "",
        searchParams?.anoLectivo,
    );

    const hasDebts = debtData && debtData.totalDivida > 0;
    const searched = searchParams !== null;

    const handleSearch = () => {
        setSearchParams({
            matricula: String(codigoMatricula),
            anoLectivo: parseFilter(codigoAnoLectivo),
        });
    };

    const openMensalidadeModal = (m: DebtMensalidade) => {
        setSelectedMensalidade(m);
        setSelectedOutroServico(null);
        setIsModalOpen(true);
    };

    const openOutroServicoModal = (s: DebtOutroServico) => {
        setSelectedOutroServico(s);
        setSelectedMensalidade(null);
        setIsModalOpen(true);
    };

    // Se o estudante nao for de Licenciatura a pagina de negociacao de divida nao aparece
    // Se o estudante nao for de Licenciatura a pagina de negociacao de divida nao aparece
    const isLicenciatura = student?.sigla_grau === "LIC";

    if (!isLicenciatura) {
        const grauLabels: Record<string, string> = {
            MST: "Mestrado",
            DTR: "Doutoramento",
        };
        const grauAtual = student?.sigla_grau
            ? grauLabels[student.sigla_grau] ?? student.sigla_grau
            : null;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Negociação de Dívidas em Aberto</h1>
                    <p className="text-muted-foreground">
                        Informe seus dados para consultar as dívidas pendentes
                    </p>
                </div>

                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                        <div className="rounded-full bg-muted p-4">
                            <GraduationCap className="h-8 w-8 text-muted-foreground" />
                        </div>

                        <div className="space-y-1.5 max-w-sm">
                            <p className="text-base font-semibold text-foreground">
                                Negociação indisponível para este curso
                            </p>
                            <p className="text-sm text-muted-foreground">
                                A negociação de dívidas está disponível apenas para estudantes de{" "}
                                <span className="font-medium text-foreground">Licenciatura</span>.
                            </p>
                        </div>

                        {grauAtual && (
                            <Badge
                                variant="outline"
                                className="text-xs font-medium border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                            >
                                Grau atual: {grauAtual}
                            </Badge>
                        )}

                        <p className="text-xs text-muted-foreground max-w-sm">
                            Para questões relacionadas com dívidas deste grau académico, contacte a Secretaria.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Negociação de Dívidas em Aberto</h1>
                <p className="text-muted-foreground">
                    Informe seus dados para consultar as dívidas pendentes
                </p>
            </div>

            {/* Filtro + Botão Pesquisar */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                        <div className="w-full sm:w-64">
                            <AcademicYearSelect
                                enableDefaultSelectItem={true}
                                value={codigoAnoLectivo}
                                onChangeValue={(v) => setCodigoAnoLectivo(v)}
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={isLoading}
                            className="w-full sm:flex-1"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            {isLoading ? "A pesquisar..." : "Pesquisar"}
                        </Button>
                        <Button
                            onClick={() => {
                                setSearchParams(null);
                                setCodigoAnoLectivo('all');
                            }}
                            disabled={isLoading}
                            variant="outline"
                            className="w-full sm:flex-1"
                        >
                            <Undo2 className="h-4 w-4 mr-2" />
                            Limpar Pesquisa
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Estado inicial — ainda não pesquisou */}
            {!searched && !isLoading && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                        <Lottie
                            animationData={Notallowed}
                            loop={true}
                            style={{ width: 200, height: 200 }}
                        />

                        <p className="text-sm text-muted-foreground text-center">
                            Seleccione um ano lectivo ou deixe em branco para pesquisar todas as dívidas.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Loading */}
            {isLoading && (
                <Card>
                    <CardContent className="flex justify-center items-center py-12">
                        <p className="text-muted-foreground text-sm animate-pulse">
                            A carregar informações de dívidas...
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Sem Dívidas */}
            {!isLoading && searched && !hasDebts && (
                <Card className="border-success">
                    <CardContent className="flex flex-col items-center justify-center py-12 gap-3">
                        <CheckCircle2 className="h-12 w-12 text-success" />
                        <p className="text-lg font-semibold text-success">Sem dívidas em aberto</p>
                        <p className="text-sm text-muted-foreground text-center">
                            O estudante não possui dívidas pendentes para o período seleccionado.
                        </p>
                    </CardContent>
                </Card>

            )}

            {/* Com Dívidas */}
            {!isLoading && searched && hasDebts && (
                <Card className="border-warning">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-warning" />
                                    Dívidas Encontradas
                                </CardTitle>
                                <CardDescription>Faturas pendentes</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-warning border-warning">
                                {debtData.size} item(s)
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">

                            {/* Total */}
                            <div>
                                <p className="text-sm text-muted-foreground">Total em atraso</p>
                                <p className="text-3xl font-bold text-warning">
                                    {formatCurrency(debtData.totalDivida)}
                                </p>
                            </div>

                            {/* Mensalidades */}
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <GraduationCap className="h-4 w-4" />
                                    Mensalidade(s)
                                </p>

                                {debtData.Mensalidades && debtData.Mensalidades.length > 0 ? (
                                    debtData.Mensalidades.map((m) => (
                                        <div
                                            key={m.mes_temp_id}
                                            className="rounded-lg border border-muted overflow-hidden"
                                        >
                                            <div className="flex items-center p-3 bg-muted hover:bg-muted/80 transition-colors gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-sm truncate block">
                                                        {m.mes ? `Mensalidade ${m.mes}` : "Mensalidade"}
                                                    </span>
                                                </div>
                                                <span className="font-semibold text-primary w-32 text-right shrink-0">
                                                    {formatCurrency(m.total)}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openMensalidadeModal(m)}
                                                    className="h-8 px-2 text-xs shrink-0"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="ml-1 hidden sm:inline">Detalhes</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center p-4 bg-muted/50 rounded-lg text-muted-foreground text-sm italic">
                                        Sem mensalidades em dívida
                                    </div>
                                )}
                            </div>

                            {/* Outros Serviços */}
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Wrench className="h-4 w-4" />
                                    Outros Serviço(s)
                                </p>

                                {debtData.OutrosServicos && debtData.OutrosServicos.length > 0 ? (
                                    debtData.OutrosServicos.map((s) => (
                                        <div
                                            key={s.codgradecurricular}
                                            className="flex items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors gap-2"
                                        >
                                            <span className="text-sm truncate flex-1 min-w-0">
                                                {s.servico}
                                            </span>
                                            <span className="font-semibold text-primary w-32 text-right shrink-0">
                                                {formatCurrency(s.total)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openOutroServicoModal(s)}
                                                className="h-8 px-2 text-xs shrink-0"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="ml-1 hidden sm:inline">Detalhes</span>
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center p-4 bg-muted/50 rounded-lg text-muted-foreground text-sm italic">
                                        Sem dívida em outros serviços
                                    </div>
                                )}
                            </div>

                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Modal Mensalidade */}
            <Dialog open={isModalOpen && !!selectedMensalidade} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Mensalidade</DialogTitle>
                        <DialogDescription>
                            Informações detalhadas da mensalidade em dívida.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMensalidade && (
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Mês:</span>
                                <span className="text-muted-foreground">{selectedMensalidade.mes}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Descrição:</span>
                                <span className="text-muted-foreground">{selectedMensalidade.descricao_servico}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Valor Base:</span>
                                <span className="text-muted-foreground">{formatCurrency(selectedMensalidade.mensalidade)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Multa:</span>
                                <span className="text-warning font-medium">{formatCurrency(selectedMensalidade.multa)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Desconto:</span>
                                <span className="text-success font-medium">{formatCurrency(selectedMensalidade.desconto)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Semestre:</span>
                                <span className="text-muted-foreground">{selectedMensalidade.semestre}º</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-bold">Total a Pagar:</span>
                                <span className="font-bold text-primary">{formatCurrency(selectedMensalidade.total)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Outro Serviço */}
            <Dialog open={isModalOpen && !!selectedOutroServico} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Serviço</DialogTitle>
                        <DialogDescription>
                            Informações detalhadas do serviço em dívida.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOutroServico && (
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="font-medium">Serviço:</span>
                                <span className="text-muted-foreground">{selectedOutroServico.servico}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Ano Lectivo:</span>
                                <span className="text-muted-foreground">{selectedOutroServico.ano_lectivo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Valor Base:</span>
                                <span className="text-muted-foreground">{formatCurrency(selectedOutroServico.valor)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Multa:</span>
                                <span className="text-warning font-medium">{formatCurrency(selectedOutroServico.multa)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Desconto:</span>
                                <span className="text-success font-medium">{formatCurrency(selectedOutroServico.desconto)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Taxa:</span>
                                <span className="text-muted-foreground">{selectedOutroServico.taxa_descricao}</span>
                            </div>
                            <div className="flex justify-between border-t pt-2">
                                <span className="font-bold">Total a Pagar:</span>
                                <span className="font-bold text-primary">{formatCurrency(selectedOutroServico.total)}</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}