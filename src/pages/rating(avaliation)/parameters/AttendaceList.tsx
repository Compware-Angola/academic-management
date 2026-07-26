import { FormSelect } from "@/components/common/FormSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutationUpdateParametrosAvaliacoesAttendance } from "@/hooks/avaliacao/use-mutation-update-parameters-avaliation";
import { useQueryAssessmentAttendanceParameters } from "@/hooks/avaliacao/use-query-assessment-attendance-parameters";
import { useQueryMonthlyInstallments } from "@/hooks/avaliacao/use-query-monthly-installments";
import { parseFilter } from "@/util/parse-filter";
import { Eye, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";

const AttendaceList = () => {
  const { data: parameterResponse, isLoading: isLoadingParameters } =
    useQueryAssessmentAttendanceParameters();
  const { mutate: updateAttendace, isPending } =
    useMutationUpdateParametrosAvaliacoesAttendance();

  const [selectedInstallment, setSelectedInstallment] = useState("");
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>("");
  const [tipoCandidatura, setTipoCandidatura] = useState("1");

  const { data: tiposCandidatura, isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  const { data, isLoading: isLoadingInstallments } = useQueryMonthlyInstallments({
    anoLectivo: parseFilter(anoLetivoSelecionado),
    semestre: undefined,
  });

  const parameters = parameterResponse?.[0];

  const handleTipoCandidaturaChange = (v: string) => {
    setTipoCandidatura(v);
    setAnoLetivoSelecionado("");
  };

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
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Lista de Presença
          </CardTitle>

          <Button
            onClick={handleUpdateAttendence}
            disabled={isPending || !canEdit || !parameters}
            className="rounded-full"
            size="icon"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormSelect
            label="Tipo de Candidatura"
            value={tipoCandidatura}
            loading={isLoadingTiposCandidatura}
            onChange={handleTipoCandidaturaChange}
            options={tiposCandidatura}
            map={(tipo) => ({
              key: tipo.codigo,
              label: tipo.designacao,
              value: tipo.codigo,
            })}
            placeholder="Selecione o tipo..."
          />

          <AcademicYearsAvailableForOperationSelect
            value={anoLetivoSelecionado}

            tipoCandidaturaId={parseFilter(tipoCandidatura) ?? 1}

            disabled={!tipoCandidatura}
            onChangeValue={(v) => setAnoLetivoSelecionado(v)}
          />
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
              loading={isLoadingInstallments}
              disabled={isLoadingInstallments}
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
  );
};

export { AttendaceList };