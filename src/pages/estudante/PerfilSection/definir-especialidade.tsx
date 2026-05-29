import { useCursoEspecialidadePorCodigoMatricula } from "@/hooks/cursos/especialidade";
import {
  useDefinirEspecialidade,
  useStudentDetail,
} from "@/hooks/students/use-query-students";
import { TabsContent } from "@/components/ui/tabs";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormSelect } from "@/components/common/FormSelect";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { parseFilter } from "@/util/parse-filter";

export function DefinirEspecialidade({
  codigoMatricula,
  value = "definir-especialidade",
}: {
  codigoMatricula: number;
  value?: string;
}) {
  const { data: student, isFetching } = useStudentDetail(codigoMatricula);

  const {
    data: especialidades,
    isLoading,
    isError,
  } = useCursoEspecialidadePorCodigoMatricula(student?.codigo_matricula ?? 0);

  const [especialidade, setEspecialidade] = useState<string>("");

  const defineSpeciality = useDefinirEspecialidade();

  const semEspecialidades = useMemo(() => {
    return !isLoading && !isFetching && (especialidades?.length ?? 0) === 0;
  }, [isLoading, isFetching, especialidades]);

  const handleDefinirEspecialidade = async () => {
    if (!especialidade) return;

    await defineSpeciality.mutateAsync({
      codigoMatricula,
      codigoCursoEspecialidade: parseFilter(especialidade),
    });

    setEspecialidade("");
  };

  return (
    <TabsContent value={value} className="space-y-6 px-4">
      <CardHeader>
        <CardTitle className="text-lg">Definir Especialidade</CardTitle>
        <CardDescription>Selecione a especialidade desejada</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 max-w-[500px]">
        {isError && (
          <div className="text-sm text-red-500">
            Erro ao carregar especialidades. Tente novamente.
          </div>
        )}

        {semEspecialidades && (
          <div className="text-sm text-muted-foreground border rounded-md p-3">
            Este curso não possui especialidades disponíveis.
          </div>
        )}

        <FormSelect
          label={
            semEspecialidades
              ? "Sem especialidades disponíveis"
              : "Especialidade"
          }
          placeholder={
            isLoading
              ? "Carregando..."
              : semEspecialidades
                ? "Nenhuma especialidade"
                : "Selecione uma especialidade"
          }
          value={especialidade}
          onChange={(v) => setEspecialidade(v)}
          disabled={isFetching || isLoading || semEspecialidades}
          loading={isLoading}
          options={especialidades ?? []}
          map={(e) => ({
            key: e.codigo,
            label: e.designacao,
            value: e.codigo,
          })}
        />

        {!semEspecialidades && (
          <Button
            disabled={
              isFetching ||
              isLoading ||
              !especialidade ||
              defineSpeciality.isPending
            }
            className="cursor-pointer w-full"
            onClick={handleDefinirEspecialidade}
          >
            {defineSpeciality.isPending
              ? "Salvando..."
              : "Confirmar Especialidade"}
          </Button>
        )}
      </CardContent>
    </TabsContent>
  );
}
