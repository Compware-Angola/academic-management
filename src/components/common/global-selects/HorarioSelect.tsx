import { useEffect } from "react";
import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";
import { FormCommandSelect, LabelMode } from "../FormCommandSelect";
import { parseFilter } from "@/util/parse-filter";

type Props = {
  value: string;
  onChangeValue: (v: string) => void;
  anoLectivo: string;
  curso: string;
  periodo?: string;
  semestre: string;
  unidadeCurricular?: string;
  estado?: string;
  labelMode?: LabelMode;
  classes?: string;
};

export function HorarioSelect({
  value,
  onChangeValue,
  anoLectivo,
  curso,
  periodo,
  semestre,
  classes,
  unidadeCurricular,
  estado,
}: Props) {
  const { data: horarios, isLoading } = useQueryHorariosExistentes(
    {
      page: 1,
      limit: 100,
      anoLectivo: parseFilter(anoLectivo),
      curso: parseFilter(curso),
      periodo: parseFilter(periodo),
      semestre: parseFilter(semestre),
      unidadeCurricular: parseFilter(unidadeCurricular),
      estado: parseFilter(estado),
      anoCurricular: parseFilter(classes),
    },
    {
      enabled: !!anoLectivo && !!curso && !!semestre && !!classes,
    }
  );

  // sempre que o período (ou outro filtro-chave) mudar, limpa o horário selecionado
  useEffect(() => {
    onChangeValue("");
  }, [periodo]);

  return (
    <FormCommandSelect
      options={horarios?.data ?? []}
      label="Horário"
      labelMode="inside"
      map={(h) => ({
        key: h.codigo,
        label: h.designacao,
        value: h.codigo,
      })}
      onChange={onChangeValue}
      value={value}
      isLoading={isLoading}
      disabled={isLoading}
    />
  );
}