import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryAvailableOperators } from "@/hooks/financa/use-cash-register";

import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

interface AvaliableOperatorsSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  availability?: "all" | "free" | "occupied";
}

export function AvaliableOperatorsSelect({
  value,
  onChangeValue,
  disabled,
  availability = "free",
}: AvaliableOperatorsSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQueryAvailableOperators({
    search: debouncedSearch,
    availability,
  });

  return (
    <FormCommandSelect
      width="full"
      label="Operador"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data?.data ?? []}
      onSearchChange={setSearch}
      map={(item) => ({
        key: item.codigo.toString(),
        value: item.codigo.toString(),
        label: item.nome,
      })}
      onChange={onChangeValue}
    />
  );
}
