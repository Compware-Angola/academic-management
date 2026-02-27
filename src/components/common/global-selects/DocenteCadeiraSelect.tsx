import { useQueryDocenteCadeiras } from "@/hooks/docentes/use-docentes-cadeiras";
import { FormCommandSelect } from "../FormCommandSelect";

interface DocenteCadeiraSelectProps {
  docenteId?: number;
  cursoId?: number;
  value: string;
  onChangeValue: (v: string) => void;
  labelMode?: "inside" | "outside";
}

export function DocenteCadeiraSelect({
  docenteId,
  cursoId,
  value,
  onChangeValue,
  labelMode = "outside",
}: DocenteCadeiraSelectProps) {
  const { data: cadeiras = [], isLoading } = useQueryDocenteCadeiras(
    docenteId,
    cursoId,
  );

  return (
    <FormCommandSelect
      disabled={!docenteId || !cursoId || isLoading}
      value={value}
      label="Cadeira"
      labelMode={labelMode}
      isLoading={isLoading}
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
