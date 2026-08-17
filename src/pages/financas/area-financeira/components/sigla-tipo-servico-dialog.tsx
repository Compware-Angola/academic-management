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
import { FormSelect } from "@/components/common/FormSelect";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";

const formSchema = z.object({
  sigla: z.string().min(1, "A sigla é obrigatória").max(50),
  descricao: z.string().min(1, "A descrição é obrigatória").max(200),
  tipo_candidatura: z.number({
    required_error: "O tipo de candidatura é obrigatório",
    invalid_type_error: "Selecione um tipo de candidatura válido",
  }),
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

  const { data: tiposCandidatura = [], isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sigla: "",
      descricao: "",
      tipo_candidatura: undefined,
    },
  });

  const tipoCandidaturaValue = watch("tipo_candidatura");

  useEffect(() => {
    if (open) {
      reset({
        sigla: selectedSiglaTipoServico?.sigla ?? "",
        descricao: selectedSiglaTipoServico?.descricao ?? "",
        tipo_candidatura:
          selectedSiglaTipoServico?.tipo_candidatura ?? undefined,
      });
    }
  }, [open, selectedSiglaTipoServico, reset]);

  const handleClose = () => {
    onSelectSiglaTipoServico(undefined);
    onOpenChange(false);
  };

  const onSubmit = (values: FormValues) => {
    const payload = {
      ...values,
      tipo_candidatura: values.tipo_candidatura,
    };

    if (isEditing) {
      updateSiglaTipoServico(
        { codigo: selectedSiglaTipoServico.codigo, ...payload },
        { onSuccess: handleClose },
      );
      return;
    }

    createSiglaTipoServico(payload as any, { onSuccess: handleClose });
  };

  const isPending = isCreating || isUpdating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Sigla" : "Nova Sigla"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="min-w-[220px]">
            <FormSelect
              label="Tipo de Candidatura"
              value={String(tipoCandidaturaValue)}
              onChange={(v) => setValue("tipo_candidatura", Number(v))}
              options={tiposCandidatura}
              loading={isLoadingTiposCandidatura}
              map={(tipo) => ({
                key: tipo.codigo,
                label: tipo.designacao,
                value: tipo.codigo,
              })}
              placeholder="Selecione o tipo..."
            />
          </div>

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
