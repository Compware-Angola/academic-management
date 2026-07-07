import { useQueryFormaPagamento } from "@/hooks/financa/use-forma-pagamento";
import { FormSelect } from "../FormSelect";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";

interface FormasPagamentoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  allowAll?: boolean;
}
const FormaPagamentoSelect = ({
  onChangeValue,
  value,
  disabled,
  allowAll = false,
}: FormasPagamentoSelectProps) => {
  const { hasPermission } = usePermission();
  const { data: formas, isLoading: isLoadingFormas } = useQueryFormaPagamento({
    status: allowAll ? undefined : 1,
  });

  const isBlocked = !allowAll && !hasPermission(PermissionTypeDetails.PAGAMENTO_EM_CASH.sigla);
  const filter = formas?.filter((f) => {
    if (isBlocked && f.codigo === 6) {
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
