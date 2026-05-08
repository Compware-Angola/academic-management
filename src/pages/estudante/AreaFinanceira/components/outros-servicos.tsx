import { useState } from "react";
import { Plus, Receipt, Trash2, Minus, Plus as PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList";
import { parseFilter } from "@/util/parse-filter";
import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";
import { useCreateInvoice } from "@/hooks/financas/invoice/use-create-mutation";
import { useToast } from "@/hooks/use-toast";

type Props = {
    codigoMatricula: number;
    poloId?: number;
};
type ServicoItem = {
    nome: string;
    valor: number;
    quantidade: number;
    codigo: number;
};

export function OutrosServicosSection({ codigoMatricula, poloId = 1 }: Props) {
    const [servicoSel, setServicoSel] = useState<string>("");
    const [servicosItens, setServicosItens] = useState<ServicoItem[]>([]);
    const [anoLetivo, setAnoLetivo] = useState<string | null>(null);
    const { mutate: criarFactura, isPending } = useCreateInvoice();
    const { toast } = useToast();
    const { data: services = [], isLoading } = useQueryTiposServico(
        {
            estado: "Ativo",
            codigoAnoLectivo: parseFilter(anoLetivo),
        },
        { enabled: !!anoLetivo },
    );
    const adicionarServico = () => {
        const servico = services.find((t) => t.codigo.toString() === servicoSel);
        if (!servico) return;

        setServicosItens((prev) => [
            ...prev,
            { nome: servico.descricao, quantidade: 1, valor: servico.preco, codigo: servico.codigo },
        ]);
        setServicoSel("");
    };

    const removerServico = (codigo: number) => {
        setServicosItens((prev) => prev.filter((item) => item.codigo !== codigo));
    };

    const alterarQuantidade = (codigo: number, novaQuantidade: number) => {
        if (novaQuantidade < 1) return;
        setServicosItens((prev) =>
            prev.map((item) =>
                item.codigo === codigo ? { ...item, quantidade: novaQuantidade } : item
            )
        );
    };

    const fmtKz = (v: number) =>
        new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(v);

    const totalServicos = servicosItens.reduce(
        (soma, item) => soma + item.valor * item.quantidade,
        0
    );

    const handleGerarFactura = () => {
        if (servicosItens.length === 0 || !anoLetivo) {
            toast({
                title: "Atenção",
                description: "Selecione pelo menos um serviço e um ano letivo.",
                variant: "destructive",
            });
            return;
        }

        const payload = {
            DataFactura: new Date().toISOString(),
            polo_id: poloId,
            TotalPreco: totalServicos,
            codigo_descricao: 101,
            ValorAPagar: totalServicos,
            total_incidencia: totalServicos,
            total_retencao: 0,
            CodigoMatricula: codigoMatricula,
            Desconto: 0,
            totalIVA: 0,
            TotalMulta: 0,
            Descricao: "Pagamento de outros serviços",
            tipo_documento_factura_id: 1,
            canal: 3,
            codigo_anoLectivo: parseInt(anoLetivo),
            itens: servicosItens.map((item) => ({
                CodigoProduto: item.codigo,
                Quantidade: item.quantidade,
                preco: item.valor,
                Total: item.valor * item.quantidade,
                valor_pago: item.valor * item.quantidade,
                obs: item.nome,
                taxaIva: 0,
                valorIva: 0,
                retencao: 0,
                incidencia: item.valor * item.quantidade,
                valorDesconto: 0,
                descontoProduto: 0,
                estado: 0,
                valorPago: item.valor * item.quantidade,
                valorATransportar: 0,
                codigo_anoLectivo: parseInt(anoLetivo),
            })),
        };

        criarFactura(payload, {
            onSuccess: () => {
                setServicosItens([]);
                toast({ title: "Sucesso", description: "Nota de Pagamento gerada com sucesso!" });
            },
        });
    };

    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="border-b pb-6">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    Outros Serviços
                </h2>
                <p className="text-muted-foreground mt-1">
                    Selecione e adicione serviços extras para o estudante
                </p>
            </div>

            {/* Seletores na mesma linha - Alinhados */}
            <div className="flex flex-col lg:flex-row items-end gap-4">
                {/* Ano Letivo */}
                <div className="w-full lg:w-80">

                    <AcademicYearSelect
                        enableDefaultActiveYear
                        value={anoLetivo}
                        onChangeValue={(v) => setAnoLetivo(v)}
                    />
                </div>

                {/* Serviço + Botão Adicionar */}
                <div className="flex-1 flex gap-2">
                    <div className="flex-1">
                        <TypeServiceSelectList
                            enabled={!!anoLetivo}
                            anoLectivo={parseFilter(anoLetivo)}
                            value={servicoSel}
                            onChangeValue={(v) => setServicoSel(v)}
                        />
                    </div>

                    <Button
                        onClick={adicionarServico}
                        disabled={!servicoSel}
                        className="gap-2 h-[42px] mt-6"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar
                    </Button>
                </div>
            </div>

            {/* Tabela */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Serviço</TableHead>
                        <TableHead className="text-right">Valor Unitário</TableHead>
                        <TableHead className="w-32 text-center">Quantidade</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-16"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {servicosItens.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                Nenhum serviço adicionado
                            </TableCell>
                        </TableRow>
                    ) : (
                        servicosItens.map((item) => (
                            <TableRow key={item.codigo}>
                                <TableCell className="font-medium">{item.nome}</TableCell>
                                <TableCell className="text-right">{fmtKz(item.valor)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-center gap-1">
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8"
                                            onClick={() => alterarQuantidade(item.codigo, item.quantidade - 1)}
                                        >
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="w-8 text-center font-medium">{item.quantidade}</span>
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className="h-8 w-8"
                                            onClick={() => alterarQuantidade(item.codigo, item.quantidade + 1)}
                                        >
                                            <PlusIcon className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                    {fmtKz(item.valor * item.quantidade)}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => removerServico(item.codigo)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Total e Factura */}
            <div className="flex items-center justify-between border-t pt-6">
                <div>
                    <span className="text-lg">Total a pagar: </span>
                    <span className="text-2xl font-bold text-primary">
                        {fmtKz(totalServicos)}
                    </span>
                </div>

                <Button className="gap-2" size="lg" disabled={servicosItens.length === 0 || isPending || isLoading} onClick={handleGerarFactura}>
                    <Receipt className="h-5 w-5" />
                    Gerar Nota de Pagamento

                </Button>
            </div>
        </div>
    );
}