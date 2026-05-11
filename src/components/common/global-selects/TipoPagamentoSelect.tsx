import { useQueryFormaPagamento } from "@/hooks/financa/use-forma-pagamento";
import { FormSelect } from "../FormSelect";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

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
  const { hasPermission } = usePermission();
  const { data: formas, isLoading: isLoadingFormas } = useQueryFormaPagamento({
    status: 1,
  });
  const filter = formas?.filter((f) => {
    if (
      !hasPermission(PermissionTypeDetails.PAGAMENTO_EM_CASH.sigla) &&
      f.codigo === 6
    ) {
      return false;
    }
    return f;
  });
  return (
    <>
      <FormSelect
        disabled={isLoadingFormas || disabled}
        loading={isLoadingFormas}
        label="Forma de Pagamento"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={filter ?? []}
        map={(a) => ({ key: a.codigo, label: a.descricao, value: a.codigo })}
      />
    </>
  );
};

export { FormaPagamentoSelect };
