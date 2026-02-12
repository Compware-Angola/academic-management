import { useQueryFetchCreditoEducacionalTipo } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional-tipo";
import { FormSelect } from "../FormSelect";
import { useId } from "react";

interface CreditoEducacionalTipoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  enabledDefaultSelectItem?: boolean;
}
const CreditoEducacionalTipoSelect = ({
  onChangeValue,
  value,
  enabledDefaultSelectItem,
}: CreditoEducacionalTipoSelectProps) => {
  const id = useId();
  const { data, isLoading } = useQueryFetchCreditoEducacionalTipo({ deleted: false, status: 1 });
  const creditoEducacionalTipo = data?.data ?? [];
  const defaultSelectItem = enabledDefaultSelectItem
    ? [
      {
        label: "Todos",
        value: "all",
        key: id,
      },
    ]
    : undefined;
  return (
    <>
      <FormSelect
        disabled={isLoading}
        loading={isLoading}
        label="Tipo Credito Educacional"
        defaultSelectItem={defaultSelectItem}
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={creditoEducacionalTipo}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { CreditoEducacionalTipoSelect };
// o tipo e uma opção de cadastro
//
