import { useId } from "react";

import { FormSelect } from "../FormSelect";
import { InvoiceEnum } from "@/enums/invoice.enum";

interface InvoiceStatusSelectProps {
  label?: string;
  value: string | number;
  onChangeValue: (value: string) => void;
  disabled?: boolean;
  enableDefaultSelectItem?: boolean;
}

const InvoiceStatusSelect = ({
  onChangeValue,
  value,
  disabled,
  enableDefaultSelectItem = false,
  label = "Estado da Factura",
}: InvoiceStatusSelectProps) => {
  const id = useId();

  const defaultSelectItem = enableDefaultSelectItem
    ? [
        {
          label: "Todos os estados",
          value: "all",
          key: id,
        },
      ]
    : undefined;

  const estadosFactura = [
    {
      codigo: InvoiceEnum.PENDENTE,
      designacao: "Pendente",
    },
    {
      codigo: InvoiceEnum.PAGO,
      designacao: "Pago",
    },
    {
      codigo: InvoiceEnum.PARCELADO,
      designacao: "Parcelado",
    },
    {
      codigo: InvoiceEnum.ANULADO,
      designacao: "Anulado",
    },
    {
      codigo: InvoiceEnum.ISENTO,
      designacao: "Isento",
    },
  ];

  return (
    <FormSelect
      disabled={disabled}
      defaultSelectItem={defaultSelectItem}
      label={label}
      value={String(value)}
      onChange={(v) => onChangeValue(v)}
      options={estadosFactura}
      map={(estado) => ({
        key: estado.codigo,
        label: estado.designacao,
        value: String(estado.codigo),
      })}
    />
  );
};

export { InvoiceStatusSelect };
