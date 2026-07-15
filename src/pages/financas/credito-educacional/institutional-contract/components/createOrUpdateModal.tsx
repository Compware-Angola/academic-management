import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InstituicaoSelect } from "@/components/common/global-selects/InstituicaoSelect";
import { BolsaPicker, BolsaSelected } from "./bolsa-picker";
import type { InstitutionalContract } from "@/services/financas/credito-educacional/institutional-contract/contract.service";
import { useCreateInstitutionalContract } from "@/hooks/financas/credito-educacional/use-create-contract";
import { useUpdateInstitutionalContract } from "@/hooks/financas/credito-educacional/use-update-contract";


interface ContratoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    contrato?: InstitutionalContract | null;
    defaultInstituicaoId?: string;
}

// yyyy-mm-dd para o <input type="date"> mesmo que venha com hora (ISO completo)
const toDateInputValue = (value?: string) => (value ? value.slice(0, 10) : "");

export default function ContratoModal({ open, onOpenChange, contrato, defaultInstituicaoId }: ContratoModalProps) {
    const isEditMode = !!contrato;

    const [instituicaoId, setInstituicaoId] = useState(defaultInstituicaoId ?? "");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");

    const [bolsasSelecionadas, setBolsasSelecionadas] = useState<BolsaSelected[]>([]);
    // nº máximo de estudantes por bolsa seleccionada (codigo -> quantidade)
    const [quantidades, setQuantidades] = useState<Record<string, number>>({});

    const resetForm = () => {
        setInstituicaoId(defaultInstituicaoId ?? "");
        setDataInicio("");
        setDataFim("");
        setBolsasSelecionadas([]);
        setQuantidades({});
    };

    // ao abrir: pré-preenche em modo edição, ou limpa em modo criação
    useEffect(() => {
        if (!open) return;
        if (contrato) {
            setInstituicaoId(contrato.codigoInstituicao.toString());
            setDataInicio(toDateInputValue(contrato.dataInicio));
            setDataFim(toDateInputValue(contrato.dataFim));

            setBolsasSelecionadas(contrato.bolsas.map((b) => ({ codigo: b.codigoBolsa.toString(), designacao: b.designacao })));
            setQuantidades(
                Object.fromEntries(contrato.bolsas.map((b) => [b.codigoBolsa.toString(), b.numeroMaximoEstudante]))
            );
        } else {
            resetForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, contrato]);

    const buildBody = () => ({
        codigoInstituicao: parseInt(instituicaoId),
        dataInicio,
        dataFim,

        bolsas: bolsasSelecionadas.map((b) => ({
            codigoBolsa: parseInt(b.codigo),
            numeroMaximoEstudante: quantidades[b.codigo] ?? 1,
        })),
    });

    const createMutation = useCreateInstitutionalContract();
    const updateMutation = useUpdateInstitutionalContract({
        id: contrato?.codigoContrato?.toString() ?? "",
        body: buildBody(),
    });

    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    const validate = () => {
        if (!instituicaoId || !dataInicio || !dataFim) {
            toast.error("Preencha instituição e datas.");
            return false;
        }
        if (new Date(dataFim) <= new Date(dataInicio)) {
            toast.error("Data fim deve ser posterior à data início.");
            return false;
        }
        if (bolsasSelecionadas.length === 0) {
            toast.error("Adicione pelo menos uma bolsa.");
            return false;
        }
        for (const b of bolsasSelecionadas) {
            const qtd = quantidades[b.codigo];
            if (!qtd || qtd < 1) {
                toast.error(`Defina o número máximo de estudantes para "${b.designacao}".`);
                return false;
            }
        }
        return true;
    };

    const submit = () => {
        if (!validate()) return;

        if (isEditMode) {
            updateMutation.mutate(undefined, { onSuccess: handleClose });
        } else {
            createMutation.mutate(buildBody(), { onSuccess: handleClose });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(next) : handleClose())}>
            <DialogContent className="max-w-5xl! w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{isEditMode ? "Editar Contrato" : "Novo Contrato"}</DialogTitle></DialogHeader>
                <div className="space-y-5">
                    <InstituicaoSelect
                        value={instituicaoId}
                        onChangeValue={setInstituicaoId}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dataInicio">Data Início *</Label>
                            <Input id="dataInicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="dataFim">Data Fim *</Label>
                            <Input id="dataFim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                        </div>
                    </div>



                    <BolsaPicker
                        values={bolsasSelecionadas}
                        onChange={(next) => {
                            setBolsasSelecionadas(next);
                            // limpa quantidades de bolsas removidas e inicializa as novas a 1
                            setQuantidades((prev) => {
                                const nextQtds: Record<string, number> = {};
                                next.forEach((b) => { nextQtds[b.codigo] = prev[b.codigo] ?? 1; });
                                return nextQtds;
                            });
                        }}
                        max={10}
                        codigoInstituicao={instituicaoId}
                        disabled={!instituicaoId}
                    />

                    {bolsasSelecionadas.length > 0 && (
                        <div className="space-y-2">
                            <Label>Número máximo de estudantes por bolsa</Label>
                            <div className="space-y-2">
                                {bolsasSelecionadas.map((b) => (
                                    <div key={b.codigo} className="flex items-center gap-3">
                                        <span className="text-sm flex-1 truncate">{b.designacao}</span>
                                        <Input
                                            type="number"
                                            min={1}
                                            className="w-24"
                                            value={quantidades[b.codigo] ?? 1}
                                            onChange={(e) =>
                                                setQuantidades((prev) => ({ ...prev, [b.codigo]: Number(e.target.value) }))
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>Cancelar</Button>
                    <Button onClick={submit} disabled={isSubmitting}>
                        {isSubmitting ? "A guardar..." : isEditMode ? "Guardar Alterações" : "Criar Contrato"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}