import { useId } from "react";
import { FormSelect } from "../FormSelect";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";

interface SemestreSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}
const SemestreSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem,
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
        label="Semestre"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={semestre ?? []}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { SemestreSelect };
