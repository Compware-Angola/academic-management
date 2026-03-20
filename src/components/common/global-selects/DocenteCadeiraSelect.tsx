import { useQueryDocenteCadeiras } from "@/hooks/docentes/use-docentes-cadeiras";
import { FormCommandSelect } from "../FormCommandSelect";
import { DocenteCadeirasPayload } from "@/services/docentes/docente-cadeiras.service";

interface DocenteCadeiraSelectProps {
  disabled?: boolean;
  params: DocenteCadeirasPayload;
  value: string;
  onChangeValue: (v: string) => void;
  labelMode?: "inside" | "outside";
  loading?: boolean;
}

export function DocenteCadeiraSelect({
  params,
  value,
  onChangeValue,
  disabled,
  loading,
  labelMode = "outside",
}: DocenteCadeiraSelectProps) {
  const { data: cadeiras = [], isLoading } = useQueryDocenteCadeiras(params);

  return (
    <FormCommandSelect
      disabled={disabled || isLoading || loading}
      value={value}
      label="Unidade Curricular"
      labelMode={labelMode}
      isLoading={loading || isLoading}
      width="full"
      options={cadeiras}
      map={(c) => ({
        key: c.codigo.toString(),
        value: c.codigo.toString(),
        label: c.nome_cadeira,
      })}
      onChange={onChangeValue}
    />
  );
}
