import { useEffect } from "react";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";


import { Form } from "@/components/ui/form";
import { InputFormField } from "@/components/inputFormField";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateCashRegister, useUpdateCashRegister } from "@/hooks/financa/use-cash-register";

type CashRegisterUpsert = {
    cashRegister?: {
        id: number;
        name: string;
    };
    open?: boolean;
    handleOpenChange?: (open: boolean) => void;

};

const schema = z.object({
    name: z.string().min(1, "Nome inválido"),
});

type FormValues = z.infer<typeof schema>;

export function ModalUpsertCashRegister({
    open,
    handleOpenChange,
    cashRegister,

}: CashRegisterUpsert) {
    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        },
    });

    const { mutateAsync: createCashRegister, isPending: createCashRegisterLoading } = useCreateCashRegister();
    const { mutateAsync: updateCashRegister, isPending: updateCashRegisterLoading } = useUpdateCashRegister();

    useEffect(() => {
        if (open) {
            form.reset({
                name: cashRegister?.name ?? "",
            });
        }
    }, [cashRegister, open, form]);

    const onSubmit = async (data: FormValues) => {
        const handleClose = () => {
            handleOpenChange?.(false);
            form.reset({ name: "" });
        }
        if (cashRegister) {
            await updateCashRegister({ id: cashRegister.id, name: data.name })
            handleClose();
            return
        }
        await createCashRegister({ name: data.name })
        handleClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                        {cashRegister ? "Editar caixa" : "Novo caixa"}
                    </DialogTitle>

                    <DialogDescription>
                        {cashRegister
                            ? "Atualize os dados do caixa."
                            : "Preencha os campos para criar um novo caixa."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <InputFormField
                            control={form.control}
                            name="name"
                            placeholder="Nome do caixa"
                            label="Nome do caixa"
                        />

                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange?.(false)}
                            >
                                Cancelar
                            </Button>

                            <Button type="submit" disabled={createCashRegisterLoading || updateCashRegisterLoading}>
                                {createCashRegisterLoading || updateCashRegisterLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        A processar...
                                    </>
                                ) : (
                                    "Salvar"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}