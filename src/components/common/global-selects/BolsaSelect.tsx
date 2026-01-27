import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchBolsa } from "@/hooks/financas/bolsa/use-query-fetch-bolsa";
import { useQueryFetchCreditoEducacional } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional";
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

  const { data, isLoading } = useQueryFetchBolsa({
    designacao: debouncedSearch,
  });

  return (
    <FormCommandSelect
      width="full"
      label="Bolsa"
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
