import { FormSelect } from "../FormSelect";
import { useQueryCaixas } from "@/hooks/caixa/use-query-caixa";

interface CaixaSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const CaixaSelect = ({ onChangeValue, value, disabled }: CaixaSelectProps) => {
  const { data: caixas, isLoading: isLoadingCaixas } = useQueryCaixas();
  return (
    <>
      <FormSelect
        disabled={isLoadingCaixas || disabled}
        loading={isLoadingCaixas}
        label="ID da Caixa"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={caixas}
        map={(a) => ({ key: a.codigo, label: a.descricao, value: a.codigo })}
      />
    </>
  );
};

export { CaixaSelect };
