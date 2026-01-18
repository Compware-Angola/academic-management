import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";
import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

interface InstituicaoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  tipoInstituicao?: number;
  disabled?: boolean;
}

export function InstituicaoSelect({
  value,
  onChangeValue,
  tipoInstituicao,
  disabled,
}: InstituicaoSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQueryFetchInstituicao({
    instituicao: debouncedSearch,
    tipo: tipoInstituicao,
  });

  return (
    <FormCommandSelect
      label="Instituição"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data?.items ?? []}
      onSearchChange={setSearch}
      width="full"
      map={(i) => ({
        key: i.codigo.toString(),
        value: i.codigo.toString(),
        label: `${i.instituicao} (${i.nif})`,
      })}
      onChange={onChangeValue}
    />
  );
}
