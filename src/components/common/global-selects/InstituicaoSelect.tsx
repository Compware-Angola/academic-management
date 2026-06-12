import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";

import { useDebounce } from "@/hooks/use-debounce";
import { useId, useState } from "react";

interface InstituicaoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  tipoInstituicao?: number;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}

export function InstituicaoSelect({
  value,
  onChangeValue,
  tipoInstituicao,
  disabled,
  enableDefaultSelectItem,
}: InstituicaoSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const id = useId();

  const { data, isLoading } = useQueryFetchInstituicao({
    instituicao: debouncedSearch,
    tipo: tipoInstituicao,
  });
  const defaultSelectItem = enableDefaultSelectItem
    ? [
      {
        label: "Todas as instituições",
        value: "all",
        key: id,
      },
    ]
    : undefined;


  return (
    <FormCommandSelect
      label="Instituição"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data?.items ?? []}
      defaultSelectItem={defaultSelectItem}
      onSearchChange={setSearch}
      width="full"
      map={(i) => ({
        key: i.codigo.toString(),
        value: i.codigo.toString(),
        label: i.instituicao,
      })}
      onChange={onChangeValue}
    />
  );
}
