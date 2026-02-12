import { useId } from "react";
import { FormSelect } from "../FormSelect";
import { useQueryFetchCreditoEducacionalTipoDesconto } from "@/hooks/financas/credito-educacional/use-query-fetch-credito-educacional-tipo-desconto";

interface CreditoEducacionalTipoDescontoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  enabledDefaultSelectItem?: boolean;
}
const CreditoEducacionalTipoDescontoSelect = ({
  onChangeValue,
  value,
  enabledDefaultSelectItem,
}: CreditoEducacionalTipoDescontoSelectProps) => {
  const id = useId();
  const { data, isLoading } = useQueryFetchCreditoEducacionalTipoDesconto();
  const creditoEducacionalTipoDesconto = data?.items ?? [];
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
        label="Tipo Desconto"
        defaultSelectItem={defaultSelectItem}
        value={value}
        onChange={(v) => onChangeValue(v)}
        options={creditoEducacionalTipoDesconto}
        map={(a) => ({ key: a.codigo, label: a.designacao, value: a.codigo })}
      />
    </>
  );
};

export { CreditoEducacionalTipoDescontoSelect };
