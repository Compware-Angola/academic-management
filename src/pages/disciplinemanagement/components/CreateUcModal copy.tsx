import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormSelectRHF } from "@/components/common/FormSelectRHF";

import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useMutationCreateUcDepartment } from "@/hooks/depatamento/use-mutation-create-uc-department";

import { Classes } from "@/services/classes/class-filter-by-curso";

import { CourseCommandSelectRHF } from "@/components/common/global-selects/CourseCommandSelectRHF";
import { DisciplineCommandSelectRHF } from "@/components/common/global-selects/DisciplineCommandSelectRHF";
import { DepartamentoCommandSelectRHF } from "@/components/common/global-selects/DepartamentoCommandSelectRHF";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  codigo_curso: string;
  codigo_classe: string;
  codigo_departamento: string;
  disciplinas: {
    codigo_disciplina: string;
  }[];
}

export function CreateUcModal({ open, onClose }: Props) {
  const form = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      disciplinas: [{ codigo_disciplina: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "disciplinas",
  });

  const mutation = useMutationCreateUcDepartment();

  // =======================
  // QUERIES
  // =======================

  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: form.watch("codigo_curso") });

  // =======================
  // SUBMIT
  // =======================
  const onSubmit = (data: FormValues) => {
    const disciplinas = data.disciplinas
      .filter((d) => d.codigo_disciplina)
      .map((d) => ({ codigoDisciplina: Number(d.codigo_disciplina) }));

    mutation.mutate(
      {
        codigoDepartamento: Number(data.codigo_departamento),
        codigoClasse: Number(data.codigo_classe),
        disciplinas,
      },
      {
        onSuccess: () => {
          form.reset({ disciplinas: [{ codigo_disciplina: "" }] });
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    form.reset({ disciplinas: [{ codigo_disciplina: "" }] });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova UC</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <CourseCommandSelectRHF<FormValues>
                control={form.control}
                name="codigo_curso"
              />

              <FormSelectRHF<FormValues, Classes>
                control={form.control}
                name="codigo_classe"
                label="Ano Curricular"
                options={classes}
                disabled={!form.watch("codigo_curso")}
                loading={isLoadingClasses}
                map={(c) => ({
                  key: String(c.codigo),
                  label: c.designacao,
                  value: String(c.codigo),
                })}
              />
            </div>

            <DepartamentoCommandSelectRHF<FormValues>
              control={form.control}
              name="codigo_departamento"
            />

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Disciplinas</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ codigo_disciplina: "" })}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Adicionar
                </Button>
              </div>

              <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <DisciplineCommandSelectRHF<FormValues>
                        control={form.control}
                        name={`disciplinas.${index}.codigo_disciplina`}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>

              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar UC"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
