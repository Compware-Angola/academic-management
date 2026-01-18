import { FormSelect } from "../FormSelect";
import { useQuerySemestres } from "@/hooks/semestre/use-query-semestres";

interface SemestreSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const SemestreSelect = ({
  onChangeValue,
  value,
  disabled,
}: SemestreSelectProps) => {
  const { data: semestre, isLoading: isLoadingSemestre } = useQuerySemestres();
  return (
    <>
      <FormSelect
        disabled={isLoadingSemestre || disabled}
        loading={isLoadingSemestre}
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
