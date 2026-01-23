import { FormSelect } from "@/components/common/FormSelect";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";

interface TipoInstituicaoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
}

export function TipoInstituicaoSelect({
  value,
  onChangeValue,
  disabled,
  label,
  placeholder,
}: TipoInstituicaoSelectProps) {
  const { data, isLoading } = useListInstituicaoTipo();

  return (
    <FormSelect
      label={label}
      value={value}
      placeholder={placeholder}
      disabled={disabled || isLoading}
      loading={isLoading}
      options={data ?? []}
      map={(item) => ({
        key: item.id.toString(),
        value: item.id.toString(),
        label: item.nome,
      })}
      onChange={onChangeValue}
    />
  );
}
