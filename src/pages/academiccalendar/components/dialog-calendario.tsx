import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import {
  useCreateTipoCalendario,
  useUpdateTipoCalendario,
} from "@/hooks/tipo-calendario/use-tipo-calendario";
import { TipoCalendario } from "@/services/tipo-calendario/tipo-calendario.service";

const formSchema = z.object({
  designacao: z.string().min(1, "A designação é obrigatória").max(150),
  sigla: z.string().min(1, "A sigla é obrigatória").max(20),
  ativoParaAluno: z.number().int(),
});

type FormValues = z.infer<typeof formSchema>;

type TipoCalendarioDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTipoCalendario?: TipoCalendario;
  onSelectTipoCalendario: (item?: TipoCalendario) => void;
};

export function TipoCalendarioDialog({
  open,
  onOpenChange,
  selectedTipoCalendario,
  onSelectTipoCalendario,
}: TipoCalendarioDialogProps) {
  const isEditing = !!selectedTipoCalendario;

  const { mutate: createTipoCalendario, isPending: isCreating } =
    useCreateTipoCalendario();
  const { mutate: updateTipoCalendario, isPending: isUpdating } =
    useUpdateTipoCalendario();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { designacao: "", sigla: "", ativoParaAluno: 0 },
  });

  useEffect(() => {
    if (open) {
      reset({
        designacao: selectedTipoCalendario?.designacao ?? "",
        sigla: selectedTipoCalendario?.sigla ?? "",
        ativoParaAluno: selectedTipoCalendario?.ativoParaAluno ?? 0,
      });
    }
  }, [open, selectedTipoCalendario, reset]);

  const handleClose = () => {
    onSelectTipoCalendario(undefined);
    onOpenChange(false);
  };

  const onSubmit = (values: FormValues) => {
    if (isEditing) {
      updateTipoCalendario(
        { codigo: selectedTipoCalendario.codigo, ...values },
        { onSuccess: handleClose },
      );
      return;
    }

    createTipoCalendario(values, { onSuccess: handleClose });
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar Tipo de Calendário"
              : "Novo Tipo de Calendário"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="designacao">Designação</Label>
            <Input id="designacao" {...register("designacao")} />
            {errors.designacao && (
              <p className="text-sm text-destructive">
                {errors.designacao.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="sigla">Sigla</Label>
            <Input id="sigla" {...register("sigla")} />
            {errors.sigla && (
              <p className="text-sm text-destructive">{errors.sigla.message}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Controller
              control={control}
              name="ativoParaAluno"
              render={({ field }) => (
                <Switch
                  id="ativoParaAluno"
                  checked={field.value === 1}
                  onCheckedChange={(checked) => field.onChange(checked ? 1 : 0)}
                />
              )}
            />
            <Label htmlFor="ativoParaAluno">Ativo para aluno</Label>
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
