import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/common/FormSelect";

import { useCursos } from "@/hooks/use-cursos";
import { useQueryDepartamento } from "@/hooks/depatamento/use-query-depardamento";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";
import { useQueryClassFilterByCurso } from "@/hooks/classes/use-query-disciplina-with-filter";
import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { useDisciplines } from "@/hooks/study_plan/use-query-disciplines";
import { useMutationCreateUcDepartment } from "@/hooks/depatamento/use-mutation-create-uc-department";
import { AuthStorage } from "@/util/auth-storage";
import { Form } from "@/components/ui/form";
import { FormSelectRHF } from "@/components/common/FormSelectRHF";
import { Curso } from "@/services/fetch-course";
import { Classes } from "@/services/classes/class-filter-by-curso";
import { Discipline } from "@/services/study_plan/fect-discipline.serice";
import { AnoAcademico } from "@/services/fetch-anos-academico";
import { Semestre } from "@/services/study_plan/semestre/fecth-semestres";
import { Departamento } from "@/services/departamento/fetch-departamento";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  codigo_disciplina: string;
  codigo_ano_lectivo: string;
  codigo_semestre: string;
  codigo_classe: string;
  codigo_curso: string;
  codigo_departamento: string;
}

export function CreateUcModal({ open, onClose }: Props) {
  const form = useForm<FormValues>({
    mode: "onSubmit",
  });

  const mutation = useMutationCreateUcDepartment();

  // =======================
  // QUERIES
  // =======================
  const { data: cursos = [], isLoading: loadingCursos } = useCursos();
  const { data: departamentos = [], isLoading: isLoadingDepartamento } =
    useQueryDepartamento();
  const { data: semestres = [], isLoading: isLoadingSemestres } =
    useQuerySemestres();
  const { data: anos = [], isLoading: isLoadingAnos } = useQueryAnoAcademico();
  const { data: disciplines = [], isLoading: isLoadingDisciplines } =
    useDisciplines();
  const { data: classes = [], isLoading: isLoadingClasses } =
    useQueryClassFilterByCurso({ curso: form.watch("codigo_curso") });

  // =======================
  // SUBMIT
  // =======================
  const onSubmit = (data: FormValues) => {
    mutation.mutate(
      {
        cursos: [{ codigoCurso: Number(data.codigo_curso) }],

        codigo_disciplina: Number(data.codigo_disciplina),
        codigo_ano_lectivo: Number(data.codigo_ano_lectivo),
        codigo_semestre: Number(data.codigo_semestre),
        codigo_classe: Number(data.codigo_classe),
        codigo_curso: Number(data.codigo_curso),
        codigo_departamento: Number(data.codigo_departamento),
        codigo_utilizador: AuthStorage.getUser().user_id,
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova UC</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormSelectRHF<FormValues, Curso>
              control={form.control}
              name="codigo_curso"
              label="Curso"
              options={cursos}
              loading={loadingCursos}
              map={(c) => ({
                key: String(c.codigo),
                label: c.designacao,
              })}
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
              })}
            />

            <FormSelectRHF<FormValues, Discipline>
              control={form.control}
              name="codigo_disciplina"
              label="Disciplina"
              options={disciplines}
              loading={isLoadingDisciplines}
              map={(d) => ({
                key: String(d.codigo),
                label: d.desginacao,
              })}
            />

            <FormSelectRHF<FormValues, AnoAcademico>
              control={form.control}
              name="codigo_ano_lectivo"
              label="Ano Letivo"
              options={anos}
              loading={isLoadingAnos}
              map={(a) => ({
                key: String(a.codigo),
                label: a.designacao,
              })}
            />

            <FormSelectRHF<FormValues, Semestre>
              control={form.control}
              name="codigo_semestre"
              label="Semestre"
              options={semestres}
              loading={isLoadingSemestres}
              map={(s) => ({
                key: String(s.codigo),
                label: s.designacao,
              })}
            />

            <FormSelectRHF<FormValues, Departamento>
              control={form.control}
              name="codigo_departamento"
              label="Departamento"
              options={departamentos}
              loading={isLoadingDepartamento}
              map={(d) => ({
                key: String(d.codigo),
                label: d.designacao,
              })}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onClose();
                }}
              >
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
