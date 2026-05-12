import { useQueryCashRegisters } from "@/hooks/financa/use-cash-register";
import { FormSelect } from "../FormSelect";

interface CaixaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const CaixaSelect = ({ onChangeValue, value, disabled }: CaixaSelectProps) => {
  const { data: caixas, isLoading: isLoadingCaixas } = useQueryCashRegisters({
    status: "aberto",
    blocked: "N",
  });

  return (
    <>
      <FormSelect
        disabled={isLoadingCaixas || disabled}
        loading={isLoadingCaixas}
        label="Caixa"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={caixas}
        map={(a) => ({ key: a.id, label: a.name, value: a.id })}
      />
    </>
  );
};

export { CaixaSelect };
