
import { useQueryTipoCandidatura } from "@/hooks/queries/use-query-tipo-candidatura";

import { useId, useMemo } from "react";
import { FormSelect } from "../FormSelect";

interface TipoCandidaturaProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
  isPostGraduation?: boolean;
  isGraduation?: boolean;
  label?: string;
}

export function TipoCandidaturaSelect({
  value,
  onChangeValue,
  disabled,
  enableDefaultSelectItem,
  isPostGraduation = false,
  isGraduation = false,
  label = "Tipo de Candidatura",
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
  const tiposCandidaturaPostGraduation = useMemo(() => {
    return tiposCandidatura.filter((tipo) => tipo.codigo !== 1);
  }, [tiposCandidatura]);
  const tiposCandidaturaGraduation = useMemo(() => {
    return tiposCandidatura.filter((tipo) => tipo.codigo === 1);
  }, [tiposCandidatura]);
  return (
    <FormSelect
      disabled={isLoading || disabled}
      loading={isLoading}
      label={label}
      defaultSelectItem={defaultSelectItem}
      value={value}
      onChange={(v) => onChangeValue(v)}
      options={isGraduation ? tiposCandidaturaGraduation : isPostGraduation ? tiposCandidaturaPostGraduation : tiposCandidatura}
      map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
    />
  );
}
