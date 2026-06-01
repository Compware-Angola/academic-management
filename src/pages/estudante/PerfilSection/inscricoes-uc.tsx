import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { useQueryAnoAcademico } from "@/hooks/queries/use-query-ano-academico";
import { FormSelect } from "@/components/common/FormSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { EpocaSelect } from "@/components/common/global-selects/EpocaSelect";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutationCreateEnrollmentUC } from "@/hooks/students/use-mutate-enrollment-uc";
import { parseFilter } from "@/util/parse-filter";
import { useQueryResultPlan } from "@/hooks/students/use-query-result-plan";

type Props = {
  codigoMatricula: number;
  value?: string;
};
type CreateInscriptionResponseError = {
  codigoGrade: number;
  error: string;
};
export function InscricoesUC({
  codigoMatricula,
  value = "inscricoes-uc",
}: Props) {
  const [anoLetivo, setAnoLetivo] = useState<string | undefined>("23");
  const [epoca, setEpoca] = useState<number>(1);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([]);
  const [successInscription, setSuccessInscription] = useState<number[]>([]);
  const [errorInscription, setErrorInscription] = useState<
    CreateInscriptionResponseError[]
  >([]);
  const { mutateAsync: createUc, isPending } = useMutationCreateEnrollmentUC();
  const getRowStyle = (codigo: number) => {
    if (successInscription.includes(codigo)) {
      return "bg-emerald-100 dark:bg-emerald-700";
    }

    if (errorInscription.some((e) => e.codigoGrade === codigo)) {
      return "bg-destructive/70";
    }

    if (selectedGrades.includes(codigo)) {
      return "bg-muted";
    }

    return "";
  };
  const getError = (codigo: number) => {
    const error = errorInscription.find((e) => e.codigoGrade === codigo).error;
    toast({
      title: "Erro",
      description: error,
      variant: "destructive",
    });
  };

  const { data: anosAcademicos, isLoading: isLoadingAcademicYear } =
    useQueryAnoAcademico();

  const {
    data: pendentUcResponse,
    isLoading,
    isError,
  } = useQueryResultPlan(codigoMatricula);

  if (!codigoMatricula) {
    return <div>Matrícula inválida</div>;
  }
  const handleSelectGrade = (codigoGrade: number) => {
    setSelectedGrades((prev) => {
      if (prev.includes(codigoGrade)) {
        return prev.filter((id) => id !== codigoGrade);
      } else {
        return [...prev, codigoGrade];
      }
    });
  };
  const handleCreateUc = async () => {
    await createUc(
      {
        codigoAnoLectivo: parseFilter(anoLetivo),
        codigoGrades: selectedGrades,
        codigoMatricula: codigoMatricula,
        epoca: epoca,
        observacao: "",
      },
      {
        onSuccess(response) {
          console.log(response);
          const sucessos = response?.sucessos ?? [];
          const erros = response?.erros ?? [];
          setSelectedGrades([]);
          setErrorInscription(erros);
          setSuccessInscription(sucessos);
        },
      },
    );
  };
  const isSelectedGrade = (grade: number) => selectedGrades.includes(grade);
  const pendentUcs =
    pendentUcResponse?.grades.filter((t) => t.codigo_grade_aluno == null) ?? [];
  const hasError = errorInscription.length > 0;
  const canSubmit = epoca && parseFilter(anoLetivo);
  return (
    <TabsContent value={value} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fazer Inscrições em UC</CardTitle>
          <CardDescription>
            Lista de todas as disciplinas cursadas e em curso
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 items-end  gap-4">
            <FormSelect
              label="Ano Letivo"
              disabled={isLoadingAcademicYear}
              loading={isLoadingAcademicYear}
              value={anoLetivo ?? ""}
              onChange={(v) => setAnoLetivo(v)}
              options={anosAcademicos}
              map={(a) => ({
                key: a.codigo,
                label: a.designacao,
                value: a.codigo,
              })}
            />
            <EpocaSelect
              value={epoca.toString()}
              onChangeValue={(v) => setEpoca(parseInt(v))}
            />
            <Button
              disabled={!canSubmit}
              className="w-full mx-auto"
              onClick={() => handleCreateUc()}
            >
              <RefreshCw className={`${isPending ? "animate-spin" : ""}`} />
              Inscrever
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center text-destructive py-10">
              Erro ao carregar as disciplinas. Tente novamente.
            </div>
          ) : pendentUcs.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              Nenhuma disciplina encontrada Para Este ano .
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>Disciplina</TableHead>
                      <TableHead className="text-center">Código</TableHead>
                      <TableHead className="text-center">Duração</TableHead>
                      <TableHead className="text-center">Classe</TableHead>
                      <TableHead className="text-center">Semestre</TableHead>
                      {hasError && (
                        <TableHead className="text-center">Erros</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendentUcs.map((pendent) => (
                      <TableRow
                        className={getRowStyle(pendent.codigo)}
                        key={pendent.codigo}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelectedGrade(pendent.codigo)}
                            onCheckedChange={() =>
                              handleSelectGrade(pendent.codigo)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {pendent.disciplina}
                        </TableCell>

                        <TableCell className="text-center">
                          {pendent.codigo}
                        </TableCell>
                        <TableCell className="text-center">
                          {pendent.duracao}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {pendent.classe}
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {pendent.semestre}
                        </TableCell>
                        {hasError && (
                          <TableCell>
                            <Button
                              onClick={() => getError(pendent.codigo)}
                              variant="outline"
                              size="icon"
                            >
                              <Eye />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
