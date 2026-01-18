import { FormSelect } from "@/components/common/FormSelect";
import { useListInstituicaoTipo } from "@/hooks/financa/use-listar-instituicao";

interface TipoInstituicaoSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  disabled?: boolean;
}

export function TipoInstituicaoSelect({
  value,
  onChangeValue,
  disabled,
}: TipoInstituicaoSelectProps) {
  const { data, isLoading } = useListInstituicaoTipo();

  return (
    <FormSelect
      label="Tipo Instituição"
      value={value}
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
