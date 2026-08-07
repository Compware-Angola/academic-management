import { useState } from "react";
import { useForm } from "react-hook-form";

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
import { DepartamentoCommandSelectRHF } from "@/components/common/global-selects/DepartamentoCommandSelectRHF";
import {
  DisciplinaMultiSelectPicker,
  DisciplinaSelected,
} from "./DisciplinaMultiSelectPicker";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  codigo_curso: string;
  codigo_classe: string;
  codigo_departamento: string;
}

export function CreateUcModal({ open, onClose }: Props) {
  const form = useForm<FormValues>({
    mode: "onSubmit",
  });

  const [disciplinas, setDisciplinas] = useState<DisciplinaSelected[]>([]);

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
    if (disciplinas.length === 0) return;

    mutation.mutate(
      {
        codigoDepartamento: Number(data.codigo_departamento),
        codigoClasse: 999,
        disciplinas: disciplinas.map((d) => ({ codigoDisciplina: d.id })),
      },
      {
        onSuccess: () => {
          form.reset();
          setDisciplinas([]);
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    form.reset();
    setDisciplinas([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl!">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova UC</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <DepartamentoCommandSelectRHF<FormValues>
              control={form.control}
              name="codigo_departamento"
            />

            <DisciplinaMultiSelectPicker
              values={disciplinas}
              onChange={setDisciplinas}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>

              <Button
                type="submit"
                disabled={mutation.isPending || disciplinas.length === 0}
              >
                {mutation.isPending ? "Salvando..." : "Salvar UC"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
