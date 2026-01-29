import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { FormSelect } from "../FormSelect";

interface PeriodoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const PeriodoSelect = ({
  onChangeValue,
  value,
  disabled,
}: PeriodoSelectProps) => {
  const { data: periodos, isLoading: isLoadingPeriodo } = useQueryPeriod();
  return (
    <>
      <FormSelect
        disabled={isLoadingPeriodo || disabled}
        loading={isLoadingPeriodo}
        label="Perido"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={periodos ?? []}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { PeriodoSelect };
