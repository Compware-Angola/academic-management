import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateSiglaTipoServico,
  useUpdateSiglaTipoServico,
} from "@/hooks/sigla-tipo-servicos/use-sigla-tipo-servicos";
import { SiglaTipoServico } from "@/services/financas/siglas-services/sigla-servicos.service";

const formSchema = z.object({
  sigla: z.string().min(1, "A sigla é obrigatória").max(50),
  descricao: z.string().min(1, "A descrição é obrigatória").max(200),
});

type FormValues = z.infer<typeof formSchema>;

type SiglaTipoServicoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSiglaTipoServico?: SiglaTipoServico;
  onSelectSiglaTipoServico: (item?: SiglaTipoServico) => void;
};

export function SiglaTipoServicoDialog({
  open,
  onOpenChange,
  selectedSiglaTipoServico,
  onSelectSiglaTipoServico,
}: SiglaTipoServicoDialogProps) {
  const isEditing = !!selectedSiglaTipoServico;

  const { mutate: createSiglaTipoServico, isPending: isCreating } =
    useCreateSiglaTipoServico();
  const { mutate: updateSiglaTipoServico, isPending: isUpdating } =
    useUpdateSiglaTipoServico();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { sigla: "", descricao: "" },
  });

  useEffect(() => {
    if (open) {
      reset({
        sigla: selectedSiglaTipoServico?.sigla ?? "",
        descricao: selectedSiglaTipoServico?.descricao ?? "",
      });
    }
  }, [open, selectedSiglaTipoServico, reset]);

  const handleClose = () => {
    onSelectSiglaTipoServico(undefined);
    onOpenChange(false);
  };

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateSiglaTipoServico(
        { codigo: selectedSiglaTipoServico.codigo, ...values },
        { onSuccess: handleClose },
      );
      return;
    }

    createSiglaTipoServico(values as any, { onSuccess: handleClose });
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Sigla" : "Nova Sigla"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input id="sigla" {...register("sigla")} disabled={isEditing} />
            {errors.sigla && (
              <p className="text-sm text-destructive">{errors.sigla.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Input id="descricao" {...register("descricao")} />
            {errors.descricao && (
              <p className="text-sm text-destructive">
                {errors.descricao.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEditing ? "Guardar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
