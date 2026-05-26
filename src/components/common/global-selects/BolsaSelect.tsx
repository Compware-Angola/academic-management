import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDropDownBolsas } from "@/hooks/dropdown-filters";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

interface BolsaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}

export function BolsaSelect({
  value,
  onChangeValue,
  disabled,
}: BolsaSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useDropDownBolsas({
    designacao: debouncedSearch,
  });

  return (
    <FormCommandSelect
      width="full"
      label="Bolsa"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data ?? []}
      onSearchChange={setSearch}
      map={(item) => ({
        key: item.codigo.toString(),
        value: item.codigo.toString(),
        label: item.designacao,
      })}
      onChange={onChangeValue}
    />
  );
}
