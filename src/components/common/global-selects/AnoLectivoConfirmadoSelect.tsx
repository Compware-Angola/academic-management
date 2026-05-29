import { useId } from "react";
import { FormSelect } from "../FormSelect";
import { useDropDownAnoLectivoConfirmados } from "@/hooks/dropdown-filters";

interface AnoLectivoConfirmadoSelectProps {
  label?: string;
  value: string;
  codigoMatricula: number;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}

const AnoLectivoConfirmadoSelect = ({
  label = "Ano Lectivo",
  value,
  codigoMatricula,
  onChangeValue,
  disabled,
  enableDefaultSelectItem,
}: AnoLectivoConfirmadoSelectProps) => {
  const id = useId();

  const defaultSelectItem = enableDefaultSelectItem
    ? [
        {
          label: "Todos",
          value: "all",
          key: id,
        },
      ]
    : undefined;

  const { data: anosLectivos, isLoading } =
    useDropDownAnoLectivoConfirmados(codigoMatricula);

  return (
    <FormSelect
      disabled={isLoading || disabled || !codigoMatricula}
      loading={isLoading}
      label={label}
      value={value}
      onChange={(v) => onChangeValue(v)}
      defaultSelectItem={defaultSelectItem}
      options={anosLectivos ?? []}
      map={(a: any) => ({
        key: a.codigo,
        label: a.designacao,
        value: a.codigo,
      })}
    />
  );
};

export { AnoLectivoConfirmadoSelect };
