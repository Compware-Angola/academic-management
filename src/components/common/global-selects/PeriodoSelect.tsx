import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { FormSelect } from "../FormSelect";
import { useId } from "react";

interface PeriodoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enabledDefaultSelectItem?: boolean;
}
const PeriodoSelect = ({
  onChangeValue,
  enabledDefaultSelectItem,
  value,
  disabled,
}: PeriodoSelectProps) => {
  const id = useId();
  const { data: periodos, isLoading: isLoadingPeriodo } = useQueryPeriod();
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
        disabled={isLoadingPeriodo || disabled}
        loading={isLoadingPeriodo}
        defaultSelectItem={defaultSelectItem}
        label="Periodo"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={periodos ?? []}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { PeriodoSelect };
