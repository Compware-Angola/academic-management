import { FormCommandSelect } from "@/components/common/FormCommandSelect";
import { useQueryFetchInstituicao } from "@/hooks/financas/instituicao/use-query-fetch-instituicao";
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";

import { useDebounce } from "@/hooks/use-debounce";
import { useId, useState } from "react";
import { FormSelect } from "../FormSelect";

interface TipoCandidaturaProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}

export function TipoCandidaturaSelect({
  value,
  onChangeValue,
  disabled,
  enableDefaultSelectItem,
}: TipoCandidaturaProps) {
  const id = useId();
  const defaultSelectItem = enableDefaultSelectItem
    ? [
        {
          label: "Todos",
          value: "all",
          key: id,
        },
      ]
    : undefined;

  const { data: tiposCandidatura = [], isLoading } = useQueryTipoCandidatura();
  return (
    <FormSelect
      disabled={isLoading}
      loading={isLoading}
      label="Tipo de Candidatura"
      defaultSelectItem={defaultSelectItem}
      value={value}
      onChange={(v) => onChangeValue(v)}
      options={tiposCandidatura}
      map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
    />
  );
}
