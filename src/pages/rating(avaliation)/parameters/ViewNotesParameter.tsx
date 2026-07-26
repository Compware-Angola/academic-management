import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Paperclip } from "lucide-react";
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
import { AcademicYearsAvailableForOperationSelect } from "@/components/common/global-selects/AcademicYearsAvailableForOperation";
import { parseFilter } from "@/util/parse-filter";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";

type Semestre = 1 | 2;

const ViewNotesParameter = () => {
  const [localParameters, setLocalParameters] = useState<AssessmentParameterNote[]>([])
  const [anoLetivoSelecionado, setAnoLetivoSelecionado] = useState<string>("");
  const [tipoCandidatura, setTipoCandidatura] = useState("1");

  const { data: tiposCandidatura, isLoading: isLoadingTiposCandidatura } =
    useQueryTipoCandidatura();

  const { data, isLoading: isLoadingParameterNote } =
    useQueryAssessmentParametersNote({
      search: "Permitir ver nota",
    });

  const { mutate: updateParametersNote, isPending } =
    useMutationUpdateAssessmentParametersNote();

  const { data: firstSemester, isLoading: isLoadingFirstSemester } =
    useQueryMonthlyInstallments({
      anoLectivo: parseFilter(anoLetivoSelecionado),
      semestre: 1,
    });
  const { data: secondSemester, isLoading: isLoadingSecondSemester } =
    useQueryMonthlyInstallments({
      anoLectivo: parseFilter(anoLetivoSelecionado),
      semestre: 2,
    });

  useEffect(() => {
    if (data) {
      setLocalParameters(data);
    }
  }, [data]);

  const handleTipoCandidaturaChange = (v: string) => {
    setTipoCandidatura(v);
    setAnoLetivoSelecionado("");
  };

  // Actualiza o valor localmente (feedback imediato no select) e envia
  // a mutação para o backend com os dois semestres no payload.
  const handleUpdateSemestre = (
    parameter: AssessmentParameterNote,
    semestre: Semestre,
    novoValor: string
  ) => {
    const campo = semestre === 1 ? "observacao" : "observacao1";

    setLocalParameters((prev) =>
      prev.map((p) =>
        p.codigo === parameter.codigo ? { ...p, [campo]: novoValor } : p
      )
    );

    updateParametersNote({
      parametroId: parameter.codigo,
      payload: {
        descricao: parameter.descricao,
        observacao:
          semestre === 1 ? Number(novoValor) : Number(parameter.observacao),
        observacao1:
          semestre === 2 ? Number(novoValor) : Number(parameter.observacao1),
      },
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-2">
          <Paperclip className="h-5 w-5" />
          Visualização de Nota
        </CardTitle>

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
        <div className="rounded-md border overflow-hidden">
          {isLoadingParameterNote ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Carregando Horários...</p>
            </div>
          ) : localParameters.length === 0 ? (
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
                  <TableRow key={parameter.codigo}>
                    <TableCell>{parameter.codigo}</TableCell>
                    <TableCell>{parameter.descricao}</TableCell>
                    <TableCell>
                      <FormSelect
                        label=""
                        value={parameter.observacao}
                        onChange={(v) =>
                          handleUpdateSemestre(parameter, 1, v)
                        }
                        options={firstSemester}
                        loading={isLoadingFirstSemester}
                        disabled={isLoadingFirstSemester || isPending}
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
                        onChange={(v) =>
                          handleUpdateSemestre(parameter, 2, v)
                        }
                        options={secondSemester}
                        loading={isLoadingSecondSemester}
                        disabled={isLoadingSecondSemester || isPending}
                        map={(u) => ({
                          key: u.prestacao,
                          label: u.designacao,
                          value: u.prestacao,
                        })}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ViewNotesParameter };