import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";
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
  const [motivo, setMotivo] = useState<string>("");

  const { data: polos, isLoading: isLoadingPolo } = usePoloDropdown();
  const { mutateAsync, isPending } = useMutationChangeStudentCourse();

  if (!codigoMatricula) {
    return <div>Matrícula inválida</div>;
  }

  const handleReset = () => {
    setPolo(undefined);
    setCurso("");
    setMotivo("");
  };

  const handleChangeCourse = async () => {
    if (!polo || !curso) {
      toast.error("Selecione o polo e o curso");
      return;
    }

    if (!motivo.trim()) {
      toast.error("Informe o motivo da mudança de curso");
      return;
    }

    toast.promise(
      mutateAsync({
        matriculaId: codigoMatricula,
        PoloId: Number(polo),
        cursoId: Number(curso),
        motivo,
      }),
      {
        position: "bottom-right",
        loading: "Mudando curso...",
        success: () => {
          handleReset();
          return "Curso alterado com sucesso!";
        },
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
            <CardHeader />
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 items-end space-x-4">
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

              {/* Campo de Motivo */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="motivo">
                  Motivo <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="motivo"
                  placeholder="Descreva o motivo da mudança de curso..."
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="resize-none"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </>
    </TabsContent>
  );
}