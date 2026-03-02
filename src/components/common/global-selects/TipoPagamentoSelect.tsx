import { useQueryFormasPagamento } from "@/hooks/formas-pagamento/use-query-formas-pagamento";
import { FormSelect } from "../FormSelect";

interface FormasPagamentoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}
const FormaPagamentoSelect = ({
  onChangeValue,
  value,
  disabled,
}: FormasPagamentoSelectProps) => {
  const { data: formas, isLoading: isLoadingFormas } =
    useQueryFormasPagamento();
  return (
    <>
      <FormSelect
        disabled={isLoadingFormas || disabled}
        loading={isLoadingFormas}
        label="Forma de Pagamento"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={formas ?? []}
        map={(a) => ({ key: a.codigo, label: a.descricao, value: a.codigo })}
      />
    </>
  );
};

export { FormaPagamentoSelect };
