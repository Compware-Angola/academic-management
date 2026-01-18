import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchCreditoEducacional } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

interface CreditoEducacionalSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}

export function CreditoEducacionalSelect({
  value,
  onChangeValue,
  disabled,
}: CreditoEducacionalSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQueryFetchCreditoEducacional({
    designacao: debouncedSearch,
  });

  return (
    <FormCommandSelect
      width="full"
      label="Crédito Educacional"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data?.items ?? []}
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
