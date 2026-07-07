import { useMemo } from "react";

import { useQueryCashRegisters } from "@/hooks/financa/use-cash-register";

import { FormSelect } from "../FormSelect";

interface CaixaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;

  allowAll?: boolean;
}

const CaixaSelect = ({ onChangeValue, value, disabled, allowAll = false }: CaixaSelectProps) => {
  const { data: response, isLoading: isLoadingCaixas } = useQueryCashRegisters({
    blocked: allowAll ? undefined : "N",
  });
  const caixas = useMemo(() => response?.data || [], [response]);
  return (
    <FormSelect
      label="Caixa"
      value={value}
      disabled={disabled}
      loading={isLoadingCaixas}
      onChange={(v) => onChangeValue(v)}
      options={caixas}
      map={(caixa) => ({
        key: caixa.code,
        label: caixa.name,
        value: String(caixa.code),
      })}
    />
  );
};

export { CaixaSelect };
