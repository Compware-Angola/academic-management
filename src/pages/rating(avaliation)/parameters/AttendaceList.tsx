import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationUpdateParametrosAvaliacoesAttendance } from "@/hooks/avaliacao/use-mutation-update-parameters-avaliation";
import { useQueryAssessmentAttendanceParameters } from "@/hooks/avaliacao/use-query-assessment-attendance-parameters";
import { useQueryMonthlyInstallments } from "@/hooks/avaliacao/use-query-monthly-installments";
import { parseFilter } from "@/util/parse-filter";
import { Eye, Loader, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface AttendaceListProps {
  academicYear: number | undefined;
}
const AttendaceList = ({ academicYear }: AttendaceListProps) => {
  const { data: parameterResponse, isLoading: isLoadingParameters } =
    useQueryAssessmentAttendanceParameters();
  const { mutate: updateAttendace, isPending } =
    useMutationUpdateParametrosAvaliacoesAttendance();
  const [selectedInstallment, setSelectedInstallment] = useState("");
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const { data, isLoading } = useQueryMonthlyInstallments({
    anoLectivo: academicYear,
    semestre: undefined,
  });

  const parameters = parameterResponse?.[0];

  const handleUpdateAttendence = () => {
    const observation = parseFilter(selectedInstallment);
    if (observation && parameters) {
      updateAttendace({
        codigo: parameters.codigo,
        payload: {
          observacao: observation.toString(),
        },
      });
      setCanEdit(false);
    }
  };

  useEffect(() => {
    if (parameters) {
      setSelectedInstallment(parameters.observacao);
    }
  }, [parameters]);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Lista de Presença
            </CardTitle>
            <Button
              onClick={handleUpdateAttendence}
              disabled={isPending || !canEdit}
              className="rounded-full"
              size="icon"
            >
              {isLoading ? <Loader /> : <Save />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoadingParameters ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : parameters ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              <div>
                <Label>Designação</Label>
                <Input readOnly placeholder={parameters.descricao} />
              </div>
              <div>
                <Label>Atualizado Por </Label>
                <Input readOnly placeholder={parameters.atualizadopor} />
              </div>
              <FormSelect
                label="Prestação"
                value={selectedInstallment}
                onChange={(v) => {
                  setSelectedInstallment(v);
                  setCanEdit(true);
                }}
                options={data}
                loading={isLoading}
                disabled={isLoading}
                map={(u) => ({
                  key: u.id,
                  label: u.designacao,
                  value: u.id,
                })}
              />
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              Nenhuma dado encontrada.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export { AttendaceList };
