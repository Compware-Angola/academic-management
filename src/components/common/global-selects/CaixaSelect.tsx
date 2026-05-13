import { useMemo } from "react";

import {
  useQueryCashRegisters,
  useQueryMyCashRegister,
} from "@/hooks/financa/use-cash-register";

import { FormSelect } from "../FormSelect";

interface CaixaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  onlyMyCashRegister?: boolean;
}

const CaixaSelect = ({
  onlyMyCashRegister = true,
  onChangeValue,
  value,
  disabled,
}: CaixaSelectProps) => {
  const { data: caixas = [], isLoading: isLoadingCaixas } =
    useQueryCashRegisters({
      status: "aberto",
      blocked: "N",
    });

  const { data: myCashRegister, isLoading: isLoadingMyCashRegister } =
    useQueryMyCashRegister();

  const options = useMemo(() => {
    if (onlyMyCashRegister) {
      return myCashRegister ? [myCashRegister] : [];
    }

    return caixas;
  }, [onlyMyCashRegister, myCashRegister, caixas]);

  const isLoading = onlyMyCashRegister
    ? isLoadingMyCashRegister
    : isLoadingCaixas;

  return (
    <FormSelect
      label="Caixa"
      value={value}
      disabled={disabled || isLoading}
      loading={isLoading}
      onChange={(v) => onChangeValue(v)}
      options={options}
      map={(caixa) => ({
        key: caixa.id,
        label: caixa.name,
        value: String(caixa.id),
      })}
    />
  );
};

export { CaixaSelect };
