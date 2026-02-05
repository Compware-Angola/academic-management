import { FormCommandSelect } from "../FormCommandSelect";
import { useQueryAcessos } from "@/hooks/acess/use-query-all-accesses";

interface AccessSelectProps {
  value: string;
  onChangeValue: (v: string) => void;
  labelMode?: "inside" | "outside";
  apenasAtivos?: boolean;
}

export function AccessSelect({
  value,
  onChangeValue,
  labelMode = "outside",
  apenasAtivos = true,
}: AccessSelectProps) {
  const { data: acessos = [], isLoading } = useQueryAcessos({
    apenasAtivos,
  });

  return (
    <FormCommandSelect
      disabled={isLoading}
      value={value}
      label="Acesso"
      labelMode={labelMode}
      isLoading={isLoading}
      width="full"
      options={acessos}
      map={(a) => ({
        key: a.id.toString(),
        value: a.id.toString(),
        label: a.designacao,
      })}
      onChange={onChangeValue}
    />
  );
}
