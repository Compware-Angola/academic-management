import { useState } from "react";
import {
    AlertCircle,
    GraduationCap,
    Wrench,
    Eye,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, CardHeader, CardTitle, CardDescription, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Mensalidade {
    id_item: string;
    mes: string;
    total: number;
}

interface OutroServico {
    servico: string;
    total: number;
}

interface DebtData {
    size: number;
    totalDivida: number;
    Mensalidades: Mensalidade[];
    OutrosServicos: OutroServico[];
}

type Props = {
    codigoMatricula: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_DEBT_DATA: DebtData = {
    size: 8,
    totalDivida: 181000,
    Mensalidades: [
        { id_item: "m-001", mes: "Janeiro 2025", total: 45000 },
        { id_item: "m-002", mes: "Fevereiro 2025", total: 45000 },
        { id_item: "m-003", mes: "Março 2025", total: 45000 },
    ],
    OutrosServicos: [
        { servico: "Taxa de Exame Especial", total: 8000 },
        { servico: "Declaração de Notas", total: 3500 },
        { servico: "Seguro Estudantil", total: 5000 },
        { servico: "Certidão de Matrícula", total: 2500 },
        { servico: "Taxa de Equivalência", total: 27000 },
    ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (value: number) =>
    `${value.toLocaleString("pt-AO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Kz`;

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function MensalidadeDetail({ m, onClose }: { m: Mensalidade; onClose: () => void }) {

    return (
        <div className="px-3 pb-3 border-t bg-muted/20 space-y-2">
            <div className="pt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                    <p className="text-muted-foreground">Mês</p>
                    <p className="font-medium">{m.mes}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Valor em dívida</p>
                    <p className="font-semibold text-warning">{formatCurrency(m.total)}</p>
                </div>
                <div>
                    <p className="text-muted-foreground">Estado</p>
                    <Badge variant="outline" className="text-warning border-warning mt-0.5">
                        Em dívida
                    </Badge>
                </div>
            </div>
            <Button variant="outline" size="sm" className="w-full mt-1" onClick={onClose}>
                Fechar
            </Button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DividasSection({ codigoMatricula }: Props) {
    const [codigoAnoLectivo, setCodigoAnoLectivo] = useState<string | null>(null);
    const [expandedMes, setExpandedMes] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMesDivida, setSelectedMesDivida] = useState<Mensalidade | null>(null);

    const debtData = MOCK_DEBT_DATA;

    const openMesDividaModal = (m: Mensalidade) => {
        setExpandedMes(expandedMes === m.id_item ? null : m.id_item);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dívidas em Aberto</h1>
                <p className="text-muted-foreground">
                    Consulte as dívidas pendentes de mensalidades e outros serviços
                </p>
            </div>

            {/* Filtro */}
            <Card>
                <CardContent className="pt-6">
                    <div className="w-full sm:w-80 space-y-1.5">
                        <Label>Ano Lectivo</Label>
                        <Select
                            value={codigoAnoLectivo ?? ""}
                            onValueChange={(v) => setCodigoAnoLectivo(v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione o ano lectivo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="2022-2023">2022–2023</SelectItem>
                                <SelectItem value="2023-2024">2023–2024</SelectItem>
                                <SelectItem value="2024-2025">2024–2025</SelectItem>
                                <SelectItem value="2025-2026">2025–2026</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Card de Dívidas — estrutura igual ao padrão fornecido */}
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
                                        key={m.id_item}
                                        className="rounded-lg border border-muted overflow-hidden"
                                    >
                                        <div className="flex items-center p-3 bg-muted hover:bg-muted/80 transition-colors gap-2">
                                            {/* Descrição */}
                                            <div className="flex-1 min-w-0">
                                                <span className="text-sm truncate block">
                                                    {m.mes ? `Mensalidade ${m.mes}` : "Mensalidade"}
                                                </span>
                                            </div>

                                            {/* Valor */}
                                            <span className="font-semibold text-primary w-32 text-right shrink-0">
                                                {formatCurrency(m.total)}
                                            </span>

                                            {/* Botão Detalhes */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedMesDivida(m);
                                                    setIsModalOpen(true);
                                                }}
                                                className="h-8 px-2 text-xs shrink-0"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="ml-1 hidden sm:inline">
                                                    Detalhes
                                                </span>
                                            </Button>
                                        </div>

                                        {expandedMes === m.id_item && (
                                            <MensalidadeDetail
                                                m={m}
                                                onClose={() => setExpandedMes(null)}
                                            />
                                        )}
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
                                debtData.OutrosServicos.map((m) => (
                                    <div
                                        key={m.servico}
                                        className="flex items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors gap-2"
                                    >
                                        {/* Serviço */}
                                        <span className="text-sm truncate flex-1 min-w-0">
                                            {m.servico}
                                        </span>

                                        {/* Valor */}
                                        <span className="font-semibold text-primary w-32 text-right shrink-0">
                                            {formatCurrency(m.total)}
                                        </span>

                                        {/* Botão */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedMesDivida(null);
                                                setIsModalOpen(true);
                                            }}
                                            className="h-8 px-2 text-xs shrink-0"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span className="ml-1 hidden sm:inline">
                                                Detalhes
                                            </span>
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
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Detalhes da Mensalidade</DialogTitle>
                        <DialogDescription>
                            Informações detalhadas da mensalidade em dívida.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMesDivida && (
                        <div className="space-y-3 text-sm">

                            <div className="flex justify-between">
                                <span className="font-medium">Mês:</span>
                                <span className="text-muted-foreground">
                                    {selectedMesDivida.mes}
                                </span>
                            </div>


                            <div className="flex justify-between">
                                <span className="font-medium">Valor Base:</span>
                                <span className="text-muted-foreground">
                                    {formatCurrency(0)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="font-medium">Multa:</span>
                                <span className="text-warning font-medium">
                                    {formatCurrency(0)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Desconto:</span>
                                <span className="text-success font-medium">
                                    {formatCurrency(0)}
                                </span>
                            </div>


                            <div className="flex justify-between border-t pt-2">
                                <span className="font-bold">Total a Pagar:</span>
                                <span className="font-bold text-primary">
                                    {formatCurrency(selectedMesDivida.total)}
                                </span>
                            </div>

                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}