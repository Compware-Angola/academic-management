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
  disabled?: boolean;
}

const GradeCurricularSelect = ({
  onChangeValue,
  value,
  curso,
  semestre,
  classe,
  anoLectivo,
  enabledDefaultSelectItem,
  disabled,
}: GradeCurricularSelectProps) => {
  const id = useId();
  const { data, isLoading } = useQueryGradeCurricularDropDown({
    curso,
    semestre,
    classe,
    anoLectivo,
  });
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
    <>
      <FormSelect
        disabled={disabled || isLoading}
        loading={isLoading}
        label="Unidade Curricular"
        defaultSelectItem={defaultSelectItem}
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={gradeCurricular}
        map={(g) => ({ key: g.pk, label: g.descricao, value: g.pk })}
      />
    </>
  );
};

export { GradeCurricularSelect };
