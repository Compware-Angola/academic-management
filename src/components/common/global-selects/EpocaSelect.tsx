import { useQueryPeriod } from "@/hooks/period/use-query-period";
import { FormSelect } from "../FormSelect";
import { useId } from "react";
import { useEpocasDropdownFilter } from "@/hooks/dropdown-filters";

interface EpocaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enabledDefaultSelectItem?: boolean;
}
const EpocaSelect = ({
  onChangeValue,
  enabledDefaultSelectItem,
  value,
  disabled,
}: EpocaSelectProps) => {
  const id = useId();
  const { data = [], isLoading: isLoadingPeriodo } = useEpocasDropdownFilter();
  const defaultSelectItem = enabledDefaultSelectItem
    ? [
        {
          label: "Todos",
          value: "all",
          key: id,
        },
      ]
    : undefined;
  const epocas = data?.filter((t) => t.id != 3);

  return (
    <>
      <FormSelect
        disabled={isLoadingPeriodo || disabled}
        loading={isLoadingPeriodo}
        defaultSelectItem={defaultSelectItem}
        label="Epoca"
        value={value}
        placeholder="Seleciona Epoca"
        onChange={(v) => onChangeValue(v)}
        options={epocas ?? []}
        map={(a) => ({ key: a.id, label: a.designacao, value: a.id })}
      />
    </>
  );
};

export { EpocaSelect };
