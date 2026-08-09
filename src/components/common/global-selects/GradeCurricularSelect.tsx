import { useId } from "react";
import { FormSelect } from "../FormSelect";
import { useQueryGradeCurricularDropDown } from "@/hooks/discplina/use-query-grade-curricular-dropdown";

interface GradeCurricularSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  curso?: number;
  semestre?: number;
  classe?: number;
  anoLectivo?: number;
  enabledDefaultSelectItem?: boolean;
  enabled?: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  label?: string;
  placeholder?: string;
}

const GradeCurricularSelect = ({
  onChangeValue,
  value,
  curso,
  semestre,
  classe,
  anoLectivo,
  enabledDefaultSelectItem,
  enabled,
  disabled,
  showLabel = true,
  label = "Unidade Curricular",
  placeholder,
}: GradeCurricularSelectProps) => {
  const id = useId();
  const { data, isLoading } = useQueryGradeCurricularDropDown(
    {
      curso,
      semestre,
      classe,
      anoLectivo,
    },
    { enabled },
  );

  const gradeCurricular = data ?? [];
  const defaultSelectItem = enabledDefaultSelectItem
    ? [
        {
          label: "Todos",
          value: "all",
          key: id,
        },
      ]
    : undefined;

  return (
    <FormSelect
      disabled={disabled || isLoading}
      loading={isLoading}
      label={showLabel ? label : undefined}
      placeholder={placeholder}
      defaultSelectItem={defaultSelectItem}
      value={value}
      onChange={(v) => onChangeValue(v)}
      options={gradeCurricular}
      map={(g) => ({
        key: g.pk.toString(),
        label: g.descricao,
        value: g.pk.toString(),
      })}
    />
  );
};

export { GradeCurricularSelect };
