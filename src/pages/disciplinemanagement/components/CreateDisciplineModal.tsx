// src/components/disciplines/CreateDisciplineModal.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";

// Schema de validação
const disciplineSchema = z.object({
  designacao: z.string().min(3, "A designação deve ter pelo menos 3 caracteres"),
  tipo_unidade_curricular: z.enum(["S", "A"], {
    required_error: "Selecione o tipo da unidade curricular",
  }),
  natureza_unidade_curricular: z.enum(["TP", "T", "P"], {
    required_error: "Selecione a natureza da unidade curricular",
  }),
});

type DisciplineFormData = z.infer<typeof disciplineSchema>;

interface CreateDisciplineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // para refetch da lista após criar
}

export function CreateDisciplineModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateDisciplineModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DisciplineFormData>({
    resolver: zodResolver(disciplineSchema),
  });

  const onSubmit = async (data: DisciplineFormData) => {
    setIsSubmitting(true);
    try {
    

      toast({
        title: "Sucesso!",
        description: "Disciplina criada com sucesso.",
      });

      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível criar a disciplina. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova Disciplina</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova unidade curricular.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="designacao">Designação da Disciplina</Label>
            <Input
              id="designacao"
              placeholder="Ex: Direito das Sociedades Comerciais"
              {...register("designacao")}
              disabled={isSubmitting}
            />
            {errors.designacao && (
              <p className="text-sm text-destructive">{errors.designacao.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo da UC</Label>
              <Select
                onValueChange={(value) => setValue("tipo_unidade_curricular", value as "S" | "A")}
                disabled={isSubmitting}
              >
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="S">Semestral</SelectItem>
                  <SelectItem value="A">Anual</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo_unidade_curricular && (
                <p className="text-sm text-destructive">
                  {errors.tipo_unidade_curricular.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="natureza">Natureza da UC</Label>
              <Select
                onValueChange={(value) =>
                  setValue("natureza_unidade_curricular", value as "TP" | "T" | "P")
                }
                disabled={isSubmitting}
              >
                <SelectTrigger id="natureza">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TP">Teórico-Prática (TP)</SelectItem>
                  <SelectItem value="T">Teórica (T)</SelectItem>
                  <SelectItem value="P">Prática (P)</SelectItem>
                </SelectContent>
              </Select>
              {errors.natureza_unidade_curricular && (
                <p className="text-sm text-destructive">
                  {errors.natureza_unidade_curricular.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Disciplina
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}