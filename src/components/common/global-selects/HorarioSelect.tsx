import { useQueryHorariosExistentes } from "@/hooks/horario/use-query-horarios-existentes";
import { FormCommandSelect, LabelMode } from "../FormCommandSelect";
import { parse } from "path";
import { parseFilter } from "@/util/parse-filter";
type Props = {
  value: string;
  onChangeValue: (v: string) => void;
  anoLectivo: string;
  curso: string;
  periodo: string;
  semestre: string;
  unidadeCurricular?: string;
  estado?: string;
  labelMode?: LabelMode;
};
export function HorarioSelect({
  value,
  onChangeValue,
  anoLectivo,
  curso,
  periodo,
  semestre,
  unidadeCurricular,
  estado,
}: Props) {
  console.log({
    anoLectivo,
    curso,
    periodo,
    semestre,
    unidadeCurricular,
    estado,
  });
  const { data: horarios } = useQueryHorariosExistentes({
    page: 1,
    limit: 100,
    anoLectivo: parseFilter(anoLectivo),
    curso: parseFilter(curso),
    periodo: parseFilter(periodo),
    semestre: parseFilter(semestre),
    unidadeCurricular: parseFilter(unidadeCurricular),
    estado: parseFilter(estado),
  });

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
    />
  );
}
