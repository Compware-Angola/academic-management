import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";
import { useQueryMCALTipoAvaliacao } from "@/hooks/prazos/use-query-mcal-tipo-avaliacao";

import { useDebounce } from "@/hooks/use-debounce";
import { useState } from "react";

interface MCALTipoAvaliacoesSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  avaliacao?: number;
  disabled?: boolean;
}

export function MCALTipoAvaliacoesSelectSelect({
  value,
  onChangeValue,
  avaliacao,
  disabled,
}: MCALTipoAvaliacoesSelectProps) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useQueryMCALTipoAvaliacao();

  return (
    <FormCommandSelect
      label="Tipo de Avaliacão"
      value={value}
      disabled={disabled || isLoading}
      isLoading={isLoading}
      options={data}
      onSearchChange={setSearch}
      width="full"
      map={(i) => ({
        key: i.codigo.toString(),
        value: i.codigo.toString(),
        label: i.designacao,
      })}
      onChange={onChangeValue}
    />
  );
}
