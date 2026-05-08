import { useState } from "react";
import { Plus, Receipt, Trash2, Minus, Plus as PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AcademicYearSelect } from "@/components/common/global-selects/AcademicYearSelect";
import { TypeServiceSelectList } from "@/components/common/global-selects/TypeServiceSelectList";
import { parseFilter } from "@/util/parse-filter";
import { useQueryTiposServico } from "@/hooks/financas/use-query-tipo-service";

type Props = {
    codigoMatricula: number;
};

const TIPOS_SERVICO_ESTUDANTE = [
    { id: "decl-freq", nome: "Declaração de Frequência", valor: 5000 },
    { id: "decl-notas", nome: "Declaração com Notas", valor: 7500 },
    { id: "cert-conclusao", nome: "Certificado de Conclusão", valor: 25000 },
    { id: "carta-curso", nome: "Carta do Curso", valor: 15000 },
    { id: "2via-cartao", nome: "2ª Via do Cartão de Estudante", valor: 3500 },
    { id: "transf-curso", nome: "Pedido de Transferência de Curso", valor: 12000 },
    { id: "reingresso", nome: "Reingresso", valor: 18000 },
];

type ServicoItem = {

    nome: string;
    valor: number;
    quantidade: number;
    codigo: number;
};

export function OutrosServicosSection({ codigoMatricula }: Props) {
    const [servicoSel, setServicoSel] = useState<string>("");
    const [servicosItens, setServicosItens] = useState<ServicoItem[]>([]);
    const [anoLetivo, setAnoLetivo] = useState<string | null>(null);
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

                <Button className="gap-2" size="lg" disabled={servicosItens.length === 0}>
                    <Receipt className="h-5 w-5" />
                    Gerar Factura

                </Button>
            </div>
        </div>
    );
}