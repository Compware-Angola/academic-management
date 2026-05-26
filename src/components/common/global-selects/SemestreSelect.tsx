import { useId } from "react";
import { FormSelect } from "../FormSelect";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";

interface SemestreSelectProps {
  label?: string;
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  yearly?: boolean;
}
const SemestreSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem,
  yearly = false,
  label = "Semestre",
}: SemestreSelectProps) => {
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

  const { data: semestre, isLoading: isLoadingSemestre } = useQuerySemestres();

  return (
    <>
      <FormSelect
        disabled={isLoadingSemestre || disabled}
        loading={isLoadingSemestre}
        defaultSelectItem={defaultSelectItem}
        label={label}
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={
          yearly
            ? [...(semestre ?? []), { codigo: 3, designacao: "Anual" }]
            : (semestre ?? [])
        }
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { SemestreSelect };
