import { useQueryFormaPagamento } from "@/hooks/financa/use-forma-pagamento";
import { FormSelect } from "../FormSelect";
import { usePermission } from "@/auth/permission.helper";
import { PermissionTypeDetails } from "@/constants/permission.type";
import { useEffect, useState } from "react";
import { FormaPagamento } from "@/services/finance/forma-pagamento.service";

interface FormasPagamentoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  allOption?: boolean;
  allowAll?: boolean;
}
const FormaPagamentoSelect = ({
  onChangeValue,
  value,
  disabled,
  allowAll = false,
  allOption = false,
}: FormasPagamentoSelectProps) => {
  const { hasPermission } = usePermission();
  const { data: formas, isLoading: isLoadingFormas } = useQueryFormaPagamento({
    status: allowAll ? undefined : 1,
  });
  const [formasPagamento, setFormasPagamento] = useState<FormaPagamento[]>([]);

  const isBlocked = !allowAll && !hasPermission(PermissionTypeDetails.PAGAMENTO_EM_CASH.sigla);
  const filter = formas?.filter((f) => {
    if (isBlocked && f.codigo === 6) {
      return false;
    }
    return f;
  });

  useEffect(() => {
    if (allOption && formas) {
      setFormasPagamento([
        {
          codigo: "all",
          descricao: "Todos",
        } as unknown as FormaPagamento,
        ...filter,
      ]);
    } else {
      setFormasPagamento(filter);
    }
  }, [allOption, filter]);

  return (
    <>
      <FormSelect
        disabled={isLoadingFormas || disabled}
        loading={isLoadingFormas}
        label="Forma de Pagamento"
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={formasPagamento}
        map={(a) => ({ key: a.codigo, label: a.descricao, value: a.codigo })}
      />
    </>
  );
};

export { FormaPagamentoSelect };
