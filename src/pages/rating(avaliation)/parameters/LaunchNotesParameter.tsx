import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutationUpdateParametrosAvaliacoesAttendance } from "@/hooks/avaliacao/use-mutation-update-parameters-avaliation";
import { Loader, Loader2, Paperclip, Save } from "lucide-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryAssessmentParametersNote } from "@/hooks/avaliacao/use-query-parameters-note-service";
import { Switch } from "@/components/ui/switch";
import { useMutationUpdateAssessmentParametersNote } from "@/hooks/avaliacao/use-mutation-update-assessment-parameters-note";
import { AssessmentParameterNote } from "@/services/avaliacao/fetch-assessment-parameter-note.service";

const LaunchNotesParameter = () => {
  const { data, isLoading: isLoadingParameterNode } =
    useQueryAssessmentParametersNote({
      search:
        "Permitir a confirmação do codigo por email antes do lançamento de notas",
    });

  const { mutate: updateParametersNote, isPending } =
    useMutationUpdateAssessmentParametersNote();

  const parameters = data || [];

  const handleUpdateParameterNote = (parameter: AssessmentParameterNote) => {
    let updateState = 0;
    if (parameter.activo == 0) {
      updateState = 1;
    } else {
      updateState = 0;
    }
    updateParametersNote({
      parametroId: parameter.codigo,
      payload: {
        descricao: parameter.descricao,
        activo: updateState,
      },
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Lançamento de Notas
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingParameterNode ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : parameters.length == 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma dado encontrada.
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Designação</TableHead>
                    <TableHead className="text-center">Acções</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parameters.map((parameter) => (
                    <>
                      <TableRow>
                        <TableCell>{parameter.codigo}</TableCell>
                        <TableCell>{parameter.descricao}</TableCell>
                        <TableCell>
                          <Switch
                            disabled={isPending}
                            checked={parameter.activo === 1}
                            onCheckedChange={() =>
                              handleUpdateParameterNote(parameter)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export { LaunchNotesParameter };
