import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useDropDownBolsas } from "@/hooks/dropdown-filters";
import { useDebounce } from "@/hooks/use-debounce";
import { parseFilter } from "@/util/parse-filter";
import { useId, useState } from "react";

interface BolsaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  codigoInstituicao?: string;
  onBlur?: () => void;
}

export function BolsaSelect({
  value,
  onChangeValue,
  disabled,
  enableDefaultSelectItem,
  codigoInstituicao,
  onBlur

}: BolsaSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const id = useId();
  const { data, isLoading } = useDropDownBolsas({
    codigoInstituicao: parseFilter(codigoInstituicao),
    designacao: debouncedSearch,
  });
  const defaultSelectItem = enableDefaultSelectItem
    ? [
      {
        label: "Todas as bolsas",
        value: "all",
        key: id,
      },
    ]
    : undefined;


  return (
    <FormCommandSelect
      width="full"
      label="Bolsa"
      value={value}
      disabled={disabled || isLoading}
      defaultSelectItem={defaultSelectItem}
      isLoading={isLoading}
      options={data ?? []}
      onSearchChange={setSearch}
      map={(item) => ({
        key: item.codigo.toString(),
        value: item.codigo.toString(),
        label: item.designacao,
      })}
      onBlur={onBlur}
      onChange={onChangeValue}
    />
  );
}
