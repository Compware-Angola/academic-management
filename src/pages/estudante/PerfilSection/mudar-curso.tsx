import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { EpocaSelect } from "@/components/common/global-selects/EpocaSelect";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { usePoloDropdown } from "@/hooks/shared/use-query-fetch-polo";
import { CourseSelect } from "@/components/common/global-selects/CourseSelect";
import { useMutationChangeStudentCourse } from "@/hooks/students/use-mutation-change-course";
import { toast } from "sonner";

type Props = {
  codigoMatricula: number;
  value?: string;
};

export function MudarCurso({ codigoMatricula, value = "mudar-curso" }: Props) {
  const [polo, setPolo] = useState<string | undefined>();
  const [curso, setCurso] = useState<string>("");

  const { data: polos, isLoading: isLoadingPolo } = usePoloDropdown();
  const { mutateAsync, isPending } = useMutationChangeStudentCourse();

  if (!codigoMatricula) {
    return <div>Matrícula inválida</div>;
  }
  const handleChangeCourse = async () => {
    if (!polo || !curso) {
      toast.error("Selecione o polo e o curso");
      return;
    }

    toast.promise(
      mutateAsync({
        matriculaId: codigoMatricula,
        PoloId: Number(polo),
        cursoId: Number(curso),
        motivo: "OBRA DO LUCIANO",
      }),
      {
        position: "bottom-right",
        loading: "Mudando curso...",
        success: () => "Curso alterado com sucesso!",
        //error: (error: any) => error?.message || "Erro ao mudar o curso",
      },
    );
  };

  return (
    <TabsContent value={value} className="space-y-4">
      <>
        <CardHeader>
          <CardTitle className="text-lg">Fazer Mudança de Curso</CardTitle>
          <CardDescription>
            Funcionalidade de mudança de curso de um aluno
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Card>
            <CardHeader></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 items-end  space-x-4">
                <FormSelect
                  label="Polo"
                  disabled={isLoadingPolo}
                  loading={isLoadingPolo}
                  placeholder="Selecione Polo"
                  value={polo ?? ""}
                  onChange={(v) => setPolo(v)}
                  options={polos}
                  map={(a) => ({
                    key: a.id,
                    label: a.designacao,
                    value: a.id,
                  })}
                />
                <CourseSelect
                  value={curso}
                  onChangeValue={(v) => setCurso(v)}
                />
                <Button
                  disabled={isPending}
                  onClick={handleChangeCourse}
                  className="w-full mx-auto"
                >
                  <RefreshCw className={`${isPending ? "animate-spin" : ""}`} />
                  Mudar Curso
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </>
    </TabsContent>
  );
}
