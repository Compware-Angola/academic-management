import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutationUpdateParametrosAvaliacoesAttendance } from "@/hooks/avaliacao/use-mutation-update-parameters-avaliation";
import { Loader, Loader2, Paperclip, Save } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryAssessmentParametersNote } from "@/hooks/avaliacao/use-query-parameters-note-service";
import { useMutationUpdateAssessmentParametersNote } from "@/hooks/avaliacao/use-mutation-update-assessment-parameters-note";
import { AssessmentParameterNote } from "@/services/avaliacao/fetch-assessment-parameter-note.service";
import { useQueryMonthlyInstallments } from "@/hooks/avaliacao/use-query-monthly-installments";
import { FormSelect } from "@/components/common/FormSelect";

interface ViewNotesParameterProps {
  academicYear: number | undefined;
}
const ViewNotesParameter = ({ academicYear }: ViewNotesParameterProps) => {
  const [localParameters, setLocalParameters] = useState<
    AssessmentParameterNote[]
  >([]);

  const { data, isLoading: isLoadingParameterNote } =
    useQueryAssessmentParametersNote({
      search: "Permitir ver nota",
    });

  const { mutate: updateParametersNote, isPending } =
    useMutationUpdateAssessmentParametersNote();

  const { data: firstSemester, isLoading: isLoadingFisrtSemester } =
    useQueryMonthlyInstallments({
      anoLectivo: academicYear,
      semestre: 1,
    });
  const { data: secondSemester, isLoading: isLoadingSecondSemester } =
    useQueryMonthlyInstallments({
      anoLectivo: academicYear,
      semestre: 2,
    });

  useEffect(() => {
    if (data) {
      setLocalParameters(data);
    }
  }, [data]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Visualização de Nota
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="rounded-md border overflow-hidden">
            {isLoadingParameterNote ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Carregando Horários...</p>
              </div>
            ) : localParameters.length == 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                Nenhuma dado encontrada.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Designacao</TableHead>
                    <TableHead className="text-center">1 Semestre</TableHead>
                    <TableHead className="text-center">2 Semestre</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {localParameters.map((parameter) => (
                    <>
                      <TableRow>
                        <TableCell>{parameter.codigo}</TableCell>
                        <TableCell>{parameter.descricao}</TableCell>
                        <TableCell>
                          <FormSelect
                            label=""
                            value={parameter.observacao}
                            onChange={(v) => {
                              setLocalParameters((prev) =>
                                prev.map((p) =>
                                  p.codigo === parameter.codigo
                                    ? { ...p, observacao: v }
                                    : p
                                )
                              );

                              updateParametersNote({
                                parametroId: parameter.codigo,
                                payload: {
                                  descricao: parameter.descricao,
                                  observacao: Number(v),
                                  observacao1: Number(parameter.observacao1),
                                },
                              });
                            }}
                            options={firstSemester}
                            loading={isLoadingFisrtSemester}
                            disabled={isLoadingFisrtSemester}
                            map={(u) => ({
                              key: u.prestacao,
                              label: u.designacao,
                              value: u.prestacao,
                            })}
                          />
                        </TableCell>
                        <TableCell>
                          <FormSelect
                            label=""
                            value={parameter.observacao1}
                            onChange={(v) => {
                              setLocalParameters((prev) =>
                                prev.map((p) =>
                                  p.codigo === parameter.codigo
                                    ? { ...p, observacao1: v }
                                    : p
                                )
                              );

                              updateParametersNote({
                                parametroId: parameter.codigo,
                                payload: {
                                  descricao: parameter.descricao,
                                  observacao1: Number(v),
                                  observacao: Number(parameter.observacao),
                                },
                              });
                            }}
                            options={secondSemester}
                            loading={isLoadingFisrtSemester}
                            disabled={isLoadingFisrtSemester}
                            map={(u) => ({
                              key: u.prestacao,
                              label: u.designacao,
                              value: u.prestacao,
                            })}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export { ViewNotesParameter };
