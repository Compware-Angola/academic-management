import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryAvailableCashRegistersForOpening } from "@/hooks/financa/use-cash-register";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

interface CaixasDisponiveisSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}

export function CaixasDisponiveisSelect({
  value,
  onChangeValue,
  disabled,
}: CaixasDisponiveisSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } =
    useQueryAvailableCashRegistersForOpening(debouncedSearch);

  return (
    <FormCommandSelect
      width="full"
      label="Caixas Disponíveis"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data?.data ?? []}
      onSearchChange={setSearch}
      map={(item) => ({
        key: item.id.toString(),
        value: item.id.toString(),
        label: item.name,
      })}
      onChange={onChangeValue}
    />
  );
}
