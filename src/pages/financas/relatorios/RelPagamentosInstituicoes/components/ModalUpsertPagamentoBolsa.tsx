import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { InputFormField } from "@/components/inputFormField";
import { SelectFormField } from "@/components/selectFormField";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { CriarPagamentoBolsaPayload, PagamentoBolsa } from "@/services/financas/bolsa/pagamento-bolsa.service";
import { CommandInputFormField } from "@/components/CommandInputFormField";
import { useDropDownBolsas } from "@/hooks/dropdown-filters";
import { useDebounce } from "@/hooks/use-debounce";
import { useCriarPagamentoBolsa, useUpdatePagamentoBolsa } from "@/hooks/financas/bolsa/pagamento-bolsa";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { SemestreSelect } from "@/components/common/global-selects/SemestreSelect";
type ModalUpsertPagamentoBolsaProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selected: PagamentoBolsa | null;
};
const schema = z.object({
    codigoBolsa: z.string().min(1, "Obrigatório"),
    anoLectivo: z.string().min(1, "Obrigatório"),
    semestre: z.string().min(1, "Obrigatório"),
    valorDepositado: z.coerce.number().min(1, "Obrigatório"),
    dataDeposito: z.string().min(1, "Obrigatório"),
    referencia: z.string().min(1, "Obrigatório"),
    observacao: z.string().min(1, "Obrigatório"),
});

type FormValues = z.infer<typeof schema>;

export const ModalUpsertPagamentoBolsa = ({
    open,
    setOpen,
    selected,
}: ModalUpsertPagamentoBolsaProps) => {
    const { data: academicYear, isLoading: loadingYear } =
        useQueryAnoAcademico();
    const { data: semestres, isLoading: loadingSemestres } =
        useQuerySemestres();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const { data, isLoading } = useDropDownBolsas({
        designacao: debouncedSearch,
    });
    const { mutateAsync: create, isPending: isCreating } = useCriarPagamentoBolsa();
    const { mutateAsync: update, isPending: isUpdating } = useUpdatePagamentoBolsa();
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            codigoBolsa: "",
            anoLectivo: "",
            semestre: "",
            valorDepositado: 0,
            dataDeposito: "",
            referencia: "",
            observacao: "",
        },
    });
    useEffect(() => {
        if (selected) {
            form.reset({
                codigoBolsa: String(selected.codigo_bolsa),
                anoLectivo: String(selected.codigo_ano_letivo),
                semestre: String(selected.semestre),
                valorDepositado: selected.valor_depositado,
                dataDeposito: format(new Date(selected.data_deposito), "yyyy-MM-dd"),
                referencia: selected.referencia,
                observacao: selected.observacao,
            });
        } else {
            form.reset({
                codigoBolsa: "",
                anoLectivo: "",
                semestre: "",
                valorDepositado: 0,
                dataDeposito: "",
                referencia: "",
                observacao: "",
            });
        }
    }, [selected, form]);

    const onSubmit = async (data: FormValues) => {
        const sucessCallback = () => {
            setOpen(false);
            form.reset({
                codigoBolsa: "",
                anoLectivo: "",
                semestre: "",
                valorDepositado: 0,
                dataDeposito: "",
                referencia: "",
                observacao: "",
            });
        }
        const params: CriarPagamentoBolsaPayload = {
            codigoBolsa: Number(data.codigoBolsa),
            anoLectivo: Number(data.anoLectivo),
            semestre: Number(data.semestre),
            valorDepositado: Number(data.valorDepositado),
            dataDeposito: data.dataDeposito,
            referencia: data.referencia,
            observacao: data.observacao,
        };
        if (selected) {
            await update({ ...params, codigoPagamento: selected.codigo_pagamento });
            sucessCallback();
            return
        }
        await create(params);
        sucessCallback();
    };

    return (
        <Dialog open={open} onOpenChange={() => !(isCreating || isUpdating) && setOpen(false)} >
            <DialogContent className=" w-full">
                <DialogHeader>
                    <DialogTitle>
                        {selected ? "Actualizar Pagamento Bolsa" : "Novo Pagamento Bolsa"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="submeter"
                        className="space-y-4 py-2 grid grid-cols-1 md:grid-cols-2 gap-2"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <CommandInputFormField
                            control={form.control}
                            name="codigoBolsa"
                            label="Bolsa"
                            placeholder="Seleciona a bolsa"
                            onSearchChange={setSearch}
                            items={data ?? []}
                            isLoading={isLoading}
                            map={(item) => ({
                                key: item.codigo,
                                value: item.codigo,
                                label: item.designacao,
                            })}
                        />
                        <SelectFormField
                            name="anoLectivo"
                            label="Ano Lectivo"
                            placeholder="Seleciona ano"

                            control={form.control}
                            items={
                                academicYear?.map((item) => ({
                                    label: item.designacao,
                                    value: String(item.codigo),
                                })) ?? []
                            }
                            disabled={loadingYear}
                            fullWidth
                        />
                        <SemestreSelect
                            disabled={loadingSemestres}
                            yearly
                            value={form.getValues("semestre")}
                            onChangeValue={(v) => {
                                form.setValue("semestre", v);
                            }}
                        />
                        <InputFormField
                            name="valorDepositado"
                            label="Valor Depositado"
                            control={form.control}
                            type="number"
                        />
                        <InputFormField
                            name="dataDeposito"
                            label="Data Depósito"
                            control={form.control}
                            type="date"
                        />
                        <InputFormField
                            name="referencia"
                            label="Referência"
                            control={form.control}
                        />
                        <div className="col-span-2">
                            <InputFormField
                                name="observacao"
                                label="Observação"
                                control={form.control}
                            />
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating || isUpdating}>
                        Cancelar
                    </Button>
                    <Button form="submeter" type="submit" disabled={isCreating || isUpdating}>
                        {selected ? "Actualizar" : "Salvar"}
                        {(isCreating || isUpdating) && (
                            <Loader2 className="animate-spin" />
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};