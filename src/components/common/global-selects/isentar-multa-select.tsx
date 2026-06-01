import { FormSelect } from "../FormSelect";

export const ISENTAR_MULTA = [
  {
    value: "SIM",
    label: "Sim",
  },
  {
    value: "NAO",
    label: "Não",
  },
];
export function IsentarMultaSelect({
  label = "Isentar Multa",
  value,
  onChangeValue,
  disabled,
}: {
  label?: string;
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <FormSelect
      map={(item) => ({
        key: item.value,
        value: item.value,
        label: item.label,
      })}
      label={label}
      options={ISENTAR_MULTA}
      value={value}
      disabled={disabled}
      onChange={(value) => {
        onChangeValue(value);
      }}
    />
  );
}
