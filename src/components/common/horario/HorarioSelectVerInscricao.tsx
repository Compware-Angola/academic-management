import { useEffect } from "react";
import { useQueryHorarioVerInscricao } from "@/hooks/horario/use-query-horario-ver-inscricao";
import { FormCommandSelect, LabelMode } from "../FormCommandSelect";
import { parseFilter } from "@/util/parse-filter";

type Props = {
  value: string;
  onChangeValue: (v: string) => void;
  anoLectivo: string;
  curso: string;
  gradeCurricular: string;
  labelMode?: LabelMode;
  periodo?: string;
};

export function HorarioVerInscricaoSelect({
  value,
  onChangeValue,
  anoLectivo,
  curso,
  gradeCurricular,
  periodo
}: Props) {
  const { data: horarios, isLoading } = useQueryHorarioVerInscricao({
    anoLectivo: parseFilter(anoLectivo),
    curso: parseFilter(curso),
    gradeCurricular: parseFilter(gradeCurricular),
    periodo: parseFilter(periodo)
  });

  // sempre que a grade curricular mudar, limpa o horário selecionado
  useEffect(() => {
    onChangeValue("");
  }, [gradeCurricular]);

  return (
    <FormCommandSelect
      options={horarios ?? []}
      label="Horário"
      labelMode="inside"
      map={(h) => ({
        key: h.pk_horario,
        label: h.designacao,
        value: h.pk_horario,
      })}
      onChange={onChangeValue}
      value={value}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
}