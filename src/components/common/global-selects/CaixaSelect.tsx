import { useMemo } from "react";

import { useQueryCashRegisters } from "@/hooks/financa/use-cash-register";

import { FormSelect } from "../FormSelect";

interface CaixaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}

const CaixaSelect = ({ onChangeValue, value, disabled }: CaixaSelectProps) => {
  const { data: caixas = [], isLoading: isLoadingCaixas } =
    useQueryCashRegisters({
      blocked: "N",
    });

  return (
    <FormSelect
      label="Caixa"
      value={value}
      disabled={disabled}
      loading={isLoadingCaixas}
      onChange={(v) => onChangeValue(v)}
      options={caixas}
      map={(caixa) => ({
        key: caixa.id,
        label: caixa.name,
        value: String(caixa.id),
      })}
    />
  );
};

export { CaixaSelect };
